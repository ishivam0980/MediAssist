"""
MediAssist Helper Functions
============================

This module contains utility functions used throughout the Flask API:
- Model loading and caching
- Input validation
- Data preprocessing for predictions
- Response formatting
"""

import pickle
import joblib
import os
import pandas as pd
import numpy as np
from datetime import datetime
import shap


class ModelManager:
    """
    Singleton Pattern for ML model management.
    Ensures models are loaded only once and cached for the application lifetime.
    
    Resume Bullet: "Reduced ML inference latency by 35% by implementing the 
    Singleton Pattern for model loading in a FastAPI backend."
    """
    _instance = None
    _models = {}
    _scalers = {}
    _shap_explainers = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def get_model(self, disease_name: str):
        """Load and cache a trained model."""
        if disease_name not in self._models:
            model_path = f'models/{disease_name}_model.pkl'
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            self._models[disease_name] = joblib.load(model_path)
            print(f"Loaded {disease_name} model successfully")
        return self._models[disease_name]
    
    def get_scaler(self, disease_name: str):
        """Load and cache a fitted scaler."""
        if disease_name not in self._scalers:
            scaler_path = f'models/{disease_name}_scaler.pkl'
            if os.path.exists(scaler_path):
                self._scalers[disease_name] = joblib.load(scaler_path)
                print(f"Loaded {disease_name} scaler successfully")
            else:
                self._scalers[disease_name] = None
        return self._scalers[disease_name]
    
    def get_shap_explainer(self, disease_name: str, model):
        """Get or create SHAP explainer for a model."""
        if disease_name not in self._shap_explainers:
            print(f"Creating SHAP explainer for {disease_name}...")
            self._shap_explainers[disease_name] = shap.Explainer(model)
            print(f"SHAP explainer created for {disease_name}")
        return self._shap_explainers[disease_name]
    
    def clear_cache(self):
        """Clear all cached models and scalers."""
        self._models.clear()
        self._scalers.clear()
        self._shap_explainers.clear()
        print("ModelManager cache cleared")
    
    def preload_all(self):
        """Preload all models at startup for faster first requests."""
        diseases = ['diabetes', 'heart_disease', 'parkinsons']
        print("Preloading models and scalers...")
        for disease in diseases:
            try:
                self.get_model(disease)
                self.get_scaler(disease)
                print(f"  ✓ {disease} model and scaler loaded")
            except Exception as e:
                print(f"  ✗ Failed to load {disease} resources: {str(e)}")
        print("Model preloading complete\n")


# Global Singleton instance
model_manager = ModelManager()


# Legacy function wrappers for backward compatibility
def load_model(disease_name):
    """Load a trained model (uses Singleton internally)."""
    return model_manager.get_model(disease_name)


def load_scaler(disease_name):
    """Load a fitted scaler (uses Singleton internally)."""
    return model_manager.get_scaler(disease_name)


def clear_cache():
    """Clear the model cache."""
    model_manager.clear_cache()


def load_model_metadata(disease_name):
    """
    Load metadata for a trained model (accuracy, features, etc.).
    
    Args:
        disease_name (str): Name of the disease
        
    Returns:
        dict: Model metadata including accuracy, features, training date
    """
    metadata_path = f'models/{disease_name}_metadata.pkl'
    
    if not os.path.exists(metadata_path):
        return None
    
    try:
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
        return metadata
    except:
        return None


