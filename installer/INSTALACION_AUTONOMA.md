# 🔐 INSTALACIÓN AUTÓNOMA - CLIENTE GESTIONA SUS DATOS

## 📋 Comparación de Métodos

| Aspecto                   | Método A: Tú Gestionas         | Método B: Cliente Gestiona    |
| ------------------------- | ------------------------------ | ----------------------------- |
| **Proyecto Firebase**     | En tu cuenta                   | En cuenta del cliente         |
| **Acceso a datos**        | Tú tienes acceso total         | Solo el cliente               |
| **Responsabilidad legal** | Tuya                           | Del cliente                   |
| **Costos Firebase**       | Tú pagas, cliente te reembolsa | Cliente paga directo a Google |
| **Control del cliente**   | Limitado                       | Total                         |
| **Complejidad setup**     | Baja (15 min)                  | Media (30 min)                |
| **Precio recomendado**    | $600 + $40/mes                 | $900 + $60/mes                |

---

## 🎯 MÉTODO B: CLIENTE AUTÓNOMO (Recomendado para ti)

### ¿Por qué usar este método?

✅ **CERO responsabilidad sobre datos**
✅ **Sin riesgo legal** de privacidad
✅ **Cliente tiene control total**
✅ **Más profesional** y transparente
✅ **Cobras más** por la complejidad

---

## 📦 Archivos Creados

```
installer/
├── install.mjs                    # Instalador ORIGINAL (tú gestionas)
├── install-client-autonomo.mjs    # ⭐ NUEVO (cliente gestiona)
└── MODELO_DE_NEGOCIO.md          # Guía completa
```

---

## 🚀 CÓMO USAR EL INSTALADOR AUTÓNOMO

### Paso 1: El Cliente Prepara su Firebase

**El CLIENTE debe hacer estos pasos ANTES:**

#### 1.1 Crear Proyecto Firebase

```
1. Ir a: https://console.firebase.google.com
2. Clic en "Agregar proyecto"
3. Nombre: nombre-de-su-empresa
4. Desactivar Google Analytics (opcional)
5. Crear proyecto
```

#### 1.2 Activar Firestore

```
1. En el menú lateral → "Firestore Database"
2. Clic en "Crear base de datos"
3. Seleccionar: "Iniciar en modo de producción"
4. Ubicación: southamerica-east1 (São Paulo)
5. Habilitar
```

#### 1.3 Activar Authentication

```
1. En el menú lateral → "Authentication"
2. Clic en "Comenzar"
3. En "Sign-in method" → Activar "Correo electrónico/contraseña"
4. Guardar
```

#### 1.4 Obtener Credenciales Web

```
1. Ir a ⚙️ "Configuración del proyecto"
2. Scroll down → "Tus aplicaciones"
3. Clic en el ícono Web (</>)
4. Registrar app:
   - Alias: control-stock
   - NO activar Firebase Hosting aún
5. Copiar TODO el objeto firebaseConfig:

   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "proyecto.firebaseapp.com",
     projectId: "proyecto",
     storageBucket: "proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
```

#### 1.5 Dar Permisos Temporales (Importante)

```
1. En Firebase Console del proyecto
2. Ir a: ⚙️ → "Usuarios y permisos"
3. Clic en "Agregar miembro"
4. Email: TU_EMAIL@gmail.com
5. Rol: "Editor" (o "Firebase Admin")
6. Invitar

⚠️ El cliente puede revocar este acceso después de la instalación
```

---

### Paso 2: Tú Ejecutas el Instalador

```bash
cd installer
node install-client-autonomo.mjs
```

El script te pedirá:

1. **Credenciales de Firebase del cliente:**

   - Project ID
   - API Key
   - Auth Domain
   - Storage Bucket
   - Messaging Sender ID
   - App ID

2. **Información del administrador:**

   - Nombre de la empresa
   - Nombre del admin
   - Email del admin
   - Contraseña inicial

3. **Login de Firebase:**

   - Se abre navegador
   - **IMPORTANTE:** El CLIENTE debe iniciar sesión con su cuenta de Google
   - Autorizar acceso

4. **Instalación automática:**
   - Copia código fuente
   - Configura variables de entorno
   - Compila aplicación
   - Despliega a Firebase Hosting del cliente
   - Despliega reglas de Firestore
   - Genera documentación

---

### Paso 3: Crear Usuario Administrador

El script genera un archivo `createAdmin.mjs` que el cliente debe ejecutar:

```bash
cd temp/[proyecto-cliente]
npm install firebase
node createAdmin.mjs
```

Esto crea el usuario administrador en Authentication del cliente.

---

### Paso 4: Entregar al Cliente

Le envías:

1. **URL de acceso:** `https://proyecto-cliente.web.app`
2. **Credenciales:**
   - Email: admin@cliente.com
   - Password: [la que configuró]
3. **Archivo:** `INSTALACION_COMPLETA.md` (generado automáticamente)
4. **Instrucciones** para revocar tu acceso (opcional)

---

## 🔒 REVOCAR TU ACCESO (Cliente)

El cliente puede quitarte el acceso cuando quiera:

