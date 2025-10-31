import db from "../config/db.js";

// Ambil semua siswa
export const getSiswa = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM siswa");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah siswa
export const tambahSiswa = async (req, res) => {
  try {
    const { nama_siswa, kelas } = req.body;
    await db.query("INSERT INTO siswa (nama_siswa, kelas) VALUES (?, ?)", [nama_siswa, kelas]);
    res.status(201).json({ message: "Siswa berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Tambahkan fungsi hapus siswa ini
export const hapusSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM siswa WHERE id_siswa = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

