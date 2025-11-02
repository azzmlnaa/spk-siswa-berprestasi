// utils/saw.js
export const hitungSAW = (dataNilai, dataKriteria) => {
  try {
    if (!Array.isArray(dataNilai) || dataNilai.length === 0) return [];
    if (!Array.isArray(dataKriteria) || dataKriteria.length === 0) return [];

    console.log("=== 🧮 MULAI PROSES SAW ===");

    const bobotMap = {};
    const sifatMap = {};
    dataKriteria.forEach((k) => {
      bobotMap[k.id_kriteria] = parseFloat(k.bobot) || 0;
      sifatMap[k.id_kriteria] = (k.sifat || "benefit").toLowerCase();
    });

    // 🔹 Bentuk ulang data nilai per siswa
    const siswaMap = {};
    dataNilai.forEach((n) => {
      if (!siswaMap[n.id_siswa]) {
        siswaMap[n.id_siswa] = {
          id_siswa: n.id_siswa,
          nama_siswa: n.nama_siswa,
          kelas: n.kelas,
          nilai: {},
        };
      }
      siswaMap[n.id_siswa].nilai[n.id_kriteria] = parseFloat(n.nilai) || 0;
    });

    const siswaList = Object.values(siswaMap);

    // 🔹 Cari nilai maksimum & minimum per kriteria
    const maxValues = {};
    const minValues = {};
    Object.keys(bobotMap).forEach((idK) => {
      const allVals = siswaList.map((s) => s.nilai[idK] || 0);
      maxValues[idK] = Math.max(...allVals) || 1;
      minValues[idK] = Math.min(...allVals) || 0;
    });

    // 🔹 Normalisasi & hitung nilai akhir
    const hasil = siswaList.map((s) => {
      let total = 0;
      Object.keys(bobotMap).forEach((idK) => {
        const raw = s.nilai[idK] || 0;
        const bobot = bobotMap[idK];
        const sifat = sifatMap[idK];
        let norm = 0;

        if (sifat === "benefit") norm = raw / maxValues[idK];
        else if (sifat === "cost") norm = minValues[idK] / raw;

        total += norm * bobot;
      });

      return {
        id_siswa: s.id_siswa,
        nama_siswa: s.nama_siswa,
        kelas: s.kelas,
        nilai_akhir: parseFloat(total.toFixed(4)),
      };
    });

    hasil.sort((a, b) => b.nilai_akhir - a.nilai_akhir);

    console.log("✅ HASIL SAW:", hasil);
    return hasil;
  } catch (err) {
    console.error("❌ Error di fungsi hitungSAW:", err);
    return [];
  }
};
