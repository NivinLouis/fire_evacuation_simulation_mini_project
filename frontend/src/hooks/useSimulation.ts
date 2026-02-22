import { useState, useCallback } from "react";
import { SimulationState, StatDataPoint } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

export function useSimulation() {
  const [gameState, setGameState] = useState<SimulationState>({
    agents: [],
    stats: null,
    history: [],
    running: false,
    grid_width: 50,
    grid_height: 50,
    fire_started: false, // Added missing property
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const initSimulation = useCallback(async (params: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      
      setCurrentStep(0);
      setGameState({
        agents: [],
        stats: null,
        history: [], 
        running: false,
        grid_width: data.grid_width,
        grid_height: data.grid_height,
        fire_started: false, // Added missing property
      });
      
      fetchState(0);
    } catch (error) {
      console.error("Failed to initialize simulation:", error);
    }
  }, []);

  const fetchState = useCallback(async (stepIndex: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/state`);
      const data = await response.json();
      
      setGameState((prev) => {
        const newHistoryPoint: StatDataPoint = { ...data.stats, step: stepIndex };
        return {
          ...prev,
          ...data,
          history: [...prev.history, newHistoryPoint],
        };
      });
    } catch (error) {
      console.error("Failed to fetch state:", error);
    }
  }, []);

  const stepSimulation = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/step`);
      const data = await response.json();
      
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1;
        setGameState((prev) => {
          const newHistoryPoint: StatDataPoint = { ...data.stats, step: nextStep };
          return {
            ...prev,
            ...data,
            history: [...prev.history, newHistoryPoint],
          };
        });
        
        // Auto-pause if simulation is no longer running
        if (!data.running) setIsPlaying(false);
        
        return nextStep;
      });
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