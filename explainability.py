import shap
import joblib
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt

# Ensure matplotlib uses a non-interactive backend
plt.switch_backend('Agg')

EXPLAINER_PATH = os.path.join(os.path.dirname(__file__), 'shap_explainer.joblib')
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')

def generate_explainer(model, X_train):
    """
    Generate and save a SHAP explainer based on the training data.
    We assume the model is a tree-based model (like RandomForest or XGBoost).
    """
    # For a VotingRegressor, we might pass the underlying Random Forest or XGBoost
    try:
        explainer = shap.TreeExplainer(model)
        joblib.dump(explainer, EXPLAINER_PATH)
        print(f"SHAP Explainer generated and saved to {EXPLAINER_PATH}")
    except Exception as e:
        print(f"Failed to generate SHAP explainer using TreeExplainer. Falling back to simple feature importance. Error: {e}")

def get_explanation(input_features_df, feature_names):
    """
    Load the explainer and get SHAP values for the given prediction.
    Translates SHAP values into readable insights and generates a visual plot.
    """
    try:
        if not os.path.exists(EXPLAINER_PATH):
            return {"text_insights": ["Explainability model is not available."], "plot_url": None}
            
        explainer = joblib.load(EXPLAINER_PATH)
        
        # Calculate SHAP values
        shap_values = explainer.shap_values(input_features_df)
        
        # Handling the output structure of shap_values based on SHAP version and model type
        if isinstance(shap_values, list):
             # For some multi-class or specific tree models
             values = shap_values[0][0]
        elif len(shap_values.shape) > 1:
             values = shap_values[0]
        else:
             values = shap_values
             
        # Extract features and map to their SHAP impact
        insights = []
        base_value = explainer.expected_value
        if isinstance(base_value, np.ndarray):
            base_value = base_value[0]
            
        feature_impacts = []
        for i, col in enumerate(feature_names):
            impact = values[i]
            val = input_features_df.iloc[0][col]
            feature_impacts.append((col, val, impact))
            
        # Sort by absolute impact to find the most influential factors
        feature_impacts.sort(key=lambda x: abs(x[2]), reverse=True)
        
        # Generate human-readable text
        for col, val, impact in feature_impacts[:3]: # Top 3 most impactful
            direction = "increased" if impact > 0 else "reduced"
            percentage_impact = abs(impact / base_value) * 100 if base_value != 0 else 0
            
            # Format feature name cleanly
            clean_name = col.replace("soil_", "").replace("_", " ").title()
            if clean_name == "N": clean_name = "Nitrogen"
            if clean_name == "P": clean_name = "Phosphorus"
            if clean_name == "K": clean_name = "Potassium"
            if clean_name == "Ph": clean_name = "pH Level"
            
            if percentage_impact > 1.0: # Only mention if impact is > 1%
                insights.append(f"{clean_name} ({round(val, 2)}) {direction} expected yield by roughly {percentage_impact:.1f}%.")
                
        if not insights:
            insights.append("All input features are within typical ranges with no single dominant impact.")
            
        # --- Generate Visual Plot ---
        plot_url = None
        try:
            plt.figure(figsize=(8, 4))
            # We use a simple bar plot of the SHAP values for the single prediction
            features_clean = [col.replace("soil_", "").replace("_", " ").title() for col in feature_names]
            y_pos = np.arange(len(features_clean))
            
            plt.barh(y_pos, values, align='center', color=['#ef4444' if v < 0 else '#10b981' for v in values])
            plt.yticks(y_pos, features_clean)
            plt.xlabel('Impact on Yield (SHAP Value)')
            plt.title('AI Feature Importance for this Prediction')
            plt.tight_layout()
            
            plot_filename = 'shap_plot.png'
            plot_path = os.path.join(STATIC_DIR, plot_filename)
            plt.savefig(plot_path, dpi=150, bbox_inches='tight')
            plt.close()
            plot_url = f"/{plot_filename}"
        except Exception as plot_e:
            print(f"Failed to generate SHAP plot: {plot_e}")
            plt.close()
            
        return {
            "text_insights": insights,
            "plot_url": plot_url
        }
        
    except Exception as e:
        print(f"Error generating explanation: {e}")
        return {"text_insights": ["Unable to generate explanation due to an internal error."], "plot_url": None}
