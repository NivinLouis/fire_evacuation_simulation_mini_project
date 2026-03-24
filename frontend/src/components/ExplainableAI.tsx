"use client";

import { StatDataPoint, SimulationStats } from "../types";

interface Props {
  stats: SimulationStats | null;
  history: StatDataPoint[];
}

export default function ExplainableAI({ stats, history }: Props) {
  if (!stats) return null;

  const totalPopulation = stats.alive + stats.dead + stats.escaped;
  if (totalPopulation === 0) return null;

  // Analysis logic
  const escapeRate = (stats.escaped / totalPopulation) * 100;
  const panicRate = (stats.panic / (stats.alive || 1)) * 100;

  // Calculate trend (last 5 steps vs previous 5 steps)
  let panicRising = false;
  if (history.length > 5) {
    const recent = history.slice(-5);
    const prev = history.slice(-10, -5);
    const avgRecentPanic = recent.reduce((sum, d) => sum + d.panic, 0) / recent.length;
    const avgPrevPanic = prev.reduce((sum, d) => sum + d.panic, 0) / (prev.length || 1);
    panicRising = avgRecentPanic > avgPrevPanic;
  }

  const isHighPanic = panicRate > 40;
  const hasCasualties = stats.dead > 0;
  const highIncapacitation = stats.incapacitated > 0 && (stats.incapacitated / totalPopulation) > 0.1;
  const anyCollaboration = (stats as any).verbal_collaboration > 0 || (stats as any).physical_collaboration > 0 || (stats as any).morale_collaboration > 0;

  return (
    <div className="flex flex-col gap-4 w-full mt-6 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <h2 className="text-lg font-bold text-slate-800">Explainable Insights</h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Evacuation Progress */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <h3 className="text-sm font-bold text-slate-700 mb-1">Evacuation Progress</h3>
          <p className="text-sm text-slate-600">
            {escapeRate === 100
              ? "Evacuation complete. All agents accounted for."
              : `${escapeRate.toFixed(1)}% of the initial population has successfully evacuated.`}
          </p>
        </div>

        {/* Panic & Behavior Analysis */}
        <div className={`p-4 rounded-xl relative overflow-hidden border ${isHighPanic ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${isHighPanic ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
          <h3 className="text-sm font-bold text-slate-700 mb-1">Behavior Analysis</h3>
          <p className="text-sm text-slate-600">
            {isHighPanic
              ? `High structural panic detected (${panicRate.toFixed(1)}%). `
              : `Panic levels are currently manageable (${panicRate.toFixed(1)}%). `}
            {history.length > 5 && panicRising && "Panic is trending upwards over the last few steps."}
            {history.length > 5 && !panicRising && "Panic seems to be stabilizing or decreasing."}
          </p>
        </div>

        {/* Risk Assessment */}
        {(hasCasualties || highIncapacitation) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">Risk Assessment</h3>
            <p className="text-sm text-slate-600">
              {hasCasualties && `Critical event: ${stats.dead} casualties reported. `}
              {highIncapacitation && `${stats.incapacitated} agents are incapacitated, blocking paths and dropping overall mobility.`}
            </p>
          </div>
        )}

        {/* Collaboration Note */}
        {anyCollaboration && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">Agent Collaboration</h3>
            <p className="text-sm text-slate-600">
              Pro-social behavior detected. Agents are engaging in physical or verbal collaboration, increasing the chances of collective survival.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
