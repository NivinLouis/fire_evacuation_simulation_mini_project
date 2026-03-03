"use client";

import { useSimulation } from "../hooks/useSimulation";
import SimulationGrid from "../components/SimulationGrid";
import Controls from "../components/Controls";
import Stats from "../components/Stats";
import Charts from "../components/Charts";

export default function Home() {
  const { gameState, initSimulation, stepSimulation, isPlaying, togglePlay } = useSimulation();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fire Evacuation Dashboard</h1>
            <p className="text-gray-600">Agent-Based Model Simulation | Step: {gameState.step}</p>
          </div>
          
          {gameState.fire_started && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full border border-red-200 animate-pulse">
              <span className="text-2xl">🔥</span>
              <span className="font-bold tracking-wider">FIRE ACTIVE</span>
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            {/* Note: Pass togglePlay instead of an inline function */}
            <Controls 
              onInit={initSimulation} 
              isPlaying={isPlaying} 
              onTogglePlay={togglePlay} 
              onStep={stepSimulation} 
            />
            <Stats stats={gameState.stats} />
          </div>

          <div className="w-full lg:flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md flex justify-center items-center overflow-hidden">
            <SimulationGrid gameState={gameState} />
          </div>
        </div>

        <Charts history={gameState.history} />

      </div>
    </main>
  );
}