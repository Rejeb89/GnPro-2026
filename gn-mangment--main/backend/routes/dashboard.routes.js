import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), getDashboardStats);

export default router;
