import React from "react";

export default function GameOverScreen({ score, onRestart }) {
  return (
    <div className="overlay">
      <div className="card game-over-screen">
        <h2 className="gradient-header">Game Over</h2>
        <p>Your final score: <strong>{score}</strong></p>
        <button className="btn-primary" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
