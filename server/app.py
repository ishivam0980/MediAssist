"""
MediAssist FastAPI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import prediction routes
from routes.predictions import router as predictions_router
from helpers import preload_all_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Preload models
    print("\nMediAssist API Starting...")
    preload_all_models()
    print("MediAssist API Ready on http://localhost:5000")
    print("API Docs available at http://localhost:5000/docs\n")
    yield
    # Shutdown
    print("\nMediAssist API Shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="MediAssist API",
    description="AI-powered disease prediction API for Diabetes, Heart Disease, and Parkinson's Disease",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup - allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register prediction routes
app.include_router(predictions_router)


@app.get("/")
def index():
    """API home page"""
    return {
        "message": "MediAssist API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "GET /api/health",
            "predict_diabetes": "POST /api/predict/diabetes",
            "predict_heart_disease": "POST /api/predict/heart-disease",
            "predict_parkinsons": "POST /api/predict/parkinsons"
        }
    }


# Run with: uvicorn app:app --host 0.0.0.0 --port 5000 --reload
if __name__ == '__main__':
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 5000))
    print(f"\nStarting MediAssist API on port {port}...")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
