# 🔧 Guía de Desarrollo - Entornos Separados

## 📋 Descripción General

Este proyecto tiene **dos proyectos Firebase completamente separados**:

### 🏭 Producción (Cliente Real)

- **Proyecto:** `control-de-stock-e4f5f`
- **URL:** https://control-de-stock-e4f5f.web.app
- **Base de Datos:** Datos reales y privados del cliente
- **Propósito:** Sistema operativo para uso del cliente

### 🎭 Demo (Demostraciones)

- **Proyecto:** `control-stock-demo`
- **URL:** https://control-stock-demo.web.app
- **Base de Datos:** Datos ficticios para pruebas
- **Propósito:** Presentaciones, portfolio, capacitaciones

## 🔐 Variables de Entorno

### `.env.production`

Contiene credenciales del proyecto de producción (cliente real)

### `.env.demo`

Contiene credenciales del proyecto demo (datos ficticios)

### `.env.example`

Plantilla para nuevos ambientes

## 🚀 Comandos Disponibles

### Desarrollo

```bash
# Desarrollo con producción
npm run dev

# Desarrollo con demo
npm run dev:demo
```

### Build

```bash
# Build de producción
npm run build

# Build de demo
npm run build:demo
```

### Deploy

```bash
# Deploy a producción
npm run deploy

# Deploy a demo
npm run deploy:demo
```

## 📝 Scripts de Administración

### `setupDemoData.mjs`

Puebla la base de datos demo con:

- Usuario: demo@demo.com / demo123
- 12 materiales de ejemplo
- Datos ficticios para pruebas

```bash
node scripts/setupDemoData.mjs
```

### `createAdminMaterials.mjs`

Crea materiales de ejemplo en producción (usar con precaución)

```bash
node scripts/createAdminMaterials.mjs
```

## 🔄 Cómo Funciona la Separación

### 1. Variables de Entorno

Vite carga automáticamente el archivo `.env` según el modo:

- `--mode production` → `.env.production`
- `--mode demo` → `.env.demo`

### 2. Firebase Config

`src/firebase.js` lee las variables de entorno:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};
```

### 3. Alias de Firebase

`.firebaserc` define aliases para cambiar entre proyectos:

```json
{
  "projects": {
    "dave": "control-de-stock-e4f5f", // Producción
    "demo": "control-stock-demo" // Demo
  }
}
```

### 4. Deploy Automático

Los comandos `deploy` y `deploy:demo` hacen:

1. Build con el entorno correcto
2. Cambian al proyecto Firebase correcto
3. Despliegan en hosting

## 🔒 Seguridad

### Reglas de Firestore

Ambos proyectos tienen reglas de seguridad idénticas en `firestore.demo.rules`:

- Solo usuarios autenticados pueden leer datos
- Solo admins pueden crear/editar/eliminar
- Logs son inmutables
- Validación de roles por documento

### Headers HTTP

`firebase.json` incluye headers de seguridad:

- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- Strict-Transport-Security

### Protección Client-Side

`public/security.js` previene:

- Inspección de código (F12)
- Copy/paste
- Grabbers
- DevTools
- Código de desbloqueo: Ctrl+Alt+Shift+D

## 🛠️ Agregar Nuevo Ambiente

1. Crear nuevo proyecto en Firebase Console
2. Crear `.env.nuevocliente`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=nuevo-cliente-id
# ...resto de credenciales
```

3. Agregar alias en `.firebaserc`:

```json
{
  "projects": {
    "dave": "control-de-stock-e4f5f",
    "demo": "control-stock-demo",
    "nuevocliente": "nuevo-cliente-id"
  }
}
```

4. Agregar scripts en `package.json`:

```json
{
  "scripts": {
    "dev:nuevocliente": "vite --mode nuevocliente",
    "build:nuevocliente": "vite build --mode nuevocliente",
    "deploy:nuevocliente": "npm run build:nuevocliente && firebase use nuevocliente && firebase deploy --only hosting"
  }
}
```

5. Habilitar Authentication y Firestore en el nuevo proyecto
6. Configurar reglas de Firestore
7. Ejecutar script de población de datos

## 📊 Flujo de Trabajo Recomendado

### Para Desarrollo

```bash
# Trabajar con demo para no afectar producción
npm run dev:demo
```

### Para Producción

```bash
# Solo cuando esté todo probado
npm run build
npm run deploy
```

### Para Demos/Portfolio

```bash
# Siempre usar la versión demo
npm run deploy:demo
```

## ⚠️ IMPORTANTE

- **NUNCA** commitear archivos `.env.*` al repositorio
- **SIEMPRE** probar cambios en demo antes de producción
- **VERIFICAR** el proyecto Firebase antes de hacer deploy
- Los datos de demo son **completamente ficticios**
- Los datos de producción son **reales y privados**

## 🔍 Verificar Proyecto Activo

```bash
# Ver qué proyecto está activo
firebase use

# Listar todos los proyectos/alias
firebase projects:list
```

## 📦 Estructura de Datos

### Producción

- Usuarios reales del cliente
- Materiales reales del inventario
- Movimientos históricos reales

### Demo

- Usuario demo (demo@demo.com)
- 12 materiales ficticios variados
- Sin movimientos históricos inicialmente

## 🤝 Colaboración

Si otro desarrollador va a trabajar en el proyecto:

1. Clonar repositorio
2. Copiar `.env.example` a `.env.demo` y `.env.production`
3. Solicitar credenciales Firebase al propietario
4. Instalar Firebase CLI: `npm install -g firebase-tools`
5. Login Firebase: `firebase login`
6. Verificar acceso a proyectos: `firebase projects:list`

## 📞 Soporte

Para dudas sobre configuración:

- Email: montedavid07@hotmail.com
- GitHub: [@Davemnt](https://github.com/Davemnt)

---

**Última Actualización:** Diciembre 2025  
**Versión:** 2.0
