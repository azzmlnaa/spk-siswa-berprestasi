// routes/kriteriaRoutes.js
import express from "express";
import db from "../config/db.js"; // pastikan file ini konek ke MySQL

const router = express.Router();

// GET semua kriteria
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kriteria");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST tambah kriteria
router.post("/", async (req, res) => {
  const { nama_kriteria, bobot, sifat } = req.body;
  try {
    await db.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, sifat) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, sifat]
    );
    res.status(201).json({ message: "Kriteria berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE hapus kriteria
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM kriteria WHERE id_kriteria = ?", [id]);
    res.json({ message: "Kriteria dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
