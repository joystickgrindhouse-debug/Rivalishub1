import React, { useState, useEffect } from "react";
import { ChatService } from "../services/chatService.js";

export default function GlobalChat({ user, userProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user) return;

    const unsubscribe = ChatService.subscribeToGlobalMessages((fetchedMessages) => {
      setMessages(fetchedMessages);
    }, 50);

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await ChatService.sendGlobalMessage({
      userId: user.uid,
      nickname: userProfile?.nickname || user.displayName || user.email,
      avatarURL: userProfile?.avatarURL || user.photoURL || "",
      text: input.trim()
    });

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="hero-background">
      <div className="overlay-card" style={{ width: "95%", height: "80vh", display: "flex", flexDirection: "column" }}>
        <h2>Global Chat</h2>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #fff", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              {m.avatarURL && (
                <img 
                  src={m.avatarURL} 
                  alt={m.nickname} 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div>
                  <strong style={{ color: "#ff4081" }}>{m.nickname}:</strong>{" "}
                  <span>{m.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <input 
            style={{ flex: 1, padding: "0.5rem" }} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
