import express from "express";
import authController from "../controller/auth.mjs";

const router = express.Router();

router.post("/nonce", authController.getNonce);
router.post("/verify", authController.verify);

export default router;
