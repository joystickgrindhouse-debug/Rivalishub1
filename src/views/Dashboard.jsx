import React from "react";
import { useNavigate } from "react-router-dom";
import soloImage from "/assets/images/solo.png";
import burnoutsImage from "/assets/images/burnouts.png";
import liveImage from "/assets/images/live.png";
import runImage from "/assets/images/run.png";
import gameboardImage from "/assets/images/gameboard.jpeg";

const gameModes = [
  {
    id: "solo",
    name: "Solo",
    image: soloImage,
    link: "/solo",
    external: false,
  },
  {
    id: "burnouts",
    name: "Burnouts",
    image: burnoutsImage,
    link: "https://burnouts.netlify.app",
    external: true,
  },
  {
    id: "live",
    name: "Live",
    image: liveImage,
    link: "https://live.rivalis.netlify.app",
    external: true,
  },
  {
    id: "run",
    name: "Run",
    image: runImage,
    link: "https://run.rivalis.netlify.app",
    external: true,
  },
  {
    id: "gameboard",
    name: "Gameboard",
    image: gameboardImage,
    link: "https://gameboard.rivalis.netlify.app",
    external: true,
  },
];

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleTileClick = async (mode) => {
    if (mode.external) {
      // For external apps like Solo mode, pass authentication data
      try {
        const token = await user.getIdToken();
        const authData = {
          token: token,
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || user.email
        };
        
        // Encode auth data as URL parameters
        const params = new URLSearchParams(authData);
        const urlWithAuth = `${mode.link}?${params.toString()}`;
        
        window.open(urlWithAuth, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Error getting auth token:", error);
        // Fallback: open without auth data
        window.open(mode.link, "_blank", "noopener,noreferrer");
      }
    } else {
      navigate(mode.link);
    }
  };

  console.log("Dashboard rendering with", gameModes.length, "game modes:", gameModes.map(m => m.name));

  return (
    <div className="dashboard-background">
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 className="rivalis-text" style={styles.rivalisTitle}>
            RIVALIS
          </h1>
          <h1 className="fitness-reimagined-breathing" style={styles.mainTitle}>
            FITNESS REIMAGINED
          </h1>
        </div>
        <div style={styles.tilesGrid}>
          {gameModes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => handleTileClick(mode)}
              style={styles.tile}
            >
              <img src={mode.image} alt={mode.name} style={styles.tileImage} />
              <div style={styles.tileOverlay}>
                <h2 style={styles.tileName}>{mode.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes breathing {
          0%, 100% { 
            transform: scale(1); 
            text-shadow: 0 0 20px #ff4081, 0 0 40px #ff4081, 0 0 60px #ff4081; 
          }
          50% { 
            transform: scale(1.05); 
            text-shadow: 0 0 30px #ff4081, 0 0 60px #ff4081, 0 0 90px #ff4081; 
          }
        }
        
        .fitness-reimagined-breathing {
          animation: breathing 3s ease-in-out infinite;
        }

        .rivalis-text {
          text-shadow: 0 0 15px #667eea, 0 0 30px #667eea, 0 0 45px #667eea;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "20px 10px",
    width: "100%",
    overflow: "hidden",
  },
  rivalisTitle: {
    fontSize: "clamp(28px, 7vw, 48px)",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "clamp(2px, 1.5vw, 10px)",
    margin: "0 0 10px 0",
    fontFamily: "'Arial Black', 'Arial Bold', sans-serif",
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mainTitle: {
    fontSize: "clamp(28px, 8vw, 72px)",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "clamp(2px, 1vw, 8px)",
    margin: "0 0 20px 0",
    fontFamily: "'Arial Black', 'Arial Bold', sans-serif",
    wordWrap: "break-word",
    maxWidth: "100%",
    lineHeight: "1.2",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #ff4081 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
  },
  tilesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "24px",
    width: "100%",
    padding: "0 10px 40px 10px",
  },
  tile: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    height: "200px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
  },
  tileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  tileOverlay: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    background: "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tileName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    margin: "0",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  },
  externalIcon: {
    fontSize: "20px",
    opacity: "0.8",
  },
};
