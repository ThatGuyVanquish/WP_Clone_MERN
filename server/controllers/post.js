import Post from "../models/post";
import User from "../models/user";
import Category from "../models/category";
import Comment from "../models/comment";
import Media from "../models/media";
import slugify from "slugify";
import cloudinary from "cloudinary";
import {
  CLOUDINARY_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRET,
  POSTS_PER_PAGE,
} from "../config";

export const createPost = async (req, res) => {
  try {
    const { title, categories } = req.body;
    // check if title is taken
    const checkUnique = await Post.findOne({
      slug: slugify(title),
    });
    if (checkUnique) {
      console.log("Can't publish new post, title is taken.");
      res.json({ error: "Title is taken" });
      return;
    }

    // get category ids based on category names
    let categoryIds = [];
    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        Category.findOne({ slug: slugify(categories[i]) }).exec((err, data) => {
          if (err) {
            console.log(err);
          } else {
            categoryIds.push(data._id);
          }
        });
      }
    }
    // save post onto the db
    setTimeout(async () => {
      try {
        const post = await new Post({
          ...req.body,
          categories: categoryIds,
          slug: slugify(title),
          author: req.auth._id,
        }).save();
        console.log(`Created a new post: ${post.title}`);
        await User.findByIdAndUpdate(req.auth._id, {
          $addToSet: { posts: post._id },
        });
        return res.json(post);
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("featuredImage", "url")
      .populate("author", "username")
      .populate("categories", "name slug")
      .populate({
        path: "comments",
        select: "content createdAt",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          model: "User",
          select: "username",
        },
      });

    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const perPage = POSTS_PER_PAGE;
    const { page } = req.params || 1;
    const { admin } = req.query;
    const allPosts = admin
      ? await Post.find()
          .skip((page - 1) * perPage)
          .limit(perPage)
          .select("title")
          .populate("author", "username")
      : await Post.find()
          .skip((page - 1) * perPage)
          .populate("featuredImage")
          .sort({ createdAt: -1 })
          .limit(perPage);
    res.json(allPosts);
  } catch (err) {
    console.log(err);
  }
};

export const getPostCount = async (req, res) => {
  const { id } = req.params;
  try {
    let count = 0;
    if (!id) {
      count = await Post.countDocuments();
    } else {
      count = await Post.countDocuments({ author: id });
    }
    return res.json(count);
  } catch (err) {
    console.log(err);
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allPosts = await Post.find({ author: id })
      .populate("featuredImage")
      .populate("author", "username")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });
    res.json(allPosts);
  } catch (err) {
    console.log(err);
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const perPage = POSTS_PER_PAGE;
    const categorySlug = req.params.slug;
    const page = req.params.page || 1;

    const category = await Category.findOne({ slug: categorySlug });

    const posts = await Post.find({ categories: { $in: [category._id] } })
      .populate("featuredImage")
      .populate("author", "username")
      .skip((page - 1) * perPage)
      .sort({ createdAt: -1 })
      .limit(perPage);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getPostCountOfCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug });
    const count = await Post.countDocuments({ categories: category._id });
    res.json(count);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id).populate("comments", id);
    for (const comment of deleted.comments) {
      await Comment.findByIdAndDelete(comment.id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, featuredImage, categories } = req.body;
    const categoryByIDs = await Promise.all(
      categories.map(async (category) => {
        const test = await Category.findOne({ slug: slugify(category) });
        return test;
      })
    );
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        slug: slugify(title),
        content,
        categories: categoryByIDs,
        featuredImage,
      },
      { new: true }
    )
      .populate("author", "username")
      .populate("categories", "name slug")
      .populate("featuredImage", "url");
    return res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error editing post");
  }
};

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image);
    res.json(result.secure_url);
  } catch (err) {
    console.log(err);
  }
};

export const uploadImageLib = async (req, res) => {
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

export const media = async (req, res) => {
  try {
    const media = await Media.find()
      .populate("uploader", "_id name")
      .sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    const post = await Post.updateMany(
      { featuredImage: media._id },
      { $pull: { featuredImage: media._id } }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
