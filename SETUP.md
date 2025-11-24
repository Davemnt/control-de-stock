# 🚀 Guía de Configuración e Instalación

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- Cuenta de Firebase (gratuita)

## 🔧 Configuración Paso a Paso

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita los siguientes servicios:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage**

### 2. Configurar Authentication

1. En Firebase Console, ve a **Authentication**
2. Habilita el método de acceso **Email/Password**

### 3. Configurar Firestore

1. Ve a **Firestore Database**
2. Crea la base de datos en modo **producción**
3. Configura las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Materials collection
    match /materials/{materialId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'user');
    }
    
    // Movements collection
    match /movements/{movementId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'user');
    }
  }
}
```

### 4. Configurar Storage

1. Ve a **Storage**
2. Configura las reglas de seguridad:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /materials/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     (request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                      request.resource.contentType.matches('image/.*'));
    }
  }
}
```

### 5. Obtener Credenciales Firebase

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. En la sección **Your apps**, selecciona **Web** (</>)
3. Registra una nueva app con el nombre "Control de Stock"
4. Copia las credenciales del `firebaseConfig`

### 6. Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env`:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 7. Instalar Dependencias

```bash
npm install
```

### 8. Inicializar Base de Datos (Opcional)

Para crear el usuario administrador y datos de ejemplo:

```bash
node scripts/initFirebase.js
```

Esto creará:
- Usuario admin: `admin@eventos.com` / `Admin123!`
- Materiales de ejemplo en diferentes categorías

### 9. Ejecutar Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Primer Acceso

### Opción A: Con datos de ejemplo
Si ejecutaste el script de inicialización:
- **Email:** admin@eventos.com
- **Password:** Admin123!

### Opción B: Crear usuario manualmente
1. En Firebase Console > Authentication
2. Agrega un usuario manualmente
3. En Firestore, crea un documento en la colección `users`:

```json
{
  "uid": "uid_del_usuario_firebase",
  "name": "Tu Nombre",
  "email": "tu@email.com",
  "role": "admin",
  "active": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 📱 Características Principales

### Para Administradores
- ✅ Crear, editar y eliminar materiales
- ✅ Gestionar usuarios y roles
- ✅ Registrar movimientos de stock
- ✅ Ver historial completo
- ✅ Exportar reportes

### Para Usuarios
- ✅ Ver catálogo de materiales
- ✅ Registrar movimientos
- ✅ Ver historial
- ✅ Exportar reportes

### Para Invitados
- ✅ Consultar catálogo
- ✅ Ver historial (solo lectura)

## 🎨 Personalización

### Cambiar Colores
Edita las variables en `src/index.css`:

```css
:root {
  --c-brand: #de591f; /* Color principal */
  --c-dark: #262727;  /* Fondo oscuro */
  /* ... más variables ... */
}
```

### Agregar Categorías
Edita `src/constants/index.js`:

```javascript
export const CATEGORIES = {
  // ... categorías existentes ...
  TU_CATEGORIA: 'tu_categoria'
};
```

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 📊 Estructura de Datos

### Colecciones Firestore

#### users
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: 'admin' | 'user' | 'guest',
  active: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### materials
```javascript
{
  name: string,
  code: string,
  category: string,
  subcategory: string,
  quantity: number,
  quantityCommitted: number,
  quantityMaintenance: number,
  location: string,
  status: string,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string
}
```

#### movements
```javascript
{
  materialId: string,
  materialName: string,
  materialCode: string,
  type: string,
  quantity: number,
  previousQuantity: number,
  newQuantity: number,
  reason: string,
  project: string,
  notes: string,
  createdAt: timestamp,
  createdBy: string,
  userName: string
}
```

## 🐛 Solución de Problemas

### Error: Firebase not initialized
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Comprueba que todas las variables comiencen con `VITE_`
- Reinicia el servidor de desarrollo

### Error: Permission denied
- Revisa las reglas de seguridad en Firestore
- Verifica que el usuario esté autenticado
- Comprueba el rol del usuario en la colección `users`

### La aplicación no carga
- Limpia la caché: `npm run build` y vuelve a ejecutar `npm run dev`
- Verifica la consola del navegador para errores
- Comprueba que Firebase esté correctamente configurado

## 📞 Soporte

Para dudas o problemas, revisa:
- Documentación de Firebase: https://firebase.google.com/docs
- Documentación de Vite: https://vitejs.dev/
- Documentación de React: https://react.dev/

## 📝 Licencia

Este proyecto está desarrollado para uso profesional en productoras técnicas de eventos.
