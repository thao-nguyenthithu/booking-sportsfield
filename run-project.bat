@echo off
REM Batch file to start backend and frontend for Sports Booking System

echo Starting Sports Booking System...
echo.

REM Start Backend (Spring Boot)
echo Starting Backend...
start "Backend" powershell -NoExit -Command "cd backend; .\mvnw.cmd spring-boot:run"

REM Wait a few seconds for backend to start
timeout /t 10 /nobreak > nul

REM Start Frontend (React)
echo Starting Frontend...
start "Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo Both services are starting...
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
pause