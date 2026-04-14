# MediAssist Client

This is the Next.js frontend for MediAssist.

## Run locally

```bash
cd client
npm install
npm run dev
```

Open http://localhost:3000

## What you will find here

- Home page with disease cards
- Diabetes, Heart Disease, and Parkinson's prediction forms
- Dashboard for prediction history
- Profile page for user details
- Login page for auth
- Server Actions under `client/actions/`

## Main env vars

Create a `.env.local` file in `client/` with values like:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

## Build

```bash
npm run build
```
