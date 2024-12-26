import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackgroundLines } from './ui/background-lines';
import Image from 'next/image';

interface OnboardingPageProps {
  onNameSubmit: (name: string) => void;
}

export default function OnboardingPage({ onNameSubmit }: OnboardingPageProps) {
    const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
       
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

   
    window.addEventListener('keydown', handleKeyDown);

    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const [name, setName] = useState('');
  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        handleSubmit(e);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name);
    }
  };

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-screen">
        <Image src="/logo.png" alt="2048" width={200} height={200} />
    <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
      Welcome to <span className='text-blue-500'>2048</span> Game
    </h2>
    <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
    Please enter your name to start the game.
    <div className='lg:flex z-50 relative lg:space-x-5'>
    <Input ref={inputRef} onKeyDown={(e)=>handleKeyDown(e)} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="mt-4" />
    <Button variant={"default"} onClick={handleSubmit}  type="submit"  className="mt-4 bg-blue-500 text-white">Start Game</Button>
    </div>
 
    </p>
  </BackgroundLines>
  );
}

