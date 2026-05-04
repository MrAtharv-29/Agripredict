import asyncio
from main import predict_yield, FarmData, get_correlation

async def test():
    data = FarmData(
        crop_type="wheat",
        location="Pune",
        soil_n=40,
        soil_p=20,
        soil_k=20,
        soil_ph=6.5,
        soil_moisture=40
    )
    
    print("Testing /api/predict...")
    response = await predict_yield(data)
    print("Prediction:", response.yield_prediction)
    print("Insights:", response.explainability_insights)
    
    print("\nTesting /api/analytics/correlation...")
    corr = await get_correlation()
    print("Correlation keys:", corr.keys())

if __name__ == "__main__":
    asyncio.run(test())
