import express from "express";
import { createVehicle, getAllVehicles, createMaintenanceRecord } from "../controllers/vehicle.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createVehicle);
router.get("/", getAllVehicles);
router.post("/maintenance", createMaintenanceRecord);

export default router;
