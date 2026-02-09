const html_to_pdf = require('html-pdf-node');
const fs = require('fs');

const options = { format: 'A4' };
const file = { content: "<h1>Test PDF Generation</h1><p>If you see this, PDF generation is working.</p>" };

console.log('Starting PDF generation test...');

html_to_pdf.generatePdf(file, options, (err, buffer) => {
  if (err) {
    console.error('PDF Generation Failed:', err);
    process.exit(1);
  }
  fs.writeFileSync('test-output.pdf', buffer);
  console.log('PDF Generation Success! File saved as test-output.pdf');
  process.exit(0);
});
