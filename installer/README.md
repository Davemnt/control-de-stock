# 🚀 Control de Stock - Instalador Profesional

Sistema automatizado para desplegar Control de Stock a nuevos clientes.

## 📋 Requisitos Previos

- Node.js 18 o superior
- Firebase CLI instalado globalmente
- Cuenta de Google Cloud con Firebase habilitado
- Permisos de administrador en Firebase

## 🔧 Instalación del Instalador

```bash
npm install
```

## 📦 Contenido del Paquete

```
installer/
├── install.mjs           # Script principal de instalación
├── config.template.json  # Template de configuración
├── utils/
│   ├── firebase.mjs      # Utilidades de Firebase
│   ├── email.mjs         # Envío de credenciales
│   └── logger.mjs        # Sistema de logs
├── templates/
│   ├── .env.template     # Template de variables de entorno
│   ├── firestore.rules   # Reglas de seguridad
│   └── welcome-email.html # Email de bienvenida
└── docs/
    ├── MANUAL_INSTALACION.md
    └── MANUAL_CLIENTE.pdf
```

## 🎯 Uso

### Instalación Completa de Nuevo Cliente

```bash
npm run install-client
```

El instalador te guiará paso a paso para:

1. ✅ Crear proyecto Firebase nuevo
2. ✅ Configurar Firestore y Authentication
3. ✅ Desplegar aplicación web
4. ✅ Crear usuario administrador
5. ✅ Cargar datos de ejemplo (opcional)
6. ✅ Enviar credenciales por email
7. ✅ Generar documentación personalizada

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
