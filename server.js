// server.js (ES Module version)

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // for calling APIs
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // your frontend folder

// Translation endpoint
app.post("/translate", async (req, res) => {
  const { input, fromLang, toLang } = req.body;

  if (!input || !fromLang || !toLang) {
    return res.status(400).json({ error: "Missing input or languages" });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key not set" });
  }

  const noMeaning = "No clear meaning";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: `Translate from ${fromLang} to ${toLang}.
Give ONLY the plain translation in the first line.
Then give a clear explanation in plain text.
Do NOT include markdown or special formatting.
If the word does not exist, say '${noMeaning}'.`
          },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || noMeaning;
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "Translation failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
