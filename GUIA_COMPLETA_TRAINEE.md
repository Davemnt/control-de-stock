# 📚 GUÍA COMPLETA PARA TRAINEE - SISTEMA CONTROL DE STOCK

## 🎯 ÍNDICE DE CONTENIDOS

1. [📋 INTRODUCCIÓN](#introducción)
2. [🏗️ ESTRUCTURA DEL PROYECTO](#estructura-del-proyecto)
3. [⚙️ CONFIGURACIÓN INICIAL](#configuración-inicial)
4. [🔥 FIREBASE SETUP](#firebase-setup)
5. [🎨 SISTEMA DE ESTILOS](#sistema-de-estilos)
6. [📱 RESPONSIVE DESIGN](#responsive-design)
7. [🚀 DEPLOYMENT](#deployment)
8. [🔧 TROUBLESHOOTING](#troubleshooting)

---

## 📋 INTRODUCCIÓN

Este es un sistema completo de Control de Stock para productoras técnicas de eventos, construido con **React + Vite + Firebase**.

### 🎯 CARACTERÍSTICAS PRINCIPALES:

- ✅ Autenticación de usuarios
- ✅ Gestión de inventario
- ✅ Registro de movimientos
- ✅ Sistema de reportes
- ✅ Responsive design
- ✅ Versiones separadas (Demo + Producción)

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
📁 Control de Stock/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── 📁 ProtectedRoute/       # Protección de rutas
│   │   └── 📁 SubscriptionGuard/    # Control de suscripciones
│   ├── 📁 contexts/                 # Contextos React (Auth, Theme)
│   ├── 📁 pages/                    # Páginas principales
│   │   ├── 📁 Login/                # Página de inicio de sesión
│   │   ├── 📁 Dashboard/            # Panel principal
│   │   ├── 📁 Materiales/           # Gestión de inventario
│   │   └── 📁 Movimientos/          # Registro de movimientos
│   └── 📄 main.jsx                  # Punto de entrada
├── 📁 public/                       # Archivos públicos
├── 📄 .env.demo                     # Variables para demo
├── 📄 .env.production               # Variables para producción
├── 📄 firebase.json                 # Configuración Firebase
├── 📄 vite.config.js                # Configuración Vite
├── 📄 package.json                  # Dependencias
└── 📄 deploy-demo.bat               # Script deploy demo
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### 📋 PASO 1: INSTALAR NODE.JS

1. Ir a https://nodejs.org
2. Descargar versión LTS (recomendada)
3. Instalar siguiendo el wizard
4. Verificar: `node --version` y `npm --version`

### 📋 PASO 2: CLONAR PROYECTO

```bash
# Clonar repositorio
git clone [URL-DEL-REPO]
cd "Control de Stock"

# Instalar dependencias
npm install
```

### 📋 PASO 3: CONFIGURAR VARIABLES DE ENTORNO

#### 📄 `.env.demo` (Versión Demo)

```env
# 🟢 DEMO - Proyecto Firebase independiente
VITE_FIREBASE_PROJECT_ID=control-stock-demo
VITE_FIREBASE_API_KEY=tu-api-key-demo
VITE_FIREBASE_AUTH_DOMAIN=control-stock-demo.firebaseapp.com
VITE_APP_MODE=demo
VITE_DEMO_USER=demo@demo.com
VITE_DEMO_PASSWORD=demo123
```

#### 📄 `.env.production` (Versión Cliente)

```env
# 🔵 PRODUCCIÓN - Proyecto Firebase del cliente
VITE_FIREBASE_PROJECT_ID=control-de-stock-e4f5f
VITE_FIREBASE_API_KEY=tu-api-key-produccion
VITE_FIREBASE_AUTH_DOMAIN=control-de-stock-e4f5f.firebaseapp.com
VITE_APP_MODE=production
```

---

## 🔥 FIREBASE SETUP

### 📋 PASO 1: CREAR PROYECTOS FIREBASE

1. Ir a https://console.firebase.google.com
2. Crear 2 proyectos separados:
   - `control-stock-demo` (para demostraciones)
   - `control-de-stock-e4f5f` (para cliente)

### 📋 PASO 2: CONFIGURAR AUTHENTICATION

```javascript
// En Firebase Console:
// 1. Authentication > Sign-in method
// 2. Habilitar "Email/Password"
// 3. Crear usuarios de prueba
```

### 📋 PASO 3: CONFIGURAR FIRESTORE

```javascript
// Reglas básicas de Firestore:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 📋 PASO 4: CONFIGURAR HOSTING

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar (si no está hecho)
firebase init hosting
```

---

## 🎨 SISTEMA DE ESTILOS

### 📱 DETECCIÓN DE MODO DEMO

```javascript
// En Login.jsx - Lógica de detección
const isDemo =
  import.meta.env.VITE_FIREBASE_PROJECT_ID === "control-stock-demo" ||
  window.location.href.includes("control-stock-demo") ||
  window.location.hostname === "localhost";

// Aplicar clase CSS condicionalmente
<div className={`login-container ${isDemo ? "demo-login" : ""}`}>
```

### 🎨 CSS VARIABLES (Custom Properties)

```css
/* Variables globales en :root */
:root {
  --c-brand: #de591f; /* Color principal */
  --c-surface: #1a1a1a; /* Fondo de tarjetas */
  --c-text: #ffffff; /* Color de texto */
  --spacing-sm: 8px; /* Espaciado pequeño */
  --spacing-md: 16px; /* Espaciado medio */
  --spacing-lg: 24px; /* Espaciado grande */
  --radius-lg: 12px; /* Bordes redondeados */
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1); /* Sombras */
}
```

### 🔄 SISTEMA DE TEMAS

```css
/* Tema oscuro (por defecto) */
[data-theme="dark"] {
  --c-surface: #1a1a1a;
  --c-text: #ffffff;
}

/* Tema claro */
[data-theme="light"] {
  --c-surface: #ffffff;
  --c-text: #1a1a1a;
}
```

---

## 📱 RESPONSIVE DESIGN

### 📋 BREAKPOINTS UTILIZADOS

```css
/* 📱 Mobile First Approach */
/* Por defecto: Mobile (320px+) */

/* 📱 Tablets pequeñas */
@media (max-width: 768px) {
}

/* 💻 Tablets grandes */
@media (max-width: 1024px) and (min-width: 769px) {
}

/* 🖥️ Desktop */
@media (min-width: 1200px) {
}
```

### 🎯 ESTRATEGIA RESPONSIVE DEMO

```css
/* 🟢 DEMO: Botones grandes en desktop */
.demo-login .demo-buttons .btn {
  height: 175px;
  width: 220px;
}

/* 📱 DEMO: Botones apilados en mobile */
@media (max-width: 768px) {
  .demo-login .demo-buttons-container {
    flex-direction: column; /* Cambiar a columna */
  }

  .demo-login .demo-buttons .btn {
    height: 100px; /* Más compactos */
    width: 100%;
  }
}
```

### 🔧 FLEXBOX PARA LAYOUTS

```css
/* Contenedor principal */
.login-container {
  display: flex;
  align-items: center; /* Centrar verticalmente */
  justify-content: center; /* Centrar horizontalmente */
  min-height: 100vh; /* Altura completa */
}

/* Botones horizontales que se vuelven verticales */
.demo-buttons-container {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  /* En mobile: flex-direction: column */
}
```

---

## 🚀 DEPLOYMENT

### 📋 COMANDOS PRINCIPALES

#### 🟢 DESPLEGAR DEMO

```bash
# Opción 1: Comando manual
npm run build:demo
firebase deploy --only hosting --project control-stock-demo

# Opción 2: Script automatizado
deploy-demo.bat
```

#### 🔵 DESPLEGAR PRODUCCIÓN

```bash
# Opción 1: Comando manual
npm run build
firebase deploy --only hosting --project control-de-stock-e4f5f

# Opción 2: Script automatizado
deploy-produccion.bat
```

### 📋 SCRIPTS EN PACKAGE.JSON

```json
{
  "scripts": {
    "dev": "vite --mode production",
    "dev:demo": "vite --mode demo",
    "build": "vite build --mode production",
    "build:demo": "vite build --mode demo",
    "deploy": "npm run build && firebase deploy --only hosting --project control-de-stock-e4f5f",
    "deploy:demo": "npm run build:demo && firebase deploy --only hosting --project control-stock-demo"
  }
}
```

### 📋 SCRIPTS BAT AUTOMATIZADOS

#### 📄 `deploy-demo.bat`

```batch
@echo off
echo 🏗️ Construyendo version demo...
call npm run build:demo

echo 🚀 Desplegando a Firebase Demo...
call firebase deploy --only hosting --project control-stock-demo

echo ✅ Demo desplegado: https://control-stock-demo.web.app
pause
```

---

## 🔧 TROUBLESHOOTING

### ❌ PROBLEMA: "Firebase project not found"

```bash
# SOLUCIÓN:
firebase projects:list              # Ver proyectos disponibles
firebase use control-stock-demo     # Cambiar proyecto
firebase deploy --project control-stock-demo  # Especificar proyecto
```

### ❌ PROBLEMA: "Build fails"

```bash
# SOLUCIÓN:
rm -rf node_modules                 # Borrar dependencias
rm package-lock.json               # Borrar lock file
npm install                        # Reinstalar limpio
npm run build                      # Intentar build nuevamente
```

### ❌ PROBLEMA: "Responsive no funciona"

```css
/* SOLUCIÓN: Verificar meta viewport en index.html */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Y verificar box-sizing */
* {
  box-sizing: border-box;
}
```

### ❌ PROBLEMA: "Demo y Producción se mezclan"

```javascript
// SOLUCIÓN: Verificar detección de modo
console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("Mode:", import.meta.env.MODE);

// Debe mostrar:
// Demo: control-stock-demo, demo
// Producción: control-de-stock-e4f5f, production
```

### ❌ PROBLEMA: "Estilos no se aplican"

```bash
# SOLUCIÓN: Limpiar cache
npm run build          # Rebuilding
Ctrl + F5              # Hard refresh en navegador
```

---

## 📚 RECURSOS ADICIONALES

### 📖 DOCUMENTACIÓN OFICIAL

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/docs)
- [CSS Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

### 🛠️ HERRAMIENTAS RECOMENDADAS

- **VS Code** con extensiones:
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Bracket Pair Colorizer
  - Prettier
  - Thunder Client (para API testing)

### 🎨 DISEÑO Y UX

- [Material Design](https://material.io/)
- [Color Hunt](https://colorhunt.co/)
- [Google Fonts](https://fonts.google.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🎯 CHECKLIST FINAL

### ✅ ANTES DE ENTREGAR:

- [ ] Ambos proyectos Firebase creados y configurados
- [ ] Variables de entorno correctas (.env.demo, .env.production)
- [ ] Responsive funcionando en mobile, tablet y desktop
- [ ] Demo desplegado y funcionando con botones grandes
- [ ] Producción desplegado con datos del cliente
- [ ] Scripts de deployment (.bat) funcionando
- [ ] Separación completa de datos verificada
- [ ] Documentación actualizada
- [ ] Credenciales de demo funcionando (demo@demo.com / demo123)

### 🚨 VERIFICACIONES DE SEGURIDAD:

- [ ] No hay API keys expuestas en el código
- [ ] Reglas de Firestore configuradas correctamente
- [ ] Usuarios demo no tienen acceso a datos de producción
- [ ] CORS configurado apropiadamente

---

## 📞 CONTACTO Y SOPORTE

Para dudas o problemas:

1. Revisar esta documentación
2. Consultar logs en Firebase Console
3. Verificar Network tab en DevTools del navegador
4. Contactar al desarrollador principal

---

**🎉 ¡FELICIDADES! Has completado la configuración del Sistema de Control de Stock**

---

_Esta documentación se actualiza constantemente. Versión: 2.0 - Diciembre 2024_
