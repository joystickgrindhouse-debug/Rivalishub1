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
    link: "https://solorivalis.netlify.app",
    external: true,
  },
  {
    id: "burnouts",
    name: "Burnouts",
    image: burnoutsImage,
    link: "/burnouts",
    external: false,
  },
  {
    id: "live",
    name: "Live",
    image: liveImage,
    link: "/live",
    external: false,
  },
  {
    id: "run",
    name: "Run",
    image: runImage,
    link: "/run",
    external: false,
  },
  {
    id: "gameboard",
    name: "Gameboard",
    image: gameboardImage,
    link: "/gameboard",
    external: false,
  },
];

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleTileClick = (mode) => {
    if (mode.external) {
      window.open(mode.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(mode.link);
    }
  };

  return (
    <div className="hero-background">
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Game Mode</h1>
        <p style={styles.subtitle}>
          Select a challenge and out-train your rivals
        </p>
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
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "20px 10px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 10px",
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
