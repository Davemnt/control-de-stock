# 🔄 SEPARACIÓN DEMO vs PRODUCCIÓN

## 📁 Estructura de Proyectos

### 🟢 VERSIÓN DEMO

- **URL**: https://control-stock-demo.web.app
- **Firebase Project ID**: `control-stock-demo`
- **Base de Datos**: Firestore independiente
- **Configuración**: `.env.demo`
- **Propósito**: Demostraciones, portfolio, pruebas

### 🔵 VERSIÓN PRODUCCIÓN

- **URL**: https://control-de-stock-e4f5f.web.app
- **Firebase Project ID**: `control-de-stock-e4f5f`
- **Base de Datos**: Firestore del cliente
- **Configuración**: `.env.production`
- **Propósito**: Cliente real, datos privados

## 🚀 Comandos de Despliegue

### Demo

```bash
npm run build:demo
firebase deploy --only hosting --project control-stock-demo
# O usar: deploy-demo.bat
```

### Producción

```bash
npm run build
firebase deploy --only hosting --project control-de-stock-e4f5f
# O usar: deploy-produccion.bat
```

## 🔒 Separación de Datos

✅ **Proyectos Firebase Completamente Separados**

- Demo: `control-stock-demo`
- Producción: `control-de-stock-e4f5f`

✅ **Bases de Datos Independientes**

- No comparten usuarios
- No comparten inventario
- No comparten movimientos
- No comparten configuración

✅ **Autenticación Separada**

- Demo: demo@demo.com / demo123
- Producción: Usuarios reales del cliente

## 🎨 Diferencias Visuales

### Demo

- Botones login grandes (220×175px)
- Banner "Versión DEMO"
- Credenciales automáticas
- Colores distintivos

### Producción

- Botones login compactos
- Sin banner demo
- Login seguro del cliente
- Branding corporativo

## 📋 Variables de Entorno

### `.env.demo`

```
VITE_FIREBASE_PROJECT_ID=control-stock-demo
VITE_APP_MODE=demo
VITE_DEMO_USER=demo@demo.com
```

### `.env.production`

```
VITE_FIREBASE_PROJECT_ID=control-de-stock-e4f5f
VITE_APP_MODE=production
```

## ⚡ Detección Automática

El sistema detecta automáticamente el modo basado en:

1. `VITE_FIREBASE_PROJECT_ID`
2. `import.meta.env.MODE`
3. URL del navegador

```javascript
const isDemo =
  import.meta.env.VITE_FIREBASE_PROJECT_ID === "control-stock-demo" ||
  import.meta.env.MODE === "demo";
```

## 🛡️ Garantías de Seguridad

❌ **NO HAY CRUCE DE DATOS**
❌ **NO HAY ACCESO MUTUO**
❌ **NO HAY CONEXIÓN ENTRE VERSIONES**

✅ **PROYECTOS 100% INDEPENDIENTES**
✅ **DATOS COMPLETAMENTE AISLADOS**
✅ **CONFIGURACIONES SEPARADAS**
