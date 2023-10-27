import Post from "../models/post";
import Comment from "../models/comment";
import { COMMENTS_PER_PAGE } from "../config";

export const createComment = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);
    if (!post) {
      res.json({ error: `No post ${postID} found` });
    }
    let comment = await new Comment({
      content: req.body.comment,
      postID,
      author: req.auth._id,
    }).save();
    post.comments.push(comment._id);
    await Post.findByIdAndUpdate(post._id, post);
    comment = await comment.populate("author", "username");
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const perPage = COMMENTS_PER_PAGE;
    const { page } = req.params || 1;
    const comments = await Comment.find()
      .skip((page - 1) * perPage)
      .populate("author", "username")
      .populate({
        path: "postID",
        select: "title",
        populate: {
          path: "author",
          select: "username",
        },
      })
      .sort({ author: 1, createdAt: -1 })
      .limit(perPage);
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getCommentCount = async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    return res.json(count);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getCommentsByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const page = req.params.page || 1;
    const perPage = COMMENTS_PER_PAGE;

    const comments = await Comment.find({ author: userID })
      .select("content createdAt updatedAt")
      .populate("postID", "title")
      .populate("author", "username")
      .skip((page - 1) * perPage)
      .sort({ postID: 1, createdAt: -1 })
      .limit(perPage);
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getCommentCountByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const count = await Comment.countDocuments({ author: userID });
    return res.json(count);
  } catch (err) {
    console.log(err.message);
    res.json({ error: err });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      commentID,
      { content },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = await Comment.findByIdAndDelete(commentID);
    const post = await Post.updateOne(
      { _id: comment.postID },
      { $pull: { comments: comment._id } }
    ).exec();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};
