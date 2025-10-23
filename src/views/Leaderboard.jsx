import React from "react";

export default function Leaderboard() {
  const leaderboard = [
    { name: "Alice", points: 150 },
    { name: "Bob", points: 120 },
    { name: "Charlie", points: 90 },
    { name: "You", points: 80 }
  ];

  return (
    <div className="hero-background">
      <div className="overlay-card">
        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map((p, idx) => (
            <li key={idx}>{p.name} - {p.points} pts</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
