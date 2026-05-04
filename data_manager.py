import sqlite3
import pandas as pd
import os
import json
from datetime import datetime


DB_PATH = os.path.join(os.path.dirname(__file__), 'farm_data.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create table for prediction queries and optionally actual yields
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS farm_predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        crop_type TEXT,
        location TEXT,
        soil_n REAL,
        soil_p REAL,
        soil_k REAL,
        soil_ph REAL,
        soil_moisture REAL,
        predicted_yield REAL,
        actual_yield REAL
    )
    ''')
    
    conn.commit()
    conn.close()

def log_prediction(data: dict, predicted_yield: float):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    INSERT INTO farm_predictions (
        timestamp, crop_type, location, 
        soil_n, soil_p, soil_k, soil_ph, soil_moisture, predicted_yield
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        datetime.now().isoformat(),
        data.get('crop_type', ''),
        data.get('location', ''),
        data.get('soil_n', 0.0),
        data.get('soil_p', 0.0),
        data.get('soil_k', 0.0),
        data.get('soil_ph', 0.0),
        data.get('soil_moisture', 0.0),
        predicted_yield
    ))
    
    conn.commit()
    conn.close()

def get_all_data() -> pd.DataFrame:
    if not os.path.exists(DB_PATH):
        return pd.DataFrame()
        
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM farm_predictions", conn)
    conn.close()
    return df

def get_correlation_matrix(df: pd.DataFrame = None):
    """
    Computes a correlation matrix for the continuous variables in the dataset.
    If no df is provided, it tries to read from the database or returns an empty dict.
    """
    if df is None:
        df = get_all_data()
        
    if df.empty or len(df) < 5:
        # If not enough data in DB, we'll return a static/mock correlation based on domain knowledge
        # or require passing the synthetic training data.
        return None
        
    features = ['soil_n', 'soil_p', 'soil_k', 'soil_ph', 'soil_moisture', 'predicted_yield']
    # Filter only available columns
    available_features = [f for f in features if f in df.columns]
    
    if not available_features:
        return None
        
    corr_matrix = df[available_features].corr(method='pearson')
    
    # Replace NaNs with 0 (happens if standard deviation is 0)
    corr_matrix = corr_matrix.fillna(0)
    
    return corr_matrix.to_dict()

# Initialize the DB on module import
init_db()
