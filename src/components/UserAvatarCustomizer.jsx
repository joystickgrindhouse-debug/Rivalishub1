import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { generateAvatarForUser } from "../avatarService";

const hairColors = ["auburn", "black", "blonde", "brown", "red", "gray"];
const eyeStyles = ["happy", "wink", "surprised", "squint", "hearts", "side"];
const clothesColors = ["black", "blue", "red", "gray", "green"];

const UserAvatarCustomizer = () => {
  const [user, setUser] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [hair, setHair] = useState(hairColors[0]);
  const [eyes, setEyes] = useState(eyeStyles[0]);
  const [clothes, setClothes] = useState(clothesColors[0]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setUser(currentUser);

    if (currentUser.photoURL) {
      setAvatarURL(currentUser.photoURL);
    } else {
      generateAvatarForUser(currentUser).then(setAvatarURL);
    }
  }, []);

  const handleUpdateAvatar = () => {
    if (!user) return;
    generateAvatarForUser(user, { hair, eyes, clothes })
      .then((url) => setAvatarURL(url))
      .catch(console.error);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Customize Your Avatar</h3>
      {avatarURL && (
        <img
          src={avatarURL}
          alt="User Avatar"
          width={100}
          height={100}
          style={{ borderRadius: "50%", marginBottom: "10px" }}
        />
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>Hair: </label>
        {hairColors.map((c) => (
          <button
            key={c}
            style={{
              backgroundColor: c,
              width: "30px",
              height: "30px",
              margin: "3px",
              border: hair === c ? "2px solid black" : "1px solid gray",
              borderRadius: "50%",
            }}
            onClick={() => setHair(c)}
          />
        ))}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Eyes: </label>
        {eyeStyles.map((style) => (
          <button
            key={style}
            style={{
              padding: "5px 8px",
              margin: "3px",
              border: eyes === style ? "2px solid #ff4081" : "1px solid gray",
              borderRadius: "5px",
              backgroundColor: eyes === style ? "#ff4081" : "white",
              color: eyes === style ? "white" : "black",
              fontSize: "11px",
              cursor: "pointer",
            }}
            onClick={() => setEyes(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Clothes: </label>
        {clothesColors.map((c) => (
          <button
            key={c}
            style={{
              backgroundColor: c,
              width: "30px",
              height: "30px",
              margin: "3px",
              border: clothes === c ? "2px solid black" : "1px solid gray",
              borderRadius: "50%",
            }}
            onClick={() => setClothes(c)}
          />
        ))}
      </div>

      <button
        onClick={handleUpdateAvatar}
        style={{
          padding: "5px 10px",
          marginTop: "10px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Update Avatar
      </button>
    </div>
  );
};

export default UserAvatarCustomizer;
