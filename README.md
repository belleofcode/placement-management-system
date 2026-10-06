# Placement Management System

MERN Stack FSD Mini Project.

## Structure

- frontend/ = React + Vite frontend
- backend/ = Node.js + Express + MongoDB backend

## Local setup

### Backend

cd backend
npm install

Create backend/.env from .env.example and add your MongoDB Atlas URI.

Run:
npm run dev

Backend:
http://localhost:5000

### Frontend

Open a second terminal:

cd frontend
npm install

Create frontend/.env:
VITE_API_URL=http://localhost:5000/api

Run:
npm run dev

Frontend:
http://localhost:5173

## Admin

After configuring backend/.env:

cd backend
npm run seed:admin

Default:
admin@placement.com
Admin@123

## GitHub

Push the complete root folder:
Placement-Management-System/

Do not commit .env files.

## Deployment

Recommended:
- Backend: Vercel serverless, Render, or Railway
- Frontend: Vercel

If deploying the backend on Vercel, create a root-level api/index.js that imports the backend app and add a Vercel configuration. For the simplest student deployment, deploying backend to Render/Railway and frontend to Vercel is recommended.

After backend deployment, set frontend VITE_API_URL to:
https://YOUR-BACKEND-DOMAIN/api

Set backend CLIENT_URL to:
https://YOUR-FRONTEND-DOMAIN
