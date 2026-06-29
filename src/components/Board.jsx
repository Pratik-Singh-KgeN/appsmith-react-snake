import React from "react";

export default function Board({ boardSize, snake, food }) {
  const cells = [];

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const isSnake = snake.some(seg => seg.x === x && seg.y === y);
      const isFood = food.x === x && food.y === y;
      const className = `cell${isSnake ? " snake" : ""}${isFood ? " food" : ""}`;
      cells.push(
        <div key={`${x},${y}`} className={className} />
      );
    }
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${boardSize}, 1fr)`
  };

  return (
    <div className="card">
      <div className="grid-board" style={gridStyle}>
        {cells}
      </div>
    </div>
  );
}
