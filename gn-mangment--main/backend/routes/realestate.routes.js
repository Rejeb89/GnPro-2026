import express from "express";
import { createRealEstate, getAllRealEstate } from "../controllers/realestate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createRealEstate);
router.get("/", getAllRealEstate);

export default router;
