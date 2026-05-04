def get_schemes(crop_type: str, location: str) -> list:
    """
    Returns relevant government schemes and subsidies based on crop and region.
    """
    schemes = [
        {
            "name": "PM-Kisan Samman Nidhi",
            "benefit": "₹6,000 per year in three installments",
            "eligibility": "Small and marginal farmers",
            "link": "https://pmkisan.gov.in/"
        },
        {
            "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "benefit": "Crop insurance against natural calamities",
            "eligibility": "All farmers growing notified crops",
            "link": "https://pmfby.gov.in/"
        }
    ]
    
    if crop_type.lower() in ["rice", "wheat"]:
        schemes.append({
            "name": "MSP (Minimum Support Price) Guarantee",
            "benefit": f"Guaranteed price of ₹{2200 if crop_type.lower() == 'rice' else 2100} per quintal",
            "eligibility": "Sale at government mandis",
            "link": "https://fci.gov.in/"
        })
        
    if "maharashtra" in location.lower() or "pune" in location.lower():
        schemes.append({
            "name": "Magel Tyala Shettale",
            "benefit": "Subsidy for farm pond construction",
            "eligibility": "Maharashtra state farmers",
            "link": "https://krishi.maharashtra.gov.in/"
        })
        
    return schemes
