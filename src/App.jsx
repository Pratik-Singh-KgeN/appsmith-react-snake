import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";
import StartScreen from "./components/StartScreen";
import GameOverScreen from "./components/GameOverScreen";
import ScoreBoard from "./components/ScoreBoard";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Leaderboard from "./components/Leaderboard";

const BOARD_SIZE = 20;
const INITIAL_SPEED = 200; // ms per move
const SPEED_INCREMENT = 20; // speed up per level
const LEVEL_THRESHOLD = 5; // points per level

function getRandomPosition(exclude) {
  const occupied = new Set(exclude.map(p => `${p.x},${p.y}`));
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  } while (occupied.has(`${pos.x},${pos.y}`));
  return pos;
}

export default function App() {
  const [gameState, setGameState] = useState("start"); // start | playing | paused | over
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [topScores, setTopScores] = useState([]);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("topScores");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTopScores(parsed);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  // Update leaderboard when game ends
  useEffect(() => {
    if (gameState === "over") {
      setTopScores(prev => {
        const updated = [...prev, score];
        updated.sort((a, b) => b - a);
        const trimmed = updated.slice(0, 5);
        localStorage.setItem("topScores", JSON.stringify(trimmed));
        return trimmed;
      });
    }
  }, [gameState, score]);

  const startGame = useCallback(() => {
    const initialSnake = [
      { x: Math.floor(BOARD_SIZE / 2) - 1, y: Math.floor(BOARD_SIZE / 2) },
      { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }
    ];
    setSnake(initialSnake);
    setDirection("right");
    setScore(0);
    setLevel(1);
    setSpeed(INITIAL_SPEED);
    setFood(getRandomPosition(initialSnake));
    setGameState("playing");
  }, []);

  const pauseToggle = () => {
    setGameState(prev => (prev === "paused" ? "playing" : "paused"));
  };

  const restartGame = () => {
    startGame();
  };

  const handleKeyDown = useCallback(e => {
    const keyMap = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };
    const newDir = keyMap[e.key];
    if (!newDir) return;

    setDirection(prev => {
      if (
        (prev === "up" && newDir === "down") ||
        (prev === "down" && newDir === "up") ||
        (prev === "left" && newDir === "right") ||
        (prev === "right" && newDir === "left")
      ) {
        return prev;
      }
      return newDir;
    });
  }, []);

  // Keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[prevSnake.length - 1];
        let newHead = { ...head };

        // Move head
        switch (direction) {
          case "up":
            newHead.y -= 1;
            break;
          case "down":
            newHead.y += 1;
            break;
          case "left":
            newHead.x -= 1;
            break;
          case "right":
            newHead.x += 1;
            break;
          default:
            break;
        }

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setGameState("over");
          return prevSnake;
        }

        // Self collision
        const collided = prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y);
        if (collided) {
          setGameState("over");
          return prevSnake;
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y;

        const newSnake = ateFood ? [...prevSnake, newHead] : [...prevSnake.slice(1), newHead];

        if (ateFood) {
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore % LEVEL_THRESHOLD === 0) {
              setLevel(lvl => lvl + 1);
              setSpeed(spd => Math.max(50, spd - SPEED_INCREMENT));
            }
            return newScore;
          });
          setFood(getRandomPosition(newSnake));
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, direction, food, speed]);

  // Reset direction when not playing
  useEffect(() => {
    if (gameState !== "playing") {
      setDirection("right");
    }
  }, [gameState]);

  return (
    <div className="app-container">
      {gameState === "start" && (
        <>
          <StartScreen onStart={startGame} />
          <Leaderboard topScores={topScores} />
        </>
      )}

      {(gameState === "playing" || gameState === "paused") && (
        <>
          <ScoreBoard
            score={score}
            level={level}
            isPaused={gameState === "paused"}
            onTogglePause={pauseToggle}
          />
          <Board boardSize={BOARD_SIZE} snake={snake} food={food} />
          <Controls onDirectionChange={setDirection} />
        </>
      )}

      {gameState === "over" && (
        <GameOverScreen score={score} onRestart={restartGame} />
      )}
    </div>
  );
}
