import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "../config";
import User from "../models/user";
import Post from "../models/post";
import Media from "../models/media";
import Comment from "../models/comment";

export const requireSignin = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
});

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user.role != "Admin") {
      return res.status(403).json({
        error: "Access denied, you must be an admin",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Failed to check permissions",
    });
  }
};

export const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user.role != "Author") {
      return res.status(403).json({
        error: "Access denied, you must be an author",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Failed to check permissions",
    });
  }
};

export const isSubscriber = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user.role != "Subscriber") {
      return res.status(403).json({
        error: "Access denied, you must be a subscriber",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Failed to check permissions",
    });
  }
};

export const canWrite = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user.role != "Author" && user.role != "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Failed to check permissions" });
  }
};

export const canUpdatePost = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    const { id } = req.params;
    const post = await Post.findById(id);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Author":
        if (post.author.toString() === user._id.toString()) {
          next();
          break;
        }
      default:
        return res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Failed to check permissions" });
  }
};

export const canDeleteMedia = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    const { id } = req.params;
    const media = await Media.findById(id);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Author":
        if (media.uploader.toString() === user._id.toString()) {
          next();
          break;
        }
      default:
        return res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Failed to check permissions" });
  }
};

export const canUpdateComment = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    const { commentID } = req.params;
    const comment = await Comment.findById(commentID);
    if (
      user.role === "Admin" ||
      comment.author.toString() === user._id.toString()
    ) {
      next();
      return;
    }
    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Failed to check permissions" });
  }
};
