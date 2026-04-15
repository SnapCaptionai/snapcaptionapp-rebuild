import { useState } from "react";

export default function Index() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");

  const generateCaption = async (type: "fast" | "deep") => {
    try {
      setResult("Generating...");
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = type === "fast"
        ? `Create a bold short caption about: ${idea}`
        : `Create a deep caption about: ${idea}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const caption = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated";
      setResult("🔥 Here's your caption:\n\n" + caption);
    } catch (error: any) {
      setResult("Error: " + error.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "100%", maxWidth: "400px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center" }}>SnapCaption</h2>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your idea..."
          style={{ width: "100%", height: "100px", marginBottom: "15px", padding: "10px" }}
        />
        <button onClick={() => generateCaption("fast")} style={{ width: "100%", padding: "10px", marginBottom: "10px", background: "#333", color: "#fff", border: "none" }}>
          Fast Caption
        </button>
        <button onClick={() => generateCaption("deep")} style={{ width: "100%", padding: "10px", marginBottom: "10px", background: "#555", color: "#fff", border: "none" }}>
          Deep Caption
        </button>
        <p style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>{result}</p>
      </div>
    </div>
  );
}
