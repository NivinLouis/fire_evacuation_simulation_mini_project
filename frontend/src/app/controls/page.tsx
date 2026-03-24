"use client";

import { useSimulation } from "../../hooks/useSimulation";
import Controls from "../../components/Controls";
import Stats from "../../components/Stats";
import ExplainableAI from "../../components/ExplainableAI";

export default function ControlsPage() {
  const { gameState, initSimulation, stepSimulation, isPlaying, togglePlay } = useSimulation();

  return (
    <main className="min-h-screen w-screen bg-slate-50 flex flex-col text-slate-900 font-sans p-6 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Controls Dashboard</h1>
        <p className="text-lg font-medium text-slate-500 mt-2">
          Agent-Based Model Simulation &bull; <span className="text-slate-700">Step {gameState.step}</span>
        </p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <Controls 
            onInit={initSimulation} 
            isPlaying={isPlaying} 
            onTogglePlay={togglePlay} 
            onStep={stepSimulation}
            gameState={gameState}
          />
        </div>
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Stats stats={gameState.stats} />
          <ExplainableAI stats={gameState.stats} history={gameState.history} />
        </div>
      </div>
    </main>
  );
}
