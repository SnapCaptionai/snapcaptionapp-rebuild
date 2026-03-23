import OpenAI from "openai";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { idea, type } = req.body;

    // Validate input
    if (!idea) {
      return res.status(400).json({ error: "Missing idea" });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in environment",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prompt logic
    let prompt = "";

    if (type === "fast") {
      prompt = `Write a short, punchy social media caption for: ${idea}`;
    } else {
      prompt = `Write a deep, emotional caption for creators over 40 about: ${idea}`;
    }

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Return clean JSON
    return res.status(200).json({
      caption: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      error: "Server failed",
      details: error.message,
    });
  }
}