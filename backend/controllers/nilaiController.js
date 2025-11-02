// controllers/nilaiController.js
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = "rahasia_sistem_saw";

// 🔹 Fungsi bantu ambil koneksi sesuai user
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

// 🔹 GET semua nilai
export const getNilai = async (req, res) => {
  try {
    const { connection, user } = await getUserConnection(req);
    const [rows] = await connection.query(`
      SELECT n.id_nilai, s.nama_siswa, k.nama_kriteria, n.nilai
      FROM nilai n
      JOIN siswa s ON n.id_siswa = s.id_siswa
      JOIN kriteria k ON n.id_kriteria = k.id_kriteria
    `);
    await connection.end();
    res.json({
      message: `Data nilai untuk ${user.username}`,
      data: rows,
    });
  } catch (err) {
    console.error("❌ Gagal ambil data nilai:", err);
    res.status(500).json({ message: "Gagal mengambil data nilai", error: err.message });
  }
};

// 🔹 GET nilai per siswa
export const getNilaiBySiswa = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const { id_siswa } = req.params;
    const [rows] = await connection.query(
      `
      SELECT n.id_nilai, s.nama_siswa, k.nama_kriteria, n.nilai
      FROM nilai n
      JOIN siswa s ON n.id_siswa = s.id_siswa
      JOIN kriteria k ON n.id_kriteria = k.id_kriteria
      WHERE n.id_siswa = ?
    `,
      [id_siswa]
    );
    await connection.end();

    res.json({
      message: rows.length
        ? "Data nilai siswa ditemukan"
        : "Belum ada nilai untuk siswa ini",
      data: rows,
    });
  } catch (err) {
    console.error("❌ Gagal ambil nilai per siswa:", err);
    res.status(500).json({ message: "Gagal mengambil nilai siswa", error: err.message });
  }
};

// 🔹 POST tambah nilai
export const createNilai = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const { id_siswa, id_kriteria, nilai } = req.body;

    if (!id_siswa || !id_kriteria || nilai === undefined) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    await connection.query(
      "INSERT INTO nilai (id_siswa, id_kriteria, nilai) VALUES (?, ?, ?)",
      [id_siswa, id_kriteria, nilai]
    );

    await connection.end();
    res.status(201).json({ message: "Nilai berhasil ditambahkan" });
  } catch (err) {
    console.error("❌ Gagal tambah nilai:", err);
    res.status(500).json({ message: "Gagal menambah nilai", error: err.message });
  }
};

// 🔹 DELETE hapus nilai
export const deleteNilai = async (req, res) => {
  try {
    const { connection } = await getUserConnection(req);
    const { id } = req.params;
    await connection.query("DELETE FROM nilai WHERE id_nilai = ?", [id]);
    await connection.end();
    res.json({ message: "Nilai berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus nilai:", err);
    res.status(500).json({ message: "Gagal menghapus nilai", error: err.message });
  }
};
