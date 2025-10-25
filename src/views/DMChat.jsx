import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "../services/chatService.js";
import { UserService } from "../services/userService.js";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function DMChat({ user, userProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipientProfile, setRecipientProfile] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    loadAllUsers();
  }, []);

  useEffect(() => {
    if (!user || !recipientProfile) return;

    const unsubscribe = ChatService.subscribeToConversation(
      user.uid,
      recipientProfile.userId,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
      },
      50
    );

    return () => unsubscribe();
  }, [user, recipientProfile]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      searchUsers(searchTerm);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const loadAllUsers = async () => {
    const result = await UserService.getAllUsers(50);
    if (result.success) {
      setAllUsers(result.users.filter(u => u.userId !== user.uid));
    }
  };

  const searchUsers = async (term) => {
    const result = await UserService.searchUsersByNickname(term);
    if (result.success) {
      const filteredUsers = result.users.filter(u => u.userId !== user.uid);
      setSearchResults(filteredUsers);
      setShowDropdown(filteredUsers.length > 0);
    }
  };

  const sendDM = async () => {
    if (!input.trim() || !recipientProfile) return;

    await ChatService.sendDirectMessage({
      fromUserId: user.uid,
      fromNickname: userProfile?.nickname || user.displayName || user.email,
      fromAvatarURL: userProfile?.avatarURL || user.photoURL || "",
      toUserId: recipientProfile.userId,
      toNickname: recipientProfile.nickname,
      text: input.trim()
    });

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendDM();
    }
  };

  const selectRecipient = (profile) => {
    setRecipientProfile(profile);
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
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
        <h2>Direct Messages</h2>
        <div style={{ marginBottom: "0.5rem", position: "relative" }}>
          {recipientProfile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
              {recipientProfile.avatarURL && (
                <img 
                  src={recipientProfile.avatarURL} 
                  alt={recipientProfile.nickname} 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
                />
              )}
              <span>Chatting with: <strong>{recipientProfile.nickname}</strong></span>
              <button 
                onClick={() => {
                  setRecipientProfile(null);
                  setMessages([]);
                }}
                style={{ marginLeft: "auto", padding: "0.25rem 0.5rem" }}
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Search for a user by nickname..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length === 0 && setShowDropdown(true)}
                style={{ width: "100%", padding: "0.5rem" }}
              />
              {showDropdown && (searchResults.length > 0 || (searchTerm.length === 0 && allUsers.length > 0)) && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "rgba(30, 30, 46, 0.98)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: "0.25rem"
                }}>
                  {(searchTerm.length > 0 ? searchResults : allUsers).map((u) => (
                    <div
                      key={u.userId}
                      onClick={() => selectRecipient(u)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {u.avatarURL && (
                        <img 
                          src={u.avatarURL} 
                          alt={u.nickname} 
                          style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
                        />
                      )}
                      <span>{u.nickname}</span>
                    </div>
                  ))}
                  {searchTerm.length > 0 && searchResults.length === 0 && (
                    <div style={{ padding: "1rem", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>
                      No users found
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #fff", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(0, 0, 0, 0.3)" }}>
          {!recipientProfile && (
            <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", padding: "2rem" }}>
              Select a user above to start chatting
            </div>
          )}
          {messages.length === 0 && recipientProfile && (
            <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", padding: "2rem" }}>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((m) => {
            const isFromMe = m.fromUserId === user.uid;
            return (
              <div key={m.id} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", justifyContent: isFromMe ? "flex-end" : "flex-start" }}>
                {!isFromMe && m.fromAvatarURL && (
                  <img 
                    src={m.fromAvatarURL} 
                    alt={m.fromNickname} 
                    style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
                  />
                )}
                <div style={{ maxWidth: "70%", background: isFromMe ? "rgba(255, 64, 129, 0.3)" : "rgba(102, 126, 234, 0.3)", padding: "0.75rem", borderRadius: "8px", border: `1px solid ${isFromMe ? "rgba(255, 64, 129, 0.5)" : "rgba(102, 126, 234, 0.5)"}` }}>
                  <div>
                    <strong style={{ color: isFromMe ? "#ff4081" : "#667eea" }}>{m.fromNickname}:</strong>{" "}
                    <span style={{ color: "#fff" }}>{m.text}</span>
                  </div>
                </div>
                {isFromMe && m.fromAvatarURL && (
                  <img 
                    src={m.fromAvatarURL} 
                    alt={m.fromNickname} 
                    style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff" }}
                  />
                )}
              </div>
            );
          })}
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
            placeholder={recipientProfile ? "Type a message..." : "Select a recipient first..."}
            disabled={!recipientProfile}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={!recipientProfile}
              style={{
                padding: "0.75rem",
                fontSize: "24px",
                background: "#667eea",
                border: "none",
                borderRadius: "8px",
                cursor: recipientProfile ? "pointer" : "not-allowed",
                opacity: recipientProfile ? 1 : 0.5
              }}
            >
              😊
            </button>
            <button 
              onClick={sendDM} 
              disabled={!recipientProfile}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontSize: "14px",
                background: "#ff4081",
                border: "none",
                borderRadius: "8px",
                cursor: recipientProfile ? "pointer" : "not-allowed",
                color: "#fff",
                fontWeight: "bold",
                opacity: recipientProfile ? 1 : 0.5
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
