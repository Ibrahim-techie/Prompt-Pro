// ✅ server.js using real Gemini API securely

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-pro";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST /generate
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "❌ Prompt is required" });
  }

  try {
    const geminiRes = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await geminiRes.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini returned no usable response.";
    const tokenCount = data?.usageMetadata?.totalTokenCount || 0;

    console.log(`📦 Tokens used: ${tokenCount}`); // ✅ Log token count to terminal

    res.json({ result });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ error: "❌ Failed to contact Gemini API." });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ PromptPro API is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});