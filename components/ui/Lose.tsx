
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function LoseTryAgain({ onrestart }: { onrestart: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

 

  useEffect(() => {
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
       
        onrestart();
      }
    };

   
    window.addEventListener('keydown', handleKeyDown);

    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onrestart]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 text-black"
      tabIndex={0}
     
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Oops! You Lost
        </motion.h1>
        <motion.div
          className="text-8xl md:text-9xl mb-8"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          😢
        </motion.div>
        <p className="text-xl md:text-2xl mb-8">
          Don&apos;t give up! You can always try again.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onrestart}
            className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Try Again
            <motion.span
              className="ml-2"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
