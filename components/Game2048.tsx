"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { initializeGame, moveTiles, addRandomTile, isGameOver, Direction, Tile as TileType } from "../utils/gameLogic";
import Endresult from "./EndResult";

import { gameConfig } from "@/app/constant";

interface Game2048Props {
  PlayerName: string;
  gridSize?: number; 
}

const Game2048: React.FC<Game2048Props> = ({ PlayerName, gridSize = gameConfig.defaultGridSize }) => {
  const [tiles, setTiles] = useState<TileType[]>(initializeGame(gridSize,gameConfig.newtile));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const getColorClass = () => {
    
    if (score === 0) return "text-gray-500"; 


    const index = Math.min(Math.floor(score / 250), gameConfig.colors.length - 1);
    return gameConfig.colors[index];
  };
  const handleMove = useCallback((direction: Direction) => {
    if (gameOver) return;

    const { newTiles, score: newScore, hasWon } = moveTiles(tiles, direction);
    if (JSON.stringify(newTiles) !== JSON.stringify(tiles)) {
      addRandomTile(newTiles,gameConfig.newtile);
      setIsWon(hasWon);
      setTiles(newTiles);
      setScore((prevScore) => prevScore + newScore);

      if (isGameOver(newTiles)) {
        setGameOver(true);
      }
    }
  },[tiles, gameOver]);

  useEffect(() => {
    if (tiles.some((tile) => tile.value === 2048)) {
      setIsWon(true);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }
      if (direction) {
        handleMove(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tiles, gameOver,handleMove]);

  const handlers = useSwipeable({
    onSwipedUp: () => handleMove("up"),
    onSwipedDown: () => handleMove("down"),
    onSwipedLeft: () => handleMove("left"),
    onSwipedRight: () => handleMove("right"),
    trackMouse: true,
  });

  const resetGame = () => {
    setTiles(initializeGame(gridSize,gameConfig.newtile));
    setScore(0);
    setGameOver(false);
    setIsWon(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      {gameOver ? (
        <Endresult
          buttontext="Try Again"
          emoji="😢"
          onrestart={resetGame}
          quote="Don't give up! You can always try again."
          result={`Oops ${PlayerName} Lost`}
        />
      ) : isWon ? (
        <Endresult
          buttontext="Play Again"
          emoji="😉"
          onrestart={resetGame}
          quote="Keep going, achieve more, win again—play on!"
          result={`Hooray ${PlayerName} Won`}
        />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome {PlayerName}</h1>
          <h1 className="text-4xl font-bold mb-4 text-blue-800">2048</h1>
          <div className="mb-4 text-xl font-semibold text-blue-500">
      Score: <span className={`text-xl font-bold transition-colors duration-300 ${getColorClass()}`}>{score}</span>
    </div>
          <div
  {...handlers}
  className="relative w-[320px] h-[320px] bg-blue-200 rounded-lg overflow-hidden touch-none shadow-lg"
>
 
  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-2">
    {Array.from({ length: 16 }).map((_, index) => (
      <div
        key={index}
        className="w-full h-full bg-blue-300 border border-blue-400 rounded-md"
      ></div>
    ))}
  </div>

 
  {tiles.map(tile => (
    <Tile key={tile.id} {...tile} />
  ))}
</div>

          <div className="mt-4 text-sm text-blue-600">Use arrow keys or swipe to play</div>
        </div>
      )}
    </div>
  );
};

const Tile: React.FC<TileType> = ({ value, position }) => {
  const [row, col] = position;
  const backgroundColor =
  gameConfig.tileColors[String(value) as keyof typeof gameConfig.tileColors] ||
  gameConfig.tileColors.default;

  const textColor = value <= 4 ? gameConfig.textColors.default : gameConfig.textColors.highlight;
  const fontSize = value < 100 ? "text-4xl" : value < 1000 ? "text-3xl" : "text-2xl";

  return (
    <motion.div
      className={`absolute w-[70px] h-[70px] flex items-center justify-center ${fontSize} font-bold ${textColor} rounded-md shadow-md ${backgroundColor}`}
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        x: col * 78 + 10,
        y: row * 78 + 10,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {value}
    </motion.div>
  );
};

export default Game2048;
