import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryItems,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:slug/items", getCategoryItems);
router.put("/:slug", updateCategory);
router.delete("/:slug", deleteCategory);

export default router;
