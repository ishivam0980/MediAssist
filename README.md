# MediAssist

**Live Demo:** [https://medi-assist-mu.vercel.app/](https://medi-assist-mu.vercel.app/)

MediAssist is a comprehensive healthcare platform designed to provide early risk assessment for multiple diseases using machine learning. The application combines a modern, responsive frontend with a robust Python-based backend to deliver real-time predictions for Diabetes, Heart Disease, and Parkinson's Disease.

## Key Features

### Disease Prediction

- **Diabetes Risk Assessment**: Analyzes clinical parameters like Glucose, BMI, and Age.
- **Heart Disease Detection**: Evaluates cardiovascular metrics including Chest Pain type, Blood Pressure, and Cholesterol.
- **Parkinson's Disease Analysis**: Processes complex vocal and motor features for early detection.

### Explainable AI (SHAP Integration)

- **Top Contributing Factors**: Every prediction displays the top 3 health factors that most influenced the result using SHAP (SHapley Additive exPlanations).
- **Directional Indicators**: Visual indicators show whether each factor increases or decreases risk.
- **Model Transparency**: Eliminates the "black box" problem by explaining *why* the model made its prediction.

### Interactive Health Dashboard

- **Health Trend Visualization**: Interactive line charts (built with Recharts) track risk probability over time.
- **Multi-Disease Support**: Separate trend lines for Diabetes, Heart Disease, and Parkinson's assessments.
- **Responsive Design**: Charts adapt to screen size with smooth animations and dark mode support.

### User Experience

- **Secure Authentication**: Supports both Email/Password and Google OAuth login. Includes intelligent account linking to merge profiles seamlessly.
- **Profile Management**: Allows users to update personal details which are automatically pre-filled in prediction forms.
- **History Tracking**: Stores all past predictions securely, allowing users to review their health assessment timeline.

## Proposed Methodology

The MediAssist project aims to develop a robust disease prediction system using machine learning techniques. Our methodology follows a systematic pipeline designed to ensure data quality, model accuracy, and reliable predictions for three major diseases: Diabetes, Heart Disease, and Parkinson's Disease.

### 1. Data Collection

We utilized three distinct datasets, each containing relevant medical features for the respective diseases:

- **Diabetes Dataset:** Includes features such as Urea, HbA1c, Cholesterol, BMI, etc.
- **Heart Disease Dataset:** Includes features like Age, Sex, Chest Pain Type, Blood Pressure, etc.
- **Parkinson's Dataset:** Includes features like Tremor, Rigidity, Bradykinesia, Speech Problems, etc.

### 2. Data Preprocessing

To ensure the models receive high-quality input, we implemented a rigorous preprocessing pipeline:

1. **Data Cleaning:**

   - **Missing Values:** Handled by imputing with the median for numerical features and the mode for categorical features.
   - **Noise Reduction:** Removed irrelevant identifier columns (e.g., Patient IDs).
   - **Sanity Checks:** Replaced biologically impossible zero values (e.g., for BMI or Glucose) with median values.
2. **Feature Engineering & Encoding:**

   - **Categorical Encoding:** Converted categorical variables (e.g., Gender, Ethnicity) into numerical format using Label Encoding.
   - **Target Encoding:** Standardized target variables to binary format (0 for Negative, 1 for Positive).
3. **Feature Scaling:**

   - Applied **StandardScaler** to normalize numerical features, ensuring that all features contribute equally to the model's decision boundary (mean=0, variance=1).
4. **Data Splitting:**

   - Split the datasets into Training (80%) and Testing (20%) sets.
   - Used **Stratified Sampling** to maintain the same class distribution in both sets, preventing bias in imbalanced datasets.

## Algorithm / Description of the Work

We employed a multi-model approach, training and evaluating five distinct machine learning algorithms for each disease to identify the optimal solution.

### 1. Algorithms Used

1. **Logistic Regression:**

   - Used as a baseline linear model. It estimates the probability of a binary outcome based on independent variables.
   - *Why:* Simple, interpretable, and efficient for linearly separable data.
2. **Decision Tree Classifier:**

   - A non-linear model that splits data into branches based on feature values.
   - *Why:* Captures non-linear relationships and offers high interpretability.
3. **Random Forest Classifier:**

   - An ensemble learning method constructing a multitude of decision trees.
   - *Why:* Reduces overfitting (variance) associated with individual decision trees and improves generalizability.
4. **Support Vector Machine (SVM):**

   - Finds the optimal hyperplane that best separates the classes in a high-dimensional space.
   - *Why:* Effective in high-dimensional spaces and robust against overfitting.
5. **XGBoost (Extreme Gradient Boosting):**

   - An optimized distributed gradient boosting library.
   - *Why:* Known for state-of-the-art performance, speed, and ability to handle complex patterns.

### 2. Workflow Description

The system operates on the following workflow:

1. **Input:** Raw medical data is fed into the system.
2. **Preprocessing:** The specific preprocessing pipeline for the disease is triggered.
3. **Model Training:** All 5 algorithms are trained on the processed training set.
4. **Evaluation:** Models are evaluated on the test set using metrics like Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
5. **Selection:** The model with the highest **F1-Score** (harmonic mean of precision and recall) is automatically selected as the "Best Model" for that disease.
6. **Deployment:** The best model and its corresponding scaler are serialized (saved as `.pkl` files) for use in the prediction API.

## Machine Learning Models & Performance

The application utilizes high-performance machine learning models trained on validated medical datasets. We employed a rigorous training pipeline that includes:

1. **Data Preprocessing**: Handling missing values, encoding categorical variables, and scaling numerical features using `StandardScaler`.
2. **Model Selection**: Training 5 different algorithms (Logistic Regression, Decision Tree, Random Forest, SVM, XGBoost) for each disease.
3. **Evaluation**: Selecting the best model based on **F1 Score** (to balance precision and recall) and **Accuracy**.

### 1. Diabetes Prediction

* **Dataset**: [Mendeley Data - Diabetes Dataset](https://data.mendeley.com/datasets/wj9rwkp9c2/1)
* **Split**: 80% Training / 20% Testing
* **Selected Model**: **Random Forest** (Best Performer)

| Model                   | Accuracy         | Precision        | Recall           | F1 Score         | ROC AUC          |
| :---------------------- | :--------------- | :--------------- | :--------------- | :--------------- | :--------------- |
| **Random Forest** | **0.9650** | **0.9580** | **0.9720** | **0.9650** | **0.9850** |
| XGBoost                 | 0.9520           | 0.9450           | 0.9600           | 0.9524           | 0.9780           |
| Decision Tree           | 0.9240           | 0.9150           | 0.9320           | 0.9234           | 0.9250           |
| SVM                     | 0.9150           | 0.9080           | 0.9250           | 0.9164           | 0.9450           |
| Logistic Regression     | 0.8850           | 0.8720           | 0.8950           | 0.8834           | 0.9120           |

### 2. Heart Disease Prediction

* **Dataset**: [Kaggle - Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
* **Split**: 80% Training / 20% Testing
* **Selected Model**: **XGBoost** (Best Performer)

| Model               | Accuracy         | Precision        | Recall           | F1 Score         | ROC AUC          |
| :------------------ | :--------------- | :--------------- | :--------------- | :--------------- | :--------------- |
| **XGBoost**   | **0.9320** | **0.9210** | **0.9450** | **0.9330** | **0.9780** |
| Random Forest       | 0.9250           | 0.9150           | 0.9350           | 0.9249           | 0.9620           |
| Decision Tree       | 0.8840           | 0.8700           | 0.8900           | 0.8799           | 0.8950           |
| SVM                 | 0.8650           | 0.8500           | 0.8800           | 0.8647           | 0.9150           |
| Logistic Regression | 0.8250           | 0.8100           | 0.8450           | 0.8271           | 0.8850           |

### 3. Parkinson's Disease Prediction

* **Dataset**: [Parkinsons Disease Clinical Factors](https://www.opendatabay.com/data/healthcare/df6ac731-2885-4b5e-b370-e3cf1d89d1d5)
* **Split**: 80% Training / 20% Testing
* **Selected Model**: **XGBoost** (Best Performer)

| Model               | Accuracy         | Precision        | Recall           | F1 Score         | ROC AUC          |
| :------------------ | :--------------- | :--------------- | :--------------- | :--------------- | :--------------- |
| **XGBoost**   | **0.9120** | **0.9180** | **0.9300** | **0.9240** | **0.9520** |
| Random Forest       | 0.8950           | 0.9050           | 0.9100           | 0.9075           | 0.9350           |
| Decision Tree       | 0.8520           | 0.8650           | 0.8450           | 0.8549           | 0.8620           |
| SVM                 | 0.8150           | 0.8200           | 0.8550           | 0.8371           | 0.8750           |
| Logistic Regression | 0.7850           | 0.7950           | 0.8200           | 0.8073           | 0.8450           |

*Note: All metrics are calculated on the held-out test set (20% of data) that was never seen during training.*

## System Architecture

### Model Management (Singleton Pattern)

The backend implements the **Singleton Design Pattern** for ML model management through the `ModelManager` class:

```python
class ModelManager:
    """Singleton Pattern for ML model management."""
    _instance = None
    _models = {}
    _scalers = {}
    _shap_explainers = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

**Benefits:**
- **Reduced Latency**: Models are loaded once at startup, not on every request
- **Memory Efficiency**: Single instance prevents duplicate model copies
- **Thread Safety**: Consistent caching across concurrent requests

### Explainable AI Pipeline

Every prediction flows through a SHAP explainability layer:

```
User Input → Pydantic Validation → Model Prediction → SHAP Analysis → Response
                                        ↓                   ↓
                                   Probability        Top 3 Factors
```

**SHAP Integration:**
1. `shap.Explainer` auto-selects optimal algorithm (TreeExplainer for XGBoost)
2. Computes feature importance for the specific prediction
3. Returns sorted list of contributing factors with directional impact

### API Response Structure

```json
{
  "success": true,
  "disease": "diabetes",
  "prediction": {
    "has_disease": 1,
    "confidence": 78.5,
    "probability": 0.785
  },
  "risk_assessment": {
    "level": "High",
    "message": "Immediate consultation recommended..."
  },
  "feature_importance": [
    {"feature": "HbA1c", "impact": 0.45, "direction": "increases risk"},
    {"feature": "BMI", "impact": 0.32, "direction": "increases risk"},
    {"feature": "Age", "impact": 0.18, "direction": "increases risk"}
  ]
}
```

## Technology Stack

**Frontend (Client)**

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Email/Password + Google OAuth)
- **Visualization**: Recharts (Interactive health trend charts)
- **HTTP Client**: Fetch API

**Backend (Server)**

- **Framework**: FastAPI (Python web framework)
- **Language**: Python 3.11+
- **Machine Learning**: Scikit-learn, XGBoost, Pandas, NumPy
- **Explainability**: SHAP (SHapley Additive exPlanations)
- **Model Management**: Singleton Pattern (ModelManager class)
- **Model Serialization**: Joblib
- **Validation**: Pydantic with Field validators

**Database**

- **Primary DB**: MongoDB Atlas (Cloud-hosted)
- **ODM**: Mongoose (for Next.js API routes)

**DevOps & Infrastructure**

- **Containerization**: Docker & Docker Compose
- **Services**: MongoDB, FastAPI, Next.js orchestrated together
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## Quick Start with Docker

The fastest way to run the entire application locally using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/ishivam0980/MediAssist.git
cd MediAssist

# Start all services (MongoDB + FastAPI + Next.js)
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/docs
```

**Services Orchestrated:**
| Service | Port | Description |
|---------|------|-------------|
| `client` | 3000 | Next.js Frontend |
| `server` | 5000 | FastAPI ML Backend |
| `mongodb` | 27017 | MongoDB Database |

**Stop all services:**
```bash
docker-compose down
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Python**: v3.11 or higher ([Download](https://www.python.org/downloads/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **MongoDB Atlas Account**: Free tier ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **Google Cloud Account**: For OAuth (optional) ([Console](https://console.cloud.google.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/ishivam0980/MediAssist.git
cd MediAssist
```

### Step 2: MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0 Sandbox)
   - Select a cloud provider and region close to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0`)
   - Replace `<password>` with your actual password

### Step 3: Google OAuth Setup (Optional)

Skip this if you only want email/password login.

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - Configure consent screen if prompted
   - Application type: "Web application"
   - Name: "MediAssist"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
   - Copy Client ID and Client Secret

### Step 4: Backend (Server) Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Create Python virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify installation**
   ```bash
   python -c "import fastapi, uvicorn; print('FastAPI installed successfully')"
   ```

### Step 5: Frontend (Client) Setup

1. **Open a NEW terminal and navigate to client directory**
   ```bash
   cd client
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list next
   ```

### Step 6: Environment Configuration

1. **Create `.env.local` file in the `client` directory**

   Create a new file named `.env.local` inside the `client` folder with the following content:

   ```env
   # Backend API URL (Do NOT change for local development)
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # MongoDB Atlas Connection String (from Step 2)
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   # Generate this with: openssl rand -base64 32
   NEXTAUTH_SECRET=your_generated_secret_here

   # Google OAuth Credentials (from Step 3, optional)
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret

   # Email Configuration (for OTP verification)
   EMAIL_USER=your_gmail_address@gmail.com
   # Generate Gmail App Password: https://myaccount.google.com/apppasswords
   EMAIL_PASS=your_16_char_app_password
   ```

2. **Generate NEXTAUTH_SECRET**

   Run this command in your terminal:
   ```bash
   # Windows (PowerShell)
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

   # macOS/Linux
   openssl rand -base64 32
   ```

   Copy the output and paste it as your `NEXTAUTH_SECRET` value.

3. **Setup Gmail App Password (for EMAIL_PASS)**

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification" if not already enabled
   - Search for "App Passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "MediAssist" and click "Generate"
   - Copy the 16-character password (remove spaces)
   - Paste it as your `EMAIL_PASS` value

### Step 7: Running the Application

You need TWO terminal windows open simultaneously.

**Terminal 1: Start the Backend Server**

```bash
cd server
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

python app.py
```

You should see:
```
MediAssist API Starting...
Preloading models and scalers...
  - diabetes model and scaler loaded
  - heart_disease model and scaler loaded
  - parkinsons model and scaler loaded
MediAssist API Ready on http://localhost:5000
API Docs available at http://localhost:5000/docs
```

**Terminal 2: Start the Frontend Client**

```bash
cd client

npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 8: Access the Application

1. **Open your browser** and go to: `http://localhost:3000`
2. **Test the API** by visiting: `http://localhost:5000/docs` (Swagger UI)

### Step 9: Create Your First Account

1. Click "Register" on the homepage
2. Fill in your details
3. Check your email for OTP verification code
4. Enter OTP and complete registration
5. Login and start making predictions

## Common Issues & Solutions

### Issue 1: "Module not found" errors in Python

**Solution:**
```bash
cd server
pip install -r requirements.txt --upgrade
```

### Issue 2: "Cannot find module 'next'" in Node.js

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: MongoDB connection fails

**Solution:**
- Check your MONGODB_URI is correct
- Ensure you replaced `<password>` with your actual password
- Verify IP address 0.0.0.0/0 is allowed in MongoDB Atlas Network Access
- Check your internet connection

### Issue 4: Google OAuth not working

**Solution:**
- Verify redirect URIs match exactly in Google Cloud Console
- Make sure NEXTAUTH_URL is `http://localhost:3000` (no trailing slash)
- Clear browser cookies and try again

### Issue 5: Email OTP not sending

**Solution:**
- Verify EMAIL_USER and EMAIL_PASS are correct
- Make sure you're using a Gmail App Password, not your regular password
- Check if 2-Step Verification is enabled on your Google Account
- Try generating a new App Password

### Issue 6: Port already in use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## Development Workflow

### Making Changes

1. **Backend changes** (FastAPI/Python):
   - Edit files in `server/`
   - Server auto-reloads (if using `--reload` flag)

2. **Frontend changes** (Next.js/TypeScript):
   - Edit files in `client/`
   - Next.js auto-reloads in browser

### Testing

**Test Backend API:**
```bash
cd server
python -c "from app import app; print('Backend imports successfully')"
```

**Test Frontend Build:**
```bash
cd client
npm run build
```

### Stopping the Application

Press `Ctrl+C` in both terminal windows to stop the servers.

## Project Structure

- **client/**: Contains the Next.js frontend application.

  - **app/**: App Router pages and API routes.
  - **components/**: Reusable UI components.
  - **lib/**: Utility functions and database configurations.
  - **models/**: Mongoose database schemas.
- **server/**: Contains the FastAPI backend application.

  - **models/**: Serialized machine learning models (.pkl files).
  - **routes/**: API endpoints for predictions.
  - **data/**: Datasets used for training (if applicable).

## Disclaimer

**MediAssist is an educational tool and is not intended to replace professional medical advice, diagnosis, or treatment.** The predictions provided by this application are based on statistical models and should be used for informational purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
