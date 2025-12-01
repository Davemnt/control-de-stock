# 📦 Control de Stock - Sistema Profesional

<div align="center">

![Control de Stock](https://img.shields.io/badge/Version-2.0.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.8-FFCA28?style=for-the-badge&logo=firebase)
![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)

**Sistema profesional de gestión de inventario para productoras técnicas de eventos**

[🏭 Producción](https://control-de-stock-e4f5f.web.app) • [🎭 Demo](https://control-stock-demo.web.app) • [📋 Portfolio](./PORTFOLIO.md) • [💼 Presupuesto](./PRESUPUESTO_CLIENTE.md)

</div>

---

## 🌐 Versiones Disponibles

### 🏭 **Versión PRODUCCIÓN**

**URL:** https://control-de-stock-e4f5f.web.app  
**Base de Datos:** Datos reales del cliente (privada y segura)  
**Acceso:** Restringido - Solo personal autorizado

### 🎭 **Versión DEMO**

**URL:** https://control-stock-demo.web.app  
**Base de Datos:** Completamente separada con datos ficticios  
**Acceso:** Público - Pruebas y demostraciones  
**Credenciales:** demo@demo.com / demo123

> ⚠️ **IMPORTANTE:** Ambas versiones están en proyectos Firebase completamente separados. No comparten información alguna.

---

## 🌟 Sobre el Proyecto

Control de Stock es una aplicación web profesional diseñada específicamente para productoras técnicas de eventos. Permite gestionar inventario de equipamiento profesional con trazabilidad completa, control de roles, escaneo de códigos de barras y exportación de reportes PDF.

### 🎯 Problema que Resuelve

En eventos profesionales, el control de equipamiento técnico (audio, iluminación, video, rigging) es crítico. Este sistema:

- ✅ Elimina pérdidas por falta de trazabilidad
- ✅ Optimiza la gestión de stock en tiempo real
- ✅ Reduce errores humanos en inventarios
- ✅ Proporciona auditoría completa de movimientos
- ✅ Facilita la gestión multi-usuario con permisos
- ✅ **Permite trabajar con múltiples usuarios simultáneamente**
- ✅ **Cierra sesión automáticamente al cerrar el navegador**
- ✅ **Soporta imágenes de materiales con compresión automática**

---

## 🚀 Características Principales

### 🔐 Sistema de Autenticación Robusto

- Autenticación con Firebase Authentication
- 3 niveles de permisos: **Admin**, **Usuario**, **Invitado (Demo)**
- Sesiones seguras con tokens JWT
- **✨ Cierre automático al cerrar navegador**
- **✨ Soporte para múltiples usuarios simultáneos**
- Protección contra inspección de código

### 📦 Gestión Integral de Materiales

- 8 categorías profesionales específicas para eventos
- Campos personalizables: código, ubicación, estado, cantidad
- Seguimiento de materiales en mantenimiento, comprometidos y disponibles
- **✨ Carga de imágenes con compresión automática (base64)**
- Subcategorías personalizadas

### 📊 Dashboard Visual e Intuitivo

- Métricas en tiempo real del stock
- Alertas de stock bajo y materiales en mantenimiento
- Últimos movimientos registrados
- Vista personalizada según rol del usuario

### 🔄 Registro de Movimientos Auditado

- 3 tipos: Entrada, Salida, Ajuste
- Historial completo (auditable)
- Registro automático de usuario y timestamp
- Campos: motivo, cantidad, ubicación
- Filtros avanzados por fecha, usuario, tipo

### 📱 Escaneo de Códigos de Barras

- Escaneo directo con cámara del dispositivo
- Soporta 7 formatos (CODE_128, CODE_39, EAN_13, EAN_8, UPC_A, UPC_E, QR_CODE)
- Integrado en formularios de materiales
- Compatible con móviles y tablets

### 📄 Exportación a PDF Profesional

- Generación de reportes en PDF con diseño profesional
- Exportación de catálogo completo o filtrado
- Tablas formateadas con colores corporativos
- Descarga automática con nombre descriptivo

### 👥 Gestión de Usuarios (Solo Admin)

- Crear, editar usuarios
- Asignación de roles y permisos
- **✨ Soporte para múltiples empleados trabajando simultáneamente**
- Control de accesos granular

### 🎯 Modo Demostración

- Base de datos completamente separada
- 10+ materiales de ejemplo pre-cargados
- Banner visual indicando modo demo
- Ideal para capacitaciones y presentaciones

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 18.2** - Framework JavaScript moderno
- **Vite 5.1** - Build tool ultrarrápido con HMR
- **React Router 6** - Navegación SPA
- **Lucide React** - Iconografía profesional
- **React Hot Toast** - Notificaciones elegantes

### Backend & Base de Datos

- **Firebase Authentication** - Sistema de autenticación seguro
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Hosting web con CDN global y SSL

### Librerías Adicionales

- **html5-qrcode 2.3.8** - Escaneo de códigos de barras y QR
- **jsPDF + jsPDF-AutoTable** - Exportación de reportes PDF

---

## 🎨 Diseño y UX

### Paleta de Colores

```css
--c-brand: #de591f      /* Naranja principal */
--c-body: #262727       /* Fondo oscuro */
--c-surface: #323333    /* Superficies */
--c-text: #f6f6f6       /* Texto principal */
--c-success: #4ade80    /* Verde éxito */
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
✅ Subir imágenes de materiales
```

### 👤 Usuario Estándar

```
✅ Ver stock completo
✅ Registrar movimientos (entrada/salida)
✅ Ver historial completo
✅ Buscar y filtrar materiales
✅ Exportar reportes
⛔ No puede crear usuarios
⛔ No puede eliminar materiales
```

### 👁️ Invitado (Demo)

```
✅ Solo consulta de stock demo
✅ Ver estado de materiales
✅ Búsqueda básica
✅ Exportar reportes
⛔ No puede modificar nada
⛔ Solo lectura
```

---

## 🎬 Demo en Vivo

### 🔗 Acceso al Sistema

**🌐 URL:** https://control-de-stock-e4f5f.web.app

### 🔐 Credenciales

**Administrador:**

```
Email: montedavid07@hotmail.com
Password: Moroni1032!
```

**Modo Demostración:**

```
Email: demo@demo.com
Password: demo123
```

---

## 📋 Guía de Inicio Rápido

### Requisitos Previos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Cuenta de Firebase** - [Crear cuenta gratis](https://firebase.google.com/)

### Instalación Local

```bash
# 1. Clonar repositorio
git clone https://github.com/Davemnt/control-de-stock.git
cd control-de-stock

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env con tus credenciales de Firebase

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173
```

### Variables de Entorno (.env)

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

---

## 🚀 Build para Producción

```bash
# Construir aplicación optimizada
npm run build

# Los archivos estarán en /dist
```

### Deploy en Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Desplegar
firebase deploy --only hosting
```

---

## 📚 Documentación Adicional

- 📋 **[PORTFOLIO.md](./PORTFOLIO.md)** - Portfolio técnico completo del proyecto
- 💼 **[PRESUPUESTO_CLIENTE.md](./PRESUPUESTO_CLIENTE.md)** - Presupuesto comercial detallado
- 🔐 **[firestore.rules](./firestore.rules)** - Reglas de seguridad de Firestore
- 📜 **[scripts/](./scripts/)** - Scripts de administración y utilidades

---

## 🛠️ Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter de código
```

### Scripts de Administración

```bash
# Crear materiales de ejemplo
node scripts/createAdminMaterials.mjs

# Limpiar datos demo
node scripts/cleanDemoData.mjs

# Cambiar email del admin
node scripts/cambiarEmailAdmin.mjs

# Reactivar cuenta original
node scripts/reactivarCuentaOriginal.mjs
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código propietario. © 2025 David Montenegro.

---

## 👨‍💻 Autor

**David Montenegro**

- Email: montedavid07@hotmail.com
- GitHub: [@Davemnt](https://github.com/Davemnt)
- LinkedIn: [Tu perfil]

---

## 🙏 Tecnologías Utilizadas

- [React](https://react.dev/) - Framework de UI
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Iconos
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - Escaneo de códigos
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDFs

---

## 📊 Estadísticas del Proyecto

- 📅 **Tiempo de Desarrollo:** 4 semanas
- 💻 **Líneas de Código:** ~8,500
- 🧩 **Componentes React:** 25+
- 📄 **Páginas:** 7 principales
- ⚡ **Performance:** Lighthouse 90+
- 🌐 **Deploy:** Firebase Hosting

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐**

**Estado:** ✅ En Producción | **Versión:** 2.0.0 | **Última actualización:** Diciembre 2025

Hecho con ❤️ por David Montenegro

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
