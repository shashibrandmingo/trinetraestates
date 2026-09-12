import cloudinary from '../config/cloudinary.js';

/**
 * Upload a file buffer or base64 stream to Cloudinary
 * @param {string} fileUri - Base64 string or remote image URI
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<object>} Upload response
 */
export const uploadToCloudinary = async (fileUri, folder = 'office-space') => {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' }
      ]
    });
    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error(`[Cloudinary Service Error] Upload failed: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId - Cloudinary asset public ID
 * @returns {Promise<object>} Deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`[Cloudinary Service Error] Delete failed: ${error.message}`);
    throw error;
  }
};
