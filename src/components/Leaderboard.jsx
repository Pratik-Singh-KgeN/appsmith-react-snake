import React from "react";

export default function Leaderboard({ topScores }) {
  return (
    <div className="card">
      <h3 className="gradient-header">Top Scores</h3>
      {topScores.length === 0 ? (
        <p>No scores yet. Play to set a record!</p>
      ) : (
        <ol className="leaderboard-list">
          {topScores.map((s, i) => (
            <li key={i}>
              <span className="leaderboard-rank">{i + 1}.</span>
              <span className="leaderboard-score">{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
