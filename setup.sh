#!/bin/bash

echo "🚀 Smart Expense Tracker - Quick Start Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies for all services
echo "📦 Installing dependencies for all services..."
echo ""

services=("user-service" "expense-service" "budget-service" "analytics-service" "notification-service" "api-gateway")

for service in "${services[@]}"
do
    echo "Installing dependencies for $service..."
    cd "$service" || exit
    npm install --silent
    cd ..
    echo "✅ $service dependencies installed"
    echo ""
done

echo "=============================================="
echo "✨ Setup Complete!"
echo ""
echo "To start the services, run these commands in separate terminals:"
echo ""
echo "Terminal 1: cd user-service && npm start"
echo "Terminal 2: cd expense-service && npm start"
echo "Terminal 3: cd budget-service && npm start"
echo "Terminal 4: cd analytics-service && npm start"
echo "Terminal 5: cd notification-service && npm start"
echo "Terminal 6: cd api-gateway && npm start"
echo ""
echo "Or use the start-all.sh script to start all services at once!"
echo "=============================================="
