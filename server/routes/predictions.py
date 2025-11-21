"""
Prediction Routes - Simple and Clean
"""

from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from helpers import (
    load_model,
    load_scaler,
    validate_diabetes_input,
    validate_heart_disease_input,
    validate_parkinsons_input,
    format_prediction_response
)

predictions_bp = Blueprint('predictions', __name__)


@predictions_bp.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "API is running"}), 200


@predictions_bp.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """Predict diabetes"""
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_message, processed_data = validate_diabetes_input(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_message}), 400
        
        # Load model and scaler
        model = load_model('diabetes')
        scaler = load_scaler('diabetes')
        
        # Feature order must match the training data exactly
        # Training data columns: Gender, AGE, Urea, Cr, HbA1c, Chol, TG, HDL, LDL, VLDL, BMI
        feature_order = ['Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 'Chol', 
                        'TG', 'HDL', 'LDL', 'VLDL', 'BMI']
        features = pd.DataFrame([[processed_data[f] for f in feature_order]], columns=feature_order)
        
        # Scale the features
        if scaler is not None:
            features = pd.DataFrame(scaler.transform(features), columns=feature_order)
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        response = format_prediction_response(prediction, probability, 'diabetes')
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@predictions_bp.route('/api/predict/heart-disease', methods=['POST'])
def predict_heart_disease():
    """Predict heart disease"""
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_message, processed_data = validate_heart_disease_input(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_message}), 400
        
        # Load model and scaler
        model = load_model('heart_disease')
        scaler = load_scaler('heart_disease')
        
        feature_order = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
                        'restecg', 'thalach', 'exang', 'oldpeak', 
                        'slope', 'ca', 'thal']
        features = pd.DataFrame([[processed_data[f] for f in feature_order]], columns=feature_order)
        
        # Scale the features
        if scaler is not None:
            features = pd.DataFrame(scaler.transform(features), columns=feature_order)
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        response = format_prediction_response(prediction, probability, 'heart_disease')
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@predictions_bp.route('/api/predict/parkinsons', methods=['POST'])
def predict_parkinsons():
    """Predict Parkinson's disease"""
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_message, processed_data = validate_parkinsons_input(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_message}), 400
        
        # Load model and scaler
        model = load_model('parkinsons')
        scaler = load_scaler('parkinsons')
        
        feature_order = [
            'Age', 'Gender', 'Ethnicity', 'EducationLevel', 'BMI',
            'Smoking', 'AlcoholConsumption', 'PhysicalActivity', 'DietQuality', 'SleepQuality',
            'FamilyHistoryParkinsons', 'TraumaticBrainInjury', 'Hypertension', 'Diabetes',
            'Depression', 'Stroke', 'SystolicBP', 'DiastolicBP',
            'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL', 'CholesterolTriglycerides',
            'UPDRS', 'MoCA', 'FunctionalAssessment',
            'Tremor', 'Rigidity', 'Bradykinesia', 'PosturalInstability',
            'SpeechProblems', 'SleepDisorders', 'Constipation'
        ]
        features = pd.DataFrame([[processed_data[f] for f in feature_order]], columns=feature_order)
        
        # Scale the features
        if scaler is not None:
            features = pd.DataFrame(scaler.transform(features), columns=feature_order)
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        response = format_prediction_response(prediction, probability, 'parkinsons')
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
