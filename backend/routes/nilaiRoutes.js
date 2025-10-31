import express from "express";
import {
  getNilai,
  getNilaiById,
  createNilai,
  updateNilai,
  deleteNilai,
} from "../controllers/nilaiController.js";

const router = express.Router();

router.get("/", getNilai);
router.get("/:id", getNilaiById);
router.post("/", createNilai);
router.put("/:id", updateNilai);
router.delete("/:id", deleteNilai);

export default router;
