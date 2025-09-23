import Item from "../models/itemModel.js";
import slugify from "slugify";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("category", "name");
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getItemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const item = await Item.findOne({ slug }).populate("category", "name");

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
    } = req.body;

    const slugCandidate = slugify(String(name || ""), { lower: true, strict: true });
    
    if (slugCandidate) {
      const existing = await Item.findOne({ slug: slugCandidate });
      if (existing) {
        return res.status(409).json({ message: "An item with this name already exists" });
      }
    }

    if (max_profit_percent < min_profit_percent) {
      return res.status(400).json({
        message: "Max profit percent cannot be less than min profit percent",
      });
    }

    const sale_price_min = cost_price * (1 + min_profit_percent / 100);
    const sale_price_max = cost_price * (1 + max_profit_percent / 100);

    const photos = (req.files || []).map((file) => file.path);

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
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(409).json({ message: "An item with this name already exists" });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { slug } = req.params;
    
    let bodyData = req.body;
    
    if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
      bodyData = {
        name: req.body.name,
        category: req.body.category,
        company: req.body.company,
        description: req.body.description,
        cost_price: req.body.cost_price ? parseFloat(req.body.cost_price) : undefined,
        min_profit_percent: req.body.min_profit_percent ? parseFloat(req.body.min_profit_percent) : undefined,
        max_profit_percent: req.body.max_profit_percent ? parseFloat(req.body.max_profit_percent) : undefined,
        stock: req.body.stock ? parseFloat(req.body.stock) : undefined,
        reorder_level: req.body.reorder_level ? parseFloat(req.body.reorder_level) : undefined,
        photos: req.body.photos ? (Array.isArray(req.body.photos) ? req.body.photos : [req.body.photos]) : [],
      };
    }
    
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
      photos = [],
    } = bodyData;

    const item = await Item.findOne({ slug });
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
    let finalPhotos = [];
    
    if (req.body.existingPhotos) {
      const existingPhotos = Array.isArray(req.body.existingPhotos) 
        ? req.body.existingPhotos 
        : [req.body.existingPhotos];
      finalPhotos = [...existingPhotos];
    }
    
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);
      finalPhotos = [...finalPhotos, ...newPhotos];
    }
    
    if (finalPhotos.length === 0 && (!req.files || req.files.length === 0)) {
    } else {
      item.photos = finalPhotos;
    }

    if (max_profit_percent < min_profit_percent) {
      return res.status(400).json({
        message: "Max profit percent cannot be less than min profit percent",
      });
    }

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
    const { slug } = req.params;

    const item = await Item.findOne({ slug });
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
