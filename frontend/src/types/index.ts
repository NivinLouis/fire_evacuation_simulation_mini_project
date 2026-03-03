export interface Agent {
  id: string;
  x: number;
  y: number;
  type: "Human" | "Fire" | "Smoke" | "Wall" | "FireExit" | "Door" | "Furniture" | "DeadHuman" | "Sight";
  mobility?: number; 
  is_carrying?: boolean;
}

export interface SimulationStats {
  alive: number;
  dead: number;
  escaped: number;
  normal: number;
  panic: number;
  incapacitated: number;
  verbal_collaboration: number;
  physical_collaboration: number;
  morale_collaboration: number;
}

// NEW: A single point in time for the charts
export interface StatDataPoint extends SimulationStats {
  step: number;
}

export interface SimulationState {
  step: number;
  agents: Agent[];
  stats: SimulationStats | null;
  history: StatDataPoint[]; // NEW: Array to hold historical data
  running: boolean;
  grid_width: number;
  grid_height: number;
  fire_started: boolean;
}