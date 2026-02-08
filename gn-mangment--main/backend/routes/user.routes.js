import express from "express";
import {
  getAllUsers,
  createUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
