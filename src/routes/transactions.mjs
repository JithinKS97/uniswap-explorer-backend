import express from "express";
import transcationsController from "../controller/transaction.mjs";
import { authenticateToken } from "../middleware/auth.mjs";

const router = express.Router();

router.post("/", authenticateToken, transcationsController.getTransactions);

export default router;
