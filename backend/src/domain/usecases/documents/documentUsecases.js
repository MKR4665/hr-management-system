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

const sendMultipleDocuments = async ({ employeeId, types, subject, message }) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) throw new Error('Employee not found');

  const attachments = [];
  
  for (const type of types) {
    const html = compileTemplate(type, employee);
    const pdfBuffer = await getPdfBuffer(html);
    
    attachments.push({
      filename: `${type.replace(/\s+/g, '_')}.pdf`,
      content: pdfBuffer
    });

    // Record each document in DB
    await documentRepo.create({
      type,
      employeeId,
      status: 'Sent'
    });
  }

  const mailOptions = {
    from: '"HR Department" <hr@company.com>',
    to: employee.email,
    subject: subject || 'Employee Documents - HRM HUB',
    text: message || `Dear ${employee.firstName}, please find the attached documents.`,
    attachments
  };

  await transporter.sendMail(mailOptions);
  
  return { success: true, message: 'Email sent with multiple documents' };
};

const generateMultipleDocuments = async ({ employeeId, types }) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) throw new Error('Employee not found');

  const results = [];
  for (const type of types) {
    const doc = await documentRepo.create({
      type,
      employeeId,
      status: 'Generated'
    });
    results.push(doc);
  }
  return results;
};

module.exports = {
  sendMultipleDocuments,
  generateMultipleDocuments,
  getPdfBuffer,
  generateDocument: async (employeeId, type) => {
    const employee = await employeeRepo.findById(employeeId);
    if (!employee) throw new Error('Employee not found');
    const html = compileTemplate(type, employee);
    return { html };
  },
  getEmployeeDocuments: (id) => documentRepo.findByEmployeeId(id)
};