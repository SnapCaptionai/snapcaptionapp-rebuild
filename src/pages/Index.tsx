import React, { useState } from "react";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const generateCaption = async (modelType) => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      model: modelType,
    }),
  });

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || // gemini
    data?.choices?.[0]?.message?.content || // openai
    JSON.stringify(data);

  setResult(text);
};

  return (
    <div style={{ padding: 20 }}>
      <h1>SnapCaption</h1>

      <textarea
        placeholder="Enter your idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={() => generateCaption("gemini")}>
  Fast Caption (Gemini)
</button>

<br /><br />

<button onClick={() => generateCaption("openai")}>
  Deep Caption (OpenAI)
</button>

      <pre style={{ marginTop: 20 }}>
        {result}
      </pre>
    </div>
  );
};

export default Index;
