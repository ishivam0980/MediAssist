# MediAssist 🏥

**MediAssist** is an AI-powered healthcare platform that provides early risk assessment for Diabetes, Heart Disease, and Parkinson's Disease using machine learning models.

## 🚀 Project Structure

The project is divided into two parts:

- **`/client`**: A modern frontend built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.
- **`/server`**: A backend API built with **Flask** (Python) that serves the machine learning models.

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)

## 📦 Installation & Setup

### 1. Backend Setup (Server)

Navigate to the server directory and set up the Python environment:

```bash
cd server

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup (Client)

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

## 🏃‍♂️ Running the Application

### Step 1: Start the Backend API

In your **server** terminal (with venv activated):

```bash
python app.py
```
The API will start at `http://localhost:5000`.

### Step 2: Start the Frontend

In your **client** terminal:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🧠 Machine Learning Models

The application uses the following models trained on public medical datasets:

- **Diabetes**: Logistic Regression / Random Forest
- **Heart Disease**: Random Forest
- **Parkinson's**: XGBoost

## 📄 License

This project is for educational purposes only.
