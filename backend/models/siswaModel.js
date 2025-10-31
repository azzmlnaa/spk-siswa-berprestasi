// models/siswaModel.js
import db from "../config/db.js";

// ✅ Ambil semua siswa
export const getAllSiswa = async () => {
  const [rows] = await db.query("SELECT * FROM siswa");
  return rows;
};

// ✅ Ambil siswa berdasarkan ID
export const getSiswaById = async (id) => {
  const [rows] = await db.query("SELECT * FROM siswa WHERE id_siswa = ?", [id]);
  return rows[0];
};

// ✅ Tambah siswa baru
export const createSiswa = async (data) => {
  const [result] = await db.query(
    "INSERT INTO siswa (nama_siswa, kelas, jenis_kelamin) VALUES (?, ?, ?)",
    [data.nama_siswa, data.kelas, data.jenis_kelamin]
  );
  return result.insertId;
};

// ✅ Update data siswa
export const updateSiswa = async (id, data) => {
  await db.query(
    "UPDATE siswa SET nama_siswa=?, kelas=?, jenis_kelamin=? WHERE id_siswa=?",
    [data.nama_siswa, data.kelas, data.jenis_kelamin, id]
  );
};

// ✅ Hapus siswa
export const deleteSiswa = async (id) => {
  await db.query("DELETE FROM siswa WHERE id_siswa=?", [id]);
};
