@echo off
REM Smart Expense Tracker - Frontend Only Startup Script
REM Use this if you already have backend services running

echo.
echo 🚀 Smart Expense Tracker - Frontend Development
echo ================================================
echo.

cd /d "%~dp0frontend" || exit /b

echo Starting frontend development server on http://localhost:5173
echo.
echo Make sure these services are already running:
echo   - API Gateway (port 3000)
echo   - User Service (port 3001)
echo   - Expense Service (port 3002)
echo.

npm run dev

pause
