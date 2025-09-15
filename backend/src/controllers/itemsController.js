import Item from "../models/itemModel.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("category", "name");
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("category", "name");

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      name,
      category,
      company,
      description,
      cost_price,
      min_profit_percent,
      max_profit_percent,
      stock,
      reorder_level,
      photos,
    } = req.body;

    // Validate profit percentages
    if (max_profit_percent < min_profit_percent) {
      return res.status(400).json({
        message: "Max profit percent cannot be less than min profit percent",
      });
    }

    const sale_price_min = cost_price * (1 + min_profit_percent / 100);
    const sale_price_max = cost_price * (1 + max_profit_percent / 100);

    const item = new Item({
      name,
      category,
      company,
      description,
      cost_price,
      min_profit_percent,
      max_profit_percent,
      sale_price_min,
      sale_price_max,
      stock,
      reorder_level,
      photos,
    });
    await item.save();

    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      company,
      description,
      cost_price,
      min_profit_percent,
      max_profit_percent,
      stock,
      reorder_level,
      photos,
    } = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (name) item.name = name;
    if (category) item.category = category;
    if (company) item.company = company;
    if (description) item.description = description;
    if (cost_price != null) item.cost_price = cost_price;
    if (min_profit_percent != null)
      item.min_profit_percent = min_profit_percent;
    if (max_profit_percent != null)
      item.max_profit_percent = max_profit_percent;
    if (stock != null) item.stock = stock;
    if (reorder_level != null) item.reorder_level = reorder_level;
    if (photos) item.photos = photos;

    // Validate profit percentages
    if (max_profit_percent < min_profit_percent) {
      return res.status(400).json({
        message: "Max profit percent cannot be less than min profit percent",
      });
    }

    // Recalculate sale prices
    if (item.cost_price != null) {
      item.sale_price_min =
        item.cost_price * (1 + item.min_profit_percent / 100);
      item.sale_price_max =
        item.cost_price * (1 + item.max_profit_percent / 100);
    }

    await item.save();
    res.json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
