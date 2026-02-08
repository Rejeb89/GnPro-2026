import express from "express";
import { createCredit, getAllCredits, updateCreditSpending } from "../controllers/credit.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createCredit);
router.get("/", getAllCredits);
router.put("/:id/spend", updateCreditSpending);

export default router;
