import Media from "../models/media";
import cloudinary from "cloudinary";
import {
  CLOUDINARY_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRET,
} from "../config";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

export const uploadImageToPostContent = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image);
    res.json(result.secure_url);
  } catch (err) {
    console.log(err);
  }
};

export const uploadImageToLibrary = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.file.path);
    // save to db
    const media = await new Media({
      url: result.secure_url,
      public_id: result.public_id,
      uploader: req.auth._id,
    }).save();
    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

export const getMedia = async (req, res) => {
  try {
    const media = await Media.find()
      .populate("uploader", "_id username")
      .sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
