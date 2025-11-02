// backend/controllers/hasilController.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { hitungSAW } from "../utils/saw.js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = "rahasia_sistem_saw";

export const getHasil = async (req, res) => {
  try {
    // 🔹 1. Verifikasi Token
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { username, role, dbName } = decoded;

    // 🔹 2. Tentukan database
    const database = role === "admin" ? process.env.DB_NAME : dbName;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database,
    });

    // 🔹 3. Ambil semua data kriteria & nilai per siswa
    const [kriteria] = await connection.query(`
      SELECT id_kriteria, nama_kriteria, bobot, sifat
      FROM kriteria
    `);

    const [nilaiRows] = await connection.query(`
      SELECT 
        n.id_siswa, 
        s.nama_siswa, 
        s.kelas,
        n.id_kriteria, 
        n.nilai
      FROM nilai n
      JOIN siswa s ON n.id_siswa = s.id_siswa
    `);

    await connection.end();

    // 🔹 4. Validasi data
    if (!nilaiRows.length || !kriteria.length) {
      return res.status(404).json({
        message: "Belum ada data nilai atau kriteria untuk perhitungan SAW.",
      });
    }

    // 🔹 5. Jalankan perhitungan SAW
    const hasil = hitungSAW(nilaiRows, kriteria);

    if (!hasil || hasil.length === 0) {
      return res.status(400).json({
        message: "Perhitungan SAW gagal dilakukan. Periksa data nilai/kriteria.",
      });
    }

    // 🔹 6. Urutkan hasil dari tertinggi ke terendah
    hasil.sort((a, b) => b.nilai_akhir - a.nilai_akhir);

    // 🔹 7. Kirim hasil ke frontend
    res.json({
      user: username,
      role,
      hasil,
    });
  } catch (err) {
    console.error("❌ Error hasil:", err);
    res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: err.message,
    });
  }
};
