def analyze_risks(data: dict):
    """
    Analyzes farm data to detect specific risks (Drought, Flood, Pest) 
    and returns severity levels along with targeted recommendations.
    """
    risks = []
    recommendations = []
    
    moisture = data.get('soil_moisture', 50.0)
    ph = data.get('soil_ph', 6.5)
    n = data.get('soil_n', 50.0)
    p = data.get('soil_p', 40.0)
    k = data.get('soil_k', 40.0)
    crop = data.get('crop_type', '').lower()
    
    # 1. Drought Risk
    if moisture < 20.0:
        risks.append({"type": "Drought", "severity": "High", "message": "Severe water deficit detected."})
        recommendations.append("EMERGENCY: Initiate immediate deep irrigation.")
        recommendations.append("Consider applying mulching to retain soil moisture.")
    elif moisture < 35.0:
        risks.append({"type": "Drought", "severity": "Medium", "message": "Soil moisture is below optimal levels."})
        recommendations.append("Increase irrigation frequency over the next 3 days.")
    else:
        risks.append({"type": "Drought", "severity": "Low", "message": "Moisture levels are stable."})
        
    # 2. Flood / Waterlogging Risk
    if moisture > 85.0:
        risks.append({"type": "Flood/Waterlogging", "severity": "High", "message": "Critical water saturation."})
        recommendations.append("EMERGENCY: Clear drainage channels immediately to prevent root rot.")
        if crop in ['cotton', 'wheat']:
            recommendations.append(f"{crop.title()} is highly sensitive to waterlogging. Drain excess water within 24 hours.")
    elif moisture > 70.0:
        if crop not in ['rice', 'sugarcane']: # Rice and sugarcane tolerate high water
            risks.append({"type": "Waterlogging", "severity": "Medium", "message": "High moisture may stress roots."})
            recommendations.append("Halt irrigation. Monitor field drainage.")
    else:
        risks.append({"type": "Flood/Waterlogging", "severity": "Low", "message": "No waterlogging detected."})

    # 3. Pest / Disease Risk (Heuristic based on imbalances)
    # High N + High Moisture often leads to fungal diseases and pest attraction
    if n > 80.0 and moisture > 60.0:
        risks.append({"type": "Pest/Disease", "severity": "High", "message": "High Nitrogen and moisture favor fungal growth and pests."})
        recommendations.append("Apply broad-spectrum preventative fungicide.")
        recommendations.append("Reduce nitrogen fertilizer application temporarily.")
    elif ph < 5.5:
        risks.append({"type": "Disease (Soil-borne)", "severity": "Medium", "message": "Highly acidic soil increases susceptibility to root diseases."})
        recommendations.append("Apply agricultural lime (CaCO3) to neutralize soil pH and prevent disease.")
    else:
        risks.append({"type": "Pest/Disease", "severity": "Low", "message": "Conditions do not indicate immediate pest outbreaks."})
        
    # Standard Nutrient Recommendations (if no extreme risks override them)
    if n < 35.0:
        recommendations.append("Apply Nitrogen-rich fertilizer (e.g., Urea) as soon as possible.")
    if p < 20.0:
        recommendations.append("Increase Phosphorus input (e.g., DAP) to support root development.")
    if k < 25.0:
        recommendations.append("Apply Potassium (e.g., MOP) to improve disease resistance and crop quality.")
        
    if not recommendations:
        recommendations.append("Soil parameters are optimal. Maintain current management practices.")
        
    # Calculate overall risk level (Highest severity wins)
    overall_risk = "Low"
    for r in risks:
        if r['severity'] == "High":
            overall_risk = "High"
            break
        elif r['severity'] == "Medium":
            overall_risk = "Medium"
            
    return {
        "overall_risk": overall_risk,
        "detailed_risks": risks,
        "recommendations": list(set(recommendations)) # remove duplicates
    }
