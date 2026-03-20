#start by navigating to backend folder
cd backend

#Create a virtual environment 
uv venv --python 3.12

#Activate the virtual environment 
source venv/bin/activate (for mac/linux)
venv\Scripts\activate (for windows)

#pip install requirements
uv pip install -r requirements.txt

#start the fastapi server
uv run uvicorn api:app --host 0.0.0.0 --port 8000

create another instance of terminal and run the following command:

cd frontend
npm install #if running for the first time

npm run dev