import { useState, useCallback, useEffect, useRef } from "react";
import { SimulationState, StatDataPoint } from "../types";

const WS_URL = "ws://localhost:8000/ws";

export function useSimulation() {
  const [gameState, setGameState] = useState<SimulationState>({
    step: 0,
    agents: [],
    stats: null,
    history: [],
    running: false,
    grid_width: 50,
    grid_height: 50,
    fire_started: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket(WS_URL);
    
    // Listen for incoming state updates from the Python server
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) return;
      
      setGameState((prev) => {
        const currentStep = data.step;
        const newHistoryPoint: StatDataPoint = { ...data.stats, step: currentStep };
        
        // If the step is 0 (new init), clear the history array
        const newHistory = currentStep === 0 ? [] : [...prev.history, newHistoryPoint];
        
        // Auto-pause if simulation finishes (everyone escaped or died)
        if (!data.running && prev.running) {
          setIsPlaying(false);
        }
        
        return {
          ...prev,
          ...data,
          history: newHistory,
        };
      });
    };

    // Cleanup connection when component unmounts
    return () => {
      ws.current?.close();
    };
  }, []);

  const initSimulation = useCallback((params: any) => {
    setIsPlaying(false);
    ws.current?.send(JSON.stringify({ command: "init", params }));
  }, []);

  const stepSimulation = useCallback(() => {
    ws.current?.send(JSON.stringify({ command: "step" }));
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const nextState = !prev;
      ws.current?.send(JSON.stringify({ command: nextState ? "play" : "pause" }));
      return nextState;
    });
  }, []);

  return {
    gameState,
    isPlaying,
    togglePlay, // Export the toggle function instead of raw setter
    initSimulation,
    stepSimulation,
  };
}