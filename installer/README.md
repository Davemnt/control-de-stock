# 🚀 Control de Stock v2.0 - Instalador Profesional

## 🆕 NUEVA VERSIÓN 2.0 - DICIEMBRE 2025

Sistema automatizado para desplegar Control de Stock v2.0 a nuevos clientes.

### ✨ Nuevas Funcionalidades v2.0:

- ✅ **Responsive Design Completo**: 4 breakpoints específicos
- ✅ **Demo Separado**: Proyectos Firebase independientes
- ✅ **Código 100% Documentado**: +300 comentarios explicativos
- ✅ **Scripts de Deploy Dual**: Demo y producción separados
- ✅ **Guía para Trainee**: Transferible a cualquier desarrollador

## 📋 Requisitos Previos v2.0

### 🔧 Software Necesario:

- **Node.js 18 o superior** (LTS recomendado)
- **Firebase CLI instalado globalmente**: `npm install -g firebase-tools`
- **Git** (para clonación de repositorio)
- **Editor de código** (VS Code recomendado)

### ☁️ Cuentas Requeridas:

- **Cuenta Google Cloud** con Firebase habilitado
- **Permisos de administrador** en Firebase
- **Cuenta GitHub** (opcional, para deployments avanzados)

### 💻 Especificaciones Mínimas:

- **RAM**: 8GB mínimo (16GB recomendado)
- **Almacenamiento**: 2GB libres
- **Internet**: Conexión estable (para deploy)
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

## 🔧 Instalación del Instalador

```bash
npm install
```

## 📦 Contenido del Paquete v2.0

```
installer/
├── 📄 install.mjs                    # Script principal de instalación
├── 📄 install-client-autonomo.mjs    # Instalación autónoma
├── 📄 admin-panel.mjs               # Panel de administración
├── 📄 guia-rapida.mjs              # Guía rápida interactiva
├── 📄 package.json                 # Dependencias v2.0
├── 📄 .gitignore                   # Configuración Git
├── 📄 LICENCIA.md                  # Términos de licencia
├── 📄 README.md                    # Documentación principal
├── 📄 README_NUEVO.md              # Novedades v2.0
├── 📄 INSTALACION_AUTONOMA.md      # Guía instalación independiente
├── 📄 MODELO_DE_NEGOCIO.md         # Estrategias de monetización
└── 📄 SISTEMA_SUSCRIPCIONES.md     # Gestión de pagos recurrentes
```

## 🎯 Uso v2.0

### 🚀 Instalación Completa de Nuevo Cliente (RECOMENDADO)

```bash
npm run install-client
```

### 🆕 Instalación Autónoma (NUEVO)

```bash
npm run install-autonomo
```

### 🔧 Panel de Administración (NUEVO)

```bash
npm run admin
```

### 📚 Guía Rápida Interactiva (NUEVO)

```bash
npm run guia
```

## ✨ El Instalador v2.0 te guía para:

### 🔥 Funcionalidades Core:

1. ✅ **Crear 2 proyectos Firebase**: Demo + Producción separados
2. ✅ **Configurar Firestore y Authentication**
3. ✅ **Desplegar aplicación responsive**: Mobile-first design
4. ✅ **Setup demo independiente**: Con interfaz especial
5. ✅ **Crear usuario administrador**
6. ✅ **Configurar variables de entorno**

### 🆕 Nuevas Mejoras v2.0:

7. ✅ **Deploy dual automático**: Scripts de demo y producción
8. ✅ **Documentación trainee**: Código completamente comentado
9. ✅ **Responsive certificado**: 4 breakpoints específicos
10. ✅ **Separación garantizada**: Datos nunca se mezclan
11. ✅ Cargar datos de ejemplo (opcional)
12. ✅ Enviar credenciales por email
13. ✅ Generar documentación personalizada

### Opciones Disponibles

**Instalación Rápida** (configuración predeterminada):

```bash
npm run install-client -- --quick
```

**Instalación Personalizada** (paso a paso):

```bash
npm run install-client -- --interactive
```

**Solo Crear Proyecto** (sin desplegar):

```bash
npm run install-client -- --create-only
```

**Migrar Cliente Existente**:

```bash
npm run install-client -- --migrate
```

## 📊 Proceso de Instalación

### Paso 1: Información del Cliente

- Nombre de la empresa
- Email del administrador
- Dominio personalizado (opcional)
- Plan contratado (Basic/Pro/Enterprise)

### Paso 2: Configuración Técnica

- Crear proyecto Firebase
- Configurar reglas de seguridad
- Activar servicios necesarios
- Configurar límites de uso

### Paso 3: Despliegue

- Build de aplicación personalizada
- Deploy a Firebase Hosting
- Configuración de dominio custom
- Configuración de SSL

### Paso 4: Inicialización

- Crear usuario administrador
- Cargar categorías predefinidas
- Crear datos de ejemplo (opcional)
- Configurar notificaciones

### Paso 5: Entrega

- Generar credenciales seguras
- Enviar email de bienvenida
- Crear documentación personalizada
- Programar sesión de capacitación

## 💰 Planes y Configuraciones

### Plan Basic ($39/mes)

- Hasta 500 materiales
- 3 usuarios
- 1 GB storage
- Soporte email

### Plan Pro ($79/mes)

- Hasta 2000 materiales
- 10 usuarios
- 5 GB storage
- Soporte prioritario

### Plan Enterprise ($149/mes)

- Materiales ilimitados
- Usuarios ilimitados
- 20 GB storage
- Soporte 24/7
- Capacitación personalizada

## 🔐 Seguridad

- Credenciales almacenadas en `.env` local
- Tokens de Firebase con permisos limitados
- Logs de auditoría para cada instalación
- Backups automáticos configurados

## 📞 Soporte

**Desarrollador:** David Monte  
**Email:** montedavid07@hotmail.com  
**Documentación:** Ver carpeta `docs/`

## 🔄 Actualización de Clientes Existentes

Para actualizar clientes ya instalados:

```bash
node update-client.mjs
```

Selecciona el cliente de la lista y el script:

- Descarga última versión
- Hace backup automático
- Despliega nueva versión
- Verifica funcionamiento
- Notifica al cliente

## 📝 Registro de Instalaciones

Todas las instalaciones quedan registradas en:

- `logs/installations.json` - Historial completo
- `logs/clients.json` - Base de datos de clientes
- `logs/errors.json` - Registro de errores

## ⚠️ Solución de Problemas

### Error: "Firebase CLI not found"

```bash
npm install -g firebase-tools
```

### Error: "Permission denied"

```bash
firebase login
```

### Error: "Project already exists"

- Usar flag `--force` para sobrescribir
- O cambiar nombre del proyecto

## 📄 Licencia

Este instalador es PROPIETARIO y de uso exclusivo para David Monte.
No distribuir sin autorización.

---

**Versión:** 1.0.0  
**Última Actualización:** Diciembre 2025  
**Estado:** ✅ Producción
