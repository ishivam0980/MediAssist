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
