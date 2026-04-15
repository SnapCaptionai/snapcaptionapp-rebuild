export default async function handler(req, res) {
  try {
    const { idea, type } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Missing idea" });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    let prompt =
      type === "fast"
        ? `Create a bold short caption about: ${idea}`
        : `Create a deep caption about: ${idea}`;

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