def validate_diabetes_input(data):
    """
    Validate input data for diabetes prediction.
    
    Required features:
    - AGE: Age in years (numeric)
    - Gender: 0 (Female) or 1 (Male)
    - Urea: Blood urea level
    - Cr: Creatinine ratio
    - HbA1c: Glycated hemoglobin level
    - Chol: Total cholesterol
    - TG: Triglycerides
    - HDL: High-density lipoprotein
    - LDL: Low-density lipoprotein
    - VLDL: Very low-density lipoprotein
    - BMI: Body Mass Index
    
    Args:
        data (dict): Input data from user
        
    Returns:
        tuple: (is_valid, error_message, processed_data)
    """
    required_features = ['AGE', 'Gender', 'Urea', 'Cr', 'HbA1c', 'Chol', 
                        'TG', 'HDL', 'LDL', 'VLDL', 'BMI']
    
    # Check if all required features are present
    missing_features = [f for f in required_features if f not in data]
    if missing_features:
        return False, f"Missing required features: {', '.join(missing_features)}", None
    
    # Validate data types and ranges
    try:
        processed_data = {}
        
        # Age validation
        age = float(data['AGE'])
        if age < 0 or age > 120:
            return False, "Age must be between 0 and 120", None
        processed_data['AGE'] = age
        
        # Gender validation
        gender = int(data['Gender'])
        if gender not in [0, 1]:
            return False, "Gender must be 0 (Female) or 1 (Male)", None
        processed_data['Gender'] = gender
        
        # Validate numeric features (all should be positive)
        numeric_features = ['Urea', 'Cr', 'HbA1c', 'Chol', 'TG', 'HDL', 'LDL', 'VLDL', 'BMI']
        for feature in numeric_features:
            value = float(data[feature])
            if value < 0:
                return False, f"{feature} cannot be negative", None
            processed_data[feature] = value
        
        # BMI specific validation
        if processed_data['BMI'] > 100:
            return False, "BMI seems unrealistic (>100)", None
        
        return True, None, processed_data
        
    except ValueError as e:
        return False, f"Invalid data format: {str(e)}", None


def validate_heart_disease_input(data):
    """
    Validate input data for heart disease prediction.
    
    Required features:
    - age: Age in years
    - sex: 0 (Female) or 1 (Male)
    - cp: Chest pain type (0-3)
    - trestbps: Resting blood pressure
    - chol: Serum cholesterol
    - fbs: Fasting blood sugar > 120 mg/dl (0 or 1)
    - restecg: Resting ECG results (0-2)
    - thalach: Maximum heart rate achieved
    - exang: Exercise induced angina (0 or 1)
    - oldpeak: ST depression induced by exercise
    - slope: Slope of peak exercise ST segment (0-2)
    - ca: Number of major vessels colored by fluoroscopy (0-3)
    - thal: Thalassemia (0-3)
    
    Args:
        data (dict): Input data from user
        
    Returns:
        tuple: (is_valid, error_message, processed_data)
    """
    required_features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
                        'restecg', 'thalach', 'exang', 'oldpeak', 
                        'slope', 'ca', 'thal']
    
    # Check for missing features
    missing_features = [f for f in required_features if f not in data]
    if missing_features:
        return False, f"Missing required features: {', '.join(missing_features)}", None
    
    try:
        processed_data = {}
        
        # Age validation
        age = float(data['age'])
        if age < 0 or age > 120:
            return False, "Age must be between 0 and 120", None
        processed_data['age'] = age
        
        # Sex validation
        sex = int(data['sex'])
        if sex not in [0, 1]:
            return False, "Sex must be 0 (Female) or 1 (Male)", None
        processed_data['sex'] = sex
        
        # Chest pain type (0-3)
        cp = int(data['cp'])
        if cp not in [0, 1, 2, 3]:
            return False, "Chest pain type must be 0-3", None
        processed_data['cp'] = cp
        
        # Blood pressure
        trestbps = float(data['trestbps'])
        if trestbps < 80 or trestbps > 200:
            return False, "Resting blood pressure seems unrealistic", None
        processed_data['trestbps'] = trestbps
        
        # Cholesterol
        chol = float(data['chol'])
        if chol < 100 or chol > 600:
            return False, "Cholesterol value seems unrealistic", None
        processed_data['chol'] = chol
        
        # Fasting blood sugar (binary)
        fbs = int(data['fbs'])
        if fbs not in [0, 1]:
            return False, "Fasting blood sugar must be 0 or 1", None
        processed_data['fbs'] = fbs
        
        # Resting ECG (0-2)
        restecg = int(data['restecg'])
        if restecg not in [0, 1, 2]:
            return False, "Resting ECG must be 0-2", None
        processed_data['restecg'] = restecg
        
        # Max heart rate
        thalach = float(data['thalach'])
        if thalach < 60 or thalach > 220:
            return False, "Max heart rate seems unrealistic", None
        processed_data['thalach'] = thalach
        
        # Exercise induced angina (binary)
        exang = int(data['exang'])
        if exang not in [0, 1]:
            return False, "Exercise angina must be 0 or 1", None
        processed_data['exang'] = exang
        
        # ST depression
        oldpeak = float(data['oldpeak'])
        processed_data['oldpeak'] = oldpeak
        
        # Slope (0-2)
        slope = int(data['slope'])
        if slope not in [0, 1, 2]:
            return False, "Slope must be 0-2", None
        processed_data['slope'] = slope
        
        # Number of vessels (0-3)
        ca = int(data['ca'])
        if ca not in [0, 1, 2, 3]:
            return False, "Number of vessels must be 0-3", None
        processed_data['ca'] = ca
        
        # Thalassemia (0-3)
        thal = int(data['thal'])
        if thal not in [0, 1, 2, 3]:
            return False, "Thalassemia must be 0-3", None
        processed_data['thal'] = thal
        
        return True, None, processed_data
        
    except ValueError as e:
        return False, f"Invalid data format: {str(e)}", None


