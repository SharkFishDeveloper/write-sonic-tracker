import express from "express";
import cors from "cors";
import { runAIVisibility } from "./openai.js";


const app = express();
app.use(cors({
  origin: "https://write-sonic-tracker.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  const { category, brands } = req.body;

  try {
    const result = await runAIVisibility(category, brands);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
