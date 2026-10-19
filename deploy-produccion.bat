@echo off
REM Publica la app y las reglas en el proyecto definido en .env
REM Para un cliente: deploy-produccion.bat acme   (usa .env.acme)
call node scripts\deploy.mjs %*
pause
