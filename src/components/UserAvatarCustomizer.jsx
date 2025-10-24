import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { UserService } from "../services/userService";
import { NicknameService } from "../services/nicknameService";

const avatarStyles = [
  { id: "adventurer", name: "Adventurer", desc: "Illustrated characters" },
  { id: "avataaars", name: "Avataaars", desc: "Cartoon style" },
  { id: "bottts", name: "Robots", desc: "Futuristic bots" },
  { id: "lorelei", name: "Lorelei", desc: "Modern portraits" },
  { id: "micah", name: "Micah", desc: "Geometric style" },
  { id: "miniavs", name: "Miniavs", desc: "Minimal avatars" },
  { id: "notionists", name: "Notionists", desc: "Notion-style" },
  { id: "open-peeps", name: "Open Peeps", desc: "Hand-drawn" },
  { id: "personas", name: "Personas", desc: "Professional" },
  { id: "pixel-art", name: "Pixel Art", desc: "Retro gaming" },
];

const parseDicebearURL = (url) => {
  if (!url || !url.includes('dicebear.com')) {
    return null;
  }
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const seed = urlObj.searchParams.get('seed');
    
    if (!seed) return null;
    
    const versionIndex = pathParts.findIndex(part => part.includes('.x'));
    if (versionIndex === -1) return null;
    
    const style = pathParts[versionIndex + 1];
    
    if (!style) return null;
    
    return { style, seed };
  } catch (e) {
    return null;
  }
};

