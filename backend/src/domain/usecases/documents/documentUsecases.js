const html_to_pdf = require('html-pdf-node');
const nodemailer = require('nodemailer');
const { DocumentRepositoryPrisma } = require('../../../data/repositories/DocumentRepositoryPrisma');
const { EmployeeRepositoryPrisma } = require('../../../data/repositories/EmployeeRepositoryPrisma');
const { compileTemplate } = require('../../../shared/helpers/documentTemplates');
const { env } = require('../../../config/env');

const documentRepo = new DocumentRepositoryPrisma();
const employeeRepo = new EmployeeRepositoryPrisma();

const transporter = nodemailer.createTransport({
  host: env.smtpHost || 'smtp.ethereal.email',
  port: env.smtpPort || 587,
  auth: {
    user: env.smtpUser || 'test@example.com',
    pass: env.smtpPass || 'password'
  }
});

const getPdfBuffer = async (html) => {
  const options = { format: 'A4' };
  const file = { content: html };
  return new Promise((resolve, reject) => {
    html_to_pdf.generatePdf(file, options, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
};

const sendMultipleDocuments = async ({ employeeId, types, subject, message, month, year }) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) throw new Error('Employee not found');

  const attachments = [];
  
  for (const type of types) {
    const { html } = await generateDocument(employeeId, type, { month, year });
    const pdfBuffer = await getPdfBuffer(html);
    
    attachments.push({
      filename: `${type.replace(/\s+/g, '_')}.pdf`,
      content: pdfBuffer
    });

    // Record each document in DB
    await documentRepo.create({
      type,
      employeeId,
      status: 'Sent',
      category: 'GENERATED',
      month,
      year
    });
  }

  const mailOptions = {
    from: '"HR Department" <hr@company.com>',
    to: employee.email,
    subject: subject || 'Employee Documents - HRM HUB',
    text: message || `Dear ${employee.firstName}, please find the attached documents.`,
    attachments
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('CRITICAL: Email Sending Failed:', err);
    throw new Error(`Email failed: ${err.message}`);
  }
  
  return { success: true, message: 'Email sent with multiple documents' };
};

const generateMultipleDocuments = async ({ employeeId, types, month, year }) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) throw new Error('Employee not found');

  const results = [];
  for (const type of types) {
    const doc = await documentRepo.create({
      type,
      employeeId,
      status: 'Generated',
      category: 'GENERATED',
      month,
      year
    });
    results.push(doc);
  }
  return results;
};

const createDocumentRecord = async (employeeId, type, fileUrl, metadata = {}) => {
  return documentRepo.create({
    type,
    employeeId,
    fileUrl,
    category: 'UPLOADED',
    status: 'Pending',
    ...metadata
  });
};

const updateDocumentStatus = async (id, status, reason = null) => {
  return documentRepo.updateStatus(id, status, reason);
};

const generateDocument = async (employeeId, type, metadata = {}) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) throw new Error('Employee not found');
  
  const html = compileTemplate(type, { 
    ...employee, 
    ...metadata 
  });
  return { html };
};

const getEmployeeDocuments = (id) => documentRepo.findByEmployeeId(id);

const getMonthlyStatus = async (month, year) => {
  return prisma.document.findMany({
    where: {
      type: 'PAYSLIP',
      month,
      year: parseInt(year),
      status: 'Sent'
    },
    select: {
      employeeId: true,
      createdAt: true
    }
  });
};

module.exports = {
  sendMultipleDocuments,
  generateMultipleDocuments,
  getPdfBuffer,
  createDocumentRecord,
  updateDocumentStatus,
  generateDocument,
  getEmployeeDocuments
};