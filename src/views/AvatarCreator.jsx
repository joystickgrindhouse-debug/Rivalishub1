import React, { useState } from "react";

export default function AvatarCreator({ user }) {
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleAvatarChange = (e) => {
    setAvatarUrl(e.target.value);
  };

  const handleSave = () => {
    alert("Avatar saved!");
  };

  return (
    <div className="hero-background">
      <div className="overlay-card">
        <h2>{user.email}'s Avatar</h2>
        <img 
          src={avatarUrl || "/assets/images/background.png"} 
          alt="avatar" 
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <input 
          type="text" 
          placeholder="Enter avatar URL" 
          value={avatarUrl} 
          onChange={handleAvatarChange} 
        />
        <button onClick={handleSave}>Save Avatar</button>
      </div>
    </div>
  );
}
