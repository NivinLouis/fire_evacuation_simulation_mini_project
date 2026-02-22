"use client";

import { SimulationStats } from "../types";

interface Props {
  stats: SimulationStats | null;
}

export default function Stats({ stats }: Props) {
  if (!stats) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Live Statistics</h2>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Status</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 p-2 rounded border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{stats.alive}</div>
            <div className="text-xs text-blue-800">Alive</div>
          </div>
          <div className="bg-red-50 p-2 rounded border border-red-100">
            <div className="text-2xl font-bold text-red-600">{stats.dead}</div>
            <div className="text-xs text-red-800">Dead</div>
          </div>
          <div className="bg-green-50 p-2 rounded border border-green-100">
            <div className="text-2xl font-bold text-green-600">{stats.escaped}</div>
            <div className="text-xs text-green-800">Escaped</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Mobility</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{stats.normal}</div>
            <div className="text-xs text-emerald-800">Normal</div>
          </div>
          <div className="bg-orange-50 p-2 rounded border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{stats.panic}</div>
            <div className="text-xs text-orange-800">Panic</div>
          </div>
          <div className="bg-purple-50 p-2 rounded border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{stats.incapacitated}</div>
            <div className="text-xs text-purple-800">Incap.</div>
          </div>
        </div>
      </div>
    </div>
  );
}