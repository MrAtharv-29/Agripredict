import pandas as pd
import joblib
import os

def run_simulation(base_data: dict, model, label_encoder, modifications: list[dict]) -> list:
    """
    Simulates changes in yield based on input modifications.
    modifications = [{"parameter": "soil_moisture", "change": -20}, {"parameter": "soil_n", "change": 10}]
    """
    if model is None or label_encoder is None:
        return []

    results = []
    
    # Baseline
    try:
        crop_encoded = label_encoder.transform([base_data.get("crop_type", "rice").lower()])[0]
    except:
        crop_encoded = 0

    def get_prediction(data):
        df = pd.DataFrame([{
            'crop_type_encoded': crop_encoded,
            'soil_n': data.get('soil_n', 0),
            'soil_p': data.get('soil_p', 0),
            'soil_k': data.get('soil_k', 0),
            'soil_ph': data.get('soil_ph', 0),
            'soil_moisture': data.get('soil_moisture', 0)
        }])
        return float(model.predict(df)[0])

    baseline_yield = get_prediction(base_data)
    results.append({"scenario": "Baseline", "yield": round(baseline_yield, 2), "change_percent": 0.0})

    for mod in modifications:
        sim_data = base_data.copy()
        param = mod.get("parameter")
        change = mod.get("change") # percent change or absolute? Let's do absolute for simplicity or relative if specified
        
        if param in sim_data:
            # Applying relative change
            original_val = sim_data[param]
            sim_data[param] = original_val * (1 + change / 100.0)
            
            sim_yield = get_prediction(sim_data)
            change_pct = ((sim_yield - baseline_yield) / baseline_yield) * 100 if baseline_yield > 0 else 0
            
            results.append({
                "scenario": f"{param.replace('soil_', '').title()} {change}%",
                "yield": round(sim_yield, 2),
                "change_percent": round(change_pct, 2),
                "modified_value": round(sim_data[param], 2)
            })

    return results
