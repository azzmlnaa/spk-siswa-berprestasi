// models/nilaiModel.js
import db from "../config/db.js";

export const getAllNilai = async () => {
  const [rows] = await db.promise().query(`
    SELECT nilai.id_nilai, siswa.nama_siswa, kriteria.nama_kriteria, nilai.nilai
    FROM nilai
    JOIN siswa ON nilai.id_siswa = siswa.id_siswa
    JOIN kriteria ON nilai.id_kriteria = kriteria.id_kriteria
  `);
  return rows;
};

export const getNilaiById = async (id) => {
  const [rows] = await db.promise().query("SELECT * FROM nilai WHERE id_nilai = ?", [id]);
  return rows[0];
};

export const insertNilai = async (data) => {
  const { id_siswa, id_kriteria, nilai } = data;
  await db.promise().query(
    "INSERT INTO nilai (id_siswa, id_kriteria, nilai) VALUES (?, ?, ?)",
    [id_siswa, id_kriteria, nilai]
  );
};

export const updateNilai = async (id, data) => {
  const { id_siswa, id_kriteria, nilai } = data;
  await db.promise().query(
    "UPDATE nilai SET id_siswa=?, id_kriteria=?, nilai=? WHERE id_nilai=?",
    [id_siswa, id_kriteria, nilai, id]
  );
};

export const deleteNilai = async (id) => {
  await db.promise().query("DELETE FROM nilai WHERE id_nilai = ?", [id]);
};
