@echo off
title ZEvent API Listener
echo Starting ZEvent API Listener server...

:: 0. Install npm dependencies to make sure everything is installed
echo Checking/installing dependencies...
call npm install

:: 1. Launch the unified full-stack server
echo Starting the full-stack server on port 3000...
start /b npm run dev

:: 2. Wait 3 seconds to ensure the server starts
timeout /t 3 /nobreak > nul

:: 3. Automatically open Google Chrome on the application
echo Opening application in Google Chrome...
start chrome http://localhost:2026

echo Application is ready in Google Chrome!
echo Do not close this command prompt window while using the application.
