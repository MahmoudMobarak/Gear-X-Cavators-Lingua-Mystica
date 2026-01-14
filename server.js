import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
app.post("/translate", async (req, res) => {
  const { input, fromLang, toLang } = req.body;

  if (!input || !fromLang || !toLang) {
    return res.status(400).json({ error: "Missing input or languages" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: `Translate from ${fromLang} to ${toLang}.
                      Give ONLY the plain translation in the first line.
                      Then give a clear explanation in plain text.
                      Do NOT include markdown or special formatting.`
          },
          { role: "user", content: input }
        ]
      })
    });

    const resultData = await response.json();
    const translationText = resultData.choices?.[0]?.message?.content || "No clear meaning";
    res.json({ result: translationText });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Default route to serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
