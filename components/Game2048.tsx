"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { initializeGame, moveTiles, addRandomTile, isGameOver, Direction, Tile as TileType } from '../utils/gameLogic';
// import LoseTryAgain from './ui/Lose';
// import Won from './ui/Won';
import Endresult from './ui/EndResult';

interface playername {
  PlayerName: string;
}

const Game2048 = ({ PlayerName }: playername) => {
  const [tiles, setTiles] = useState<TileType[]>(initializeGame());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [iswon, setiswon] = useState(false);
  const getColorClass = () => {
    
    if (score === 0) return "text-gray-500"; // Zero

    const colors = [

     
      "text-purple-300",
      "text-purple-400",
      "text-purple-500",
      "text-purple-600",
      "text-indigo-700",
      "text-indigo-800",
      "text-blue-800",
     
    ];

    const index = Math.min(Math.floor(score / 250), colors.length - 1);
    return colors[index];
  };
  const handleMove = (direction: Direction) => {
    if (gameOver) return;

    const { newTiles, score: newScore,hasWon} = moveTiles(tiles, direction);
    if (JSON.stringify(newTiles) !== JSON.stringify(tiles)) {
      addRandomTile(newTiles);
      setiswon(hasWon);
      setTiles(newTiles);
      setScore(prevScore => prevScore + newScore);

      if (isGameOver(newTiles)) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
      
      }

      if (direction) {
        handleMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, gameOver]);

  const handlers = useSwipeable({
    onSwipedUp: () => handleMove('up'),
    onSwipedDown: () => handleMove('down'),
    onSwipedLeft: () => handleMove('left'),
    onSwipedRight: () => handleMove('right'),
    trackMouse: true
  });

  const resetGame = () => {
    setTiles(initializeGame());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      {/* Without Component Reusabiility }{
      gameOver ? ( <LoseTryAgain onrestart={resetGame} />) : iswon ? ( <Won onrestart={resetGame} playername={PlayerName} />) : ( <div className='flex flex-col items-center justify-center min-h-screen bg-transparent'>
      }*/}
      {gameOver ? (
        <Endresult buttontext='Try Again' emoji='😢' onrestart={resetGame} quote="Don't give up! You can always try again." result={`Oops ${PlayerName} Lost`}   />
) : iswon ? (
  <Endresult buttontext='Play Again' emoji='😉' onrestart={resetGame} quote="Keep going, achieve more, win again—play on!" result={`Hooray ${PlayerName} Won`}   />
) : (
  <div className='flex flex-col items-center justify-center min-h-screen bg-transparent'>
    <h1 className="text-sm md:text-xl lg:text-2xl xl:text-4xl font-bold mb-4 text-blue-800">
      Welcome {PlayerName}
    </h1>
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
          <div key={index} className="bg-blue-300 rounded-md"></div>
        ))}
      </div>
      {tiles.map(tile => (
        <Tile key={tile.id} {...tile} />
      ))}
    </div>

    <div className="mt-4 text-sm text-blue-600">
      Use arrow keys or swipe to play 
    </div>
  </div>
)}

    </div>
      
   
  );
};

const Tile: React.FC<TileType> = ({ value, position }) => {
  const [row, col] = position;
  const backgroundColor = {
    2: 'bg-gradient-to-br from-blue-200 to-blue-300',
    4: 'bg-gradient-to-br from-blue-300 to-blue-400',
    8: 'bg-gradient-to-br from-blue-400 to-blue-500',
    16: 'bg-gradient-to-br from-blue-500 to-blue-600',
    32: 'bg-gradient-to-br from-blue-600 to-blue-700',
    64: 'bg-gradient-to-br from-blue-700 to-blue-800',
    128: 'bg-gradient-to-br from-indigo-400 to-indigo-500',
    256: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    512: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    1024: 'bg-gradient-to-br from-purple-500 to-purple-600',
    2048: 'bg-gradient-to-br from-purple-600 to-purple-700',
  }[value] || 'bg-gradient-to-br from-purple-700 to-purple-800';

  const textColor = value <= 4 ? 'text-blue-800' : 'text-white';
  const fontSize = value < 100 ? 'text-4xl' : value < 1000 ? 'text-3xl' : 'text-2xl';

  return (
    <motion.div
      className={`absolute w-[70px] h-[70px] flex items-center justify-center ${fontSize} font-bold ${textColor} rounded-md shadow-md ${backgroundColor} transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-lg`}
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        x: col * 78 + 10,
        y: row * 78 + 10,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {value}
    </motion.div>
  );
};

export default Game2048;