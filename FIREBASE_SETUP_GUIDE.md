# 🔥 Guía Completa de Configuración de Firebase

## 📋 Índice

1. [Crear Proyecto en Firebase](#1-crear-proyecto-en-firebase)
2. [Configurar Authentication](#2-configurar-authentication)
3. [Configurar Firestore Database](#3-configurar-firestore-database)
4. [Configurar Storage](#4-configurar-storage)
5. [Obtener Credenciales](#5-obtener-credenciales)
6. [Configurar Archivo .env](#6-configurar-archivo-env)
7. [Crear Usuario Administrador](#7-crear-usuario-administrador)
8. [Sistema de Seguridad](#8-sistema-de-seguridad)
9. [Solución de Problemas](#9-solución-de-problemas)

---

## 1. Crear Proyecto en Firebase

### Paso 1.1: Ir a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**

### Paso 1.2: Configurar el proyecto

1. **Nombre del proyecto**: Escribe `control-stock-eventos` (o el nombre que prefieras)
2. **Google Analytics**: Puedes desactivarlo o dejarlo activado (recomendado)
3. Haz clic en **"Crear proyecto"**
4. Espera a que se complete la configuración (30-60 segundos)

---

## 2. Configurar Authentication

### Paso 2.1: Activar Authentication

1. En el menú lateral, haz clic en **"Build"** → **"Authentication"**
2. Haz clic en **"Get started"** o **"Comenzar"**

### Paso 2.2: Activar método de inicio de sesión

1. Ve a la pestaña **"Sign-in method"**
2. Busca **"Email/Password"** (Correo electrónico/Contraseña)
3. Haz clic en él
4. **Activa** el switch de "Enable" (Activar)
5. **NO actives** "Email link (passwordless sign-in)"
6. Haz clic en **"Save"** (Guardar)

### ✅ Authentication configurado correctamente

---

## 3. Configurar Firestore Database

### Paso 3.1: Crear la base de datos

1. En el menú lateral, haz clic en **"Build"** → **"Firestore Database"**
2. Haz clic en **"Create database"** (Crear base de datos)

### Paso 3.2: Configurar modo de seguridad

1. Selecciona **"Start in production mode"** (Iniciar en modo de producción)
2. Haz clic en **"Next"** (Siguiente)

### Paso 3.3: Seleccionar ubicación

1. Elige la ubicación más cercana a tus usuarios:
   - Para América del Sur: `southamerica-east1 (São Paulo)`
   - Para América del Norte: `us-central1 (Iowa)` o `us-east1 (South Carolina)`
   - Para Europa: `europe-west1 (Belgium)`
2. Haz clic en **"Enable"** (Habilitar)
3. Espera a que se cree la base de datos (1-2 minutos)

### Paso 3.4: Configurar reglas de seguridad

1. Ve a la pestaña **"Rules"** (Reglas)
2. Verás un editor con las reglas actuales
3. **REEMPLAZA TODO** el contenido con las reglas del archivo `firestore.rules`
4. Haz clic en **"Publish"** (Publicar)

```javascript
// El contenido completo está en firestore.rules
// Asegúrate de copiar TODAS las reglas del archivo
```

### ✅ Firestore Database configurado correctamente

---

## 4. Configurar Storage

### Paso 4.1: Activar Storage

1. En el menú lateral, haz clic en **"Build"** → **"Storage"**
2. Haz clic en **"Get started"** (Comenzar)

### Paso 4.2: Configurar modo de seguridad

1. Selecciona **"Start in production mode"**
2. Haz clic en **"Next"**

### Paso 4.3: Seleccionar ubicación

1. Elige la **MISMA ubicación** que seleccionaste para Firestore
2. Haz clic en **"Done"** (Listo)

### Paso 4.4: Configurar reglas de seguridad

1. Ve a la pestaña **"Rules"** (Reglas)
2. **REEMPLAZA TODO** el contenido con las reglas del archivo `storage.rules`
3. Haz clic en **"Publish"** (Publicar)

```javascript
// El contenido completo está en storage.rules
// Asegúrate de copiar TODAS las reglas del archivo
```

### ✅ Storage configurado correctamente

---

## 5. Obtener Credenciales

### Paso 5.1: Registrar aplicación web

1. En la página principal del proyecto, busca el ícono **</>** (Web)
2. Haz clic en él
3. **Nombre de la app**: Escribe `Control de Stock Web`
4. **NO marques** "Also set up Firebase Hosting"
5. Haz clic en **"Register app"** (Registrar aplicación)

### Paso 5.2: Copiar configuración

Verás un objeto de configuración como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxx...",
};
```

### Paso 5.3: Guardar las credenciales

**¡IMPORTANTE!** Copia estos valores, los necesitarás en el siguiente paso.

También puedes acceder a estas credenciales en cualquier momento:

1. Haz clic en el ícono de **⚙️ Settings** (Configuración)
2. Ve a **"Project settings"** (Configuración del proyecto)
3. Scroll hacia abajo hasta **"Your apps"** (Tus aplicaciones)
4. Busca tu aplicación web

---

## 6. Configurar Archivo .env

### Paso 6.1: Abrir el archivo .env

En la raíz de tu proyecto, abre el archivo `.env`

### Paso 6.2: Completar las variables

Reemplaza los valores con las credenciales que copiaste:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDxxx...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxx...
```

### Paso 6.3: Guardar el archivo

**Importante**:

- NO compartas este archivo
- Asegúrate de que `.env` esté en tu `.gitignore`
- Nunca subas estas credenciales a GitHub

### ✅ Credenciales configuradas correctamente

---

## 7. Crear Usuario Administrador

### Opción A: Desde Firebase Console (Recomendado)

#### Paso 7.1: Crear usuario en Authentication

1. Ve a **"Authentication"** → **"Users"**
2. Haz clic en **"Add user"** (Agregar usuario)
3. **Email**: `admin@tuempresa.com` (usa tu email real)
4. **Password**: Crea una contraseña segura (mínimo 8 caracteres)
5. Haz clic en **"Add user"** (Agregar usuario)
6. **IMPORTANTE**: Copia el **User UID** que aparece

#### Paso 7.2: Crear documento en Firestore

1. Ve a **"Firestore Database"** → **"Data"**
2. Haz clic en **"Start collection"** (Iniciar colección)
3. **Collection ID**: `users`
4. Haz clic en **"Next"**
5. **Document ID**: Pega el **User UID** que copiaste
6. Agrega los siguientes campos:

```
Campo: email          | Tipo: string    | Valor: admin@tuempresa.com
Campo: name           | Tipo: string    | Valor: Administrador
Campo: role           | Tipo: string    | Valor: admin
Campo: active         | Tipo: boolean   | Valor: true
Campo: createdAt      | Tipo: timestamp | Valor: [click en reloj para usar fecha actual]
```

7. Haz clic en **"Save"** (Guardar)

### Opción B: Usando el script de inicialización

```bash
# En la terminal, ejecuta:
npm run init-firebase
```

Sigue las instrucciones del script para crear el usuario administrador.

### ✅ Usuario administrador creado correctamente

---

## 8. Sistema de Seguridad

### 🛡️ Capas de Seguridad Implementadas

#### 1. **Autenticación Obligatoria**

- Todos los usuarios deben estar autenticados con Firebase Authentication
- Las sesiones expiran automáticamente según la configuración de Firebase
- Los tokens de autenticación se validan en cada operación

#### 2. **Control de Acceso por Roles**

| Rol     | Permisos                                         |
| ------- | ------------------------------------------------ |
| `admin` | Acceso total: Crear, leer, actualizar, eliminar  |
| `user`  | Leer todo, crear/editar materiales y movimientos |
| `guest` | Solo lectura (no puede modificar nada)           |

#### 3. **Validación de Datos**

Todas las operaciones validan:

- ✅ Tipos de datos correctos (string, number, boolean, timestamp)
- ✅ Valores permitidos (categorías, estados, tipos de movimiento)
- ✅ Campos obligatorios presentes
- ✅ Rangos válidos (cantidad >= 0)

#### 4. **Inmutabilidad del Historial**

- Los movimientos (`movements`) **NO pueden modificarse ni eliminarse**
- Garantiza trazabilidad completa
- Cumple con requisitos de auditoría

#### 5. **Protección de Datos Críticos**

- Los campos `createdAt` y `createdBy` no pueden modificarse
- Los emails de usuario no pueden cambiar después de la creación
- Los administradores no pueden eliminar su propia cuenta

#### 6. **Seguridad en Storage**

- Solo imágenes permitidas: JPEG, PNG, WebP, GIF
- Tamaño máximo: 5MB para materiales, 2MB para avatares
- Nombres de archivo validados (sin caracteres especiales peligrosos)
- Validación de content-type

#### 7. **Protección contra Ataques Comunes**

**SQL Injection**: No aplica (NoSQL)
**XSS**: Validación de nombres de archivo y datos
**CSRF**: Tokens de Firebase
**DoS**: Límites de tamaño de archivo
**Path Traversal**: Validación estricta de rutas

### 🔒 Mejores Prácticas Implementadas

1. **Principio de Menor Privilegio**: Cada usuario solo puede hacer lo necesario
2. **Defensa en Profundidad**: Múltiples capas de validación
3. **Fail Secure**: Por defecto, todo está denegado (`allow read, write: if false`)
4. **Auditoría Completa**: Registro inmutable de todos los movimientos
5. **Separación de Datos**: Colecciones organizadas por tipo y acceso

---

## 9. Solución de Problemas

### ❌ Error: "Permission denied"

**Causa**: Las reglas de seguridad no están publicadas correctamente
**Solución**:

1. Ve a Firestore Database → Rules
2. Verifica que las reglas estén publicadas
3. Espera 1-2 minutos para que se propaguen

### ❌ Error: "User does not have a role"

**Causa**: El documento del usuario en Firestore no existe
**Solución**:

1. Ve a Firestore Database → users
2. Verifica que existe un documento con el UID del usuario
3. Asegúrate de que tiene el campo `role` con valor válido

### ❌ Error: "Firebase not configured"

**Causa**: El archivo `.env` no está configurado
**Solución**:

1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Confirma que todas las variables VITE*FIREBASE*\* tienen valores
3. Reinicia el servidor de desarrollo (`npm run dev`)

### ❌ Error: "Failed to get document"

**Causa**: Firestore Database no está creada
**Solución**:

1. Ve a Firestore Database en Firebase Console
2. Si no existe, créala siguiendo el paso 3
3. Publica las reglas de seguridad

### ❌ Error: "Storage: Object not found"

**Causa**: Storage no está habilitado
**Solución**:

1. Ve a Storage en Firebase Console
2. Si no está habilitado, habilítalo siguiendo el paso 4
3. Publica las reglas de seguridad

---

## 🎯 Checklist Final

Antes de usar la aplicación, verifica que:

- [ ] Proyecto de Firebase creado
- [ ] Authentication activado con Email/Password
- [ ] Firestore Database creado y reglas publicadas
- [ ] Storage habilitado y reglas publicadas
- [ ] Archivo `.env` configurado con todas las credenciales
- [ ] Usuario administrador creado en Authentication y Firestore
- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Puedes hacer login con el usuario administrador

---

## 📞 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Reglas de Seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Reglas de Seguridad de Storage](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## 🔐 Notas de Seguridad Importantes

1. **NUNCA compartas tu archivo `.env`**
2. **Usa contraseñas seguras** (mínimo 8 caracteres, con mayúsculas, números y símbolos)
3. **Revisa las reglas de seguridad** periódicamente
4. **Mantén Firebase SDK actualizado**
5. **Monitorea el uso** en Firebase Console para detectar actividades sospechosas
6. **Habilita App Check** (opcional) para protección adicional contra bots

---

¡Tu aplicación ahora está protegida con múltiples capas de seguridad! 🔒✨
