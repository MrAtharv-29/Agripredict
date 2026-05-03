import asyncio
import httpx
from main import app
from httpx import ASGITransport

async def test_apis():
    async with httpx.AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Test Predict Endpoint (triggers risk engine)
        print("Testing /api/predict...")
        payload = {
            "crop_type": "wheat",
            "location": "Pune",
            "soil_n": 80.0,
            "soil_p": 40.0,
            "soil_k": 40.0,
            "soil_ph": 6.5,
            "soil_moisture": 15.0  # Should trigger Drought risk
        }
        res = await client.post("/api/predict", json=payload)
        data = res.json()
        print("Prediction Risk Level:", data.get("risk_level"))
        print("Detailed Risks:", data.get("detailed_risks"))
        
        # Test Admin Stats Endpoint
        print("\nTesting /api/admin/stats...")
        res = await client.get("/api/admin/stats")
        print("Admin Stats:", res.json())

if __name__ == "__main__":
    asyncio.run(test_apis())
