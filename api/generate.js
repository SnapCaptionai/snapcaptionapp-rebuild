import OpenAI from "openai";

export default async function handler(req, res) {
  const { idea, type } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let prompt = "";

  if (type === "fast") {
    prompt = `Write a short, punchy social media caption for: ${idea}`;
  } else {
    prompt = `Write a deep, emotional caption for creators over 40 about: ${idea}`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.status(200).json({
      caption: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: "AI failed",
      details: error.message,
    });
  }
}