import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import History from "./models/History.js";
import jwt from "jsonwebtoken";

import historyRoutes from "./routes/history.routes.js";
app.use("/api/history", historyRoutes);
dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());

/* ===================== DATABASE ===================== */
connectDB();

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);

/* ===================== AI CODE REVIEW ===================== */
app.post("/api/review", async (req, res) => {
  const { code, language } = req.body;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a senior software engineer. Review the code and give improvements." },
          { role: "user", content: `Language: ${language}\n\nCode:\n${code}` }
        ],
        temperature: 0.2,
        max_tokens: 600
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "CodieFy"
        }
      }
    );

    const aiResult = response.data.choices[0].message.content;

    // ✅ SAVE TO DB
    await History.create({
      user: decoded.id,
      language,
      code,
      result: aiResult
    });

    res.json({ result: aiResult });
  } catch (err) {
    res.status(500).json({ error: "AI review failed" });
  }
});


/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
