# Smart Expense Tracker - Windows Startup Script
Write-Host "🚀 Smart Expense Tracker - Starting All Services" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Define services and their ports
$services = @(
    @{ name = "user-service"; port = 3001 },
    @{ name = "expense-service"; port = 3002 },
    @{ name = "budget-service"; port = 3003 },
    @{ name = "analytics-service"; port = 3004 },
    @{ name = "notification-service"; port = 3005 },
    @{ name = "api-gateway"; port = 3000 },
    @{ name = "frontend"; port = 5173 }
)

# Start each service in a new terminal
foreach ($service in $services) {
    $serviceName = $service.name
    $port = $service.port
    
    Write-Host "Starting $serviceName on port $port..." -ForegroundColor Cyan
    
    if ($serviceName -eq "frontend") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\$serviceName'; npm run dev"
    } else {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\$serviceName'; npm start"
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ All services started in separate terminal windows!" -ForegroundColor Green
Write-Host "Frontend will be available at http://localhost:5173" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green
