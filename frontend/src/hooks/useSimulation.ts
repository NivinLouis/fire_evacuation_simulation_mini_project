import { useState, useCallback } from "react";
import { SimulationState } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

export function useSimulation() {
  const [gameState, setGameState] = useState<SimulationState>({
    agents: [],
    stats: null,
    running: false,
    grid_width: 50,
    grid_height: 50,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize a fresh model
  const initSimulation = useCallback(async (params: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      
      setGameState((prev) => ({
        ...prev,
        grid_width: data.grid_width,
        grid_height: data.grid_height,
      }));
      
      // Fetch the initial state immediately after initializing
      fetchState();
    } catch (error) {
      console.error("Failed to initialize simulation:", error);
    }
  }, []);

  // Get current state
  const fetchState = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/state`);
      const data = await response.json();
      setGameState((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch state:", error);
    }
  }, []);

  // Advance the simulation by one step
  const stepSimulation = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/step`);
      const data = await response.json();
      setGameState((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to step simulation:", error);
    }
  }, []);

  return {
    gameState,
    isPlaying,
    setIsPlaying,
    initSimulation,
    stepSimulation,
  };
}