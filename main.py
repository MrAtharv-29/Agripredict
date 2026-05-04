from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import random
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import httpx
from geopy.geocoders import Nominatim
from datetime import datetime, timedelta
import subprocess
from data_manager import log_prediction, get_correlation_matrix, get_all_data
from explainability import get_explanation
from risk_engine import analyze_risks
from harvest_engine import predict_harvest_time

# Load ML models
try:
    model_path = os.path.join(os.path.dirname(__file__), 'yield_model.joblib')
    encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.joblib')
    rf_model = joblib.load(model_path)
    label_encoder = joblib.load(encoder_path)
except Exception as e:
    print(f"Warning: ML models not found. Please run train_model.py first. Error: {e}")
    rf_model = None
    label_encoder = None

app = FastAPI(title="AgriPredict API")

# Allow CORS for local development if frontend runs separately
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class FarmData(BaseModel):
    crop_type: str
    location: str
    soil_n: float
    soil_p: float
    soil_k: float
    soil_ph: float
    soil_moisture: float
    sowing_date: str | None = None

class PredictionResponse(BaseModel):
    yield_prediction: float
    unit: str
    confidence_score: float
    risk_level: str
    detailed_risks: list[dict]
    recommendations: list[str]
    explainability_insights: list[str]
    explainability_plot_url: str | None = None
    harvest_prediction: dict | None = None

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_yield(data: FarmData):
    if rf_model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="ML Model is not loaded. Please train the model first.")

    try:
        # Prepare input data for the model
        crop_encoded = label_encoder.transform([data.crop_type.lower()])[0]
        
        input_features = pd.DataFrame([{
            'crop_type_encoded': crop_encoded,
            'soil_n': data.soil_n,
            'soil_p': data.soil_p,
            'soil_k': data.soil_k,
            'soil_ph': data.soil_ph,
            'soil_moisture': data.soil_moisture
        }])
        
        predicted_yield = float(rf_model.predict(input_features)[0])
        confidence = round(random.uniform(85.0, 95.0), 1) # Still mock confidence for now
        
        # Get AI Explanation
        feature_names = ['crop_type_encoded', 'soil_n', 'soil_p', 'soil_k', 'soil_ph', 'soil_moisture']
        explanation_data = get_explanation(input_features, feature_names)
        insights = explanation_data["text_insights"]
        plot_url = explanation_data["plot_url"]
        
        # Analyze Risks and Recommendations
        risk_analysis = analyze_risks(data.model_dump())
        
        # Predict Harvest Time
        harvest_pred = predict_harvest_time(data.crop_type, data.sowing_date)
        
        # Log to DB for dynamic modeling
        log_prediction(data.model_dump(), predicted_yield)
        
    except ValueError:
        # If crop type is not in the encoder
        raise HTTPException(status_code=400, detail=f"Crop type '{data.crop_type}' is not supported by the model.")

    return PredictionResponse(
        yield_prediction=round(predicted_yield, 2),
        unit="tons/hectare",
        confidence_score=confidence,
        risk_level=risk_analysis["overall_risk"],
        detailed_risks=risk_analysis["detailed_risks"],
        recommendations=risk_analysis["recommendations"],
        explainability_insights=insights,
        explainability_plot_url=plot_url,
        harvest_prediction=harvest_pred
    )

@app.get("/api/admin/stats")
async def get_admin_stats():
    """Returns database statistics for the admin panel."""
    df = get_all_data()
    total_predictions = len(df)
    
    crop_counts = {}
    if not df.empty and 'crop_type' in df.columns:
        crop_counts = df['crop_type'].value_counts().to_dict()
        
    return {
        "status": "success",
        "total_predictions": total_predictions,
        "predictions_by_crop": crop_counts,
        "database_size_bytes": os.path.getsize(os.path.join(os.path.dirname(__file__), 'farm_data.db')) if os.path.exists(os.path.join(os.path.dirname(__file__), 'farm_data.db')) else 0
    }