const UserAvatarCustomizer = ({ user: propUser, isFirstTimeSetup = false, onSetupComplete, userProfile }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || null);
  const [selectedStyle, setSelectedStyle] = useState("adventurer");
  const [seed, setSeed] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDicebearAvatar, setIsDicebearAvatar] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    const currentUser = propUser || auth.currentUser;
    if (!currentUser) return;
    setUser(currentUser);
    
    if (userProfile && userProfile.nickname) {
      setNickname(userProfile.nickname);
    } else if (isFirstTimeSetup) {
      setNickname(NicknameService.generate());
    }
    
    if (currentUser.photoURL) {
      const parsed = parseDicebearURL(currentUser.photoURL);
      
      if (parsed && parsed.style && parsed.seed) {
        setSelectedStyle(parsed.style);
        setSeed(parsed.seed);
        setAvatarURL(currentUser.photoURL);
        setIsDicebearAvatar(true);
      } else {
        setAvatarURL(currentUser.photoURL);
        setIsDicebearAvatar(false);
        const initialSeed = currentUser.email?.split('@')[0] || Math.random().toString(36).substring(7);
        setSeed(initialSeed);
      }
    } else {
      const initialSeed = currentUser.email?.split('@')[0] || Math.random().toString(36).substring(7);
      setSeed(initialSeed);
      setIsDicebearAvatar(true);
      const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${initialSeed}`;
      setAvatarURL(url);
    }
    
    setInitialized(true);
  }, [propUser, userProfile, isFirstTimeSetup]);

  useEffect(() => {
    if (initialized && isDicebearAvatar && seed) {
      const url = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`;
      setAvatarURL(url);
    }
  }, [selectedStyle, seed, initialized, isDicebearAvatar]);

  const handleSaveAvatar = async () => {
    console.log("=== SAVE AVATAR CLICKED ===");
    console.log("User:", user);
    console.log("Nickname:", nickname);
    console.log("Avatar URL:", avatarURL);
    console.log("Is first time setup:", isFirstTimeSetup);
    
    if (!user) {
      console.error("No user found!");
      return;
    }
    
    const validation = NicknameService.validate(nickname);
    console.log("Validation result:", validation);
    if (!validation.valid) {
      setNicknameError(validation.error);
      console.error("Validation failed:", validation.error);
      alert("Invalid nickname: " + validation.error);
      return;
    }
    
    setNicknameError("");
    setSaving(true);
    console.log("Starting save process...");
    
    try {
      console.log("Updating Firebase Auth profile...");
      await updateProfile(user, {
        photoURL: avatarURL,
        displayName: nickname
      });
      console.log("Firebase Auth profile updated successfully");
      
      const parsed = parseDicebearURL(avatarURL);
      if (parsed) {
        setIsDicebearAvatar(true);
      }
      
      if (isFirstTimeSetup) {
        console.log("Completing first-time setup...");
        
        // Create a temporary profile to pass to the callback
        const tempProfile = {
          userId: user.uid,
          nickname: nickname,
          avatarURL: avatarURL,
          hasCompletedSetup: true
        };
        
        if (onSetupComplete) {
          console.log("Calling onSetupComplete callback with temp profile");
          try {
            onSetupComplete(tempProfile);
          } catch (callbackError) {
            console.error("Error in onSetupComplete callback:", callbackError);
          }
        }
        
        // Try to save to Firestore in the background (don't wait for it)
        UserService.completeUserSetup(user.uid, nickname, avatarURL)
          .then(result => {
            console.log("Background save completed:", result.success);
          })
          .catch(err => {
            console.error("Background save failed:", err);
          });
        
        console.log("Navigating to dashboard...");
        alert("Profile created! Welcome to Rivalis Hub!");
        navigate("/dashboard");
      } else {
        console.log("Updating existing profile...");
        try {
          const updateResult = await UserService.updateUserProfile(user.uid, { nickname, avatarURL });
          
          if (updateResult.success) {
            alert("Avatar updated successfully!");
            navigate("/dashboard");
          } else {
            alert("Failed to update avatar: " + (updateResult.error || "Unknown error"));
          }
        } catch (updateError) {
          console.error("Error during update:", updateError);
          alert("Failed to update avatar: " + updateError.message);
        }
      }
    } catch (error) {
      console.error("Error saving avatar:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
      console.log("=== SAVE COMPLETE ===");
    }
  };

  const generateRandomNickname = () => {
    const newNickname = NicknameService.generate();
    setNickname(newNickname);
    setNicknameError("");
  };

  const randomizeSeed = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setSeed(newSeed);
    setIsDicebearAvatar(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.previewSection}>
        <h3 style={styles.heading}>Avatar Preview</h3>
        <div style={styles.avatarWrapper}>
          {avatarURL && (
            <img
              src={avatarURL}
              alt="Avatar Preview"
              style={styles.avatar}
            />
          )}
        </div>
        <button onClick={randomizeSeed} style={styles.randomButton}>
          🎲 Randomize
        </button>
      </div>

      <div style={styles.customizeSection}>
        <div style={styles.nicknameSection}>
          <label style={styles.label}>Nickname</label>
          <div style={styles.hint}>Only letters, numbers, and underscores (no spaces). 3-20 characters.</div>
          <div style={styles.nicknameInputGroup}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameError("");
              }}
              placeholder="Enter your nickname"
              style={{...styles.input, marginBottom: 0, borderColor: nicknameError ? '#ff4081' : 'rgba(255, 255, 255, 0.1)'}}
            />
            <button onClick={generateRandomNickname} style={styles.generateButton}>
              🎲 Generate
            </button>
          </div>
          {nicknameError && <div style={styles.error}>❌ {nicknameError}</div>}
        </div>

        <h3 style={styles.heading}>Choose Style</h3>
        <div style={styles.stylesGrid}>
          {avatarStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              style={{
                ...styles.styleCard,
                ...(selectedStyle === style.id ? styles.styleCardActive : {})
              }}
            >
              <img
                src={`https://api.dicebear.com/7.x/${style.id}/svg?seed=${seed}`}
                alt={style.name}
                style={styles.stylePreview}
              />
              <div style={styles.styleInfo}>
                <div style={styles.styleName}>{style.name}</div>
                <div style={styles.styleDesc}>{style.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.seedSection}>
          <label style={styles.label}>Custom Seed (name or phrase)</label>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter text to generate unique avatar"
            style={styles.input}
          />
        </div>

        <button
          onClick={handleSaveAvatar}
          disabled={saving}
          style={{
            ...styles.saveButton,
            ...(saving ? styles.saveButtonDisabled : {})
          }}
        >
          {saving ? "Saving..." : "💾 Save Avatar"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "15px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  previewSection: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxSizing: "border-box",
  },
  customizeSection: {
    width: "100%",
    boxSizing: "border-box",
  },
  nicknameSection: {
    marginBottom: "20px",
    width: "100%",
  },
  nicknameInputGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  generateButton: {
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  hint: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "11px",
    marginBottom: "8px",
    fontStyle: "italic",
  },
  error: {
    color: "#ff4081",
    fontSize: "14px",
    marginTop: "8px",
    fontWeight: "600",
    padding: "8px",
    background: "rgba(255, 64, 129, 0.1)",
    borderRadius: "6px",
    border: "1px solid #ff4081",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff",
    textAlign: "center",
  },
  avatarWrapper: {
    width: "150px",
    height: "150px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    overflow: "hidden",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "5px",
    boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#fff",
  },
  randomButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
  stylesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
    width: "100%",
  },
  styleCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    backdropFilter: "blur(10px)",
  },
  styleCardActive: {
    border: "2px solid #ff4081",
    background: "rgba(255, 64, 129, 0.1)",
    transform: "scale(1.05)",
    boxShadow: "0 8px 25px rgba(255, 64, 129, 0.3)",
  },
  stylePreview: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff",
    margin: "0 auto 8px",
    display: "block",
  },
  styleInfo: {
    textAlign: "center",
  },
  styleName: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "2px",
  },
  styleDesc: {
    fontSize: "10px",
    color: "rgba(255, 255, 255, 0.6)",
  },
  seedSection: {
    marginBottom: "15px",
    width: "100%",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    boxSizing: "border-box",
  },
  saveButton: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ff4081 0%, #ff6e40 100%)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(255, 64, 129, 0.4)",
  },
  saveButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default UserAvatarCustomizer;
