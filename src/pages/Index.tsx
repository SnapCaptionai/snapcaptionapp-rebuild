import { useState } from "react";

export default function Index() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");

  const generateCaption = async (type: "fast" | "deep") => {
    try {
      setResult("Generating...");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          type,
        }),
      });

      const data = await res.json();

      // 🔥 show real backend errors
      if (!res.ok) {
        setResult("Error: " + data.error + " " + (data.details || ""));
        return;
      }

      setResult(`🔥 Here's your caption:\n\n${data.caption}`);
    } catch (error: any) {
      console.log(error);
      setResult("Error: " + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          SnapCaption
        </h1>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your idea..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            minHeight: "80px",
          }}
        />

        <button
          onClick={() => generateCaption("fast")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Fast Caption
        </button>

        <button
          onClick={() => generateCaption("deep")}
          style={{
            width: "100%",
            padding: "10px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Deep Caption
        </button>

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}