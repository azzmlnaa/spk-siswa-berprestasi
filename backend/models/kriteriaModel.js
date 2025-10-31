import db from "../config/db.js";

// Get semua kriteria
export const getAllKriteria = async () => {
  const [rows] = await db.query("SELECT * FROM kriteria");
  return rows;
};

// Get kriteria by ID
export const getKriteriaById = async (id) => {
  const [rows] = await db.query("SELECT * FROM kriteria WHERE id_kriteria = ?", [id]);
  return rows;
};

// Tambah kriteria
export const addKriteria = async (data) => {
  const [result] = await db.query(
    "INSERT INTO kriteria (nama_kriteria, bobot, sifat) VALUES (?, ?, ?)",
    [data.nama_kriteria, data.bobot, data.sifat]
  );
  return result;
};

// Update kriteria
export const updateKriteria = async (id, data) => {
  const [result] = await db.query(
    "UPDATE kriteria SET nama_kriteria=?, bobot=?, sifat=? WHERE id_kriteria=?",
    [data.nama_kriteria, data.bobot, data.sifat, id]
  );
  return result;
};

// Delete kriteria
export const deleteKriteria = async (id) => {
  const [result] = await db.query("DELETE FROM kriteria WHERE id_kriteria=?", [id]);
  return result;
};
