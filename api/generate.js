import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { idea, type } = await req.json();

    if (!idea) {
      return new Response(
        JSON.stringify({ error: "Missing idea" }),
        { status: 400 }
      );
    }

    // ✅ Get Gemini key
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
        { status: 500 }
      );
    }

    // 🔥 FULL PROMPT SYSTEM (THIS WAS YOUR MAIN PROBLEM)
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

    // 🔥 UPDATED MODEL + SETTINGS (THIS FIXES REPETITION)
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

    // ✅ SAFE EXTRACTION (PREVENTS FALLBACK LOOPS)
    const caption =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No caption generated";

    return new Response(
      JSON.stringify({ caption }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Server failed",
        details: err.message,
      }),
      { status: 500 }
    );
  }
});