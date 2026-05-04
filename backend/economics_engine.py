import random

def calculate_profit(crop_type: str, predicted_yield: float, area_hectares: float = 1.0) -> dict:
    """
    Calculates expected profit based on yield, market price, and input costs.
    """
    # Typical Market Prices (INR per Ton) - Mock data
    market_prices = {
        "rice": 22000,
        "wheat": 21000,
        "maize": 19000,
        "cotton": 60000,
        "sugarcane": 3500,
    }
    
    # Typical Input Costs (INR per Hectare) - Mock data
    input_costs = {
        "rice": {"seeds": 5000, "fertilizer": 8000, "water": 4000, "labor": 12000, "pesticides": 3000},
        "wheat": {"seeds": 4000, "fertilizer": 7000, "water": 3000, "labor": 10000, "pesticides": 2000},
        "maize": {"seeds": 6000, "fertilizer": 9000, "water": 3500, "labor": 11000, "pesticides": 4000},
        "cotton": {"seeds": 8000, "fertilizer": 12000, "water": 5000, "labor": 20000, "pesticides": 10000},
    }
    
    price_per_ton = market_prices.get(crop_type.lower(), 20000)
    costs = input_costs.get(crop_type.lower(), {"seeds": 5000, "fertilizer": 8000, "water": 4000, "labor": 10000, "pesticides": 3000})
    
    total_cost_per_hectare = sum(costs.values())
    total_revenue = predicted_yield * price_per_ton * area_hectares
    total_cost = total_cost_per_hectare * area_hectares
    profit = total_revenue - total_cost
    
    return {
        "expected_revenue": round(total_revenue, 2),
        "estimated_total_cost": round(total_cost, 2),
        "expected_profit": round(profit, 2),
        "profit_margin_percent": round((profit / total_revenue) * 100, 1) if total_revenue > 0 else 0,
        "cost_breakdown": costs,
        "currency": "INR",
        "market_price_per_ton": price_per_ton
    }

def suggest_seasonal_crops(soil_n: float, soil_p: float, soil_k: float, location: str) -> list:
    """
    Suggests best crops based on soil nutrients and location (simulated).
    """
    all_crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Pulses"]
    
    # Simple logic based on NPK
    recommendations = []
    
    if soil_n > 70:
        recommendations.append({"crop": "Rice", "reason": "High nitrogen levels are ideal for leafy growth in rice."})
    if soil_p > 50:
        recommendations.append({"crop": "Wheat", "reason": "Good phosphorus levels support strong root systems in wheat."})
    if soil_k > 50:
        recommendations.append({"crop": "Cotton", "reason": "Potassium helps in fiber quality and disease resistance for cotton."})
    
    # Add some based on "market trends" (simulated)
    market_trending = random.choice(all_crops)
    recommendations.append({"crop": market_trending, "reason": "High market demand predicted for next season in regional markets."})
    
    # Remove duplicates
    seen = set()
    unique_recs = []
    for r in recommendations:
        if r["crop"] not in seen:
            unique_recs.append(r)
            seen.add(r["crop"])
            
    return unique_recs
