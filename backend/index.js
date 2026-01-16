import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { runAIVisibility } from "./openai.js";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();


const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.post("/run",aiLimiter,async (req, res) => {
  const { category, brands } = req.body;

  if (!category || !Array.isArray(brands) || brands.length === 0) {
    return res.status(400).json({ error: "Category and a non-empty brands array are required." });
  }

  if (brands.length > 20) {
    return res.status(400).json({ error: "Too many brands. Limit is 20." });
  }

  if (
    typeof category !== "string" ||
    brands.some(b => typeof b !== "string")
  ) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const result = await runAIVisibility(
      category.trim(),
      brands.map(b => b.trim())
    );
    res.json(result);
  } catch (err) {
    console.error("Run failed:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
