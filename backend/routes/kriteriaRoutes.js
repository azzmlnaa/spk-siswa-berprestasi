// routes/kriteriaRoutes.js
import express from "express";
import {
  getKriteria,
  createKriteria,
  editKriteria,
  removeKriteria,
} from "../controllers/kriteriaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua route dilindungi token
router.get("/", verifyToken, getKriteria);
router.post("/", verifyToken, createKriteria);
router.put("/:id", verifyToken, editKriteria);
router.delete("/:id", verifyToken, removeKriteria);

export default router;
