const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const generateEmployeeQRCode = async (employee) => {
  const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'qrcodes');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Only the unique verification link
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${baseUrl}/verify/${employee.id}`;

  // Use stable filename to overwrite old QR and save space
  const fileName = `qr_${employee.id}.png`;
  const filePath = path.join(uploadDir, fileName);
  const dbPath = `/uploads/qrcodes/${fileName}`;

  await QRCode.toFile(filePath, verificationUrl, {
    color: {
      dark: '#003366', 
      light: '#FFFFFF'
    },
    width: 400,
    margin: 2
  });

  return dbPath;
};

module.exports = { generateEmployeeQRCode };
