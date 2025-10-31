// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const SECRET_KEY = "rahasia_sistem_saw"; // harus sama seperti di authController.js

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // simpan data user ke request
    next();
  } catch (error) {
    res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};
