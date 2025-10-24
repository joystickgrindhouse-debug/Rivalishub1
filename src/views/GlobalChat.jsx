import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "../services/chatService.js";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function GlobalChat({ user, userProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

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

  const onEmojiSelect = (emoji) => {
    setInput(input + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea 
            style={{ 
              width: "100%",
              padding: "0.75rem", 
              minHeight: "80px",
              maxHeight: "120px",
              resize: "vertical",
              fontSize: "16px",
              borderRadius: "8px",
              border: "2px solid #ff4081",
              boxSizing: "border-box"
            }} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                padding: "0.75rem",
                fontSize: "24px",
                background: "#667eea",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              😊
            </button>
            <button 
              onClick={sendMessage}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontSize: "14px",
                background: "#ff4081",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              Send
            </button>
          </div>
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              style={{
                position: "absolute",
                bottom: "100%",
                left: "0",
                marginBottom: "10px",
                zIndex: 1000
              }}
            >
              <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
