import express from "express";
import { getSiswa, tambahSiswa, hapusSiswa } from "../controllers/siswaController.js";

const router = express.Router();

router.get("/", getSiswa);
router.post("/", tambahSiswa);
router.delete("/:id", hapusSiswa); // penting: pastikan parameternya :id

export default router;
