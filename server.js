// server.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // for making API calls
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // for JSON body parsing

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Translation endpoint
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
                      Do NOT include markdown or special formatting.`
          },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices[0]?.message?.content || "No result";

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
