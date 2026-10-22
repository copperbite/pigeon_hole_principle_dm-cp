Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Pigeonhole Lab - Launching Frontend and Backend" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "Starting REST Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "backend/server.py 8080" -WindowStyle Minimized

Write-Host "Starting Web Frontend Server on http://localhost:3000..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m http.server 3000 --directory frontend" -WindowStyle Minimized

Start-Sleep -Seconds 2
Write-Host "Opening web browser to http://localhost:3000..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "Done! Pigeonhole Lab is running." -ForegroundColor Green
