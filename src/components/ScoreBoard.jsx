import React from "react";

export default function ScoreBoard({ score, level, isPaused, onTogglePause }) {
  return (
    <div className="card">
      <div className="gradient-header">
        <span>Score: {score}</span>
        <span>Level: {level}</span>
        <button className="btn-primary" onClick={onTogglePause}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
