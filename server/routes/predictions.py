"""
Prediction Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import numpy as np
import pandas as pd
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from helpers import (
    load_model,
    load_scaler,
    validate_diabetes_input,
    validate_heart_disease_input,
    validate_parkinsons_input,
    format_prediction_response
)

router = APIRouter()


# Pydantic Models for Request Validation

class DiabetesInput(BaseModel):
    """Input schema for diabetes prediction"""
    Gender: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    AGE: float = Field(..., ge=0, le=120, description="Age in years")
    Urea: float = Field(..., ge=0, description="Blood urea level")
    Cr: float = Field(..., ge=0, description="Creatinine ratio")
    HbA1c: float = Field(..., ge=0, description="Glycated hemoglobin level")
    Chol: float = Field(..., ge=0, description="Total cholesterol")
    TG: float = Field(..., ge=0, description="Triglycerides")
    HDL: float = Field(..., ge=0, description="High-density lipoprotein")
    LDL: float = Field(..., ge=0, description="Low-density lipoprotein")
    VLDL: float = Field(..., ge=0, description="Very low-density lipoprotein")
    BMI: float = Field(..., ge=0, le=100, description="Body Mass Index")

    class Config:
        json_schema_extra = {
            "example": {
                "Gender": 1,
                "AGE": 45,
                "Urea": 32,
                "Cr": 0.9,
                "HbA1c": 6.5,
                "Chol": 200,
                "TG": 150,
                "HDL": 50,
                "LDL": 120,
                "VLDL": 30,
                "BMI": 28.5
            }
        }


class HeartDiseaseInput(BaseModel):
    """Input schema for heart disease prediction"""
    age: float = Field(..., ge=0, le=120, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    trestbps: float = Field(..., ge=80, le=200, description="Resting blood pressure")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: float = Field(..., ge=60, le=220, description="Maximum heart rate achieved")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina")
    oldpeak: float = Field(..., description="ST depression induced by exercise")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment")
    ca: int = Field(..., ge=0, le=3, description="Number of major vessels (0-3)")
    thal: int = Field(..., ge=0, le=3, description="Thalassemia (0-3)")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 55,
                "sex": 1,
                "cp": 2,
                "trestbps": 130,
                "chol": 250,
                "fbs": 0,
                "restecg": 1,
                "thalach": 150,
                "exang": 0,
                "oldpeak": 1.5,
                "slope": 1,
                "ca": 0,
                "thal": 2
            }
        }


class ParkinsonsInput(BaseModel):
    """Input schema for Parkinson's disease prediction"""
    Age: float = Field(..., ge=30, le=100, description="Age in years")
    Gender: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    Ethnicity: int = Field(..., ge=0, le=3, description="Ethnicity (0-3)")
    EducationLevel: int = Field(..., ge=0, le=3, description="Education level (0-3)")
    BMI: float = Field(..., ge=10, le=50, description="Body Mass Index")
    Smoking: int = Field(..., ge=0, le=1, description="Smoking status")
    AlcoholConsumption: float = Field(..., ge=0, description="Alcohol consumption level")
    PhysicalActivity: float = Field(..., ge=0, description="Physical activity level")
    DietQuality: float = Field(..., ge=0, description="Diet quality score")
    SleepQuality: float = Field(..., ge=0, description="Sleep quality score")
    FamilyHistoryParkinsons: int = Field(..., ge=0, le=1, description="Family history of Parkinson's")
    TraumaticBrainInjury: int = Field(..., ge=0, le=1, description="History of traumatic brain injury")
    Hypertension: int = Field(..., ge=0, le=1, description="Hypertension status")
    Diabetes: int = Field(..., ge=0, le=1, description="Diabetes status")
    Depression: int = Field(..., ge=0, le=1, description="Depression status")
    Stroke: int = Field(..., ge=0, le=1, description="History of stroke")
    SystolicBP: float = Field(..., ge=80, le=200, description="Systolic blood pressure")
    DiastolicBP: float = Field(..., ge=50, le=130, description="Diastolic blood pressure")
    CholesterolTotal: float = Field(..., ge=0, description="Total cholesterol")
    CholesterolLDL: float = Field(..., ge=0, description="LDL cholesterol")
    CholesterolHDL: float = Field(..., ge=0, description="HDL cholesterol")
    CholesterolTriglycerides: float = Field(..., ge=0, description="Triglycerides")
    UPDRS: float = Field(..., ge=0, description="UPDRS score (0-199)")
    MoCA: float = Field(..., ge=0, le=30, description="MoCA score (0-30)")
    FunctionalAssessment: float = Field(..., ge=0, le=10, description="Functional assessment score")
    Tremor: int = Field(..., ge=0, le=1, description="Presence of tremor")
    Rigidity: int = Field(..., ge=0, le=1, description="Presence of rigidity")
    Bradykinesia: int = Field(..., ge=0, le=1, description="Presence of bradykinesia")
    PosturalInstability: int = Field(..., ge=0, le=1, description="Postural instability")
    SpeechProblems: int = Field(..., ge=0, le=1, description="Speech problems")
    SleepDisorders: int = Field(..., ge=0, le=1, description="Sleep disorders")
    Constipation: int = Field(..., ge=0, le=1, description="Constipation")

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 65,
                "Gender": 1,
                "Ethnicity": 0,
                "EducationLevel": 2,
                "BMI": 25.5,
                "Smoking": 0,
                "AlcoholConsumption": 2.5,
                "PhysicalActivity": 5.0,
                "DietQuality": 7.0,
                "SleepQuality": 6.5,
                "FamilyHistoryParkinsons": 0,
                "TraumaticBrainInjury": 0,
                "Hypertension": 1,
                "Diabetes": 0,
                "Depression": 0,
                "Stroke": 0,
                "SystolicBP": 130,
                "DiastolicBP": 85,
                "CholesterolTotal": 200,
                "CholesterolLDL": 120,
                "CholesterolHDL": 55,
                "CholesterolTriglycerides": 150,
                "UPDRS": 25,
                "MoCA": 26,
                "FunctionalAssessment": 7.5,
                "Tremor": 1,
                "Rigidity": 0,
                "Bradykinesia": 1,
                "PosturalInstability": 0,
                "SpeechProblems": 0,
                "SleepDisorders": 1,
                "Constipation": 0
            }
        }


