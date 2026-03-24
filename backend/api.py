import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from fire_evacuation.model import FireEvacuation
from fire_evacuation.agent import Human

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

sim_model = None

def get_grid_state():
    if not sim_model:
        return {"error": "Model not initialized"}
    
    agents_data = []
    for agents, (x, y) in sim_model.grid.coord_iter():
        for agent in agents:
            agent_info = {
                "id": str(agent.unique_id),
                "x": x,
                "y": y,
                "type": agent.__class__.__name__
            }
            if isinstance(agent, Human):
                agent_info["mobility"] = agent.get_mobility()
                agent_info["is_carrying"] = agent.is_carrying()
            
            agents_data.append(agent_info)
            
    stats = {
        "alive": sim_model.count_human_status(sim_model, Human.Status.ALIVE),
        "dead": sim_model.count_human_status(sim_model, Human.Status.DEAD),
        "escaped": sim_model.count_human_status(sim_model, Human.Status.ESCAPED),
        "normal": sim_model.count_human_mobility(sim_model, Human.Mobility.NORMAL),
        "panic": sim_model.count_human_mobility(sim_model, Human.Mobility.PANIC),
        "incapacitated": sim_model.count_human_mobility(sim_model, Human.Mobility.INCAPACITATED),
        "verbal_collaboration": sim_model.count_human_collaboration(sim_model, Human.Action.VERBAL_SUPPORT),
        "physical_collaboration": sim_model.count_human_collaboration(sim_model, Human.Action.PHYSICAL_SUPPORT),
        "morale_collaboration": sim_model.count_human_collaboration(sim_model, Human.Action.MORALE_SUPPORT),
    }
    
    return {
        "step": getattr(sim_model, "steps", 0), # NEW: Track time
        "agents": agents_data,
        "stats": stats, 
        "running": sim_model.running,
        "fire_started": getattr(sim_model, "fire_started", False)
    }

@app.get("/api/floorplans")
def get_floorplans():
    floorplan_dir = "fire_evacuation/floorplans"
    if not os.path.exists(floorplan_dir):
        return {"floorplans": []}
    files = [f for f in os.listdir(floorplan_dir) if f.endswith('.txt')]
    return {"floorplans": files}


# --- NEW: WEBSOCKET ENDPOINT ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.is_playing = False
        self.loop_task = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Send current state upon connection
        if sim_model:
            await websocket.send_json(get_grid_state())

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if not self.active_connections:
            self.is_playing = False
            if self.loop_task:
                self.loop_task.cancel()
                self.loop_task = None

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

async def simulation_loop():
    while True:
        if manager.is_playing and sim_model and sim_model.running:
            sim_model.step()
            await manager.broadcast(get_grid_state())
            await asyncio.sleep(0.1)  # 10 Steps per second (Adjust for speed)
        else:
            await asyncio.sleep(0.1)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    global sim_model
    
    # Start the shared loop task if not started
    if not manager.loop_task:
        manager.loop_task = asyncio.create_task(simulation_loop())

    try:
        while True:
            # Wait for commands from the Next.js frontend
            data = await websocket.receive_json()
            command = data.get("command")
            
            if command == "init":
                params = data.get("params", {})
                sim_model = FireEvacuation(
                    floor_plan_file=params.get("floor_plan_file", "floorplan_testing.txt"),
                    human_count=params.get("human_count", 10),
                    collaboration_percentage=params.get("collaboration_percentage", 50.0),
                    fire_probability=params.get("fire_probability", 0.1),
                    visualise_vision=params.get("visualise_vision", False),
                    random_spawn=params.get("random_spawn", True),
                    save_plots=params.get("save_plots", False)
                )
                manager.is_playing = False
                await manager.broadcast(get_grid_state())
                
            elif command == "step":
                if sim_model and sim_model.running:
                    sim_model.step()
                    await manager.broadcast(get_grid_state())
                    
            elif command == "play":
                manager.is_playing = True
                await manager.broadcast(get_grid_state())
                
            elif command == "pause":
                manager.is_playing = False
                await manager.broadcast(get_grid_state())
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)