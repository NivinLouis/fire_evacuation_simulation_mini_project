export interface Agent {
  id: string;
  x: number;
  y: number;
  type: "Human" | "Fire" | "Smoke" | "Wall" | "FireExit" | "Door" | "Furniture" | "DeadHuman" | "Sight";
  mobility?: number; // 0: Incapacitated, 1: Normal, 2: Panic
  is_carrying?: boolean;
}

export interface SimulationStats {
  alive: number;
  dead: number;
  escaped: number;
  normal: number;
  panic: number;
  incapacitated: number;
}

export interface SimulationState {
  agents: Agent[];
  stats: SimulationStats | null;
  running: boolean;
  grid_width: number;
  grid_height: number;
}