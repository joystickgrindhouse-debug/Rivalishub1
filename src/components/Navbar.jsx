import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase.js";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="logo">Rivalis Hub</div>
      <div className="menu">
        <button onClick={() => setOpen(!open)}>Menu</button>
        {open && (
          <div className="dropdown">
            <Link to="/chat">Chat</Link>
            <Link to="/dm">DM</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/dashboard">Avatar</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