```
1. Ir a: https://console.firebase.google.com/project/[su-proyecto]/settings/iam
2. Buscar tu email en la lista
3. Clic en los 3 puntos → "Quitar acceso"
4. Confirmar
```

**Resultado:**

- ✅ Ya no puedes ver sus datos
- ✅ Aplicación sigue funcionando
- ✅ Cliente tiene control 100%

---

## 💰 PRECIOS SUGERIDOS

### Con Cliente Autónomo:

**Setup Inicial:** $800-900 USD

- Instalación completa
- Configuración Firebase del cliente
- Capacitación (2 horas)
- Documentación personalizada

**Soporte Mensual:** $50-70 USD/mes

- Actualizaciones de código
- Soporte técnico por email
- Acceso temporal para mantenimiento (con autorización)
- Sin costos de hosting (cliente paga a Google)

**Actualizaciones:** $100 USD/hora

- Nuevas funcionalidades
- Reportes personalizados
- Integraciones custom

---

## 📊 VENTAJAS PARA TI

### ✅ Legales:

- **Cero responsabilidad** sobre datos sensibles
- **Sin riesgo** de demandas por privacidad
- **Transparente** con el cliente
- **Cumples GDPR** sin esfuerzo

### ✅ Comerciales:

- **Cobras más** ($900 vs $600)
- **Cliente más satisfecho** (control total)
- **Más profesional** (separación clara)
- **Menos soporte** (cliente gestiona backups)

### ✅ Técnicas:

- **Sin costos** de hosting en tu bolsillo
- **Sin preocuparte** por límites de Firebase
- **Cliente escala** sin consultar contigo
- **Fácil de migrar** si cambian de proveedor

---

## ⚠️ DESVENTAJAS

### Para ti:

- ⚠️ **Más complejo** de explicar al cliente
- ⚠️ **Más tiempo** de instalación (30 min vs 15 min)
- ⚠️ **Cliente debe ser técnico** o confiar en ti
- ⚠️ **Menos control** sobre el entorno

### Para el cliente:

- ⚠️ **Debe crear** proyecto Firebase
- ⚠️ **Debe pagar** Firebase directamente
- ⚠️ **Debe gestionar** su propia infraestructura

---

## 🎯 RECOMENDACIÓN FINAL

### Usa el Método B (Cliente Autónomo) cuando:

✅ Cliente es mediano/grande
✅ Maneja datos sensibles/críticos
✅ Tiene presupuesto para infraestructura
✅ Valora la privacidad y control
✅ Es técnicamente capaz o tiene IT

### Usa el Método A (Tú Gestionas) cuando:

✅ Cliente es pequeño/emprendedor
✅ No tiene conocimientos técnicos
✅ Presupuesto limitado
✅ Prefiere simplicidad sobre control
✅ Confía en ti completamente

---

## 📧 TEMPLATE DE EMAIL PARA CLIENTE AUTÓNOMO

```
Asunto: 📋 Pasos previos - Instalación Control de Stock

Hola [Cliente],

Para instalar tu sistema de Control de Stock, necesito que completes
estos pasos en Firebase (plataforma de Google donde se alojará tu sistema).

⏰ Tiempo estimado: 15-20 minutos

📋 PASOS A SEGUIR:

1. CREAR PROYECTO FIREBASE
   → https://console.firebase.google.com
   → Agregar proyecto
   → Nombre: [tu-empresa]

2. ACTIVAR SERVICIOS
   → Firestore Database (base de datos)
   → Authentication (autenticación)

3. OBTENER CREDENCIALES
   → Configuración del proyecto (⚙️)
   → Agregar app Web
   → Copiar las credenciales

4. DARME ACCESO TEMPORAL
   → Usuarios y permisos
   → Agregar: [tu-email]
   → Rol: Editor

Te adjunto guía detallada con capturas de pantalla.

Una vez completado, agendamos una videollamada y hago la
instalación en 30 minutos.

Después de instalar, puedes quitarme el acceso cuando quieras.

¿Te viene bien el [fecha] a las [hora]?

Saludos,
[Tu nombre]
```

---

## 🛠️ TROUBLESHOOTING

### Error: "Permission denied"

**Causa:** El cliente no te dio permisos correctos

**Solución:**

```
1. Cliente va a Firebase Console
2. ⚙️ → Usuarios y permisos
3. Verifica que tu email tenga rol "Editor"
4. Si no está, agregar nuevamente
```

### Error: "Project not found"

**Causa:** Project ID incorrecto

**Solución:**

```
1. Verificar Project ID en Firebase Console
2. Debe ser todo en minúsculas
3. Ejemplo: mi-empresa-2024 (correcto)
4. Ejemplo: Mi Empresa (incorrecto)
```

### Error: "Firebase login required"

**Causa:** No has hecho login o expiró

**Solución:**

```
firebase logout
firebase login
(Usa cuenta que tiene permisos en el proyecto del cliente)
```

---

## 📞 SOPORTE

**Desarrollador:** David Monte  
**Email:** montedavid07@hotmail.com

---

**Última Actualización:** Diciembre 2025  
**Versión:** 2.0.0
