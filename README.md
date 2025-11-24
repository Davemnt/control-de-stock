# 📦 Control de Stock - Sistema Profesional

Sistema profesional de gestión de inventario para productora técnica de eventos masivos internacionales.

## 🚀 Características

- **Sistema de autenticación** con roles (Administrador, Usuario, Invitado)
- **Gestión integral de stock** con categorías profesionales
- **Movimientos auditados** (entradas, salidas, transferencias, reparaciones)
- **Dashboard visual** con métricas y alertas
- **Historial completo** de cada material
- **Exportación** de reportes en PDF y Excel
- **Diseño responsive** mobile-first
- **Dark theme profesional**

## 🛠️ Tecnologías

- React 18 + Vite
- Firebase (Auth, Firestore, Storage)
- React Router DOM
- Lucide React (iconos)
- date-fns (manejo de fechas)
- jsPDF + xlsx (exportación)
- React Hot Toast (notificaciones)

## 📋 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
   - Crear proyecto en Firebase Console
   - Copiar `.env.example` a `.env`
   - Completar las variables de entorno con tus credenciales

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## 🔐 Usuarios por defecto

Al inicializar la aplicación, se creará un usuario administrador:

- **Email:** admin@eventos.com
- **Password:** Admin123!
- **Rol:** Administrador

## 📱 Roles y Permisos

### Administrador (Root)
- Acceso completo al sistema
- Crear/editar/eliminar usuarios
- Modificar stock manualmente
- Registrar nuevos materiales
- Ver historial completo

### Usuario Estándar
- Ver stock
- Registrar movimientos
- Retirar/ingresar materiales
- Cargar notas y observaciones

### Invitado/Técnico
- Solo consulta de stock
- Ver estado de materiales

## 📦 Categorías de Materiales

- Audio
- Iluminación
- Video
- Rigging
- Estructuras
- Cables y Accesorios
- Mochilas Técnicas
- Repuestos

## 🎨 Diseño

El sistema utiliza un diseño profesional y minimalista basado en variables CSS personalizadas:

- Dark theme principal
- Tipografía: AktivGrotesk
- Color brand: #de591f
- Interfaz limpia y moderna

## 📊 Funcionalidades Principales

1. **Dashboard**: Resumen visual del estado del stock
2. **Catálogo**: Lista completa con filtros avanzados
3. **Movimientos**: Registro de todas las operaciones
4. **Historial**: Auditoría completa por material
5. **Usuarios**: Gestión de accesos y roles (solo Admin)
6. **Reportes**: Exportación en PDF/Excel

## 🔧 Build para producción

```bash
npm run build
```

## 📄 Licencia

Desarrollado para uso profesional en productora técnica de eventos.
