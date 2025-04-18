#!/bin/bash

# Set Docker Hub username and image names
DOCKER_USER="ankushbehl"
FRONTEND_IMAGE="${DOCKER_USER}/s3-browser-frontend:latest"
BACKEND_IMAGE="${DOCKER_USER}/s3-browser-backend:latest"

# Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it."
    exit 1
fi

# Create a temporary folder to hold the compose file
mkdir -p s3-browser-run && cd s3-browser-run

curl -o docker-compose.yml https://raw.githubusercontent.com/cloudbehl/s3-browser/refs/heads/main/docker-compose.yml

# Run Docker Compose
echo "📦 Pulling and running s3-browser containers..."
docker-compose up -d

echo "✅ Application is running!"
echo "👉 Frontend: http://localhost:8080"
echo "👉 Backend API: http://localhost:5000"
