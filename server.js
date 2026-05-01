import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
  try {
    const { language, history } = req.body;

    if (!history ||!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: "history required" });
    }

    let systemPrompt = "You are a helpful AI assistant. Answer shortly and clearly.";
    if (language === "hi") {
      systemPrompt = "Tum ek madadgar AI assistant ho. Hindi me simple aur chhota jawab do.";
    }

    const messages = [
      { role: "system", content: systemPrompt },
   ...history
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant", // Naya working model
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No reply";
    res.json({ reply });

  } catch (err) {
    console.error('Backend Error:', err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log("Groq server running on port", PORT);
});