// backend/routes/dashboardRoutes.js
import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // perhatikan nama folder!

const router = express.Router();

router.get("/", verifyToken, getDashboard);

export default router;
