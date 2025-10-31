import {
  getAllKriteria,
  getKriteriaById,
  addKriteria,
  updateKriteria,
  deleteKriteria,
} from "../models/kriteriaModel.js";

// GET semua kriteria
export const getKriteria = async (req, res) => {
  try {
    const result = await getAllKriteria();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data kriteria", error: err.message });
  }
};

// GET kriteria by ID
export const getKriteriaDetail = async (req, res) => {
  try {
    const result = await getKriteriaById(req.params.id);
    if (result.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil detail kriteria", error: err.message });
  }
};

// POST tambah kriteria
export const createKriteria = async (req, res) => {
  try {
    const data = req.body;
    await addKriteria(data);
    res.status(201).json({ message: "Kriteria berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan kriteria", error: err.message });
  }
};

// PUT ubah kriteria
export const editKriteria = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateKriteria(id, data);
    res.json({ message: "Kriteria berhasil diubah" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah kriteria", error: err.message });
  }
};

// DELETE hapus kriteria
export const removeKriteria = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteKriteria(id);
    res.json({ message: "Kriteria berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus kriteria", error: err.message });
  }
};
