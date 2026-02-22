"use client";

import { SimulationState, Agent } from "../types";
import Image from "next/image";

interface Props {
  gameState: SimulationState;
}

export default function SimulationGrid({ gameState }: Props) {
  const { agents, grid_width, grid_height } = gameState;

  // Calculate cell size based on a fixed container size (e.g., 800px)
  const containerSize = 800;
  const cellWidth = containerSize / grid_width;
  const cellHeight = containerSize / grid_height;

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
    <div 
      className="relative bg-gray-100 border-2 border-gray-800 mx-auto"
      style={{ width: containerSize, height: containerSize }}
    >
      {agents.map((agent) => {
        const imgSrc = getAgentImage(agent);
        if (!imgSrc) return null;

        return (
          <div
            key={agent.id}
            className="absolute"
            style={{
              left: agent.x * cellWidth,
              // Mesa often treats (0,0) as bottom-left, Next.js is top-left.
              // If your layout looks upside down, change this to: (grid_height - 1 - agent.y) * cellHeight
              top: agent.y * cellHeight, 
              width: cellWidth,
              height: cellHeight,
              zIndex: getLayer(agent.type),
            }}
          >
            <Image 
              src={imgSrc} 
              alt={agent.type} 
              fill 
              sizes={`${cellWidth}px`}
              className="object-contain"
              unoptimized // Bypasses Next.js image optimization for purely local rapid renders
            />
          </div>
        );
      })}
    </div>
  );
}