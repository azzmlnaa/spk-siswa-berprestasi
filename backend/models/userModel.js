import db from "../config/db.js";

// Ambil user berdasarkan username
export const getUserByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
};

// Tambah user baru
export const createUser = async (data) => {
  const { username, password, role } = data;
  const [result] = await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role || "user"]
  );
  return result.insertId;
};
