# MediAssist

MediAssist is a health risk prediction app. A user fills out a form for Diabetes, Heart Disease, or Parkinson's, and the app returns a machine learning based result in simple language.

Live demo: https://medi-assist-mu.vercel.app/

## What it does

- Predicts risk for 3 diseases
- Shows a short explanation with the result
- Saves history for logged-in users
- Lets users update profile details
- Keeps local history for guest users

## How it works

- Frontend: Next.js app
- Server Actions: handle prediction, history, and profile flows
- Backend: Python FastAPI service for ML inference
- Database: MongoDB for users, OTP, and prediction history
- Explainability: SHAP shows the main factors behind each result

## Main flow

1. User fills out a form
2. The request goes to a Server Action
3. The Server Action calls the Python backend
4. The model returns a prediction
5. Logged-in users get the result saved in MongoDB
6. The UI shows the result and top factors

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- NextAuth
- FastAPI
- scikit-learn
- XGBoost
- SHAP
- MongoDB
- Docker

## Run locally

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
pip install -r requirements.txt
python app.py
```

### Full app with Docker

```bash
docker-compose up --build
```

## Important routes

- `/` home
- `/diabetes` diabetes prediction form
- `/heart-disease` heart disease prediction form
- `/parkinsons` Parkinson's prediction form
- `/dashboard` prediction history
- `/profile` user profile
- `/login` sign in

## Folder snapshot

- `client/` Next.js frontend
- `client/actions/` server actions
- `client/app/` pages and app routes
- `server/` FastAPI ML backend
- `server/models/` trained model files
- `server/data/` raw and processed datasets
