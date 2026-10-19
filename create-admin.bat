@echo off
echo ========================================
echo  Crear Usuario Administrador - Firebase
echo ========================================
echo.
REM Sin parametros usa .env. Para un cliente: create-admin.bat acme   (usa .env.acme)
node scripts\createAdmin.mjs %*
echo.
pause
