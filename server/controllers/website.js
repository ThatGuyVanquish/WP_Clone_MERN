import User from "../models/user";
import Post from "../models/post";
import Category from "../models/category";
import Comment from "../models/comment";
import Page from "../models/page";

export const getNumbers = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      // ALL data was requested (for admin dashboard/homepage)
      const posts = await Post.countDocuments();
      const users = await User.countDocuments();
      const comments = await Comment.countDocuments();
      const categories = await Category.countDocuments();
      return res.json({ posts, users, comments, categories });
    } else {
      // user only necessary for their role
      const user = await User.findById(id).select("role posts");
      const posts = user.posts.length || 0;
      const comments = (await Comment.countDocuments({ author: id })) || 0;
      if (user.role === "Author") {
        return res.json({ posts, comments });
      }
      return res.json({ comments });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
};

// Using createPage for both create and update because it'll only be accessible from one location for both
export const createPage = async (req, res) => {
  try {
    const { page } = req.body;
    const exists = await Page.findOne({ page });
    if (exists) {
      // update
      const update = await Page.findOneAndUpdate({ page }, req.body, {
        new: true,
      }).populate("titleImage");
      return res.json(update);
    } else {
      // create
      const create = (await Page.create(req.body)).populate("titleImage");
      create.save();
      return res.json(create);
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

export const getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ page: req.params.page }).populate(
      "titleImage"
    );
    if (!page) {
      return res.json({ error: "COULD NOT FIND PAGE" });
    }
    return res.json(page);
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};
