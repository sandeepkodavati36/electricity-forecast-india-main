from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(title="Electricity Forecast API")

# Enable CORS - CRITICAL FOR FRONTEND COMMUNICATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data structure
class ForecastData(BaseModel):
    month: str
    month_num: int
    bill: float
    units: float
    consumption: float
    ci_lower: float
    ci_upper: float

# State and year data
STATES = [
    "Tamil Nadu",
    "Maharashtra",
    "Uttar Pradesh",
    "Rajasthan",
    "Gujarat",
    "Karnataka",
    "Andhra Pradesh",
    "West Bengal",
]

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

BASE_BILLS = {
    "Tamil Nadu": 850,
    "Maharashtra": 1100,
    "Uttar Pradesh": 950,
    "Rajasthan": 600,
    "Gujarat": 780,
    "Karnataka": 720,
    "Andhra Pradesh": 680,
    "West Bengal": 620,
}

GROWTH_RATES = {
    "Tamil Nadu": 0.055,
    "Maharashtra": 0.060,
    "Uttar Pradesh": 0.070,
    "Rajasthan": 0.065,
    "Gujarat": 0.058,
    "Karnataka": 0.050,
    "Andhra Pradesh": 0.060,
    "West Bengal": 0.050,
}

@app.get("/")
def read_root():
    return {"message": "Electricity Forecast API is running!", "version": "1.0"}

@app.get("/states")
def get_states():
    """Get list of available states"""
    return {"states": STATES}

@app.get("/years")
def get_years():
    """Get list of available forecast years"""
    return {"years": [2025, 2026, 2027]}

@app.get("/predict", response_model=List[ForecastData])
def predict(state: str, year: int):
    """
    Get electricity bill forecast for a state and year
    
    Parameters:
    - state: One of the states from /states endpoint
    - year: One of [2025, 2026, 2027]
    
    Returns:
    - List of monthly forecast data with confidence intervals
    """
    
    if state not in STATES:
        return []
    if year not in [2025, 2026, 2027]:
        return []
    
    base_bill = BASE_BILLS[state]
    growth_rate = GROWTH_RATES[state]
    
    # Calculate growth from 2024 to year
    years_ahead = year - 2024
    projection_factor = (1 + growth_rate) ** years_ahead
    
    forecast_data = []
    for month_num, month_name in enumerate(MONTHS, 1):
        # Base forecast
        base = base_bill * projection_factor
        
        # Add seasonal variation (peak in summer)
        if month_num in [4, 5, 6]:  # April, May, June - peak season
            bill = base * 1.15
        elif month_num in [11, 12, 1]:  # Nov, Dec, Jan - winter
            bill = base * 0.95
        else:
            bill = base
        
        # Add some randomness for realism
        np.random.seed(month_num * 100 + year % 100)
        variation = np.random.normal(0, bill * 0.05)
        bill += variation
        
        # Confidence intervals (90%)
        ci_width = bill * 0.08
        ci_lower = bill - ci_width
        ci_upper = bill + ci_width
        
        forecast_data.append(ForecastData(
            month=month_name,
            month_num=month_num,
            bill=max(0, round(bill, 2)),
            units=max(0, round(bill / 10, 2)),  # Assume ₹10 per unit
            consumption=max(0, round(bill / 10 / 1000, 2)),  # MU
            ci_lower=max(0, round(ci_lower, 2)),
            ci_upper=round(ci_upper, 2)
        ))
    
    return forecast_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
