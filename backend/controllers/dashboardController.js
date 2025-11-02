// backend/controllers/dashboardController.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
const SECRET_KEY = "rahasia_sistem_saw";

export const getDashboard = async (req, res) => {
  try {
    // === 1️⃣ Verifikasi Token ===
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const username = decoded.username || "User";
    const role = decoded.role || "user";
    const dbName = decoded.dbName || process.env.DB_NAME;

    // === 2️⃣ Buat koneksi sesuai role ===
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: role === "admin" ? process.env.DB_NAME : dbName,
    });

    // === 3️⃣ Ambil ringkasan data ===
    const [[{ jmlSiswa }]] = await connection.query(
      "SELECT COUNT(*) AS jmlSiswa FROM siswa"
    );
    const [[{ jmlKriteria }]] = await connection.query(
      "SELECT COUNT(*) AS jmlKriteria FROM kriteria"
    );
    const [[{ jmlNilai }]] = await connection.query(
      "SELECT COUNT(*) AS jmlNilai FROM nilai"
    );

    // === 4️⃣ Ambil data hasil SPK (Ranking Top 5) ===
    const [rankingTop5] = await connection.query(`
      SELECT 
        s.id_siswa,
        s.nama_siswa,
        ROUND(SUM(n.nilai * (k.bobot / 100)), 4) AS total
      FROM siswa s
      LEFT JOIN nilai n ON n.id_siswa = s.id_siswa
      LEFT JOIN kriteria k ON n.id_kriteria = k.id_kriteria
      GROUP BY s.id_siswa
      ORDER BY total DESC
      LIMIT 5
    `);

    // === 5️⃣ Ambil aktivitas terbaru (5 data terakhir) ===
    const [aktivitas] = await connection.query(`
      SELECT 
        s.nama_siswa, 
        k.nama_kriteria, 
        n.nilai
      FROM nilai n
      JOIN siswa s ON n.id_siswa = s.id_siswa
      JOIN kriteria k ON n.id_kriteria = k.id_kriteria
      ORDER BY n.id_nilai DESC
      LIMIT 5
    `);

    await connection.end();

    // === 6️⃣ Siapkan data grafik ===
    const grafik = {
      labels: rankingTop5.map((r) => r.nama_siswa),
      data: rankingTop5.map((r) => parseFloat(r.total) || 0),
    };

    // === 7️⃣ Ambil nama Ranking 1 ===
    const ranking1 =
      rankingTop5.length > 0 ? rankingTop5[0].nama_siswa : "Belum Ada";

    // === 8️⃣ Kirim Response ===
    res.json({
      user: username,
      role,
      jmlSiswa,
      jmlKriteria,
      jmlNilai,
      ranking1,
      grafik,
      aktivitas,
    });
  } catch (error) {
    console.error("❌ Error Dashboard:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
