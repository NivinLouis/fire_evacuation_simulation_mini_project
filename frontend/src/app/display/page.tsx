"use client";

import { useSimulation } from "../../hooks/useSimulation";
import SimulationGrid from "../../components/SimulationGrid";
import Charts from "../../components/Charts";
import { useState, useRef, useEffect, useCallback } from "react";

export default function DisplayPage() {
  const { gameState } = useSimulation();

  // Sidebar resizing logic
  const [sidebarWidth, setSidebarWidth] = useState(480);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
  }, []);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isResizing.current) return;
      const newWidth = document.body.clientWidth - clientX;
      // Allow width between 300px and 70% of the screen width
      if (newWidth > 300 && newWidth < document.body.clientWidth * 0.7) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    const stopResizing = () => {
      isResizing.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", stopResizing);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopResizing);
    };
  }, []);

  return (
    <main
      className={`h-screen w-screen overflow-hidden flex flex-row bg-slate-900 font-sans relative ${isResizing.current ? "select-none" : ""}`}
    >
      {/* Left Area: Main Simulation Grid */}
      <section className="flex-1 flex flex-col items-center justify-center p-4 relative h-full">
        {/* Optional: Add a top minimal overlay to show step and fire status */}
        <div className="absolute top-6 right-6 z-20">
          {gameState.fire_started && (
            <div className="flex items-center gap-2 bg-rose-500 text-white px-2 py-1 rounded-full shadow-md border border-rose-600 animate-pulse">
              <span className="text-base">🔥</span>
              <span className="text-sm font-medium tracking-wider">FIRE ACTIVE</span>
            </div>
          )}
        </div>

        <div className="absolute top-6 left-6 z-20">
          <div className="bg-slate-800 text-slate-100 px-2 py-1 rounded-full shadow-md border border-slate-700 font-mono text-sm font-medium">
            STEP {gameState.step}
          </div>
        </div>

        {/* Main Simulation Area */}
        <div className="w-full h-full flex items-center justify-center">
          <SimulationGrid gameState={gameState} />
        </div>
      </section>

      {/* Resizer Handle */}
      <div
        className="w-2 cursor-col-resize bg-slate-800 hover:bg-slate-600 active:bg-slate-500 transition-colors z-40 border-l border-slate-700 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center group"
        onMouseDown={startResizing}
        onTouchStart={startResizing}
      >
        <div className="h-12 w-0.5 bg-slate-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Right Area: Sidebar for Charts */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="shrink-0 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md overflow-y-auto p-6 flex flex-col gap-6 shadow-2xl z-30"
      >
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Live Analytics</h3>

        {/* Wrapper to ensure the light-themed Charts component is clearly readable */}
        <div className="bg-white p-5 rounded-2xl shadow-xl flex-1 flex flex-col justify-start">
          <Charts history={gameState.history} />
        </div>
      </aside>

    </main>
  );
}
