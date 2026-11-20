@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install from https://nodejs.org
  pause
  exit /b 1
)
start "MY IDOL server" cmd /c "node server.js"
timeout /t 2 /nobreak >nul
start "" http://localhost:4800
