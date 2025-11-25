# 🚀 Guía Rápida: Configuración Multi-Cliente

## ✅ ¿Qué se ha implementado?

### 1. Sistema de Configuración por Cliente

- ✅ Archivo `clientConfig.js` con configuraciones separadas
- ✅ Modo Demo seguro con banner visible
- ✅ Soporte para múltiples clientes con bases de datos independientes
- ✅ Sistema de cambio rápido entre configuraciones

### 2. Modo Demo

- ✅ Banner de demostración visible
- ✅ Credenciales de demo mostradas
- ✅ Base de datos separada del proyecto actual
- ✅ Datos de ejemplo seguros

### 3. Seguridad

- ✅ Proyectos Firebase totalmente separados
- ✅ Variables de entorno protegidas en `.gitignore`
- ✅ Sin acceso cruzado entre clientes
- ✅ Configuraciones sensibles no se suben a Git

---

## 🎯 Cómo Configurar un Nuevo Cliente

### Opción Rápida (5 pasos)

```bash
# 1. Crear archivo de configuración
cp .env.example .env.cliente-nombreempresa

# 2. Editar con las credenciales del cliente
# (Copiar desde Firebase Console del proyecto del cliente)

# 3. Cambiar a ese cliente
npm run switch:cliente-nombreempresa

# 4. Iniciar en modo desarrollo
npm run dev

# 5. O construir para producción
npm run build
```

### Configuración Completa

#### 1. Crear Proyecto Firebase del Cliente

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. "Agregar proyecto" → `control-stock-nombrecliente`
3. Habilitar Authentication → Email/Password
4. Crear Firestore Database → Modo producción
5. Copiar reglas de `firestore.rules`
6. Obtener credenciales de configuración

#### 2. Crear Archivo `.env.cliente-nombreempresa`

```bash
VITE_FIREBASE_API_KEY=AIzaSy... [del nuevo proyecto]
VITE_FIREBASE_AUTH_DOMAIN=control-stock-cliente.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=control-stock-cliente
VITE_FIREBASE_STORAGE_BUCKET=control-stock-cliente.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

VITE_APP_MODE=production
VITE_CLIENT_NAME=cliente1

# Personalización
VITE_PRIMARY_COLOR=#FF6B35
VITE_CONTACT_EMAIL=soporte@cliente.com
```

#### 3. Actualizar `switch-client.js`

```javascript
const clients = {
  demo: ".env.demo",
  cliente1: ".env.cliente1",
  nombreempresa: ".env.cliente-nombreempresa", // ← Agregar aquí
};
```

#### 4. Agregar Scripts en `package.json`

```json
"scripts": {
  "switch:nombreempresa": "node switch-client.js nombreempresa",
  "dev:nombreempresa": "npm run switch:nombreempresa && vite",
  "build:nombreempresa": "npm run switch:nombreempresa && vite build"
}
```

---

## 🔄 Cómo Cambiar Entre Clientes

### Método 1: Scripts de Package.json (Recomendado)

```bash
# Cambiar a modo demo
npm run switch:demo

# Cambiar a cliente1
npm run switch:cliente1

# Cambiar a cliente2
npm run switch:cliente2
```

### Método 2: Directo con Node

```bash
# Ver clientes disponibles
node switch-client.js

# Cambiar a un cliente
node switch-client.js nombreempresa
```

### Método 3: Dev directo con cliente

```bash
# Iniciar dev cambiando automáticamente
npm run dev:demo
npm run dev:cliente1

# Build cambiando automáticamente
npm run build:cliente1
```

---

## 🛡️ Modo Demo - Características

### Banner de Demostración

Cuando `VITE_APP_MODE=demo`:

- ✅ Banner morado en la parte superior
- ✅ Texto: "MODO DEMOSTRACIÓN"
- ✅ Muestra credenciales de acceso
- ✅ Visible en todas las páginas

### Base de Datos Separada

- ✅ Proyecto Firebase: `control-de-stock-e4f5f`
- ✅ Sin datos de clientes reales
- ✅ Datos de ejemplo pre-cargados
- ✅ Seguro para demostraciones públicas

### Usuarios de Demo

```
Admin: demo@demo.com / demo123
Usuario: usuario@demo.com / demo123
```

---

## 📁 Estructura de Archivos

```
proyecto/
├── .env.example          # Plantilla (sí se sube a Git)
├── .env.demo            # Config demo (sí se sube a Git)
├── .env.cliente1        # Config cliente 1 (NO se sube)
├── .env.cliente2        # Config cliente 2 (NO se sube)
├── .env                 # Actual en uso (NO se sube)
├── .env.backup          # Backup automático (NO se sube)
│
├── switch-client.js     # Script de cambio
├── package.json         # Scripts actualizados
│
└── src/
    ├── config/
    │   └── clientConfig.js    # Configuraciones por cliente
    └── components/
        └── DemoBanner/        # Banner de modo demo
            ├── DemoBanner.jsx
            └── DemoBanner.css
```

