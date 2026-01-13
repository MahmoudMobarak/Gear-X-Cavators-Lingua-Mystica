import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------------------
   Fix __dirname for ES modules
------------------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------------
   Middleware
------------------------------ */
app.use(bodyParser.json());
app.use(express.static(__dirname));

/* ------------------------------
   TRANSLATE ENDPOINT
------------------------------ */
app.post("/translate", async (req, res) => {
  const { input, fromLang, toLang } = req.body;

  if (!input || !fromLang || !toLang) {
    return res.json({
      result: "No clear meaning\nNo clear meaning"
    });
  }

  try {
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content:
              `Translate from ${fromLang} to ${toLang}.
Give ONLY the translation on the first line.
Then give a plain-text explanation.
Do NOT use markdown, symbols, bullets, or formatting.
If no meaning exists, say "No clear meaning".`
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await aiRes.json();

    if (!data.choices || !data.choices[0]) {
      return res.json({
        result: "No clear meaning\nNo clear meaning"
      });
    }

    const text = data.choices[0].message.content.trim();

    res.json({ result: text });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.json({
      result: "Translation failed\nTranslation failed"
    });
  }
});

/* ------------------------------
   Serve frontend
------------------------------ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ------------------------------
   Start server
------------------------------ */
app.listen(PORT, () => {
  console.log(`Lingua Mystica running on port ${PORT}`);
});