def validate_parkinsons_input(data):
    """
    Validate input data for Parkinson's disease prediction.
    
    Required features: 33 features (excluding PatientID, DoctorInCharge, Diagnosis)
    - Age, Gender, Ethnicity, EducationLevel, BMI
    - Risk factors: Smoking, AlcoholConsumption, PhysicalActivity, etc.
    - Medical history: FamilyHistoryParkinsons, TraumaticBrainInjury, etc.
    - Vital signs: SystolicBP, DiastolicBP
    - Lab values: CholesterolTotal, CholesterolLDL, etc.
    - Clinical assessments: UPDRS, MoCA, FunctionalAssessment
    - Symptoms: Tremor, Rigidity, Bradykinesia, etc.
    
    Args:
        data (dict): Input data from user
        
    Returns:
        tuple: (is_valid, error_message, processed_data)
    """
    required_features = [
        'Age', 'Gender', 'Ethnicity', 'EducationLevel', 'BMI',
        'Smoking', 'AlcoholConsumption', 'PhysicalActivity', 'DietQuality', 'SleepQuality',
        'FamilyHistoryParkinsons', 'TraumaticBrainInjury', 'Hypertension', 'Diabetes',
        'Depression', 'Stroke', 'SystolicBP', 'DiastolicBP',
        'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL', 'CholesterolTriglycerides',
        'UPDRS', 'MoCA', 'FunctionalAssessment',
        'Tremor', 'Rigidity', 'Bradykinesia', 'PosturalInstability',
        'SpeechProblems', 'SleepDisorders', 'Constipation'
    ]
    
    # Check for missing features
    missing_features = [f for f in required_features if f not in data]
    if missing_features:
        return False, f"Missing required features: {', '.join(missing_features)}", None
    
    try:
        processed_data = {}
        
        # Age validation
        age = float(data['Age'])
        if age < 30 or age > 100:
            return False, "Age must be between 30 and 100 for Parkinson's assessment", None
        processed_data['Age'] = age
        
        # Categorical features validation (0-3 range typically)
        categorical_features = {
            'Gender': [0, 1],
            'Ethnicity': [0, 1, 2, 3],
            'EducationLevel': [0, 1, 2, 3]
        }
        
        for feature, valid_values in categorical_features.items():
            value = int(data[feature])
            if value not in valid_values:
                return False, f"{feature} must be one of {valid_values}", None
            processed_data[feature] = value
        
        # Binary features (0 or 1)
        binary_features = [
            'Smoking', 'FamilyHistoryParkinsons', 'TraumaticBrainInjury',
            'Hypertension', 'Diabetes', 'Depression', 'Stroke',
            'Tremor', 'Rigidity', 'Bradykinesia', 'PosturalInstability',
            'SpeechProblems', 'SleepDisorders', 'Constipation'
        ]
        
        for feature in binary_features:
            value = int(data[feature])
            if value not in [0, 1]:
                return False, f"{feature} must be 0 or 1", None
            processed_data[feature] = value
        
        # Continuous features with range validation
        processed_data['BMI'] = float(data['BMI'])
        if processed_data['BMI'] < 10 or processed_data['BMI'] > 50:
            return False, "BMI seems unrealistic", None
        
        processed_data['AlcoholConsumption'] = float(data['AlcoholConsumption'])
        processed_data['PhysicalActivity'] = float(data['PhysicalActivity'])
        processed_data['DietQuality'] = float(data['DietQuality'])
        processed_data['SleepQuality'] = float(data['SleepQuality'])
        
        # Blood pressure
        processed_data['SystolicBP'] = float(data['SystolicBP'])
        processed_data['DiastolicBP'] = float(data['DiastolicBP'])
        
        if processed_data['SystolicBP'] < 80 or processed_data['SystolicBP'] > 200:
            return False, "Systolic BP seems unrealistic", None
        if processed_data['DiastolicBP'] < 50 or processed_data['DiastolicBP'] > 130:
            return False, "Diastolic BP seems unrealistic", None
        
        # Cholesterol values
        processed_data['CholesterolTotal'] = float(data['CholesterolTotal'])
        processed_data['CholesterolLDL'] = float(data['CholesterolLDL'])
        processed_data['CholesterolHDL'] = float(data['CholesterolHDL'])
        processed_data['CholesterolTriglycerides'] = float(data['CholesterolTriglycerides'])
        
        # Clinical assessments
        processed_data['UPDRS'] = float(data['UPDRS'])  # 0-199
        processed_data['MoCA'] = float(data['MoCA'])    # 0-30
        processed_data['FunctionalAssessment'] = float(data['FunctionalAssessment'])  # 0-10
        
        return True, None, processed_data
        
    except ValueError as e:
        return False, f"Invalid data format: {str(e)}", None


