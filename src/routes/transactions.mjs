import express from "express";
import transcationsController from "../controller/transaction.mjs";

const router = express.Router();

router.get("/", transcationsController.getTransactions);

export default router;
