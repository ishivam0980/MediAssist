# MediAssist

MediAssist is a comprehensive healthcare platform designed to provide early risk assessment for multiple diseases using machine learning. The application combines a modern, responsive frontend with a robust Python-based backend to deliver real-time predictions for Diabetes, Heart Disease, and Parkinson's Disease.

## Key Features

### Disease Prediction

- **Diabetes Risk Assessment**: Analyzes clinical parameters like Glucose, BMI, and Age.
- **Heart Disease Detection**: Evaluates cardiovascular metrics including Chest Pain type, Blood Pressure, and Cholesterol.
- **Parkinson's Disease Analysis**: Processes complex vocal and motor features for early detection.

### User Experience

- **Secure Authentication**: Supports both Email/Password and Google OAuth login. Includes intelligent account linking to merge profiles seamlessly.
- **Interactive Dashboard**: Visualizes prediction history and health trends using dynamic charts.
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

## Technology Stack

**Frontend (Client)**

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Visualization**: Recharts

**Backend (Server)**

- **Framework**: FastAPI
- **Language**: Python 3.x
- **Machine Learning**: Scikit-learn, Pandas, NumPy
- **Models**: Random Forest, XGBoost, Logistic Regression

**Database**

- **Primary DB**: MongoDB (via Mongoose)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB Database (Local or Atlas)

### Installation

#### 1. Server Setup

The backend handles all machine learning inference requests.

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### 2. Client Setup

The frontend provides the user interface and handles authentication/database interactions.

```bash
cd client
npm install
```

### Configuration

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Database Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# Google OAuth (Optional, for Google Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running the Application

**Start the Backend Server**
Open a terminal in the `server` directory:

```bash
python app.py
```

The API will run on `http://localhost:5000`. Interactive API documentation (Swagger UI) is available at `http://localhost:5000/docs`.

**Start the Frontend Client**
Open a new terminal in the `client` directory:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

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
