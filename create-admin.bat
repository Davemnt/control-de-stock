@echo off
echo ========================================
echo  Crear Usuario Administrador - Firebase
echo ========================================
echo.

REM Cargar variables del archivo .env
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if not "%%a"=="#" (
        set %%a=%%b
    )
)

echo Ejecutando script de creacion...
echo.

node --loader dotenv/config scripts\createAdmin.mjs

echo.
pause
