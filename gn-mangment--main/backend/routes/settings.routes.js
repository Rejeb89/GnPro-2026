import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", roleMiddleware("ADMIN"), updateSettings);

export default router;
