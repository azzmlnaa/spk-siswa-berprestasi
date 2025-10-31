// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import db from "../config/db.js";
import { getUserByUsername, createUser } from "../models/userModel.js";

const SECRET_KEY = "rahasia_sistem_saw";

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch =
      password === user.password || (await bcrypt.compare(password, user.password));
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const dbName = `spk_${user.username}`; // nama database khusus user

    // Token berisi data user lengkap
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, dbName },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ message: `Login berhasil, selamat datang ${user.username}!`, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== REGISTER ======================
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Cek apakah username sudah digunakan
    const existing = await getUserByUsername(username);
    if (existing) return res.status(400).json({ message: "Username sudah digunakan" });

    const hashed = await bcrypt.hash(password, 10);
    const id = await createUser({ username, password: hashed, role });

    const dbName = `spk_${username}`;

    // Buat database baru untuk user
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    res.status(201).json({
      message: `User ${username} berhasil dibuat dan database baru '${dbName}' telah dibuat`,
      id,
      dbName,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
