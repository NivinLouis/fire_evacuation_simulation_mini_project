"use client";

import { useState, useEffect } from "react";

interface Props {
  onInit: (params: any) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
}

export default function Controls({ onInit, isPlaying, onTogglePlay, onStep }: Props) {
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

  // Fetch available floorplans from the Python API on mount
  useEffect(() => {
    async function fetchFloorplans() {
      try {
        const res = await fetch("http://localhost:8000/api/floorplans");
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
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Simulation Parameters</h2>
      
      {/* Dynamic Dropdown for Floorplans */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Floorplan</label>
        <select 
          name="floor_plan_file" 
          value={params.floor_plan_file} 
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          Initialize Model
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onStep}
            disabled={isPlaying}
            className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Step
          </button>
          <button 
            onClick={onTogglePlay}
            className={`flex-1 px-4 py-2 text-white font-semibold rounded transition-colors ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}