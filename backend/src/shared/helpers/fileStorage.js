const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.resolve(__dirname, '..', '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Saves a base64 string as a file and returns the relative path
 * @param {string} base64Data 
 * @param {string} folder 
 * @returns {string|null}
 */
const saveBase64File = (base64Data, folder = 'misc') => {
  if (!base64Data || !base64Data.startsWith('data:')) return base64Data; // Already a path or empty

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const type = matches[1];
    let extension = type.split('/')[1] || 'bin';
    
    // Normalize extensions
    if (extension === 'svg+xml') extension = 'svg';
    if (extension === 'jpeg') extension = 'jpg';

    // Validate allowed types
    const allowedExtensions = ['png', 'jpg', 'svg'];
    if (!allowedExtensions.includes(extension)) {
      console.warn(`Blocked attempt to upload unsupported file type: ${extension}`);
      return null;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    
    const targetDir = path.join(UPLOADS_DIR, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(targetDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    // Return relative path for URL serving (always use forward slashes for URLs)
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('File saving error:', error);
    return null;
  }
};

module.exports = { saveBase64File };
