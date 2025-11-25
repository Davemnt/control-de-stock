# 🚀 Guía Rápida - Crear Usuario Administrador

## Método Rápido: Desde Firebase Console (5 minutos)

### ✅ Paso 1: Crear usuario en Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **control-de-stock-e4f5f**
3. En el menú lateral: **Authentication** → **Users**
4. Clic en **"Add user"** (Agregar usuario)
5. Completa:
   - **Email**: Tu email (ejemplo: admin@tuempresa.com)
   - **Password**: Mínimo 8 caracteres (ejemplo: Admin123!)
6. Clic en **"Add user"**
7. **MUY IMPORTANTE**: Copia el **User UID** que aparece (es un código largo como: `xB2k9mL3nP4qR5s6T7u8V`)

### ✅ Paso 2: Crear documento en Firestore

1. En el menú lateral: **Firestore Database**
2. Si dice "Create database", haz clic y selecciona:
   - **Start in production mode**
   - Ubicación: **southamerica-east1 (São Paulo)** (o la más cercana)
   - Clic en **Enable**
3. Una vez creada la base de datos:
   - Clic en **"Start collection"** (Iniciar colección)
   - **Collection ID**: `users` (exactamente así, en minúsculas)
   - Clic en **"Next"**
4. **Document ID**: Pega el **User UID** que copiaste en el Paso 1
5. Agrega estos campos uno por uno:

```
Campo 1:
  Name: email
  Type: string
  Value: admin@tuempresa.com (el mismo que usaste en el paso 1)

Campo 2:
  Name: name
  Type: string
  Value: Administrador

Campo 3:
  Name: role
  Type: string
  Value: admin

Campo 4:
  Name: active
  Type: boolean
  Value: ✓ true (marca el checkbox)

Campo 5:
  Name: createdAt
  Type: timestamp
  Value: [Click en el ícono del reloj para usar fecha actual]
```

6. Clic en **"Save"** (Guardar)

### ✅ Paso 3: Configurar reglas de seguridad

1. En **Firestore Database**, ve a la pestaña **"Rules"**
2. Borra TODO el contenido actual
3. Copia y pega el contenido del archivo `firestore.rules` de tu proyecto
4. Clic en **"Publish"**

### ✅ Paso 4: Verificar configuración

1. Abre tu aplicación en el navegador: **http://localhost:3000**
2. Presiona **F12** para abrir las herramientas de desarrollo
3. Ve a la pestaña **Console**
4. Si ves errores, cópialos y pégalos aquí

### ✅ Paso 5: Iniciar sesión

1. En la página de login, ingresa:
   - **Email**: admin@tuempresa.com (el que configuraste)
   - **Password**: Admin123! (la que configuraste)
2. Clic en **"Iniciar Sesión"**

---

## 📊 Plan Gratuito de Firebase

**No te preocupes por los costos**, el plan gratuito (Spark) incluye:

### Authentication

- ✅ **10,000 verificaciones** por mes
- ✅ **Gratis para siempre**

### Firestore Database

- ✅ **1 GB de almacenamiento**
- ✅ **50,000 lecturas por día**
- ✅ **20,000 escrituras por día**
- ✅ **20,000 eliminaciones por día**

### Storage (OPCIONAL)

- ✅ **5 GB de almacenamiento**
- ✅ **1 GB de descarga por día**
- ✅ **20,000 subidas por día**

Para una empresa pequeña/mediana esto es **MÁS QUE SUFICIENTE**.

---

## ❌ Si algo sale mal

### Error: "Permission denied"

**Solución**: Asegúrate de haber publicado las reglas de seguridad en Firestore

### Error: "User does not have a role"

**Solución**: Verifica que el documento en Firestore tenga todos los campos correctos

### Error: "Firebase: Error (auth/wrong-password)"

**Solución**: Contraseña incorrecta, verifica que sea la misma que creaste

### Error: "Firebase: Error (auth/user-not-found)"

**Solución**: El usuario no existe en Authentication, créalo primero

### La pantalla sigue en blanco

1. Presiona **F12** → **Console**
2. Copia todos los errores rojos que veas
3. Compártelos para ayudarte

---

## 🎯 Checklist Rápido

Antes de intentar iniciar sesión:

- [ ] Proyecto Firebase creado
- [ ] Authentication activado con Email/Password
- [ ] Usuario creado en Authentication (tienes el UID)
- [ ] Firestore Database creado
- [ ] Colección `users` creada con el documento del usuario
- [ ] Documento tiene los 5 campos: email, name, role, active, createdAt
- [ ] Reglas de seguridad publicadas en Firestore
- [ ] Archivo `.env` configurado correctamente
- [ ] Servidor corriendo en http://localhost:3000

---

¿Listo? ¡Adelante! 🚀
