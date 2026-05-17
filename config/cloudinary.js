const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadToCloudinary = async (fileBuffer, filename) => {
  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${fileBuffer.toString('base64')}`, {
      folder: 'shree-ganesh-enterprises',
    });
    return result;
  } catch (error) {
    console.log('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = { cloudinary, upload, uploadToCloudinary };