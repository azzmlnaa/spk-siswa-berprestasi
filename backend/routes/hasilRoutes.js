// backend/routes/hasilRoute.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Ambil data siswa + pivot nilai per id_kriteria (gunakan CASE WHEN)
    // Sesuaikan id_kriteria (18..21) sesuai database-mu
    const [rows] = await db.query(`
      SELECT
        s.id_siswa,
        s.nama_siswa,
        s.kelas,
        MAX(CASE WHEN n.id_kriteria = 18 THEN n.nilai END) AS nilai_akademik,
        MAX(CASE WHEN n.id_kriteria = 19 THEN n.nilai END) AS hafalan_quran,
        MAX(CASE WHEN n.id_kriteria = 20 THEN n.nilai END) AS prilaku,
        MAX(CASE WHEN n.id_kriteria = 21 THEN n.nilai END) AS kehadiran
      FROM siswa s
      LEFT JOIN nilai n ON n.id_siswa = s.id_siswa
      GROUP BY s.id_siswa, s.nama_siswa, s.kelas
    `);

    // Ambil semua kriteria (untuk bobot & sifat)
    const [kriteria] = await db.query(`SELECT id_kriteria, nama_kriteria, bobot, sifat FROM kriteria`);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Data siswa/nilai kosong." });
    }
    if (!kriteria || kriteria.length === 0) {
      return res.status(404).json({ message: "Data kriteria kosong." });
    }

    // Map bobot & sifat per id_kriteria (lebih aman daripada matching by name)
    const bobotMap = {};
    const sifatMap = {};
    kriteria.forEach(k => {
      bobotMap[k.id_kriteria] = parseFloat(k.bobot) || 0;
      sifatMap[k.id_kriteria] = (k.sifat || "benefit").toLowerCase();
    });

    // Jika kamu mau pakai nama kriteria dinamis (mis. nama_kriteria untuk kolom),
    // buat mapping antara kolom pivot di query dan id_kriteria:
    const pivotToKriteriaId = {
      nilai_akademik: 18,
      hafalan_quran: 19,
      prilaku: 20,
      kehadiran: 21
    };

    // Konversi dan normalisasi
    const data = rows.map(r => ({
      id_siswa: r.id_siswa,
      nama_siswa: r.nama_siswa,
      kelas: r.kelas,
      // pastikan jadi number
      nilai_akademik: parseFloat(r.nilai_akademik) || 0,
      hafalan_quran: parseFloat(r.hafalan_quran) || 0,
      prilaku: parseFloat(r.prilaku) || 0,
      kehadiran: parseFloat(r.kehadiran) || 0
    }));

    // Hitung max tiap kolom (untuk benefit) atau min jika cost (tapi semua examplemu benefit)
    const keys = Object.keys(pivotToKriteriaId); // ['nilai_akademik', ...]
    const maxValues = {};
    keys.forEach(k => {
      maxValues[k] = Math.max(...data.map(d => d[k] || 0));
      // hindari 0 divisor
      if (!maxValues[k] || isNaN(maxValues[k])) maxValues[k] = 0;
    });

    // Normalisasi & hitung total
    const hasil = data.map(d => {
      let total = 0;

      keys.forEach(key => {
        const kId = pivotToKriteriaId[key];
        const bobot = bobotMap[kId] ?? 0;
        const sifat = sifatMap[kId] ?? "benefit";
        const raw = d[key] || 0;

        let norm = 0;
        if (sifat === "benefit") {
          norm = maxValues[key] > 0 ? raw / maxValues[key] : 0;
        } else {
          // cost
          // hitung min untuk cost:
          const minVal = Math.min(...data.map(x => x[key] || Infinity));
          norm = raw > 0 ? minVal / raw : 0;
        }

        total += norm * bobot;
      });

      return {
        id_siswa: d.id_siswa,
        nama_siswa: d.nama_siswa,
        kelas: d.kelas,
        nilai_akhir: parseFloat(total.toFixed(4))
      };
    });

    // Urutkan descending
    hasil.sort((a, b) => b.nilai_akhir - a.nilai_akhir);

    return res.json(hasil);
  } catch (err) {
    console.error("Error hitung hasil SAW:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: err.message });
  }
});

export default router;
