# MediAssist API - Simple Guide

## Quick Start

1. **Run the API:**
   ```bash
   cd server
   python app.py
   ```
   API will run on `http://localhost:5000`
   Interactive Docs: `http://localhost:5000/docs`

2. **Test the API:**
   Visit `http://localhost:5000` in your browser

## API Endpoints

### 1. Health Check
```
GET /api/health
```

### 2. Predict Diabetes
```
POST /api/predict/diabetes
Content-Type: application/json

{
  "AGE": 45,
  "Gender": 1,
  "Urea": 35,
  "Cr": 1.2,
  "HbA1c": 7.5,
  "Chol": 220,
  "TG": 180,
  "HDL": 40,
  "LDL": 140,
  "VLDL": 36,
  "BMI": 32.5
}
```

### 3. Predict Heart Disease
```
POST /api/predict/heart-disease
Content-Type: application/json

{
  "age": 52,
  "sex": 1,
  "cp": 0,
  "trestbps": 125,
  "chol": 212,
  "fbs": 0,
  "restecg": 1,
  "thalach": 168,
  "exang": 0,
  "oldpeak": 1.0,
  "slope": 2,
  "ca": 2,
  "thal": 3
}
```

### 4. Predict Parkinson's Disease
```
POST /api/predict/parkinsons
Content-Type: application/json

{
  "Age": 65,
  "Gender": 1,
  "Ethnicity": 0,
  "EducationLevel": 2,
  "BMI": 26.5,
  "Smoking": 0,
  "AlcoholConsumption": 5,
  "PhysicalActivity": 3,
  "DietQuality": 7,
  "SleepQuality": 6,
  "FamilyHistoryParkinsons": 1,
  "TraumaticBrainInjury": 0,
  "Hypertension": 1,
  "Diabetes": 0,
  "Depression": 0,
  "Stroke": 0,
  "SystolicBP": 140,
  "DiastolicBP": 85,
  "CholesterolTotal": 220,
  "CholesterolLDL": 130,
  "CholesterolHDL": 45,
  "CholesterolTriglycerides": 180,
  "UPDRS": 45,
  "MoCA": 22,
  "FunctionalAssessment": 6,
  "Tremor": 1,
  "Rigidity": 1,
  "Bradykinesia": 1,
  "PosturalInstability": 0,
  "SpeechProblems": 0,
  "SleepDisorders": 1,
  "Constipation": 0
}
```

## Response Format

All prediction endpoints return:
```json
{
  "success": true,
  "disease": "diabetes",
  "prediction": {
    "has_disease": 1,
    "disease_detected": true,
    "confidence": 87.5,
    "probability": 0.875
  },
  "risk_assessment": {
    "level": "High",
    "color": "red",
    "message": "High risk detected. Please consult a doctor."
  }
}
```

## Files Structure

```
server/
├── app.py              # Main FastAPI app
├── helpers.py          # Validation & utilities
├── routes/
│   └── predictions.py  # API endpoints
├── models/             # Trained ML models
└── data/              # Datasets
```

That's it! Simple and functional.
