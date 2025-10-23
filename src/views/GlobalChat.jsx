import React, { useState, useEffect } from "react";

export default function GlobalChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    const newMessage = { user: user.email, text: input };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="hero-background">
      <div className="overlay-card" style={{ width: "95%", height: "80vh", display: "flex", flexDirection: "column" }}>
        <h2>Global Chat</h2>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #fff", padding: "0.5rem" }}>
          {messages.map((m, idx) => (
            <div key={idx}><strong>{m.user}:</strong> {m.text}</div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <input 
            style={{ flex: 1, padding: "0.5rem" }} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
