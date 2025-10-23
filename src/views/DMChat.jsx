import React, { useState } from "react";

export default function DMChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState("");

  const sendDM = () => {
    if (!input || !recipient) return;
    const newMessage = { from: user.email, to: recipient, text: input };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="hero-background">
      <div className="overlay-card" style={{ width: "95%", height: "80vh", display: "flex", flexDirection: "column" }}>
        <h2>Direct Messages</h2>
        <input 
          type="text" 
          placeholder="Recipient email" 
          value={recipient} 
          onChange={e => setRecipient(e.target.value)}
          style={{ marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #fff", padding: "0.5rem" }}>
          {messages.map((m, idx) => (
            <div key={idx}><strong>{m.from} → {m.to}:</strong> {m.text}</div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <input 
            style={{ flex: 1, padding: "0.5rem" }} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Type a message..."
          />
          <button onClick={sendDM}>Send</button>
        </div>
      </div>
    </div>
  );
}
