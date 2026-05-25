import sys
import os
import uvicorn

# Add the 'backend' directory to the Python path so uvicorn and python can find the updated files
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
sys.path.insert(0, backend_path)

# Import the FastAPI app from backend/main.py
from main import app

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
