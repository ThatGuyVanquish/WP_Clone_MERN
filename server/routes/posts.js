import express from "express";
import formidable from "express-formidable";

// Middlewares
import {
  requireSignin,
  isAdmin,
  canWrite,
  canUpdatePost,
  canDeleteMedia,
  canUpdateComment,
} from "../middlewares";

// Controllers
import {
  createPost,
  getPost,
  getAllPosts,
  getPostCount,
  getPostsByUser,
  editPost,
  deletePost,
  getPostsByCategory,
  getPostCountOfCategory,
} from "../controllers/post";

import {
  createComment,
  getAllComments,
  getCommentCount,
  getCommentsByUser,
  getCommentCountByUser,
  editComment,
  deleteComment,
} from "../controllers/comment";

import {
  uploadImageToPostContent,
  uploadImageToLibrary,
  getMedia,
  deleteMedia,
} from "../controllers/media";

const router = express.Router();

{
  /************ Posts ************/
}
router.post("/create-post", requireSignin, canWrite, createPost); // CREATE

// READ
router.get("/post/:slug", getPost); // RECEIVE ONE POST BY SLUG
router.get("/posts/:page", getAllPosts); // RECEIVE ALL POSTS
router.get(`/post-count/:id?`, getPostCount);
router.get("/posts-by-user/:id/:page", getPostsByUser);
router.get("/category/:slug/:page", getPostsByCategory);
router.get("/category/:slug", getPostCountOfCategory);

router.put(`/post/:id`, requireSignin, canUpdatePost, editPost); // UPDATE
router.delete(`/post/:id`, requireSignin, canUpdatePost, deletePost); // DELETE

{
  /************ Comments ************/
}
router.post("/comment/:postID", requireSignin, createComment); // CREATE

// READ
router.get("/comments/:page", requireSignin, isAdmin, getAllComments);
router.get("/comment-count/:userID", getCommentCountByUser);
router.get("/comment-count", requireSignin, isAdmin, getCommentCount);
router.get("/comments/:userID/:page", requireSignin, getCommentsByUser);

router.put("/comment/:commentID", requireSignin, canUpdateComment, editComment); // UPDATE
// DELETE
router.delete(
  "/comment/:commentID",
  requireSignin,
  canUpdateComment,
  deleteComment
);

{
  /************ Media ************/
}
// CREATE
router.post("/upload-image", requireSignin, canWrite, uploadImageToPostContent); // Images that are embedded within posts, not to be saved in the db
router.post(
  "/upload-image-lib",
  requireSignin,
  canWrite,
  formidable(),
  uploadImageToLibrary
);

router.get("/media", getMedia); // READ
router.delete("/media/:id", requireSignin, canDeleteMedia, deleteMedia); // DELETE

export default router;
