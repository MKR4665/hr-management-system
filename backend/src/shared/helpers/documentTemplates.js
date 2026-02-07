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
  
  return template({
    ...data,
    date: new Date().toLocaleDateString(),
    hireDate: data.hireDate ? new Date(data.hireDate).toLocaleDateString() : 'N/A'
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