import Category from "../models/category";
import Post from "../models/post";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    console.info(`Created category ${name}`);
    res.json(category);
  } catch (err) {
    console.error("CATEGORY CONTROLLER @ create\n", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    console.info(`Sent categories data to client`);
    res.json(categories);
  } catch (err) {
    console.error("CATEGORY CONTROLLER @ categories:\n", err.message);
    res.status(404).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    const postsInCategory = await Post.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    ).exec();

    console.info(`Deleted category ${category.name}`);
    res.json(category);
  } catch (err) {
    console.error("CATEGORY CONTROLLER @ deleteCategory:\n", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    console.info(`Updated ${slug} category to ${category.name}`);
    res.json(category);
  } catch (err) {
    console.error("CATEGORY CONTROLLER @ update:\n", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const getCategoryName = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    console.info(`Sent ${category.name} to client`);
    res.json(category.name);
  } catch (err) {
    console.error("CATEGORY CONTROLLER @ getCategoryName:\n", err.message);
    res.status(404).json({ error: err });
  }
};
