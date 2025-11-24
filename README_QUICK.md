# 🎯 Control de Stock - Sistema Profesional

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Firebase (ver SETUP.md)
cp .env.example .env
# Editar .env con tus credenciales

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir navegador
http://localhost:3000
```

## 📚 Documentación Completa

- **[SETUP.md](SETUP.md)** - Guía completa de configuración e instalación
- **[FEATURES.md](FEATURES.md)** - Lista detallada de todas las funcionalidades
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Checklist y guía de despliegue

## 🎨 Diseño y Variables

El sistema utiliza un tema oscuro profesional con variables CSS personalizadas:

```css
--c-brand: #de591f     /* Naranja corporativo */
--c-body: #262727      /* Fondo oscuro */
--c-text: #f6f6f6      /* Texto principal */
```

Ver `src/index.css` para todas las variables.

## 📦 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── contexts/        # Context API (Auth)
├── pages/           # Páginas principales
├── constants/       # Constantes y configuraciones
├── utils/           # Utilidades y helpers
├── firebase.js      # Configuración Firebase
├── App.jsx          # Router principal
└── main.jsx         # Entry point
```

## 🔑 Credenciales por Defecto

Después de ejecutar el script de inicialización:

```
Email: admin@eventos.com
Password: Admin123!
Rol: Administrador
```

## 🛠️ Scripts Disponibles

```bash
npm run dev       # Desarrollo con HMR
npm run build     # Build para producción
npm run preview   # Preview del build
npm run lint      # Verificar código
```

## 🔒 Roles y Permisos

### Administrador

- ✅ Acceso completo
- ✅ Gestión de usuarios
- ✅ Modificación de stock
- ✅ Todas las operaciones

### Usuario

- ✅ Ver stock
- ✅ Registrar movimientos
- ✅ Consultar historial
- ❌ Gestión de usuarios

### Invitado

- ✅ Solo consulta
- ❌ Modificaciones

## 🌐 Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool ultra-rápido
- **Firebase** - Backend as a Service
  - Authentication
  - Firestore Database
  - Storage
- **React Router** - Navegación
- **date-fns** - Manejo de fechas
- **Lucide React** - Iconos

## 📱 Características Principales

✅ Sistema de autenticación con 3 niveles de roles
✅ Gestión completa de inventario técnico
✅ 8 categorías de materiales profesionales
✅ Sistema de movimientos con auditoría
✅ Dashboard con métricas en tiempo real
✅ Historial completo y exportable
✅ Diseño responsive mobile-first
✅ Dark theme profesional

## 🎯 Casos de Uso

**Para Productoras de Eventos:**

- Control de inventario técnico completo
- Gestión de múltiples proyectos simultáneos
- Seguimiento de equipos prestados
- Planificación de mantenimientos

**Para Técnicos:**

- Consulta rápida de disponibilidad
- Registro de retiros/devoluciones
- Reporte de estados

**Para Administración:**

- Control de usuarios y accesos
- Trazabilidad completa
- Reportes exportables

## 🔐 Seguridad

- Autenticación Firebase
- Reglas de seguridad Firestore
- Validación de permisos por rol
- Rutas protegidas
- Sanitización de inputs

## 📊 Base de Datos

### Colecciones Firestore

**users**

- uid, name, email, role, active, timestamps

**materials**

- name, code, category, quantity, location, status, etc.

**movements**

- materialId, type, quantity, reason, user, timestamps

Ver `SETUP.md` para estructura detallada.

## 🚀 Despliegue

### Firebase Hosting (Recomendado)

```bash
npm run build
firebase deploy --only hosting
```

Ver `DEPLOYMENT.md` para guía completa.

## 🐛 Solución de Problemas

**Firebase not initialized**

- Verifica el archivo `.env`
- Todas las variables deben empezar con `VITE_`

**Permission denied**

- Revisa las reglas en Firebase Console
- Verifica que el usuario tenga rol asignado

**Build errors**

- `npm install` para reinstalar dependencias
- Verifica versiones de Node (v18+)

## 📞 Soporte

Para dudas técnicas:

- Firebase: https://firebase.google.com/docs
- React: https://react.dev/
- Vite: https://vitejs.dev/

## 📄 Licencia

Sistema desarrollado para uso profesional en productoras técnicas de eventos masivos internacionales.

---

**Versión:** 1.0.0
**Última actualización:** Noviembre 2025
**Estado:** ✅ Producción Ready
