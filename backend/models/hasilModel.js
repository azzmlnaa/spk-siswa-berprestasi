// models/hasilModel.js
import db from "../config/db.js";

// 🔹 Ambil semua data nilai siswa + data kriteria
export const getDataNilaiDanKriteria = async () => {
  const [dataNilai] = await db.query(`
    SELECT 
      s.id_siswa, 
      s.nama_siswa,
      n1.nilai AS nilai_akademik, 
      n2.nilai AS hafalan_quran, 
      n3.nilai AS prilaku, 
      n4.nilai AS kehadiran
    FROM siswa s
    LEFT JOIN nilai n1 ON n1.id_siswa = s.id_siswa AND n1.id_kriteria = 18
    LEFT JOIN nilai n2 ON n2.id_siswa = s.id_siswa AND n2.id_kriteria = 19
    LEFT JOIN nilai n3 ON n3.id_siswa = s.id_siswa AND n3.id_kriteria = 20
    LEFT JOIN nilai n4 ON n4.id_siswa = s.id_siswa AND n4.id_kriteria = 21
  `);

  const [dataKriteria] = await db.query(`SELECT * FROM kriteria`);
  return { dataNilai, dataKriteria };
};

// 🔹 Ambil hasil SAW berdasarkan ID
export const getHasilById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM hasil_saw WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// 🔹 Simpan hasil perhitungan SAW (insert baru)
export const createHasil = async (data) => {
  const [result] = await db.query(
    `INSERT INTO hasil_saw (id_siswa, nama_siswa, nilai_akhir)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       nama_siswa = VALUES(nama_siswa),
       nilai_akhir = VALUES(nilai_akhir)`,
    [data.id_siswa, data.nama_siswa, data.nilai_akhir]
  );
  return result.insertId;
};

// 🔹 Update hasil SAW
export const updateHasil = async (id, data) => {
  await db.query(
    `UPDATE hasil_saw 
     SET nama_siswa = ?, nilai_akhir = ? 
     WHERE id = ?`,
    [data.nama_siswa, data.nilai_akhir, id]
  );
};

// 🔹 Hapus hasil SAW berdasarkan ID
export const deleteHasil = async (id) => {
  await db.query(`DELETE FROM hasil_saw WHERE id = ?`, [id]);
};
