import express from "express";
import serverStatusCheckController from "../controller/serverStatusCheck.mjs";

const router = express.Router();

router.get("/", serverStatusCheckController.getStatus);

export default router;
