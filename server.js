import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check (Render needs this)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===============================
// TRANSLATE ENDPOINT
// ===============================
app.post("/translate", async (req, res) => {
  const { input, fromLang, toLang } = req.body;

  if (!input || !fromLang || !toLang) {
    return res.json({ result: "No clear meaning" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          // REQUIRED by OpenRouter (this was missing before)
          "HTTP-Referer": "https://gear-x-cavators-lingua-mystica.onrender.com",
          "X-Title": "Lingua Mystica"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "system",
              content: `Translate from ${fromLang} to ${toLang}.
Return ONLY the translation on the first line.
Then return a short explanation on the second line.
If no meaning exists, say "No clear meaning".`
            },
            {
              role: "user",
              content: input
            }
          ]
        })
      }
    );

    const data = await response.json();

    // VERY IMPORTANT LOG
    console.log(
      "OPENROUTER RAW RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    if (data.error) {
      console.error("OPENROUTER ERROR:", data.error);
      return res.json({ result: "No clear meaning" });
    }

    const text =
      data?.choices?.[0]?.message?.content ?? "No clear meaning";

    res.json({ result: text });

  } catch (err) {
    console.error("TRANSLATION ERROR:", err);
    res.json({ result: "No clear meaning" });
  }
});

// Serve frontend (for GitHub Pages-style routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Lingua Mystica running on port ${PORT}`);
});
