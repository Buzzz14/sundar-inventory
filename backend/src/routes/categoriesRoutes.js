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

router.get(
  "/",
  requireAuth,
  requireRole(["admin", "superadmin", "user"]),
  getCategories
);
router.get(
  "/:slug/items",
  requireAuth,
  requireRole(["admin", "superadmin", "user"]),
  getCategoryItems
);
router.post(
  "/",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  createCategory
);
router.put(
  "/:slug",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  updateCategory
);
router.delete(
  "/:slug",
  requireAuth,
  requireRole(["superadmin"]),
  deleteCategory
);

export default router;
