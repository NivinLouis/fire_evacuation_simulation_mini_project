"use client";

import { useState, useEffect } from "react";

interface Props {
  onInit: (params: any) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  gameState?: any;
}

export default function Controls({ onInit, isPlaying, onTogglePlay, onStep, gameState }: Props) {
  const [floorplans, setFloorplans] = useState<string[]>([]);
  
  const [params, setParams] = useState({
    floor_plan_file: "floorplan_testing.txt",
    human_count: 10,
    collaboration_percentage: 50,
    fire_probability: 0.1,
    visualise_vision: false,
    random_spawn: true,
    save_plots: false,
  });

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoCountdown, setDemoCountdown] = useState<number | null>(null);

  // Demo Mode loop logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDemoMode) {
      if (!isPlaying && !gameState?.running) {
        if (demoCountdown === null) {
          setDemoCountdown(5);
        } else if (demoCountdown > 0) {
          timer = setTimeout(() => setDemoCountdown(demoCountdown - 1), 1000);
        } else if (demoCountdown === 0) {
          setDemoCountdown(null);
          if (floorplans.length > 0) {
            const randomHumans = Math.floor(Math.random() * 20) + 10; // Between 10 and 29 agents
            const randomCollaboration = Math.floor(Math.random() * 11) * 10;
            const randomFireProb = Math.floor(Math.random() * 20 + 5) / 100;
            
            setParams((prev) => {
              const newParams = {
                ...prev,
                human_count: randomHumans,
                collaboration_percentage: randomCollaboration,
                fire_probability: randomFireProb,
                random_spawn: true,
              };
              // Wait for React to update state, but immediately trigger init with new params
              onInit(newParams);
              return newParams;
            });
            
            // Allow time for init before hitting play
            setTimeout(() => {
              onTogglePlay();
            }, 800);
          }
        }
      } else {
        if (demoCountdown !== null) setDemoCountdown(null);
      }
    } else {
      if (demoCountdown !== null) setDemoCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [isDemoMode, isPlaying, gameState?.running, demoCountdown, floorplans, onInit, onTogglePlay]);

  // Fetch available floorplans from the Python API on mount
  useEffect(() => {
    async function fetchFloorplans() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8000/api`;
        const res = await fetch(`${API_BASE_URL}/floorplans`);
        const data = await res.json();
        if (data.floorplans && data.floorplans.length > 0) {
          setFloorplans(data.floorplans);
          // Set the default selected floorplan to the first one in the list
          setParams(prev => ({ ...prev, floor_plan_file: data.floorplans[0] }));
        }
      } catch (error) {
        console.error("Failed to fetch floorplans:", error);
      }
    }
    fetchFloorplans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Type narrowing for checkboxes
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setParams((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : (name === "floor_plan_file" ? value : Number(value)),
    }));
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 flex justify-between items-center">
        <span>Parameters</span>
        <div className="flex items-center gap-2">
          <label htmlFor="demo_mode" className="text-sm font-bold text-indigo-600 cursor-pointer" onClick={() => setIsDemoMode(!isDemoMode)}>
            Demo Mode
          </label>
          <input 
            type="checkbox" id="demo_mode" 
            checked={isDemoMode} onChange={() => setIsDemoMode(!isDemoMode)}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </h2>

      {isDemoMode && demoCountdown !== null && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium text-center animate-pulse">
          Next demo starting in {demoCountdown}s...
        </div>
      )}
      
      {/* Dynamic Dropdown for Floorplans */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Floorplan</label>
        <select 
          name="floor_plan_file" 
          value={params.floor_plan_file} 
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        >
          {floorplans.length === 0 ? (
            <option>Loading...</option>
          ) : (
            floorplans.map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))
          )}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Number Of Human Agents: {params.human_count}
        </label>
        <input 
          type="range" name="human_count" 
          min="1" max="100" value={params.human_count} onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Percentage Collaborating: {params.collaboration_percentage}%
        </label>
        <input 
          type="range" name="collaboration_percentage" 
          min="0" max="100" step="10" value={params.collaboration_percentage} onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Probability of Fire: {params.fire_probability}
        </label>
        <input 
          type="range" name="fire_probability" 
          min="0" max="1" step="0.01" value={params.fire_probability} onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" name="random_spawn" id="random_spawn"
          checked={params.random_spawn} onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="random_spawn" className="text-sm text-gray-700">Random Locations</label>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" name="visualise_vision" id="visualise_vision"
          checked={params.visualise_vision} onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="visualise_vision" className="text-sm text-gray-700">Show Agent Vision</label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => onInit(params)}
          className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-bold tracking-wide rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          Initialize Model
        </button>
        <div className="flex gap-3 mt-1">
          <button 
            onClick={onStep}
            disabled={isPlaying}
            className="flex-1 px-4 py-2.5 bg-slate-600 text-white text-sm font-bold tracking-wide rounded-xl hover:bg-slate-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:active:scale-100"
          >
            Step
          </button>
          <button 
            onClick={onTogglePlay}
            className={`flex-1 px-4 py-2.5 text-white text-sm font-bold tracking-wide rounded-xl active:scale-95 transition-all shadow-sm ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}