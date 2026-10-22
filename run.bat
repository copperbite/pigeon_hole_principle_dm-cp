@echo off
echo ========================================================
echo  Pigeonhole Lab - Launching Frontend and Backend
echo ========================================================

echo Starting Python REST Backend on http://localhost:8080...
start "Pigeonhole Lab Backend" python backend/server.py 8080

echo Starting Web Frontend Server on http://localhost:3000...
start "Pigeonhole Lab Frontend" python -m http.server 3000 --directory frontend

timeout /t 2 /nobreak >nul
echo Opening web browser to http://localhost:3000...
start http://localhost:3000

echo Done! Pigeonhole Lab is running.
pause
