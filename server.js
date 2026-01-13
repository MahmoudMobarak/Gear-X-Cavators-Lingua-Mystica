import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// TRANSLATE ENDPOINT
app.post("/translate", async (req, res) => {
  const { input, fromLang, toLang } = req.body;

  if (!input || !fromLang || !toLang) {
    return res.json({ result: "No clear meaning" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `Translate from ${fromLang} to ${toLang}.
Give ONLY the plain translation in the first line.
Then give a clear explanation in plain text.
If no meaning exists, say "No clear meaning".`
          },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No clear meaning";

    res.json({ result: text });

  } catch (err) {
    console.error(err);
    res.json({ result: "No clear meaning" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Lingua Mystica running on port ${PORT}`);
});
