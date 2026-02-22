from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

# Import your existing Mesa model and agents
from fire_evacuation.model import FireEvacuation
from fire_evacuation.agent import Human

app = FastAPI()

# Enable CORS so your local Next.js app (usually localhost:3000) can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# We'll store the active simulation in a global variable for now
sim_model = None

# Define the expected payload for initializing the model
class InitParams(BaseModel):
    floor_plan_file: str = "floorplan_testing.txt"
    human_count: int = 10
    collaboration_percentage: float = 50.0
    fire_probability: float = 0.1
    visualise_vision: bool = False
    random_spawn: bool = True
    save_plots: bool = False

@app.post("/api/init")
def init_model(params: InitParams):
    global sim_model
    sim_model = FireEvacuation(
        floor_plan_file=params.floor_plan_file,
        human_count=params.human_count,
        collaboration_percentage=params.collaboration_percentage,
        fire_probability=params.fire_probability,
        visualise_vision=params.visualise_vision,
        random_spawn=params.random_spawn,
        save_plots=params.save_plots
    )
    return {
        "status": "initialized", 
        "grid_width": sim_model.grid.width, 
        "grid_height": sim_model.grid.height
    }

def get_grid_state():
    if not sim_model:
        return {"error": "Model not initialized"}
    
    agents_data = []
    # Iterate through the grid to get all agent positions
    for agents, x, y in sim_model.grid.coord_iter():
        for agent in agents:
            agent_info = {
                "id": str(agent.unique_id),
                "x": x,
                "y": y,
                "type": agent.__class__.__name__
            }
            
            # Extract specific states for visual changes (like panicked vs incapacitated)
            if isinstance(agent, Human):
                agent_info["mobility"] = agent.get_mobility()
                agent_info["is_carrying"] = agent.is_carrying()
            
            agents_data.append(agent_info)
            
    # Pull current statistics for your frontend charts
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
    
    return {"agents": agents_data, "stats": stats, "running": sim_model.running,"fire_started": getattr(sim_model, "fire_started", False)}

@app.get("/api/state")
def get_state():
    return get_grid_state()

@app.get("/api/step")
def step_model():
    if sim_model and sim_model.running:
        sim_model.step()
    return get_grid_state()

@app.get("/api/floorplans")
def get_floorplans():
    """Returns a list of available floorplan .txt files."""
    floorplan_dir = "fire_evacuation/floorplans"
    
    # Ensure the directory exists to prevent errors
    if not os.path.exists(floorplan_dir):
        return {"floorplans": []}
        
    # List all .txt files in the directory
    files = [f for f in os.listdir(floorplan_dir) if f.endswith('.txt')]
    return {"floorplans": files}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)