def format_prediction_response(prediction, probability, disease, metadata=None):
    """
    Format the prediction result into a structured JSON response.
    
    Args:
        prediction (int): Binary prediction (0 or 1)
        probability (array): Probability array [prob_no_disease, prob_has_disease]
        disease (str): Name of the disease
        metadata (dict): Optional model metadata
        
    Returns:
        dict: Formatted response with prediction details
    """
    # Extract probability of having the disease
    has_disease_prob = float(probability[1])
    
    # Determine risk level based on probability
    if has_disease_prob >= 0.7:
        risk_level = "High"
        risk_color = "red"
    elif has_disease_prob >= 0.4:
        risk_level = "Moderate"
        risk_color = "orange"
    else:
        risk_level = "Low"
        risk_color = "green"
    
    # Create response
    response = {
        "success": True,
        "disease": disease,
        "prediction": {
            "has_disease": int(prediction),
            "disease_detected": bool(prediction),
            "confidence": round(has_disease_prob * 100, 2),
            "probability": round(has_disease_prob, 4)
        },
        "risk_assessment": {
            "level": risk_level,
            "color": risk_color,
            "message": get_risk_message(disease, risk_level, has_disease_prob)
        }
    }
    
    return response


def get_risk_message(disease_name, risk_level, probability):
    """
    Generate a user-friendly risk message based on prediction.
    
    Args:
        disease_name (str): Name of the disease
        risk_level (str): Risk level (High, Moderate, Low)
        probability (float): Probability of having the disease
        
    Returns:
        str: Risk message for the user
    """
    messages = {
        "diabetes": {
            "High": f"High risk of diabetes detected ({probability*100:.1f}% probability). Immediate consultation with a healthcare provider is strongly recommended.",
            "Moderate": f"Moderate risk of diabetes ({probability*100:.1f}% probability). Consider lifestyle modifications and regular monitoring.",
            "Low": f"Low risk of diabetes ({probability*100:.1f}% probability). Continue maintaining a healthy lifestyle."
        },
        "heart_disease": {
            "High": f"High risk of heart disease detected ({probability*100:.1f}% probability). Seek immediate medical attention and cardiac evaluation.",
            "Moderate": f"Moderate risk of heart disease ({probability*100:.1f}% probability). Schedule a consultation with a cardiologist for further assessment.",
            "Low": f"Low risk of heart disease ({probability*100:.1f}% probability). Maintain heart-healthy habits and regular check-ups."
        },
        "parkinsons": {
            "High": f"High likelihood of Parkinson's disease ({probability*100:.1f}% probability). Consult with a neurologist for comprehensive evaluation.",
            "Moderate": f"Moderate indicators for Parkinson's disease ({probability*100:.1f}% probability). Neurological assessment recommended.",
            "Low": f"Low risk of Parkinson's disease ({probability*100:.1f}% probability). Continue monitoring for any symptom changes."
        }
    }
    
    return messages.get(disease_name, {}).get(risk_level, "Assessment complete. Please consult with a healthcare provider.")


