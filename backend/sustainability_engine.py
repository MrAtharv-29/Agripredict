def calculate_sustainability_score(data: dict) -> dict:
    """
    Calculates a sustainability score (0-100) based on resource usage.
    """
    score = 80 # Base score
    
    # Water Efficiency
    moisture = data.get("soil_moisture", 50)
    if moisture > 80:
        score -= 10 # Over-irrigation penalty
    elif 40 <= moisture <= 60:
        score += 5 # Optimal water usage bonus
        
    # Fertilizer Balance (N-P-K)
    # High Nitrogen can lead to leaching
    n = data.get("soil_n", 50)
    if n > 80:
        score -= 10 # Excess N penalty
        
    # Carbon Footprint (Simulated)
    # Based on fertilizer amount (proxy)
    carbon_footprint = (n * 0.5 + data.get("soil_p", 0) * 0.3) * 0.1
    
    # Biodiversity / Crop Rotation (Simulated)
    # If we had history, we would check rotation. For now, mock bonus.
    score += 5 
    
    return {
        "overall_score": min(max(score, 0), 100),
        "water_efficiency": "High" if 40 <= moisture <= 70 else "Low",
        "carbon_footprint_kg_co2_eq": round(carbon_footprint, 2),
        "rating": "A" if score > 85 else "B" if score > 70 else "C" if score > 50 else "D",
        "recommendations": [
            "Reduce nitrogen application to lower carbon footprint" if n > 80 else "Nitrogen levels are sustainable",
            "Optimize irrigation to avoid water wastage" if moisture > 80 else "Water usage is efficient"
        ]
    }
