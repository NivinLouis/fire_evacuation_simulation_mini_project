import sys
import time

try:
    from fire_evacuation.model import FireEvacuation
except ImportError as e:
    print(f"Error importing model: {e}")
    sys.exit(1)

def run_test():
    print("Initializing model...")
    start_time = time.time()
    
    # We will run 100 steps
    model = FireEvacuation(
        floor_plan_file="floorplan_testing.txt",
        human_count=20,
        collaboration_percentage=50,
        fire_probability=0.2,
        visualise_vision=False,
        random_spawn=True,
        save_plots=False
    )
    
    print(f"Initialization took: {time.time() - start_time:.2f}s")
    
    print("Running simulation...")
    sim_start_time = time.time()
    for i in range(50):
        if not model.running:
            print(f"Model stopped running at step {i}")
            break
        model.step()
        
    print(f"50 steps took: {time.time() - sim_start_time:.2f}s")

if __name__ == "__main__":
    run_test()
