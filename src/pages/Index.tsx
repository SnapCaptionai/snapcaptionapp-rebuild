<<<<<<< HEAD
import React, { useEffect, useState } from "react";

const Index = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);
=======
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
>>>>>>> d39ee8bb6ceea7edab19179109fa96784303e567

  return (
    <div style={{ padding: 20 }}>
      <h1>SnapCaption</h1>
<<<<<<< HEAD
      <pre>{JSON.stringify(data, null, 2)}</pre>
=======

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
>>>>>>> d39ee8bb6ceea7edab19179109fa96784303e567
    </div>
  );
};

<<<<<<< HEAD
export default Index;
=======
export default Index;
>>>>>>> d39ee8bb6ceea7edab19179109fa96784303e567
