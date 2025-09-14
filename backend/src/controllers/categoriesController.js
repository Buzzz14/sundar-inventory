import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category created successfully"});
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
