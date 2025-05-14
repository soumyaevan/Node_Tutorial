const Image = require("../models/image");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helpers/cloudinaryHelpers");
const fs = require("fs");
const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid file.",
      });
    }
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const newlyCreatedImage = new Image({
      imageUrl: url,
      publicId,
      uploadBy: req.userInfo.userId,
    });
    await newlyCreatedImage.save();

    //delete file from local storage
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image has been successfully uploaded",
      image: newlyCreatedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Technical error in uploading image, try again later",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const offset = (page - 1) * limit;
    const images = await Image.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    const totalFiles = await Image.countDocuments();
    const totalPages = Math.ceil(totalFiles / limit);
    if (images) {
      res.status(200).json({
        success: true,
        totalNumberOfPages: totalPages,
        currentPage: page,
        data: images,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No images found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Technical error in fetching image, try again later",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const currentFileId = req.params.id;
    const userId = req.userInfo.userId;
    const file = await Image.findOne({ publicId: currentFileId });
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No matching file is found!!!",
      });
    }
    if (file.uploadBy.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "This image is not uploaded by current user",
      });
    }
    const result = await deleteFromCloudinary(currentFileId);
    if (result === "ok") {
      await Image.findByIdAndDelete(file._id);
      res.status(201).json({
        success: true,
        message: "File is successfully deleted",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error in file deletion!!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Technical error in deleting image, try again later",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
