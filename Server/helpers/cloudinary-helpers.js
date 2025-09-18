const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  // Renamed parameter to filePath for clarity
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log('Cloufinary upload Result', result); // Ensure correct parameter usage
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error while uploading to cloudinary', error);
    throw new Error('Pdf upload failed');
  }
};

module.exports = {
  uploadToCloudinary,
};
