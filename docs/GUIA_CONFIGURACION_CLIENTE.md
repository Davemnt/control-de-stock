# 🏢 Guía de Configuración Multi-Cliente

Esta guía te ayudará a configurar la aplicación para diferentes clientes y mantener un modo demo seguro.

---

## 📋 Tabla de Contenidos

1. [Configuración para Nuevo Cliente](#-configuración-para-nuevo-cliente)
2. [Modo Demo vs Producción](#-modo-demo-vs-producción)
3. [Seguridad de Datos](#-seguridad-de-datos)
4. [Personalización Visual](#-personalización-visual)
5. [Checklist de Implementación](#-checklist-de-implementación)

---

## 🎯 Configuración para Nuevo Cliente

### Paso 1: Crear Proyecto Firebase para el Cliente

#### 1.1 Crear Nuevo Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre sugerido: `control-stock-[nombre-cliente]`
   - Ejemplo: `control-stock-producciones-xyz`
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

#### 1.2 Configurar Authentication

```bash
Firebase Console → Authentication → Get Started
```

**Habilitar proveedores:**

- ✅ Email/Password
- ⚠️ Google (opcional, para login más rápido)

**Crear usuarios iniciales:**

```javascript
// Usuario Admin del cliente
Email: admin@cliente.com
Password: [generar contraseña segura]
Role: admin

// Usuario de prueba (opcional)
Email: usuario@cliente.com
Password: [contraseña temporal]
Role: user
```

#### 1.3 Configurar Firestore Database

```bash
Firebase Console → Firestore Database → Create Database
```

**Modo:** Producción (con reglas de seguridad)
**Ubicación:** us-central (o la más cercana al cliente)

**Crear colecciones iniciales:**

```
/users
  - (vacío, se crea al registrar usuarios)

/materials
  - (vacío, el cliente agregará sus materiales)

/movements
  - (vacío, se genera con los movimientos)

/system
  /categories (documento)
    - categories: [array de categorías del cliente]
```

#### 1.4 Copiar Reglas de Seguridad

```bash
Firebase Console → Firestore Database → Rules
```

Copia el contenido de `firestore.rules` del proyecto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función helper para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }

    // Función helper para obtener datos del usuario
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    // Función helper para verificar roles
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }

    function isUser() {
      return isAuthenticated() && getUserData().role in ['admin', 'user'];
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
    }

    // Materials collection
    match /materials/{materialId} {
      allow read: if isAuthenticated();
      allow create: if isUser();
      allow update: if isUser();
      allow delete: if isAdmin();

      allow write: if isUser() &&
        request.resource.data.keys().hasAll(['name', 'code', 'category', 'quantity', 'status', 'location', 'createdAt', 'createdBy']) &&
        request.resource.data.name is string &&
        request.resource.data.code is string &&
        request.resource.data.category is string &&
        request.resource.data.quantity is int &&
        request.resource.data.status is string;
    }

    // Movements collection (immutable audit trail)
    match /movements/{movementId} {
      allow read: if isAuthenticated();
      allow create: if isUser();
      allow update: if false; // Immutable
      allow delete: if false; // Immutable
    }

    // System collection
    match /system/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

#### 1.5 Obtener Credenciales

```bash
Firebase Console → Project Settings → General
```

Copia las credenciales de **SDK de Firebase para Web**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "control-stock-cliente.firebaseapp.com",
  projectId: "control-stock-cliente",
  storageBucket: "control-stock-cliente.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

---

### Paso 2: Configurar Variables de Entorno

#### 2.1 Para Producción del Cliente

Crea `.env.cliente-nombre`:

```bash
# Firebase Configuration - CLIENTE: [Nombre del Cliente]
VITE_FIREBASE_API_KEY=AIzaSy_CREDENCIALES_DEL_CLIENTE
VITE_FIREBASE_AUTH_DOMAIN=control-stock-cliente.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=control-stock-cliente
VITE_FIREBASE_STORAGE_BUCKET=control-stock-cliente.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# App Mode: 'production' para cliente real
VITE_APP_MODE=production

# Client Branding (opcional)
VITE_CLIENT_NAME=Producciones XYZ
VITE_CLIENT_LOGO_URL=https://cliente.com/logo.png
VITE_PRIMARY_COLOR=#DE591F
VITE_CONTACT_EMAIL=soporte@cliente.com
```

#### 2.2 Para Modo Demo (Portfolio)

Mantén `.env` o `.env.demo`:

```bash
# Firebase Configuration - DEMO VERSION
VITE_FIREBASE_API_KEY=AIzaSyCiFmBad39lrK-Y7QMRtGZRl3sxJwSiv_0
VITE_FIREBASE_AUTH_DOMAIN=control-de-stock-e4f5f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=control-de-stock-e4f5f
VITE_FIREBASE_STORAGE_BUCKET=control-de-stock-e4f5f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=649358163988
VITE_FIREBASE_APP_ID=1:649358163988:web:bffd97df2bde6130b82701

# App Mode: 'demo' para versión de demostración
VITE_APP_MODE=demo

# Demo Branding
VITE_CLIENT_NAME=Control de Stock - Demo
VITE_DEMO_MODE=true
```

---

### Paso 3: Script de Cambio Rápido

Crea `switch-client.js` en la raíz:

```javascript
// switch-client.js
const fs = require("fs");
const path = require("path");

const clients = {
  demo: ".env.demo",
  cliente1: ".env.cliente1",
  cliente2: ".env.cliente2",
  // Agrega más clientes aquí
};

const clientName = process.argv[2];

if (!clientName || !clients[clientName]) {
  console.error("❌ Cliente no válido");
  console.log("Clientes disponibles:", Object.keys(clients).join(", "));
  process.exit(1);
}

const sourceFile = clients[clientName];
const targetFile = ".env";

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Archivo ${sourceFile} no encontrado`);
  process.exit(1);
}

// Backup del .env actual
if (fs.existsSync(targetFile)) {
  fs.copyFileSync(targetFile, ".env.backup");
}

// Copiar configuración del cliente
fs.copyFileSync(sourceFile, targetFile);

console.log(`✅ Configuración cambiada a: ${clientName}`);
console.log(`📁 Usando: ${sourceFile}`);
console.log("🔄 Reinicia el servidor de desarrollo");
```

**Uso:**

```bash
# Cambiar a modo demo
node switch-client.js demo

# Cambiar a cliente específico
node switch-client.js cliente1

# Agregar a package.json
"scripts": {
  "switch:demo": "node switch-client.js demo",
  "switch:cliente1": "node switch-client.js cliente1",
  "dev:demo": "npm run switch:demo && vite",
  "dev:cliente1": "npm run switch:cliente1 && vite",
  "build:cliente1": "npm run switch:cliente1 && vite build"
}
```

---

## 🔐 Modo Demo vs Producción

### Diferencias Clave

| Aspecto          | Demo                      | Producción               |
| ---------------- | ------------------------- | ------------------------ |
| Firebase Project | control-de-stock-e4f5f    | control-stock-cliente    |
| Datos            | Datos de ejemplo          | Datos reales del cliente |
| Usuarios         | demo@demo.com             | usuarios@cliente.com     |
| Marca            | "Control de Stock - Demo" | Logo del cliente         |
| Restricciones    | Banner de demo visible    | Sin restricciones        |
| Analytics        | Deshabilitado             | Habilitado               |

### Implementar Banner de Demo

Actualiza `src/App.jsx`:

```jsx
import { useEffect, useState } from "react";

function App() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(import.meta.env.VITE_APP_MODE === "demo");
  }, []);

  return (
    <Router>
      {isDemoMode && (
        <div className="demo-banner">
          ⚠️ MODO DEMOSTRACIÓN - Los datos mostrados son ejemplos
        </div>
      )}
      {/* ... resto de la app */}
    </Router>
  );
}
```

CSS en `src/index.css`:

```css
.demo-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Ajustar layout cuando hay banner */
.app-container.demo-mode {
  padding-top: 48px;
}
```

---

## 🛡️ Seguridad de Datos

### Separación Total de Datos

#### 1. Proyectos Firebase Separados

- ✅ **Demo**: `control-de-stock-e4f5f`
  - Datos públicos de ejemplo
  - Sin información sensible
- ✅ **Cliente 1**: `control-stock-cliente1`
  - Base de datos aislada
  - Usuarios propios del cliente
- ✅ **Cliente 2**: `control-stock-cliente2`
  - Completamente independiente
  - Sin acceso cruzado

#### 2. Reglas de Firestore Estrictas

```javascript
// Regla adicional para evitar acceso cruzado
match /{document=**} {
  allow read, write: if false; // Deny all by default
}

