import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div className="card start-screen">
      <h1 className="gradient-header">🐍 Snake Game</h1>
      <p>Use arrow keys or the on‑screen controls to guide the snake.</p>
      <button className="btn-primary" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}
