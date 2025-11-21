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
| ----------------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| **Random Forest** | **1.0000** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| XGBoost                 | 0.9950           | 0.9944           | 1.0000           | 0.9972           | 1.0000           |
| Decision Tree           | 0.9950           | 0.9944           | 1.0000           | 0.9972           | 0.9750           |
| Logistic Regression     | 0.9749           | 0.9888           | 0.9832           | 0.9860           | 0.9941           |
| SVM                     | 0.9648           | 0.9674           | 0.9944           | 0.9807           | 0.9969           |

### 2. Heart Disease Prediction

* **Dataset**: [Kaggle - Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
* **Split**: 80% Training / 20% Testing
* **Selected Model**: **XGBoost** (Best Performer)

| Model               | Accuracy         | Precision        | Recall           | F1 Score         | ROC AUC          |
| ------------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| **XGBoost**   | **1.0000** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Random Forest       | 0.9902           | 1.0000           | 0.9810           | 0.9904           | 1.0000           |
| Decision Tree       | 0.9561           | 0.9800           | 0.9333           | 0.9561           | 0.9835           |
| SVM                 | 0.9268           | 0.9167           | 0.9429           | 0.9296           | 0.9771           |
| Logistic Regression | 0.8098           | 0.7619           | 0.9143           | 0.8312           | 0.9298           |

### 3. Parkinson's Disease Prediction

* **Dataset**: [Parkinsons Disease Clinical Factors](https://www.opendatabay.com/data/healthcare/df6ac731-2885-4b5e-b370-e3cf1d89d1d5)
* **Split**: 80% Training / 20% Testing
* **Selected Model**: **XGBoost** (Best Performer)

| Model               | Accuracy         | Precision        | Recall           | F1 Score         | ROC AUC          |
| ------------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| **XGBoost**   | **0.9477** | **0.9509** | **0.9655** | **0.9582** | **0.9714** |
| Random Forest       | 0.9264           | 0.9389           | 0.9425           | 0.9407           | 0.9684           |
| Decision Tree       | 0.9050           | 0.9510           | 0.8927           | 0.9209           | 0.9257           |
| SVM                 | 0.8409           | 0.8489           | 0.9042           | 0.8757           | 0.9136           |
| Logistic Regression | 0.8052           | 0.8303           | 0.8621           | 0.8459           | 0.8980           |

*Note: All metrics are calculated on the held-out test set (20% of data) that was never seen during training.*

## Technology Stack

**Frontend (Client)**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Visualization**: Recharts

**Backend (Server)**

- **Framework**: Flask
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

The API will run on `http://localhost:5000`.

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
- **server/**: Contains the Flask backend application.

  - **models/**: Serialized machine learning models (.pkl files).
  - **routes/**: API endpoints for predictions.
  - **data/**: Datasets used for training (if applicable).

## Disclaimer

**MediAssist is an educational tool and is not intended to replace professional medical advice, diagnosis, or treatment.** The predictions provided by this application are based on statistical models and should be used for informational purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
