const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error while uploading the file", error);
    throw new Error("Error while uploading the file");
  }
};
const deleteFromCloudinary = async (file_publicId) => {
  try {
    const { result } = await cloudinary.uploader.destroy(file_publicId, {
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("Error while deleting the file", error);
    throw new Error("Error while deleting the file");
  }
};
module.exports = { uploadToCloudinary, deleteFromCloudinary };
