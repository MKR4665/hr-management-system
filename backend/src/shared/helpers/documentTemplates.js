const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { prisma } = require('../../data/models/prismaClient');

const templatesDir = path.join(__dirname, '..', 'templates');

const compileTemplate = async (type, data) => {
  const templatePath = path.join(templatesDir, `${type}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${type}.html`);
  }

  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  
  const now = new Date();

  // Fetch company config for logo
  const config = await prisma.companyConfig.findFirst();
  let logoUrl = '';
  if (config?.logoPath) {
    // Remove leading slash if present to avoid path join issues on some systems
    const cleanPath = config.logoPath.startsWith('/') ? config.logoPath.substring(1) : config.logoPath;
    const logoFile = path.resolve(__dirname, '..', '..', '..', cleanPath);
    
    if (fs.existsSync(logoFile)) {
      const logoBase64 = fs.readFileSync(logoFile, 'base64');
      let ext = path.extname(logoFile).replace('.', '').toLowerCase();
      let mimeType = `image/${ext}`;
      if (ext === 'svg') mimeType = 'image/svg+xml';
      logoUrl = `data:${mimeType};base64,${logoBase64}`;
    }
  }

  // Fetch Employee QR Code
  let qrUrl = '';
  if (data.qrCodePath) {
    const cleanQRPath = data.qrCodePath.startsWith('/') ? data.qrCodePath.substring(1) : data.qrCodePath;
    const qrFile = path.resolve(__dirname, '..', '..', '..', cleanQRPath);
    if (fs.existsSync(qrFile)) {
      const qrBase64 = fs.readFileSync(qrFile, 'base64');
      qrUrl = `data:image/png;base64,${qrBase64}`;
    }
  }
  
  return template({
    ...data,
    companyLogo: logoUrl,
    employeeQR: qrUrl,
    fullName: `${data.firstName} ${data.lastName}`,
    date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    month: now.toLocaleString('default', { month: 'long' }),
    year: now.getFullYear(),
    hireDate: data.hireDate ? new Date(data.hireDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
    timestamp: now.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    }),
    // Formatting numbers for currency
    basicSalaryFormatted: data.basicSalary?.toLocaleString('en-IN'),
    hraFormatted: data.hra?.toLocaleString('en-IN'),
    specialAllowanceFormatted: data.specialAllowance?.toLocaleString('en-IN'),
    conveyanceAllowanceFormatted: data.conveyanceAllowance?.toLocaleString('en-IN'),
    grossSalaryFormatted: data.grossSalary?.toLocaleString('en-IN'),
    annualGrossSalaryFormatted: (data.grossSalary * 12)?.toLocaleString('en-IN'),
  });
};

const getAvailableTemplates = () => {
  return fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => file.replace('.html', ''));
};

module.exports = { 
  compileTemplate, 
  templates: getAvailableTemplates() 
};