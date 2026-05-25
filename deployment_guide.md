# AgriPulse Deployment Guide

This guide explains how to deploy the **AgriPulse** platform to production.

## Prerequisites
- [Docker](https://www.docker.com/) installed (for containerized deployment).
- [Node.js](https://nodejs.org/) and [Python 3.11+](https://www.python.org/) (for manual deployment).

---

## Option 1: Docker Deployment (Recommended)
This is the most reliable way to deploy as it packages both the frontend and backend together.

1. **Build the image**:
   ```bash
   docker build -t agripulse .
   ```
2. **Run the container**:
   ```bash
   docker run -p 8000:8000 agripulse
   ```
3. **Access the site**: Open `http://localhost:8000` in your browser.

---

## Option 2: Cloud Deployment (Render.com)
Render is a great choice for hosting this type of application.

### Step 1: Push to GitHub
Ensure your code is pushed to a GitHub repository.

### Step 2: Create a Web Service
1. Log in to [Render.com](https://render.com/).
2. Click **New** > **Web Service**.
3. Connect your repository.
4. **Environment**: `Docker`.
5. **Name**: `agripulse`.
6. **Plan**: Free or Starter.
7. Click **Deploy Web Service**.

Render will automatically use the `Dockerfile` to build and serve your application.

---

## Option 3: Manual Deployment (VPS/Server)
If you are deploying manually on a server:

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. **Move Build Files**:
   Copy everything from `frontend/dist/` to `backend/static/`.
3. **Setup Backend**:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```
4. **Run Server**:
   ```bash
   python main.py
   ```

---

## Troubleshooting
- **API Errors**: Ensure the frontend is calling `/api/predict` (relative path) and not `localhost:8000`.
- **Static Files Not Loading**: Check that the `backend/static` directory contains the `index.html` and assets from the frontend build.
- **Model Warnings**: If the ML model is missing, run `python train_model.py` in the backend directory once before starting the server.
