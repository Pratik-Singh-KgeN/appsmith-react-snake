import React from "react";

export default function Controls({ onDirectionChange }) {
  const handleClick = dir => () => onDirectionChange(dir);

  return (
    <div className="controls">
      <button className="btn-primary control-btn" onClick={handleClick("up")}>↑</button>
      <button className="btn-primary control-btn" onClick={handleClick("left")}>←</button>
      <button className="btn-primary control-btn" onClick={handleClick("right")}>→</button>
      <button className="btn-primary control-btn" onClick={handleClick("down")}>↓</button>
    </div>
  );
}