@app.post("/api/admin/retrain")
async def trigger_retraining():
    """Triggers the ML model retraining script asynchronously."""
    try:
        # Run train_model.py in the background
        script_path = os.path.join(os.path.dirname(__file__), 'train_model.py')
        subprocess.Popen(["python", script_path], cwd=os.path.dirname(__file__))
        return {"status": "success", "message": "Model retraining started in the background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start retraining: {str(e)}")

@app.get("/api/analytics/correlation")
async def get_correlation():
    corr = get_correlation_matrix()
    if corr is None:
        return {"status": "insufficient_data", "message": "Not enough data to compute correlation."}
    return {"status": "success", "correlation_matrix": corr}

@app.get("/api/weather")
async def get_weather(location: str = "Pune"):
    geolocator = Nominatim(user_agent="agripredict_app")
    try:
        # Use geopy to get lat/lon
        location_data = geolocator.geocode(location)
        if not location_data:
            raise HTTPException(status_code=404, detail="Location not found")
            
        lat, lon = location_data.latitude, location_data.longitude
        
        # Call Open-Meteo API for 7 day forecast
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            weather_data = response.json()
            
        current = weather_data.get("current", {})
        daily = weather_data.get("daily", {})
        
        # Simple weather code mapping
        def get_condition(code):
            if code in [0, 1]: return "Sunny"
            if code in [2, 3]: return "Cloudy"
            if code in [45, 48]: return "Foggy"
            if code in [51, 53, 55, 61, 63, 65, 80, 81, 82]: return "Rain"
            if code in [71, 73, 75, 85, 86]: return "Snow"
            if code in [95, 96, 99]: return "Thunderstorm"
            return "Clear"
            
        forecast_7_days = []
        for i in range(7):
            date_str = daily.get("time", [])[i] if i < len(daily.get("time", [])) else f"Day {i+1}"
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                day_name = date_obj.strftime("%A")
            except:
                day_name = date_str
                
            max_temp = daily.get("temperature_2m_max", [])[i] if i < len(daily.get("temperature_2m_max", [])) else 0
            w_code = daily.get("weather_code", [])[i] if i < len(daily.get("weather_code", [])) else 0
            
            forecast_7_days.append({
                "day": day_name[:3], # Mon, Tue
                "temp": max_temp,
                "condition": get_condition(w_code)
            })

        return {
            "location": location_data.address.split(",")[0],
            "current": {
                "temp": current.get("temperature_2m", 0),
                "humidity": current.get("relative_humidity_2m", 0),
                "rainfall_mm": current.get("precipitation", 0),
                "condition": get_condition(current.get("weather_code", 0))
            },
            "forecast_7_days": forecast_7_days
        }
        
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Fallback to mock data on error
        return {
            "location": location,
            "current": {
                "temp": round(random.uniform(20.0, 35.0), 1),
                "humidity": round(random.uniform(40.0, 80.0), 1),
                "rainfall_mm": round(random.uniform(0.0, 15.0), 1),
                "condition": random.choice(["Sunny", "Cloudy", "Partly Cloudy", "Light Rain"])
            },
            "forecast_7_days": [
                {"day": f"Day {i+1}", "temp": round(random.uniform(20.0, 35.0), 1), "condition": random.choice(["Sunny", "Cloudy", "Rain"])}
                for i in range(7)
            ]
        }

@app.get("/api/satellite")
async def get_satellite_data(location: str):
    geolocator = Nominatim(user_agent="agripredict_app_sat")
    lat, lon = 18.5204, 73.8567 # Default
    try:
        location_data = geolocator.geocode(location)
        if location_data:
            lat, lon = location_data.latitude, location_data.longitude
    except Exception as e:
        print(f"Geocoding failed for satellite: {e}")

    return {
        "lat": lat,
        "lon": lon,
        "ndvi_index": round(random.uniform(0.4, 0.8), 2),
        "crop_health": random.choice(["Good", "Excellent", "Fair", "Poor"]),
        "anomalies_detected": "None" if random.random() > 0.2 else "Potential pest stress in North sector"
    }

# Ensure static folder exists
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

# Mount static files to serve the frontend
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
