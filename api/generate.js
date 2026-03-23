import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Parse request
    const { idea, type } = await req.json();

    if (!idea) {
      return new Response(
        JSON.stringify({ error: "Missing idea" }),
        { status: 400 }
      );
    }

    // Get Gemini key
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
        { status: 500 }
      );
    }

    // Build prompt
    const prompt =
      type === "fast"
        ? `Write a short, punchy caption: ${idea}`
        : `Write a deeper, emotional caption for creators over 40: ${idea}`;

    // Call Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract caption safely
    const caption =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

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