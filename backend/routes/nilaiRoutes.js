import express from "express";
import {
  getNilai,
  getNilaiBySiswa,
  createNilai,
  deleteNilai,
} from "../controllers/nilaiController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNilai);
router.get("/:id_siswa", verifyToken, getNilaiBySiswa);
router.post("/", verifyToken, createNilai);
router.delete("/:id", verifyToken, deleteNilai);

export default router;
