@echo off
echo ========================================
echo     DESPLEGANDO VERSION PRODUCCION
echo ========================================
echo.
echo 🏗️ Construyendo version produccion...
call npm run build
echo.
echo 🚀 Desplegando a Firebase Produccion...
call firebase deploy --only hosting --project production
echo.
echo ✅ Produccion desplegado exitosamente!
echo 🌐 URL: https://control-de-stock-e4f5f.web.app
echo ========================================
pause