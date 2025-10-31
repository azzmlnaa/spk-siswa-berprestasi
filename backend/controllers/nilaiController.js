// controllers/nilaiController.js

// === GET semua nilai ===
export const getNilai = async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM nilai");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data nilai", error: err.message });
  }
};

// === GET nilai berdasarkan ID ===
export const getNilaiById = async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM nilai WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data nilai", error: err.message });
  }
};

// === CREATE nilai ===
export const createNilai = async (req, res) => {
  try {
    const { id_siswa, id_kriteria, nilai } = req.body;
    await req.db.query(
      "INSERT INTO nilai (id_siswa, id_kriteria, nilai) VALUES (?, ?, ?)",
      [id_siswa, id_kriteria, nilai]
    );
    res.status(201).json({ message: "Data nilai berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan nilai", error: err.message });
  }
};

// === UPDATE nilai ===
export const updateNilai = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_siswa, id_kriteria, nilai } = req.body;
    await req.db.query(
      "UPDATE nilai SET id_siswa = ?, id_kriteria = ?, nilai = ? WHERE id = ?",
      [id_siswa, id_kriteria, nilai, id]
    );
    res.json({ message: "Data nilai berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui nilai", error: err.message });
  }
};

// === DELETE nilai ===
export const deleteNilai = async (req, res) => {
  try {
    const { id } = req.params;
    await req.db.query("DELETE FROM nilai WHERE id = ?", [id]);
    res.json({ message: "Data nilai berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus nilai", error: err.message });
  }
};
