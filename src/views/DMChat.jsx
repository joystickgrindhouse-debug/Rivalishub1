import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "../services/chatService.js";
import { UserService } from "../services/userService.js";
import CustomEmojiPicker from "../components/CustomEmojiPicker.jsx";

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
    setInput(input + emoji);
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
      <div style={{ 
        width: "95%", 
        maxWidth: "800px",
        height: "80vh", 
        display: "flex", 
        flexDirection: "column",
        background: "#000000",
        border: "2px solid #ff3050",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 0 30px rgba(255, 48, 80, 0.5), inset 0 0 20px rgba(255, 48, 80, 0.05)"
      }}>
        <h2 style={{ 
          color: "#ff3050",
          textShadow: "0 0 15px rgba(255, 48, 80, 0.8)",
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          💬 Direct Messages
        </h2>
        <div style={{ marginBottom: "0.5rem", position: "relative" }}>
          {recipientProfile ? (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              padding: "0.75rem", 
              background: "rgba(255, 48, 80, 0.1)", 
              borderRadius: "8px",
              border: "1px solid rgba(255, 48, 80, 0.3)"
            }}>
              {recipientProfile.avatarURL && (
                <img 
                  src={recipientProfile.avatarURL} 
                  alt={recipientProfile.nickname} 
                  style={{ 
                    width: "32px", 
                    height: "32px", 
                    borderRadius: "50%", 
                    background: "#fff",
                    border: "2px solid #ff3050"
                  }}
                />
              )}
              <span style={{ color: "#fff" }}>Chatting with: <strong style={{ color: "#ff3050" }}>{recipientProfile.nickname}</strong></span>
              <button 
                onClick={() => {
                  setRecipientProfile(null);
                  setMessages([]);
                }}
                style={{ 
                  marginLeft: "auto", 
                  padding: "0.4rem 0.8rem",
                  background: "#000000",
                  border: "1px solid #ff3050",
                  borderRadius: "6px",
                  color: "#ff3050",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
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
                style={{ 
                  width: "100%", 
                  padding: "0.75rem",
                  background: "#000000",
                  border: "2px solid #ff3050",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  boxShadow: "0 0 15px rgba(255, 48, 80, 0.3), inset 0 0 10px rgba(255, 48, 80, 0.05)"
                }}
              />
              {showDropdown && (searchResults.length > 0 || (searchTerm.length === 0 && allUsers.length > 0)) && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#000000",
                  border: "2px solid #ff3050",
                  borderRadius: "8px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1000,
                  marginTop: "0.25rem",
                  boxShadow: "0 0 20px rgba(255, 48, 80, 0.6)"
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
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 48, 80, 0.2)"}
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
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          marginBottom: "1rem", 
          border: "1px solid rgba(255, 48, 80, 0.3)", 
          padding: "0.5rem", 
          display: "flex", 
          flexDirection: "column", 
          gap: "0.5rem", 
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "8px",
          boxShadow: "inset 0 0 15px rgba(255, 48, 80, 0.1)"
        }}>
          {!recipientProfile && (
            <div style={{ textAlign: "center", color: "rgba(255, 48, 80, 0.5)", padding: "2rem" }}>
              Select a user above to start chatting
            </div>
          )}
          {messages.length === 0 && recipientProfile && (
            <div style={{ textAlign: "center", color: "rgba(255, 48, 80, 0.5)", padding: "2rem" }}>
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
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: "#fff",
                      border: "2px solid #ff3050"
                    }}
                  />
                )}
                <div style={{ 
                  maxWidth: "70%", 
                  background: isFromMe ? "rgba(255, 48, 80, 0.2)" : "rgba(255, 48, 80, 0.1)", 
                  padding: "0.75rem", 
                  borderRadius: "8px", 
                  border: `2px solid ${isFromMe ? "rgba(255, 48, 80, 0.5)" : "rgba(255, 48, 80, 0.3)"}`,
                  boxShadow: "0 0 10px rgba(255, 48, 80, 0.2)"
                }}>
                  <div>
                    <strong style={{ color: "#ff3050", textShadow: "0 0 8px rgba(255, 48, 80, 0.6)" }}>{m.fromNickname}:</strong>{" "}
                    <span style={{ color: "#fff" }}>{m.text}</span>
                  </div>
                </div>
                {isFromMe && m.fromAvatarURL && (
                  <img 
                    src={m.fromAvatarURL} 
                    alt={m.fromNickname} 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: "#fff",
                      border: "2px solid #ff3050"
                    }}
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
              border: "2px solid #ff3050",
              boxSizing: "border-box",
              background: "#000000",
              color: "#fff",
              boxShadow: "0 0 15px rgba(255, 48, 80, 0.3), inset 0 0 10px rgba(255, 48, 80, 0.05)",
              opacity: recipientProfile ? 1 : 0.5
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
                padding: "0.75rem 1rem",
                fontSize: "18px",
                background: "#000000",
                border: "2px solid #ff3050",
                borderRadius: "8px",
                cursor: recipientProfile ? "pointer" : "not-allowed",
                color: "#ff3050",
                fontWeight: "bold",
                boxShadow: recipientProfile ? "0 0 15px rgba(255, 48, 80, 0.5)" : "none",
                opacity: recipientProfile ? 1 : 0.3,
                transition: "all 0.2s"
              }}
            >
              🎮
            </button>
            <button 
              onClick={sendDM} 
              disabled={!recipientProfile}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontSize: "16px",
                background: recipientProfile ? "#ff3050" : "#000000",
                border: "2px solid #ff3050",
                borderRadius: "8px",
                cursor: recipientProfile ? "pointer" : "not-allowed",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: recipientProfile ? "0 0 20px rgba(255, 48, 80, 0.6)" : "none",
                opacity: recipientProfile ? 1 : 0.3,
                transition: "all 0.2s"
              }}
            >
              Send 💥
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
              <CustomEmojiPicker 
                onEmojiSelect={onEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
