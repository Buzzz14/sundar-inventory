import express from "express";
import upload from "../config/multer.js";
import {
  getItems,
  getItemBySlug,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", upload.array("photos", 5), createItem);
router.get("/:slug", getItemBySlug);
router.patch("/:slug", upload.array("photos", 5), updateItem);
router.delete("/:slug", deleteItem);

export default router;
