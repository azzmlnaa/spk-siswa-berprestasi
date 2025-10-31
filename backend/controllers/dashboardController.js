// controllers/dashboardController.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const SECRET_KEY = "rahasia_sistem_saw"; // sama seperti di authController.js

export const getDashboard = async (req, res) => {
  try {
    // --- 1. Verifikasi Token ---
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username || "User";

    // --- 2. Hitung Ringkasan ---
    const [siswaCount] = await db.query("SELECT COUNT(*) AS jmlSiswa FROM siswa");
    const [kriteriaCount] = await db.query("SELECT COUNT(*) AS jmlKriteria FROM kriteria");
    const [nilaiCount] = await db.query("SELECT COUNT(*) AS jmlNilai FROM nilai");

    const jmlSiswa = siswaCount[0]?.jmlSiswa || 0;
    const jmlKriteria = kriteriaCount[0]?.jmlKriteria || 0;
    const jmlNilai = nilaiCount[0]?.jmlNilai || 0;

    // --- 3. Ranking Top 5 ---
    const [rankingTop5] = await db.query(`
      SELECT 
        s.id_siswa,
        s.nama_siswa,
        COALESCE(SUM(n.nilai * k.bobot), 0) AS total
      FROM siswa s
      LEFT JOIN nilai n ON n.id_siswa = s.id_siswa
      LEFT JOIN kriteria k ON n.id_kriteria = k.id_kriteria
      GROUP BY s.id_siswa
      ORDER BY total DESC
      LIMIT 5
    `);

    // --- 4. Data Siswa Terbaru (5 terakhir ditambahkan) ---
    const [latestStudents] = await db.query(`
      SELECT 
        s.id_siswa,
        s.nama_siswa,
        COALESCE(SUM(n.nilai * k.bobot), 0) AS total
      FROM siswa s
      LEFT JOIN nilai n ON n.id_siswa = s.id_siswa
      LEFT JOIN kriteria k ON n.id_kriteria = k.id_kriteria
      GROUP BY s.id_siswa
      ORDER BY s.id_siswa DESC
      LIMIT 5
    `);

    // --- 5. Aktivitas Terbaru (5 input nilai terakhir) ---
    const [aktivitas] = await db.query(`
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

    // --- 6. Siapkan Data Grafik ---
    const grafik = {
      labels: rankingTop5.map(r => r.nama_siswa),
      data: rankingTop5.map(r => {
        const nilai = parseFloat(r.total);
        return isNaN(nilai) ? 0 : nilai; // jangan .toFixed() di sini, frontend yang handle format tampilan
      })
    };

    // --- 7. Ambil Ranking 1 ---
    const ranking1 = rankingTop5.length > 0 ? rankingTop5[0].nama_siswa : "Belum Ada";

    // --- 8. Kirim Response ke Frontend ---
    res.json({
      message: `Hallo ${username}`,
      jmlSiswa,
      jmlKriteria,
      jmlNilai,
      ranking1,
      rankingTop5,
      latestStudents,
      aktivitas,
      grafik,
      username,
      avatar: `https://i.pravatar.cc/50?u=${username}`
    });

  } catch (error) {
    console.error("Error Dashboard:", error);
    res.status(500).json({ 
      message: "Terjadi kesalahan pada server", 
      error: error.message 
    });
  }
};
