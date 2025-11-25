# 📦 Control de Stock - Sistema Profesional

<div align="center">

![Control de Stock](https://img.shields.io/badge/Version-2.0.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.8-FFCA28?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistema profesional de gestión de inventario para productoras técnicas de eventos masivos internacionales**

[Demo en Vivo](#-demo) • [Documentación](#-documentación) • [Instalación](#-guía-de-instalación-paso-a-paso) • [Capturas](#-capturas-de-pantalla)

</div>

---

## 🌟 Sobre el Proyecto

Control de Stock es una aplicación web profesional diseñada específicamente para productoras técnicas de eventos internacionales. Permite gestionar inventario de equipamiento profesional con trazabilidad completa, control de roles y auditoría de movimientos.

### 🎯 Problema que Resuelve

En eventos masivos, el control de equipamiento técnico (audio, iluminación, video, rigging) es crítico. Este sistema:

- ✅ Elimina pérdidas por falta de trazabilidad
- ✅ Optimiza la gestión de stock en tiempo real
- ✅ Reduce errores humanos en inventarios
- ✅ Proporciona auditoría completa de movimientos
- ✅ Facilita la gestión multi-usuario con permisos

---

## 🚀 Características Principales

### 🔐 Sistema de Autenticación Robusto

- Autenticación con Firebase Authentication
- 3 niveles de permisos: **Admin**, **Usuario**, **Invitado**
- Sesiones seguras con tokens JWT
- Validación de permisos en tiempo real

### 📦 Gestión Integral de Materiales

- 8 categorías profesionales específicas para eventos
- Campos personalizables: código, ubicación, estado, cantidad
- Seguimiento de materiales en mantenimiento, comprometidos y disponibles
- Carga de imágenes y documentos adjuntos
- Subcategorías y etiquetas personalizadas

### 📊 Dashboard Visual e Intuitivo

- Métricas en tiempo real del stock
- Alertas de stock bajo y materiales en mantenimiento
- Gráficos de uso por categoría
- Resumen de movimientos del día
- Vista personalizada según rol del usuario

### 🔄 Registro de Movimientos Auditado

- 4 tipos: Entrada, Salida, Transferencia, Ajuste
- Historial inmutable (no editable una vez guardado)
- Firma digital con usuario y timestamp
- Campos obligatorios: motivo, cantidad, ubicación
- Filtros avanzados por fecha, usuario, tipo

### 📈 Historial Completo y Trazabilidad

- Seguimiento completo de cada material desde su ingreso
- Línea de tiempo visual de movimientos
- Exportación de reportes en PDF y Excel
- Búsqueda avanzada con múltiples filtros

### 📱 Escaneo de Códigos de Barras ⭐ NUEVO

- Escaneo directo con cámara del dispositivo
- Soporta múltiples formatos (Code 128, EAN, QR)
- Integrado en formularios de materiales
- Compatible con móviles y tablets

### 📄 Exportación a PDF Profesional ⭐ NUEVO

- Generación de reportes en PDF con diseño profesional
- Exportación de inventario completo o filtrado
- Historial de movimientos en PDF
- Tablas formateadas con resúmenes estadísticos

### 👥 Gestión de Usuarios (Solo Admin)

- Crear, editar, activar/desactivar usuarios
- Asignación de roles y permisos
- Registro de última actividad
- Control de accesos granular

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 18.2** - Librería de UI moderna y eficiente
- **Vite 5.1** - Build tool ultrarrápido con HMR
- **React Router DOM 6.22** - Enrutamiento SPA
- **Lucide React** - Librería de iconos profesionales
- **date-fns** - Manejo robusto de fechas

### Backend & Base de Datos

- **Firebase Authentication** - Sistema de autenticación seguro
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Storage** - Almacenamiento de imágenes (opcional)
- **Firebase Security Rules** - Reglas de seguridad server-side

### Librerías Adicionales

- **html5-qrcode** - Escaneo de códigos de barras y QR
- **jsPDF + jsPDF-AutoTable** - Exportación de reportes PDF
- **XLSX** - Exportación de reportes Excel
- **React Hot Toast** - Sistema de notificaciones elegante

---

## 🎨 Diseño y UX

### Paleta de Colores

```css
--c-brand: #de591f      /* Naranja principal */
--c-body: #262727       /* Fondo oscuro */
--c-surface: #2e2f2f    /* Superficies */
--c-text: #e8e9ea       /* Texto principal */
--c-success: #10b981    /* Verde éxito */
--c-error: #ef4444      /* Rojo error */
```

### Características de Diseño

- 🌙 **Dark Theme** profesional y elegante
- 📱 **Mobile-First** - Totalmente responsive
- ⚡ **Micro-interacciones** - Feedback visual inmediato
- ♿ **Accesible** - Contraste WCAG AA
- 🎯 **Minimalista** - UI limpia sin distracciones

---

## 📦 Categorías de Materiales

El sistema está optimizado para 8 categorías profesionales:

| Categoría                | Ejemplos                        | Uso Principal        |
| ------------------------ | ------------------------------- | -------------------- |
| 🎵 **Audio**             | Consolas, micrófonos, speakers  | Sistemas de sonido   |
| 💡 **Iluminación**       | Moving heads, PAR LED, consolas | Diseño lumínico      |
| 📹 **Video**             | LED walls, cámaras, proyectores | Pantallas y mapping  |
| ⚙️ **Rigging**           | Motores, cadenas, trusses       | Estructuras elevadas |
| 🏗️ **Estructuras**       | Escenarios, tarimas, gradas     | Montaje físico       |
| 🔌 **Cables**            | Multipar, DMX, energía          | Conectividad         |
| 🎒 **Mochilas Técnicas** | Kits de herramientas            | Mantenimiento        |
| 🔧 **Repuestos**         | Lámparas, fusibles, conectores  | Reemplazos           |

---

## 📱 Roles y Permisos

### 👑 Administrador

```
✅ Acceso total al sistema
✅ Crear/editar/eliminar usuarios
✅ Gestionar materiales (CRUD completo)
✅ Registrar movimientos
✅ Ver historial completo
✅ Exportar reportes
✅ Configuración del sistema
```

### 👤 Usuario Estándar

```
✅ Ver stock completo
✅ Registrar movimientos (entrada/salida)
✅ Cargar notas y observaciones
✅ Buscar y filtrar materiales
⛔ No puede crear usuarios
⛔ No puede eliminar materiales
```

### 👁️ Invitado/Técnico

```
✅ Solo consulta de stock
✅ Ver estado de materiales
✅ Búsqueda básica
⛔ No puede modificar nada
⛔ No puede ver reportes
```

---

## 📋 Guía de Instalación Paso a Paso

### Requisitos Previos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Cuenta de Firebase** - [Crear cuenta gratis](https://firebase.google.com/)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Davemnt/control-de-stock.git
cd control-de-stock
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase

1. **Crear Proyecto en Firebase:**

   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Clic en "Agregar proyecto"
   - Nombre: `control-stock-eventos`
   - Desactiva Google Analytics (opcional)

2. **Activar Authentication:**

   - En el menú: Build → Authentication
   - Clic en "Comenzar"
   - Habilita: **Email/Password**

3. **Crear Firestore Database:**

   - En el menú: Build → Firestore Database
   - Clic en "Crear base de datos"
   - Modo: **Producción**
   - Ubicación: `southamerica-east1` (São Paulo)

4. **Obtener Credenciales:**
   - Clic en el ícono ⚙️ → Configuración del proyecto
   - Scroll a "Tus aplicaciones" → clic en ícono Web `</>`
   - Copia el objeto `firebaseConfig`

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Paso 5: Configurar Reglas de Seguridad

1. En Firestore Database → pestaña **Rules**
2. Copia el contenido de `firestore.rules` del proyecto
3. Pégalo y haz clic en **Publicar**

### Paso 6: Crear Usuario Administrador

**Opción A: Desde Firebase Console**

1. Authentication → Users → Add user
2. Email: `admin@tuempresa.com`
3. Password: Mínimo 8 caracteres
4. Copia el **UID** del usuario
5. En Firestore → Colección `users` → Nuevo documento
6. Document ID: El UID copiado
7. Campos:
   ```
   email: "admin@tuempresa.com"
   name: "Administrador"
   role: "admin"
   active: true
   createdAt: [timestamp actual]
   ```

### Paso 7: Ejecutar el Proyecto

```bash
npm run dev
```

Abre: **http://localhost:3000**

---

## 🎬 Demo

### 🔗 Enlaces del Proyecto

- **Demo en Vivo:** [https://control-stock-eventos.web.app](https://control-stock-eventos.web.app) _(próximamente)_
- **Repositorio GitHub:** [https://github.com/Davemnt/control-de-stock](https://github.com/Davemnt/control-de-stock)
- **Documentación Completa:** [Ver docs](./FIREBASE_SETUP_GUIDE.md)
- **Guía de Inicio Rápido:** [Ver guía](./QUICK_START.md)

### 🎥 Video Demo

_[Próximamente - Video demostrativo en YouTube]_

---

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en `/dist`

### Deploy en Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📚 Documentación

- 📖 [Guía Completa de Firebase](./FIREBASE_SETUP_GUIDE.md)
- 🚀 [Inicio Rápido](./QUICK_START.md)
- ⚙️ [Configuración Avanzada](./SETUP.md)
- 🎯 [Características Detalladas](./FEATURES.md)
- 💡 [Ejemplos de Uso](./EXAMPLES.md)
- 🚢 [Guía de Deploy](./DEPLOYMENT.md)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles.

---

## 👨‍💻 Autor

**David Monte**

- GitHub: [@Davemnt](https://github.com/Davemnt)
- Portfolio: [tu-portfolio.com](#)
- LinkedIn: [David Monte](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- [Firebase](https://firebase.google.com/) por la infraestructura backend
- [React](https://react.dev/) por la librería de UI
- [Vite](https://vitejs.dev/) por el build tool
- [Lucide](https://lucide.dev/) por los iconos

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️

</div>
