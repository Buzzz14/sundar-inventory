import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryItems,
} from "../controllers/categoriesController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", requireAuth, requireRole(["admin"]), createCategory);
router.get("/:slug/items", getCategoryItems);
router.put("/:slug", requireAuth, requireRole(["admin"]), updateCategory);
router.delete("/:slug", requireAuth, requireRole(["admin"]), deleteCategory);

export default router;
