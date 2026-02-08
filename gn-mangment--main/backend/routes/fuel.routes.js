import express from "express";
import { createFuelRecord, getAllFuelRecords } from "../controllers/fuel.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createFuelRecord);
router.get("/", getAllFuelRecords);

export default router;
