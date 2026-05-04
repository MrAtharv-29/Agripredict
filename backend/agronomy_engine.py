from datetime import datetime
import random

def get_growth_stage(crop_type: str, sowing_date_str: str) -> dict:
    """
    Predicts the current growth stage based on sowing date and crop characteristics.
    """
    if not sowing_date_str:
        return {"stage": "Unknown", "progress": 0, "days_since_sowing": 0}

    try:
        sowing_date = datetime.strptime(sowing_date_str, "%Y-%m-%d")
        today = datetime.now()
        days_diff = (today - sowing_date).days
        
        if days_diff < 0:
            return {"stage": "Planned", "progress": 0, "days_since_sowing": days_diff}

        # Simplified growth stage durations (days)
        # In a real app, these would be fetched from a database per crop variety
        crop_cycles = {
            "rice": {"germination": 10, "vegetative": 40, "flowering": 30, "maturity": 40},
            "wheat": {"germination": 15, "vegetative": 60, "flowering": 25, "maturity": 30},
            "maize": {"germination": 12, "vegetative": 50, "flowering": 20, "maturity": 38},
            "cotton": {"germination": 10, "vegetative": 70, "flowering": 40, "maturity": 50},
        }
        
        cycle = crop_cycles.get(crop_type.lower(), {"germination": 15, "vegetative": 45, "flowering": 30, "maturity": 30})
        
        total_days = sum(cycle.values())
        
        if days_diff <= cycle["germination"]:
            stage = "Germination"
            progress = (days_diff / cycle["germination"]) * 100
        elif days_diff <= cycle["germination"] + cycle["vegetative"]:
            stage = "Vegetative"
            progress = ((days_diff - cycle["germination"]) / cycle["vegetative"]) * 100
        elif days_diff <= cycle["germination"] + cycle["vegetative"] + cycle["flowering"]:
            stage = "Flowering"
            progress = ((days_diff - cycle["germination"] - cycle["vegetative"]) / cycle["flowering"]) * 100
        elif days_diff <= total_days:
            stage = "Maturity"
            progress = ((days_diff - cycle["germination"] - cycle["vegetative"] - cycle["flowering"]) / cycle["maturity"]) * 100
        else:
            stage = "Harvested"
            progress = 100

        return {
            "stage": stage,
            "progress": round(min(progress, 100), 1),
            "days_since_sowing": days_diff,
            "estimated_remaining_days": max(0, total_days - days_diff)
        }
    except Exception as e:
        print(f"Error calculating growth stage: {e}")
        return {"stage": "Error", "progress": 0, "days_since_sowing": 0}

def detect_anomalies(sensor_data: dict, satellite_data: dict) -> list:
    """
    Detects sudden drops or unusual readings in soil/satellite data.
    """
    anomalies = []
    
    # Check for NDVI drop (Health stress)
    if satellite_data.get("ndvi_index", 1.0) < 0.3:
        anomalies.append({
            "type": "Low Vegetation Index",
            "severity": "High",
            "message": "Significant drop in NDVI detected. Potential pest attack or severe water stress."
        })
        
    # Soil moisture anomaly (Sudden drop vs rainfall)
    if sensor_data.get("soil_moisture", 100) < 20:
        anomalies.append({
            "type": "Soil Moisture Alert",
            "severity": "Medium",
            "message": "Soil moisture is critically low. Immediate irrigation recommended."
        })
        
    # PH balance anomaly
    ph = sensor_data.get("soil_ph", 7.0)
    if ph < 5.5 or ph > 8.5:
        anomalies.append({
            "type": "Soil Acidity/Alkalinity",
            "severity": "Medium",
            "message": f"Soil pH is {ph}, which is outside optimal range for most crops."
        })
        
    return anomalies

def calculate_heat_stress(temp: float, humidity: float) -> str:
    """
    Simplified Heat Stress Index for crops.
    """
    if temp > 35 and humidity < 30:
        return "Extreme Heat Stress (High Evapotranspiration)"
    elif temp > 32:
        return "Moderate Heat Stress"
    return "Optimal Temperature"

def get_multispectral_indices(ndvi: float):
    """
    Simulates EVI and NDWI based on NDVI for demonstration.
    In production, these would be calculated from raw NIR/RED/SWIR bands.
    """
    # EVI is generally more sensitive in high biomass regions
    evi = ndvi * 1.1 + random.uniform(-0.05, 0.05)
    # NDWI indicates water stress (often inversely or correlated depending on canopy)
    ndwi = ndvi * 0.8 + random.uniform(-0.1, 0.1)
    
    return {
        "ndvi": round(ndvi, 2),
        "evi": round(min(max(evi, 0), 1), 2),
        "ndwi": round(min(max(ndwi, -1), 1), 2)
    }
