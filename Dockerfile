# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Backend & Serve
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend from Stage 1 to backend/static
# Note: Vite usually builds to 'dist', we move it to the backend 'static' folder
COPY --from=frontend-builder /app/frontend/dist/ ./static/

# Expose the port FastAPI runs on
EXPOSE 8000

# Start the server
CMD ["python", "main.py"]
