import { useState } from "react";

export default function Index() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");

  const generateCaption = () => {
    setResult(`🔥 Here's your caption:

"${idea} — This is your moment. Stop waiting and start building."`);
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
          placeholder="Enter your idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={generateCaption}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            background: "black",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Fast Caption (Gemini)
        </button>

        <button
          onClick={generateCaption}
          style={{
            width: "100%",
            padding: "12px",
            background: "#444",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Deep Caption (OpenAI)
        </button>

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}