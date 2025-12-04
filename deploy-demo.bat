@echo off
echo ========================================
echo       DESPLEGANDO VERSION DEMO
echo ========================================
echo.
echo 🏗️ Construyendo version demo...
call npm run build:demo
echo.
echo 🚀 Desplegando a Firebase Demo...
call firebase deploy --only hosting --project control-stock-demo
echo.
echo ✅ Demo desplegado exitosamente!
echo 🌐 URL: https://control-stock-demo.web.app
echo ========================================
pause