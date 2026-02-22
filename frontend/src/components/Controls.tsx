"use client";

import { useState } from "react";

interface Props {
  onInit: (params: any) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
}

export default function Controls({ onInit, isPlaying, onTogglePlay, onStep }: Props) {
  // Matching the default values from your Mesa server.py setup
  const [params, setParams] = useState({
    floor_plan_file: "floorplan_testing.txt",
    human_count: 10,
    collaboration_percentage: 50,
    fire_probability: 0.1,
    visualise_vision: false,
    random_spawn: true,
    save_plots: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Simulation Parameters</h2>
      
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
          className="w-4 h-4"
        />
        <label htmlFor="random_spawn" className="text-sm text-gray-700">Spawn Agents at Random Locations</label>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" name="visualise_vision" id="visualise_vision"
          checked={params.visualise_vision} onChange={handleChange}
          className="w-4 h-4"
        />
        <label htmlFor="visualise_vision" className="text-sm text-gray-700">Show Agent Vision</label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
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
            className={`flex-1 px-4 py-2 text-white font-semibold rounded transition-colors ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}