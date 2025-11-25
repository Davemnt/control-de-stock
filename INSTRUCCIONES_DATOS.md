# 📝 Cómo Agregar Datos de Ejemplo

Hay **2 formas** de agregar los datos de ejemplo a tu aplicación:

## ✅ Opción 1: Desde la Aplicación Web (RECOMENDADO)

Esta es la forma más simple y segura:

1. **Abre tu aplicación**: https://control-de-stock-e4f5f.web.app

2. **Inicia sesión** con tu cuenta de administrador

3. **Agrega materiales manualmente** desde la página "Materiales":

   - Click en "Nuevo Material"
   - Completa el formulario con los datos de ejemplo que están abajo
   - Guarda cada material

4. **Crea movimientos** desde la página "Movimientos":
   - Click en "Nuevo Movimiento"
   - Selecciona el material
   - Completa los datos del movimiento
   - Guarda

### 🎯 Materiales de Ejemplo para Copiar/Pegar:

```
Material 1:
Nombre: Consola Digital Yamaha QL5
Código: AUD-001
Categoría: Audio
Subcategoría: Consolas Digitales
Cantidad: 3
Ubicación: Depósito Principal
Estado: operativo
Notas: Consola profesional 64 canales, incluye stage box

Material 2:
Nombre: Micrófono Shure SM58
Código: AUD-002
Categoría: Audio
Subcategoría: Micrófonos
Cantidad: 25
Ubicación: Depósito Principal
Estado: operativo
Notas: Micrófonos dinámicos cardio para voces

Material 3:
Nombre: Moving Head Robe Robin 600
Código: LUZ-001
Categoría: Iluminación
Subcategoría: Moving Heads
Cantidad: 12
Ubicación: Depósito Central
Estado: operativo
Notas: Moving heads LED con zoom 7-49 grados

Material 4:
Nombre: PAR LED 54x3W RGBW
Código: LUZ-002
Categoría: Iluminación
Subcategoría: PAR LED
Cantidad: 48
Ubicación: Depósito Principal
Estado: operativo
Notas: Proyectores LED RGBW para wash

Material 5:
Nombre: Pantalla LED P3.9 Indoor
Código: VID-001
Categoría: Video
Subcategoría: Pantallas LED
Cantidad: 60
Ubicación: Depósito Video
Estado: operativo
Notas: Módulos 50x50cm, resolución HD
```

---

## 🔧 Opción 2: Mediante Script (Requiere Firebase Admin)

Si prefieres usar el script automatizado, necesitas configurar Firebase Admin SDK:

### Paso 1: Obtener Credenciales de Administrador

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **control-de-stock-e4f5f**
3. Ve a **⚙️ Configuración del proyecto** > **Cuentas de servicio**
4. Click en **"Generar nueva clave privada"**
5. Descarga el archivo JSON (se llama algo como `control-de-stock-xxxxx-firebase-adminsdk.json`)
6. **Guarda este archivo** en la carpeta del proyecto como `serviceAccountKey.json`

### Paso 2: Instalar Dependencia

```powershell
npm install firebase-admin
```

### Paso 3: Crear Script con Admin SDK

El archivo `scripts/poblarDatosAdmin.mjs` ya está listo, solo necesitas:

```powershell
node scripts/poblarDatosAdmin.mjs
```

### ⚠️ IMPORTANTE: Seguridad

**NUNCA** subas `serviceAccountKey.json` a GitHub. Ya está en `.gitignore`.

---

## 🎨 Opción 3: Desde Firebase Console

También puedes agregar datos directamente desde la consola de Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Click en **Firestore Database**
4. Click en **"Agregar colección"** → Nombre: `materials`
5. Agrega documentos manualmente con los campos necesarios

---

## 📋 Estructura de Datos

### Material:

```json
{
  "name": "string",
  "code": "string",
  "category": "Audio|Iluminación|Video|Rigging|Estructuras|Cables|Mochilas Técnicas|Repuestos",
  "subcategory": "string",
  "quantity": number,
  "quantityCommitted": number,
  "quantityMaintenance": number,
  "location": "string",
  "status": "operativo",
  "notes": "string",
  "createdAt": timestamp,
  "updatedAt": timestamp,
  "createdBy": "userId"
}
```

### Movimiento:

```json
{
  "materialId": "string",
  "materialName": "string",
  "type": "entrada|salida|transferencia|ajuste",
  "quantity": number,
  "fromLocation": "string",
  "toLocation": "string",
  "reason": "string",
  "createdAt": timestamp,
  "createdBy": "userId",
  "createdByName": "string"
}
```

---

## 🚀 Recomendación Final

**La Opción 1 es la más recomendada** porque:

- ✅ No requiere configuración adicional
- ✅ Usa tu autenticación de administrador existente
- ✅ Es más segura (no expones credenciales)
- ✅ Te familiarizas con la interfaz de usuario
- ✅ Perfecta para demostrar en tu portfolio

Solo toma 10-15 minutos agregar manualmente 5-10 materiales y algunos movimientos, y así tu demo estará completa y funcional.
