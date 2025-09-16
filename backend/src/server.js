import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import txRoutes from "./routes/transactions.js";
import "./config/db.js"; // ✅ just import, it connects automatically

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", txRoutes);

app.get("/", (req, res) => res.send({ message: "Demo banking backend running" }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("🚀 Server started on port", port));