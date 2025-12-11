// File: auth-server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js"; // Note: .js extension zaroori hai ESM mein

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7860;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"], // Aapka frontend URL
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Better Auth API Route
app.all("/api/auth/*", toNodeHandler(auth));

// Health check
app.get("/", (req, res) => {
    res.send("Auth Server is Running on Port " + PORT + " 🚀");
});

app.listen(PORT, () => {
    console.log(`✅ Auth Server running at http://localhost:${PORT}`);
});