const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');

const compileTemplate = (type, data) => {
  const templatePath = path.join(templatesDir, `${type}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${type}.html`);
  }

  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  
  const now = new Date();
  
  return template({
    ...data,
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