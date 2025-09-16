import Category from "../models/categoryModel.js";
import Item from "../models/itemModel.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getCategoryItems = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const items = await Item.find({ category: category._id });
    res.json(items);
  } catch (error) {
    console.error("Error fetching category items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    if (name) {
      const categoryExists = await Category.findOne({
        name,
        slug: { $ne: slug },
      });
      if (categoryExists) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { slug },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const item = await Item.find({ category: category._id });

    if (item.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with associated items." });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
