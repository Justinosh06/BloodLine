@echo off
echo Starting BloodLine Development Environment...
echo.

echo Starting Laravel server...
start "Laravel Server" cmd /c "php artisan serve"

echo Starting Vite frontend...
start "Vite Frontend" cmd /c "npm run dev"

echo.
echo Servers are starting...
echo Laravel: http://localhost:8000
echo Vite: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping servers...
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo All servers stopped.
