# 🔧 Actualizar Reglas de Firestore - URGENTE

## ⚠️ Necesitas hacer esto AHORA para que funcione

He actualizado las reglas de seguridad para que coincidan con tu aplicación.

## 📝 Pasos para publicar las reglas (2 minutos):

### 1. Ve a Firebase Console

- Abre: https://console.firebase.google.com/
- Selecciona tu proyecto: **control-de-stock-e4f5f**

### 2. Ve a Firestore Database

- En el menú lateral: **Firestore Database**
- Haz clic en la pestaña **"Rules"** (Reglas)

### 3. Copia las reglas actualizadas

- En VS Code, abre el archivo: `firestore.rules`
- Selecciona TODO el contenido (Ctrl + A)
- Copia (Ctrl + C)

### 4. Reemplaza en Firebase Console

- En Firebase Console, **BORRA TODO** el contenido del editor de reglas
- Pega el nuevo contenido (Ctrl + V)
- Haz clic en **"Publish"** (Publicar)

### 5. Espera 30 segundos

- Las reglas tardan unos segundos en aplicarse

### 6. Recarga tu aplicación

- Vuelve a http://localhost:3000
- Presiona Ctrl + Shift + R (recarga forzada)
- Intenta crear un material nuevamente

---

## ✅ Cambios realizados en el código:

1. **Validación mejorada**: Ahora convierte las cantidades a números
2. **Campos limpios**: Elimina espacios extras con `.trim()`
3. **Estados actualizados**: Las reglas ahora aceptan el estado "operativo"
4. **Mensajes de error claros**: Te dirá exactamente qué falló

---

## 🎯 Para crear un material exitosamente:

Asegúrate de completar:

- ✅ **Nombre** (obligatorio)
- ✅ **Código** (obligatorio)
- ✅ **Categoría** (obligatorio)
- ✅ **Cantidad** (puede ser 0)
- ✅ **Ubicación** (por defecto: "Depósito Principal")
- ✅ **Estado** (por defecto: "operativo")

Los demás campos son opcionales.

---

## 📋 Sobre createAdmin.mjs

**NO necesitas configurar credenciales en ese archivo** - ya las lee automáticamente del archivo `.env`.

El script está listo para usar, pero la forma más fácil es crear usuarios directamente desde Firebase Console (como ya lo hiciste).

---

## ❓ Si sigue sin funcionar:

1. Presiona **F12** en el navegador
2. Ve a la pestaña **Console**
3. Intenta crear un material
4. Copia el error completo que aparezca
5. Pégalo aquí para ayudarte

---

¡Actualiza las reglas en Firebase Console y debería funcionar! 🚀