# API Endpoints

@router.get('/api/health')
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is running"}


@router.post('/api/predict/diabetes')
def predict_diabetes(data: DiabetesInput):
    """Predict diabetes based on input features"""
    try:
        # Convert Pydantic model to dict
        input_data = data.model_dump()
        
        # Validate input (additional validation)
        is_valid, error_message, processed_data = validate_diabetes_input(input_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
        # Load model and scaler
        model = load_model('diabetes')
        scaler = load_scaler('diabetes')
        
        # Feature order must match the training data exactly
        feature_order = ['Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 'Chol', 
                        'TG', 'HDL', 'LDL', 'VLDL', 'BMI']
        features = pd.DataFrame([[processed_data[f] for f in feature_order]], columns=feature_order)
        
        # Scale the features
        if scaler is not None:
            features = pd.DataFrame(scaler.transform(features), columns=feature_order)
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        response = format_prediction_response(prediction, probability, 'diabetes')
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/predict/heart-disease')
def predict_heart_disease(data: HeartDiseaseInput):
    """Predict heart disease based on input features"""
    try:
        # Convert Pydantic model to dict
        input_data = data.model_dump()
        
        # Validate input
        is_valid, error_message, processed_data = validate_heart_disease_input(input_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
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
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/api/predict/parkinsons')
def predict_parkinsons(data: ParkinsonsInput):
    """Predict Parkinson's disease based on input features"""
    try:
        # Convert Pydantic model to dict
        input_data = data.model_dump()
        
        # Validate input
        is_valid, error_message, processed_data = validate_parkinsons_input(input_data)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
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
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
