export default function Index() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          SnapCaption
        </h1>

        <textarea
          placeholder="Enter your idea..."
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px"
          }}
        />

        <button style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          border: "none"
        }}>
          Fast Caption (Gemini)
        </button>

        <button style={{
          width: "100%",
          padding: "12px",
          background: "#444",
          color: "white",
          borderRadius: "8px",
          border: "none"
        }}>
          Deep Caption (OpenAI)
        </button>

      </div>
    </div>
  );
}