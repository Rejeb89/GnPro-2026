import express from "express";
import {
  createEquipmentReception,
  getAllEquipmentReceptions,
  getEquipmentReceptionById,
  updateEquipmentReception,
  deleteEquipmentReception,
  getEquipmentByCategory,
  getLowStockEquipment,
  getEquipmentStockSummary,
} from "../controllers/equipment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// All equipment routes require authentication
router.use(authMiddleware);

// Create equipment reception (Manager, Admin)
router.post(
  "/",
  roleMiddleware("MANAGER", "ADMIN", "USER"),
  createEquipmentReception,
);

// Get all equipment receptions
router.get("/", getAllEquipmentReceptions);

// Get equipment by category
router.get("/category/:category", getEquipmentByCategory);

// Get low stock equipment
router.get("/status/low-stock", getLowStockEquipment);

// Get equipment stock summary
router.get("/status/stock-summary", getEquipmentStockSummary);

// Get equipment by ID
router.get("/:id", getEquipmentReceptionById);

// Update equipment reception (Manager, Admin)
router.put(
  "/:id",
  roleMiddleware("MANAGER", "ADMIN"),
  updateEquipmentReception,
);

// Delete equipment reception (Admin only)
router.delete(
  "/:id",
  roleMiddleware("MANAGER", "ADMIN"),
  deleteEquipmentReception,
);

export default router;
