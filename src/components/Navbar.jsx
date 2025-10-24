import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase.js";

export default function Navbar({ user, userProfile }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  const avatarURL = userProfile?.avatarURL || user?.photoURL || "";
  const nickname = userProfile?.nickname || user?.displayName || "User";

  return (
    <nav className="navbar">
      <div className="logo">Rivalis Hub</div>
      <div className="nav-right">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {avatarURL && (
            <img 
              src={avatarURL} 
              alt={nickname} 
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                background: "#fff",
                border: "2px solid #ff4081"
              }}
            />
          )}
          <span style={{ color: "#fff", fontWeight: "600" }}>{nickname}</span>
        </div>
        <div className="menu">
          <button onClick={() => setOpen(!open)}>Menu</button>
          {open && (
            <div className="dropdown">
              <Link to="/dashboard">Home</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/chat">Chat</Link>
              <Link to="/dm">DM</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <Link to="/achievements">Achievements</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
