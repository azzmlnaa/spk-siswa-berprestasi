// backend/routes/hasilRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getHasil } from "../controllers/hasilController.js";

const router = express.Router();

// Hanya user login yang bisa akses hasil
router.get("/", verifyToken, getHasil);

export default router;
