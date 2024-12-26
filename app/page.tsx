"use client"
import { useState } from 'react';
import Game2048 from '../components/Game2048';
import GridBackgroundDemo from './comp/GridBackground';
import OnboardingPage from '@/components/OnboardingPage';

export default function Home() {
  const [PlayerName,setPlayerName] = useState("");
  const handleNameSubmit = (name:string) => {
  setPlayerName(name);
  }
  return (
    <GridBackgroundDemo>
  <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 ">
      {
        !PlayerName ? (<OnboardingPage onNameSubmit={handleNameSubmit}/>):(<Game2048 PlayerName={PlayerName}/>)
      }
    </main>
    </GridBackgroundDemo>
  
  );
}

