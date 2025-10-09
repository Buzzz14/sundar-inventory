import express from "express";
import upload from "../config/multer.js";
import {
  getItems,
  getItemBySlug,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole(["admin", "superadmin", "user"]),
  getItems
);
router.get(
  "/:slug",
  requireAuth,
  requireRole(["admin", "superadmin", "user"]),
  getItemBySlug
);
router.post(
  "/",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  upload.array("photos", 5),
  createItem
);
router.patch(
  "/:slug",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  upload.array("photos", 5),
  updateItem
);
router.delete("/:slug", requireAuth, requireRole(["superadmin"]), deleteItem);

export default router;
