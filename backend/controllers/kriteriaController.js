// controllers/kriteriaController.js
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = "rahasia_sistem_saw"; // sama seperti di authController.js

// Helper untuk koneksi DB sesuai user
const getUserConnection = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Token tidak ditemukan");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET_KEY);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: decoded.role === "admin" ? process.env.DB_NAME : decoded.dbName,
  });

  return { connection, user: decoded };
};

// GET semua kriteria
export const getKriteria = async (req, res) => {
  try {
    const { connection, user } = await getUserConnection(req);

    const [rows] = await connection.query("SELECT * FROM kriteria");
    await connection.end();

    res.json({
      message: `Data kriteria untuk ${user.role === "admin" ? "Admin" : user.username}`,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data kriteria", error: err.message });
  }
};

// POST tambah kriteria
export const createKriteria = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const { nama_kriteria, bobot, sifat } = req.body;

    await connection.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, sifat) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, sifat]
    );

    await connection.end();
    res.status(201).json({ message: "Kriteria berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan kriteria", error: err.message });
  }
};

// PUT ubah kriteria
export const editKriteria = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const id = req.params.id;
    const { nama_kriteria, bobot, sifat } = req.body;

    await connection.query(
      "UPDATE kriteria SET nama_kriteria=?, bobot=?, sifat=? WHERE id_kriteria=?",
      [nama_kriteria, bobot, sifat, id]
    );

    await connection.end();
    res.json({ message: "Kriteria berhasil diubah" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah kriteria", error: err.message });
  }
};

// DELETE hapus kriteria
export const removeKriteria = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const id = req.params.id;

    await connection.query("DELETE FROM kriteria WHERE id_kriteria=?", [id]);
    await connection.end();

    res.json({ message: "Kriteria berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus kriteria", error: err.message });
  }
};
