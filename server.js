import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Ask me anything about improving your looks." });
  }

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
You are Ascend AI, a professional looksmaxxing assistant.

Your goal is to help users improve their appearance with healthy and realistic advice.

Focus on:
- skincare
- hair
- grooming
- body fat
- posture
- fitness
- fashion
- hygiene
- confidence

Structure answers clearly like:

1. Skin
2. Hair
3. Body
4. Style
5. Habits

Give practical actionable advice.
Be supportive and motivating.
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

    if (!data.choices || !data.choices[0]) {

      console.error("Groq API error:", data);

      return res.json({
        reply: "AI could not respond right now."
      });

    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {

    console.error("Server error:", error);

    res.json({
      reply: "Server error. Try again later."
    });

  }

});

app.listen(PORT, () => {
  console.log(`🚀 Ascend AI running on http://localhost:${PORT}`);
});