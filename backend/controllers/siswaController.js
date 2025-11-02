import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const SECRET_KEY = "rahasia_sistem_saw";

// 🔹 Helper: buat koneksi sesuai user login
const getUserDB = async (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  const dbName = decoded.dbName;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: dbName,
  });
  return connection;
};

// ======================= GET SEMUA SISWA =======================
export const getSiswa = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    const db = await getUserDB(token);
    const [rows] = await db.query("SELECT * FROM siswa ORDER BY id_siswa DESC");
    await db.end();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data siswa", error: err.message });
  }
};

// ======================= TAMBAH SISWA =======================
export const tambahSiswa = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    const db = await getUserDB(token);
    const { nama_siswa, kelas } = req.body;

    await db.query(
      "INSERT INTO siswa (nama_siswa, kelas) VALUES (?, ?)",
      [nama_siswa, kelas]
    );
    await db.end();

    res.status(201).json({ message: "Siswa berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan siswa", error: err.message });
  }
};

// ======================= HAPUS SISWA =======================
export const hapusSiswa = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    const db = await getUserDB(token);
    const { id } = req.params;

    await db.query("DELETE FROM siswa WHERE id_siswa = ?", [id]);
    await db.end();

    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus siswa", error: err.message });
  }
};
