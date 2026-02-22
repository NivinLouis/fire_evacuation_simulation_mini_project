"use client";

import { SimulationState, Agent } from "../types";
import Image from "next/image";

interface Props {
  gameState: SimulationState;
}

export default function SimulationGrid({ gameState }: Props) {
  const { agents, grid_width, grid_height } = gameState;

  // Helper to determine the correct image based on the agent's state
  const getAgentImage = (agent: Agent) => {
    switch (agent.type) {
      case "Human":
        if (agent.mobility === 0) return "/resources/incapacitated_human.png";
        if (agent.mobility === 2) return "/resources/panicked_human.png";
        if (agent.is_carrying) return "/resources/carrying_human.png";
        return "/resources/human.png";
      case "Fire":
        return "/resources/fire.png";
      case "Smoke":
        return "/resources/smoke.png";
      case "FireExit":
        return "/resources/fire_exit.png";
      case "Door":
        return "/resources/door.png";
      case "Wall":
        return "/resources/wall.png";
      case "Furniture":
        return "/resources/furniture.png";
      case "DeadHuman":
        return "/resources/dead.png";
      case "Sight":
        return "/resources/eye.png";
      default:
        return null;
    }
  };

  // Helper to determine Z-index (Layering)
  const getLayer = (type: string) => {
    const layers: Record<string, number> = {
      FireExit: 1, Door: 1, Wall: 1, Furniture: 1,
      Smoke: 2, Fire: 3, DeadHuman: 4, Human: 5, Sight: 7,
    };
    return layers[type] || 1;
  };

  return (
    // w-full makes it fluid, max-w-4xl caps the size so it doesn't get ridiculously huge, aspect-square keeps it a perfect box
    <div className="relative w-full min-w-[280px] max-w-4xl aspect-square bg-gray-100 border-2 border-gray-800 mx-auto overflow-hidden shadow-inner">
      {agents.map((agent) => {
        const imgSrc = getAgentImage(agent);
        if (!imgSrc) return null;

        // Calculate size and position as percentages
        const widthPct = (1 / grid_width) * 100;
        const heightPct = (1 / grid_height) * 100;
        
        const leftPct = (agent.x / grid_width) * 100;
        
        // Mesa's Y origin (0,0) is bottom-left, but CSS origin is top-left.
        // We subtract from grid_height to flip the Y-axis so the floorplan renders correctly.
        const topPct = ((grid_height - 1 - agent.y) / grid_height) * 100;

        return (
          <div
            key={agent.id}
            className="absolute transition-all duration-300 ease-linear"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
              zIndex: getLayer(agent.type),
            }}
          >
            <Image 
              src={imgSrc} 
              alt={agent.type} 
              fill 
              className="object-contain"
              unoptimized // Bypasses Next.js image optimization for purely local rapid renders
            />
          </div>
        );
      })}
    </div>
  );
}