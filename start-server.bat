@echo off
title GFX Package - Local Server
echo.
echo Starting GFX Package server...
echo.
echo Control panel:  http://localhost:8080/control.html
echo VMix output URL: http://localhost:8080/output.html
echo.
echo Press Ctrl+C to stop the server.
echo.

python -m http.server 8080
if errorlevel 1 (
  echo.
  echo Trying 'py' launcher...
  py -m http.server 8080
  if errorlevel 1 (
    echo.
    echo Python not found. Install from https://python.org (add to PATH^)
    echo Or with Node installed: npx serve -p 8080
    pause
    exit /b 1
  )
)
