import express from "express";
import { login, register, me, getAllUsers, updateUserRole, deleteUser } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

router.get("/users", requireAuth, requireRole(["superadmin"]), getAllUsers);
router.patch("/users/:userId/role", requireAuth, requireRole(["superadmin"]), updateUserRole);
router.delete("/users/:userId", requireAuth, requireRole(["superadmin"]), deleteUser);

export default router;


