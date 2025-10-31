// controllers/hasilController.js
import { hitungSAW } from "../utils/saw.js";
import {
  getDataNilaiDanKriteria,
  getHasilById,
  createHasil,
  updateHasil,
  deleteHasil
} from "../models/hasilModel.js";

// ✅ GET semua hasil (otomatis dihitung dengan SAW)
export const getHasil = async (req, res) => {
  try {
    const { dataNilai, dataKriteria } = await getDataNilaiDanKriteria();

    // 🧩 DEBUG 1: Cek data mentah hasil query database
    console.log("\n=== 🧩 DEBUG 1: HASIL QUERY DARI DATABASE ===");
    console.table(dataNilai);
    console.table(dataKriteria);

    // Pastikan datanya tidak kosong
    if (!dataNilai || dataNilai.length === 0) {
      console.warn("⚠️ Tidak ada data nilai yang ditemukan di database!");
      return res.status(400).json({ message: "Data nilai tidak ditemukan" });
    }
    if (!dataKriteria || dataKriteria.length === 0) {
      console.warn("⚠️ Tidak ada data kriteria yang ditemukan di database!");
      return res.status(400).json({ message: "Data kriteria tidak ditemukan" });
    }

    // 🧩 DEBUG 2: Cek apakah semua nilai siswa terisi atau masih ada yang null
    const adaNull = dataNilai.some(s =>
      Object.values(s).some(v => v === null)
    );
    if (adaNull) {
      console.warn("⚠️ Ada nilai siswa yang masih NULL. Mohon periksa tabel `nilai`!");
    }

    console.log("\n=== 🧮 DEBUG 3: DATA NILAI SETELAH CEK ===");
    dataNilai.forEach(s => {
      console.log(`Siswa: ${s.nama_siswa} | Nilai:`, s);
    });

    // Jalankan perhitungan SAW
    console.log("\n=== 🔢 DEBUG 4: MULAI PROSES PERHITUNGAN SAW ===");
    const hasil = hitungSAW(dataNilai, dataKriteria);

    console.log("\n=== ✅ DEBUG 5: HASIL PERHITUNGAN SAW ===");
    console.table(hasil);

    // ✅ Kirim juga data mentah untuk debugging via Postman
    res.json({
      message: "Berhasil menghitung hasil SAW",
      totalData: hasil.length,
      data: hasil,
      debug: {
        dataNilai,
        dataKriteria,
      },
    });
  } catch (err) {
    console.error("❌ Error di getHasil:", err);
    res.status(500).json({
      message: "Gagal menghitung hasil SAW",
      error: err.message,
    });
  }
};

// ✅ GET hasil by ID (opsional)
export const getHasilDetail = async (req, res) => {
  try {
    const hasil = await getHasilById(req.params.id);
    if (!hasil) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json(hasil);
  } catch (err) {
    console.error("❌ Error di getHasilDetail:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ POST tambah hasil (jika ingin disimpan ke tabel hasil)
export const createHasilData = async (req, res) => {
  try {
    const id = await createHasil(req.body);
    res.status(201).json({
      message: "Hasil berhasil ditambahkan",
      id,
    });
  } catch (err) {
    console.error("❌ Error di createHasilData:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ PUT update hasil
export const editHasil = async (req, res) => {
  try {
    await updateHasil(req.params.id, req.body);
    res.json({ message: "Hasil berhasil diubah" });
  } catch (err) {
    console.error("❌ Error di editHasil:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE hasil
export const removeHasil = async (req, res) => {
  try {
    await deleteHasil(req.params.id);
    res.json({ message: "Hasil berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error di removeHasil:", err);
    res.status(500).json({ message: err.message });
  }
};