// Solo permitir en colecciones específicas
match /users/{userId} {
  allow read: if isAuthenticated() &&
    request.auth.token.firebase.tenant == 'cliente1-tenant'; // Multi-tenancy
}
```

#### 3. Variables de Entorno Seguras

**Nunca commitear `.env` con credenciales reales:**

```bash
# .gitignore
.env
.env.local
.env.*.local
.env.cliente*
!.env.example
```

**Crear `.env.example` como plantilla:**

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

VITE_APP_MODE=production
VITE_CLIENT_NAME=Nombre del Cliente
```

---

## 🎨 Personalización Visual

### Paso 1: Logo del Cliente

#### Opción A: Variable de Entorno (Recomendado)

```bash
# .env.cliente
VITE_CLIENT_LOGO_URL=https://cliente.com/logo.png
```

```jsx
// src/components/Layout/Layout.jsx
const clientLogo = import.meta.env.VITE_CLIENT_LOGO_URL;

<div className="logo">
  {clientLogo ? <img src={clientLogo} alt="Logo" /> : <h1>Control de Stock</h1>}
</div>;
```

#### Opción B: Archivo Local

```bash
# Estructura
public/
  clients/
    cliente1/
      logo.png
      favicon.ico
    cliente2/
      logo.png
      favicon.ico
```

