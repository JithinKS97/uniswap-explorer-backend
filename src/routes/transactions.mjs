import express from "express";
import transcationsController from "../controller/transaction.mjs";
import { authenticateToken } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", authenticateToken, transcationsController.getTransactions);

export default router;
