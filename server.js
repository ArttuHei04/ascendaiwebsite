import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

/* CHAT */

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  try {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `
You are Ascend AI, a looksmaxxing assistant.

Give clear structured advice.
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});


/* PLAN GENERATOR */

app.post("/generate-plan", async (req, res) => {

  const { answers } = req.body;

  try {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
Create a personalized looksmaxxing plan.

Return ONLY JSON.

{
  "goals": [],
  "daily": [],
  "weekly": [],
  "habits": [
    { "task": "", "done": false }
  ]
}
`
          },
          {
            role: "user",
            content: JSON.stringify(answers)
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.json({ error: "Invalid AI JSON", raw });
    }

    res.json({ plan: parsed });

  } catch (err) {
    res.json({ error: "Server error" });
  }

});


app.listen(PORT, () => {
  console.log(`🚀 Running on http://localhost:${PORT}`);
});