### Paso 2: Colores Corporativos

Crear `src/themes/clienteTheme.js`:

```javascript
export const clientThemes = {
  default: {
    primary: "#DE591F",
    secondary: "#1A1D29",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
  },
  cliente1: {
    primary: "#FF6B35",
    secondary: "#004E89",
    success: "#06D6A0",
    error: "#EF476F",
    warning: "#FFD23F",
  },
  cliente2: {
    primary: "#6C5CE7",
    secondary: "#2D3436",
    success: "#00B894",
    error: "#D63031",
    warning: "#FDCB6E",
  },
};

export const getClientTheme = () => {
  const clientName = import.meta.env.VITE_CLIENT_NAME || "default";
  return clientThemes[clientName] || clientThemes.default;
};
```

Aplicar en `src/index.css`:

```css
:root {
  --c-brand: var(--client-primary, #de591f);
  --c-secondary: var(--client-secondary, #1a1d29);
  /* ... */
}
```

### Paso 3: Textos Personalizados

Crear `src/config/clientConfig.js`:

```javascript
const configs = {
  demo: {
    appName: "Control de Stock - Demo",
    companyName: "Demo Company",
    supportEmail: "demo@controldestock.com",
    showBanner: true,
  },
  cliente1: {
    appName: "Inventario Producciones XYZ",
    companyName: "Producciones XYZ",
    supportEmail: "soporte@produccionesxyz.com",
    showBanner: false,
    customCategories: ["Categoría Especial 1", "Categoría Especial 2"],
  },
};

export const getClientConfig = () => {
  const mode = import.meta.env.VITE_APP_MODE || "demo";
  return configs[mode] || configs.demo;
};
```

---

## ✅ Checklist de Implementación

### Para Nuevo Cliente

- [ ] **1. Firebase Setup**

  - [ ] Crear proyecto Firebase
  - [ ] Configurar Authentication
  - [ ] Crear Firestore Database
  - [ ] Copiar reglas de seguridad
  - [ ] Probar reglas con simulador

- [ ] **2. Configuración Local**

  - [ ] Crear archivo `.env.cliente-nombre`
  - [ ] Copiar credenciales de Firebase
  - [ ] Configurar variables de personalización
  - [ ] Agregar script de cambio en `package.json`

- [ ] **3. Usuarios Iniciales**

  - [ ] Crear usuario admin del cliente
  - [ ] Crear usuarios de prueba
  - [ ] Documentar credenciales (seguro)

- [ ] **4. Datos Iniciales**

  - [ ] Configurar categorías del cliente
  - [ ] Importar materiales iniciales (si aplica)
  - [ ] Configurar ubicaciones

- [ ] **5. Personalización**

  - [ ] Agregar logo del cliente
  - [ ] Configurar colores corporativos
  - [ ] Personalizar textos
  - [ ] Configurar favicon

- [ ] **6. Testing**

  - [ ] Probar login
  - [ ] Probar CRUD de materiales
  - [ ] Probar movimientos
  - [ ] Probar exportaciones (CSV, PDF)
  - [ ] Probar escaneo de códigos
  - [ ] Verificar permisos por rol

- [ ] **7. Deploy**

  - [ ] Build de producción
  - [ ] Deploy a Firebase Hosting
  - [ ] Configurar dominio personalizado (si aplica)
  - [ ] Probar en producción

- [ ] **8. Documentación**
  - [ ] Documentar credenciales
  - [ ] Crear guía para el cliente
  - [ ] Documentar proceso de backup

### Para Mantener Modo Demo

- [ ] **Seguridad**

  - [ ] Proyecto Firebase separado
  - [ ] Datos de ejemplo (no reales)
  - [ ] Banner de demo visible
  - [ ] Sin información sensible

- [ ] **Contenido**

  - [ ] Datos realistas pero ficticios
  - [ ] Variedad de ejemplos
  - [ ] Casos de uso documentados

- [ ] **Acceso**
  - [ ] Usuario demo público: demo@demo.com / demo123
  - [ ] Limitar operaciones críticas (opcional)
  - [ ] Backup automático de datos demo

---

## 📞 Soporte

Si tienes dudas durante la configuración:

1. Revisa la documentación de Firebase
2. Verifica los logs de la consola
3. Comprueba las reglas de Firestore
4. Valida las variables de entorno

---

**Última actualización**: Noviembre 2024  
**Versión**: 2.0.0
