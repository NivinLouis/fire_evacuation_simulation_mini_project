"use client";

import { useEffect } from "react";
import { useSimulation } from "../hooks/useSimulation";
import SimulationGrid from "../components/SimulationGrid";
import Controls from "../components/Controls";
import Stats from "../components/Stats";
import Charts from "../components/Charts";

export default function Home() {
  const { gameState, initSimulation, stepSimulation, isPlaying, setIsPlaying } = useSimulation();

  // The Play Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        stepSimulation();
      }, 500); // 500ms delay between steps
    }
    return () => clearInterval(interval);
  }, [isPlaying, stepSimulation]);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fire Evacuation Dashboard</h1>
            <p className="text-gray-600">Agent-Based Model Simulation</p>
          </div>
          
          {/* Dynamic Fire Alert Badge */}
          {gameState.fire_started && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full border border-red-200 animate-pulse">
              <span className="text-2xl">🔥</span>
              <span className="font-bold tracking-wider">FIRE ACTIVE</span>
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar: Controls & Stats */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            <Controls 
              onInit={initSimulation} 
              isPlaying={isPlaying} 
              onTogglePlay={() => setIsPlaying(!isPlaying)} 
              onStep={stepSimulation} 
            />
            <Stats stats={gameState.stats} />
          </div>

          {/* Right Main Area: The Grid */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-auto flex justify-center items-center">
            <SimulationGrid gameState={gameState} />
          </div>
        </div>

        <Charts history={gameState.history} />

      </div>
    </main>
  );
}