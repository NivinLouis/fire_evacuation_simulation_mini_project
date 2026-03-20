"use client";

import { SimulationStats } from "../types";

interface Props {
  stats: SimulationStats | null;
}

export default function Stats({ stats }: Props) {
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">Live Statistics</h2>
      
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.alive}</div>
            <div className="text-xs font-medium text-blue-800 mt-1">Alive</div>
          </div>
          <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.dead}</div>
            <div className="text-xs font-medium text-red-800 mt-1">Dead</div>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{stats.escaped}</div>
            <div className="text-xs font-medium text-emerald-800 mt-1">Escaped</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Mobility</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 shadow-sm">
            <div className="text-2xl font-bold text-teal-600">{stats.normal}</div>
            <div className="text-xs font-medium text-teal-800 mt-1">Normal</div>
          </div>
          <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.panic}</div>
            <div className="text-xs font-medium text-orange-800 mt-1">Panic</div>
          </div>
          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.incapacitated}</div>
            <div className="text-xs font-medium text-purple-800 mt-1">Incap.</div>
          </div>
        </div>
      </div>
    </div>
  );
}