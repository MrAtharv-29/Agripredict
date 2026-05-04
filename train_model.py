import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.feature_selection import mutual_info_regression
import joblib
import os

from data_manager import get_all_data
from explainability import generate_explainer

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    crops = ['wheat', 'rice', 'cotton', 'sugarcane']
    data = []
    
    for _ in range(num_samples):
        crop = np.random.choice(crops)
        if crop == 'wheat':
            n, p, k = np.random.uniform(30, 80), np.random.uniform(20, 60), np.random.uniform(20, 50)
            ph, moisture = np.random.uniform(6.0, 7.5), np.random.uniform(40, 60)
            base_yield = 3.0
        elif crop == 'rice':
            n, p, k = np.random.uniform(40, 90), np.random.uniform(30, 70), np.random.uniform(30, 60)
            ph, moisture = np.random.uniform(5.5, 7.0), np.random.uniform(60, 90)
            base_yield = 4.5
        elif crop == 'cotton':
            n, p, k = np.random.uniform(20, 70), np.random.uniform(20, 50), np.random.uniform(20, 60)
            ph, moisture = np.random.uniform(5.8, 8.0), np.random.uniform(30, 50)
            base_yield = 2.0
        else: # sugarcane
            n, p, k = np.random.uniform(50, 120), np.random.uniform(40, 80), np.random.uniform(40, 90)
            ph, moisture = np.random.uniform(6.0, 8.5), np.random.uniform(50, 80)
            base_yield = 70.0
            
        yield_val = base_yield + (n - 50) * 0.01 + (p - 40) * 0.01 + (k - 40) * 0.01
        if ph < 5.5 or ph > 8.0: yield_val -= base_yield * 0.1
        if moisture < 30: yield_val -= base_yield * 0.2
        yield_val += np.random.normal(0, base_yield * 0.05)
        yield_val = max(0.1, yield_val)
        
        data.append({
            'crop_type': crop, 'soil_n': n, 'soil_p': p, 'soil_k': k, 
            'soil_ph': ph, 'soil_moisture': moisture, 'yield': yield_val
        })
    return pd.DataFrame(data)

def get_combined_data():
    print("Generating base synthetic data...")
    df_synthetic = generate_synthetic_data(2000)
    
    print("Fetching dynamic data from database...")
    df_db = get_all_data()
    
    if not df_db.empty and 'actual_yield' in df_db.columns:
        # Filter for rows that have verified actual yield
        df_real = df_db.dropna(subset=['actual_yield'])
        if not df_real.empty:
            df_real = df_real[['crop_type', 'soil_n', 'soil_p', 'soil_k', 'soil_ph', 'soil_moisture', 'actual_yield']]
            df_real = df_real.rename(columns={'actual_yield': 'yield'})
            print(f"Adding {len(df_real)} real records from database to training set.")
            df_synthetic = pd.concat([df_synthetic, df_real], ignore_index=True)
            
    return df_synthetic

def main():
    df = get_combined_data()
    
    le = LabelEncoder()
    df['crop_type_encoded'] = le.fit_transform(df['crop_type'])
    
    feature_cols = ['crop_type_encoded', 'soil_n', 'soil_p', 'soil_k', 'soil_ph', 'soil_moisture']
    X = df[feature_cols]
    y = df['yield']
    
    # Feature Selection / Analysis
    print("\nPerforming Feature Selection (Mutual Information)...")
    mi_scores = mutual_info_regression(X, y)
    mi_scores = pd.Series(mi_scores, name="MI Scores", index=X.columns)
    mi_scores = mi_scores.sort_values(ascending=False)
    print(mi_scores)
    # We could drop features here, but for this domain, all these features are relevant.
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("\nTraining Ensemble Model (Random Forest + XGBoost)...")
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    xgb = XGBRegressor(n_estimators=100, random_state=42, learning_rate=0.1)
    
    ensemble = VotingRegressor(estimators=[('rf', rf), ('xgb', xgb)])
    ensemble.fit(X_train, y_train)
    
    predictions = ensemble.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    print(f"Ensemble Model Evaluation:\n MSE: {mse:.4f}\n R2 Score: {r2:.4f}")
    
    # Save the models
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'yield_model.joblib')
    encoder_path = os.path.join(script_dir, 'label_encoder.joblib')
    
    joblib.dump(ensemble, model_path)
    joblib.dump(le, encoder_path)
    print(f"\nModel saved to {model_path}")
    
    # Generate SHAP explainer on the XGBoost component (TreeExplainer)
    print("\nGenerating SHAP explainer for XGBoost component...")
    # Refit XGBoost alone to serve as the proxy explainer since VotingRegressor is hard to explain natively
    xgb.fit(X_train, y_train)
    generate_explainer(xgb, X_train)

if __name__ == '__main__':
    main()
