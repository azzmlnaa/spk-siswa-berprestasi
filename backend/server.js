import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nilaiRoutes from "./routes/nilaiRoutes.js";
import kriteriaRoutes from "./routes/kriteriaRoutes.js";
import siswaRoutes from "./routes/siswaRoutes.js";
import hasilRoutes from "./routes/hasilRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5000", // sesuaikan dengan alamat frontend kamu
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Serve file HTML di folder public
app.use(express.static("public"));

// Register routes
app.use("/api/nilai", nilaiRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/siswa", siswaRoutes);
app.use("/api/hasil", hasilRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
