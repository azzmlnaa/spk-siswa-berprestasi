// utils/saw.js
export const hitungSAW = (dataNilai, dataKriteria) => {
  try {
    if (!dataNilai || !dataKriteria) return [];

    console.log("=== 🧮 MULAI PROSES NORMALISASI SAW ===");

    // 1️⃣ Ambil nama kolom kriteria (dari dataNilai)
    const kriteriaKeys = Object.keys(dataNilai[0]).filter(
      (key) => key !== "id_siswa" && key !== "nama_siswa"
    );

    // 2️⃣ Konversi semua nilai ke number
    const dataConverted = dataNilai.map((siswa) => {
      const converted = { ...siswa };
      kriteriaKeys.forEach((k) => {
        converted[k] = parseFloat(siswa[k]) || 0;
      });
      return converted;
    });

    // 3️⃣ Dapatkan nilai maksimum & minimum untuk tiap kriteria
    const maxValues = {};
    const minValues = {};
    kriteriaKeys.forEach((key) => {
      const values = dataConverted.map((s) => s[key]);
      maxValues[key] = Math.max(...values);
      minValues[key] = Math.min(...values);
    });

    console.log("🧩 MAX VALUES:", maxValues);
    console.log("🧩 MIN VALUES:", minValues);

    // 4️⃣ Normalisasi nilai berdasarkan sifat (benefit/cost)
    const normalized = dataConverted.map((siswa) => {
      const norm = { ...siswa };
      kriteriaKeys.forEach((key) => {
        const kriteria = dataKriteria.find((k) =>
          k.nama_kriteria.toLowerCase().includes(key.replace("nilai_", "").toLowerCase())
        );

        if (!kriteria) {
          norm[key] = 0;
        } else if (kriteria.sifat === "benefit") {
          norm[key] = siswa[key] / maxValues[key];
        } else if (kriteria.sifat === "cost") {
          norm[key] = minValues[key] / siswa[key];
        }
      });
      return norm;
    });

    console.log("📊 DATA NORMALISASI:");
    console.table(normalized);

    // 5️⃣ Hitung total nilai preferensi (Σ bobot * normalisasi)
    const hasil = normalized.map((siswa) => {
      let total = 0;
      kriteriaKeys.forEach((key) => {
        const kriteria = dataKriteria.find((k) =>
          k.nama_kriteria.toLowerCase().includes(key.replace("nilai_", "").toLowerCase())
        );
        const bobot = parseFloat(kriteria?.bobot) || 0;
        total += bobot * siswa[key];
      });

      return {
        id_siswa: String(siswa.id_siswa),
        nama_siswa: siswa.nama_siswa,
        total: parseFloat(total.toFixed(4)),
      };
    });

    // 6️⃣ Urutkan dari terbesar ke terkecil
    hasil.sort((a, b) => b.total - a.total);

    return hasil;
  } catch (err) {
    console.error("❌ Error di fungsi hitungSAW:", err);
    return [];
  }
};
