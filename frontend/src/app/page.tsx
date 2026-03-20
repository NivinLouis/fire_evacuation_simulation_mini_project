"use client";

import { useSimulation } from "../hooks/useSimulation";
import SimulationGrid from "../components/SimulationGrid";
import Controls from "../components/Controls";
import Stats from "../components/Stats";
import Charts from "../components/Charts";

export default function Home() {
  const { gameState, initSimulation, stepSimulation, isPlaying, togglePlay } = useSimulation();

  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-50 flex flex-col text-slate-900 font-sans">
      <header className="shrink-0 flex justify-between items-center bg-white px-6 py-4 border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fire Evacuation Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Agent-Based Model Simulation &bull; <span className="text-slate-700">Step {gameState.step}</span></p>
        </div>
        
        {gameState.fire_started && (
          <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full border border-rose-200 animate-pulse shadow-sm">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold tracking-wider">FIRE ACTIVE</span>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Panel: Controls */}
        <aside className="w-[320px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-5 scrollbar-thin shadow-right z-10">
          <Controls 
            onInit={initSimulation} 
            isPlaying={isPlaying} 
            onTogglePlay={togglePlay} 
            onStep={stepSimulation} 
          />
        </aside>

        {/* Center Panel: Simulation Grid Canvas */}
        <section className="flex-1 bg-slate-100/80 flex flex-col items-center justify-center p-6 overflow-hidden relative shadow-inner">
          <div className="w-full h-full flex items-center justify-center">
            <SimulationGrid gameState={gameState} />
          </div>
        </section>

        {/* Right Panel: Stats & Charts */}
        <aside className="w-[420px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 flex flex-col gap-8 scrollbar-thin shadow-left z-10">
          <Stats stats={gameState.stats} />
          <Charts history={gameState.history} />
        </aside>
      </div>
    </main>
  );
}