---

## 🔐 Seguridad - Checklist

### ✅ Protección de Datos

- [x] Proyectos Firebase separados por cliente
- [x] `.env.cliente*` en `.gitignore`
- [x] `.env.production` en `.gitignore`
- [x] `.env.example` como plantilla pública
- [x] `.env.demo` único archivo con credenciales en Git

### ✅ Separación Total

- [x] Cada cliente tiene su propio Firebase Project
- [x] Sin acceso cruzado entre bases de datos
- [x] Reglas de Firestore independientes
- [x] Usuarios separados por proyecto

### ✅ Modo Demo Seguro

- [x] Base de datos demo separada
- [x] Banner visible para identificar demo
- [x] Sin datos sensibles
- [x] Credenciales públicas solo para demo

---

## 🎨 Personalización por Cliente

### 1. Logo

**Opción A: URL externa**

```bash
# En .env.cliente
VITE_CLIENT_LOGO_URL=https://cliente.com/logo.png
```

**Opción B: Archivo local**

```bash
# Crear carpeta
public/clients/nombrecliente/logo.png

# Configurar en clientConfig.js
logoUrl: '/clients/nombrecliente/logo.png'
```

### 2. Colores Corporativos

```javascript
// src/config/clientConfig.js
nombrecliente: {
  branding: {
    primaryColor: '#FF6B35',    // Color principal
    secondaryColor: '#004E89',  // Color secundario
  }
}
```

### 3. Nombre de la Aplicación

```javascript
// src/config/clientConfig.js
nombrecliente: {
  appName: 'Stock Manager - NombreCliente',
  companyName: 'NombreCliente S.A.',
  supportEmail: 'soporte@cliente.com',
}
```

### 4. Categorías Personalizadas

```javascript
// src/config/clientConfig.js
nombrecliente: {
  customCategories: [
    { key: "CategoriaEspecial", label: "Categoría Especial" },
    { key: "OtraCategoria", label: "Otra Categoría" },
  ];
}
```

---

## 🚀 Deploy por Cliente

### Firebase Hosting

```bash
# 1. Cambiar a configuración del cliente
npm run switch:cliente1

# 2. Build de producción
npm run build

# 3. Inicializar Firebase (primera vez)
firebase login
firebase init hosting

# 4. Deploy
firebase deploy --only hosting

# 5. Configurar dominio personalizado (opcional)
# Firebase Console → Hosting → Add custom domain
```

### Deploy Múltiples Clientes

```bash
# Cliente 1
npm run build:cliente1
firebase use proyecto-cliente1
firebase deploy

# Cliente 2
npm run build:cliente2
firebase use proyecto-cliente2
firebase deploy

# Demo
npm run build:demo
firebase use proyecto-demo
firebase deploy
```

---

## 📊 Comparación: Demo vs Producción

| Aspecto              | Modo Demo              | Modo Producción             |
| -------------------- | ---------------------- | --------------------------- |
| **Firebase Project** | control-de-stock-e4f5f | control-stock-nombrecliente |
| **Banner**           | ✅ Visible             | ❌ No visible               |
| **Datos**            | Ejemplos ficticios     | Datos reales del cliente    |
| **Usuarios**         | demo@demo.com          | admin@cliente.com           |
| **Logo**             | "Control de Stock"     | Logo del cliente            |
| **Colores**          | Naranja #DE591F        | Colores corporativos        |
| **Git**              | ✅ Se sube             | ❌ No se sube               |
| **Público**          | ✅ Sí                  | ❌ No                       |

---

## 🆘 Resolución de Problemas

### "No encuentro los archivos .env"

```bash
# Crear desde plantilla
cp .env.example .env.cliente-tucliente

# Editar con tus credenciales
code .env.cliente-tucliente
```

### "El banner demo no desaparece"

```bash
# Verificar que estás en modo correcto
cat .env | grep VITE_APP_MODE

# Debe decir "production", no "demo"
# Si no, cambia de configuración:
npm run switch:cliente1
```

### "Error de Firebase: permiso denegado"

1. Verifica que las credenciales en `.env` son correctas
2. Confirma que el proyecto Firebase existe
3. Revisa las reglas de Firestore
4. Asegúrate de que el usuario existe en Authentication

### "No se ven cambios después de cambiar cliente"

```bash
# Reiniciar el servidor de desarrollo
# Ctrl+C para detener
npm run dev
```

---

## 📞 Contacto y Soporte

**Desarrollador**: David Monte  
**Email**: soporte@controldestock.com  
**Documentación completa**: `/docs/GUIA_CONFIGURACION_CLIENTE.md`

---

**Última actualización**: Noviembre 2024  
**Versión**: 2.0.0