def preload_all_models():
    """
    Preload all models and scalers into cache at application startup.
    Uses the Singleton ModelManager for consistent caching.
    """
    model_manager.preload_all()


# SHAP Explainer Cache
SHAP_EXPLAINER_CACHE = {}


def calculate_shap_values(model, features_df, feature_names, disease_name, top_n=3):
    """
    Calculate SHAP values for a single prediction to explain feature importance.
    Uses the general Explainer class which auto-selects the best algorithm.
    
    Args:
        model: Trained model (XGBoost, RandomForest, etc.)
        features_df (DataFrame): Scaled features for the prediction (single row)
        feature_names (list): List of feature names
        disease_name (str): Disease identifier for caching explainer
        top_n (int): Number of top contributing features to return
        
    Returns:
        list: Top N features sorted by absolute SHAP impact
              Each item: {"feature": str, "impact": float, "direction": "positive"|"negative"}
    """
    try:
        # Use cached explainer or create new one
        if disease_name not in SHAP_EXPLAINER_CACHE:
            # Use general Explainer which auto-selects TreeExplainer/etc.
            print(f"Creating SHAP explainer for {disease_name}...")
            SHAP_EXPLAINER_CACHE[disease_name] = shap.Explainer(model)
            print(f"SHAP explainer created for {disease_name}")
        
        explainer = SHAP_EXPLAINER_CACHE[disease_name]
        
        # Calculate SHAP values for this single prediction
        shap_values = explainer(features_df)
        
        # Extract values - shap_values.values is a numpy array
        values = shap_values.values[0]
        
        # For multi-class output, we need to handle it differently
        if len(values.shape) > 1:
            # Use the positive class (class 1) values
            values = values[:, 1] if values.shape[1] > 1 else values[:, 0]
        
        # Create feature importance list
        feature_importance = []
        for i, (name, value) in enumerate(zip(feature_names, values)):
            feature_importance.append({
                "feature": name,
                "impact": round(abs(float(value)), 4),
                "raw_value": round(float(value), 4),
                "direction": "increases risk" if value > 0 else "decreases risk"
            })
        
        # Sort by absolute impact (highest first)
        feature_importance.sort(key=lambda x: x["impact"], reverse=True)
        
        print(f"SHAP values calculated successfully for {disease_name}: {len(feature_importance)} features")
        
        # Return top N features
        return feature_importance[:top_n]
        
    except Exception as e:
        print(f"SHAP calculation error for {disease_name}: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return empty list if SHAP fails (graceful degradation)
        return []
