export default async function handler(req, res) {
  try {
    const { idea, type } = req.body || {};

    if (!idea) {
      return res.status(400).json({ error: "Missing idea" });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    let prompt;

    if (type === "fast") {
      prompt = `
Create a bold, short caption.

Topic: ${idea}

Rules:
- 1–2 sentences only
- No clichés
- No generic motivation
- No "this is your moment"
- Make it sound real, direct, and slightly edgy

Return ONLY the caption.
`;
    } else {
      prompt = `
Create a deep caption for someone over 40 rebuilding their life.

Topic: ${idea}

Rules:
- 4–6 sentences
- Real tone, not inspirational poster
- No repeated phrases
- No generic lines
- Make it feel personal and grounded

Return ONLY the caption.
`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();

    const caption =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No caption generated";

    return res.status(200).json({ caption });
  } catch (err) {
    return res.status(500).json({
      error: "Server failed",
      details: err.message,
    });
  }
}
