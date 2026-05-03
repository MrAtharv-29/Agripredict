from datetime import datetime, timedelta
import random

def predict_harvest_time(crop_type: str, sowing_date: str = None):
    """
    Predicts the optimal harvest time based on crop type.
    In a full production system, this would use real weather history 
    and Growing Degree Days (GDD). 
    Here we use a sophisticated heuristic.
    """
    if not sowing_date:
        # Default assumption: Sown 60 days ago if no date provided
        sowing_date_obj = datetime.now() - timedelta(days=60)
    else:
        try:
            sowing_date_obj = datetime.strptime(sowing_date, "%Y-%m-%d")
        except:
            sowing_date_obj = datetime.now() - timedelta(days=60)
            
    # Standard crop maturation periods (in days)
    maturation_days = {
        'wheat': 120,
        'rice': 135,
        'cotton': 150,
        'sugarcane': 365
    }
    
    crop = crop_type.lower()
    base_days = maturation_days.get(crop, 120)
    
    # Simulate weather-based variation (+/- 10 days)
    # E.g., hot weather accelerates maturation
    weather_impact = random.randint(-7, 7) 
    
    total_days = base_days + weather_impact
    harvest_date = sowing_date_obj + timedelta(days=total_days)
    
    days_remaining = (harvest_date - datetime.now()).days
    
    # Formulate insights
    if days_remaining > 30:
        status = "Vegetative/Flowering phase. Maintain nutrient schedule."
    elif days_remaining > 0:
        status = "Maturation phase. Prepare for upcoming harvest. Stop irrigation 2 weeks prior."
    else:
        status = "Crop is ready for immediate harvest."
        
    return {
        "estimated_harvest_date": harvest_date.strftime("%B %d, %Y"),
        "days_remaining": max(0, days_remaining),
        "status": status,
        "weather_impact_days": weather_impact
    }
