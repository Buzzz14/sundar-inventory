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

router.get("/", getItems);
router.post("/", requireAuth, requireRole(["admin"]), upload.array("photos", 5), createItem);
router.get("/:slug", getItemBySlug);
router.patch("/:slug", requireAuth, requireRole(["admin"]), upload.array("photos", 5), updateItem);
router.delete("/:slug", requireAuth, requireRole(["admin"]), deleteItem);

export default router;
