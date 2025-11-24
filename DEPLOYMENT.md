# 📋 Checklist de Despliegue

## Antes de Desplegar

### 1. Configuración de Firebase
- [ ] Proyecto Firebase creado
- [ ] Authentication habilitada (Email/Password)
- [ ] Firestore Database creada
- [ ] Storage configurado
- [ ] Reglas de seguridad aplicadas (`firestore.rules` y `storage.rules`)
- [ ] Plan de facturación configurado (si es necesario)

### 2. Variables de Entorno
- [ ] Archivo `.env` creado en la raíz
- [ ] Todas las variables `VITE_FIREBASE_*` configuradas
- [ ] Credenciales verificadas

### 3. Base de Datos
- [ ] Script de inicialización ejecutado (`node scripts/initFirebase.js`)
- [ ] Usuario administrador creado
- [ ] Datos de prueba cargados (opcional)
- [ ] Colecciones verificadas en Firestore

### 4. Código
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` funciona correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Todas las funcionalidades probadas
- [ ] Responsive verificado en múltiples dispositivos

## Opciones de Despliegue

### Opción A: Firebase Hosting (Recomendado)

#### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login en Firebase
```bash
firebase login
```

#### 3. Inicializar Firebase Hosting
```bash
firebase init hosting
```
- Seleccionar el proyecto Firebase
- Build directory: `dist`
- Single-page app: `Yes`
- Setup automatic builds: `No` (por ahora)

#### 4. Build y Deploy
```bash
npm run build
firebase deploy --only hosting
```

#### 5. Verificar
- [ ] URL de producción funciona
- [ ] HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)

### Opción B: Vercel

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
npm run build
vercel
```

#### 3. Configurar Variables de Entorno
En el dashboard de Vercel, agregar todas las variables `VITE_FIREBASE_*`

### Opción C: Netlify

#### 1. Build
```bash
npm run build
```

#### 2. Deploy desde dashboard
- Subir carpeta `dist/`
- O conectar repositorio Git

#### 3. Configurar Variables de Entorno
Agregar variables `VITE_FIREBASE_*` en Settings > Environment

## Post-Despliegue

### Verificación
- [ ] Login funciona
- [ ] Dashboard carga correctamente
- [ ] Crear material funciona
- [ ] Registrar movimiento funciona
- [ ] Historial se muestra
- [ ] Exportar CSV funciona
- [ ] Gestión de usuarios funciona (admin)
- [ ] Responsive funciona en móvil
- [ ] Performance es aceptable (< 3s carga inicial)

### Monitoreo
- [ ] Firebase Console > Usage para ver consumo
- [ ] Analytics configurado (opcional)
- [ ] Error tracking configurado (opcional)

### Seguridad
- [ ] Reglas de Firestore activas
- [ ] Reglas de Storage activas
- [ ] HTTPS forzado
- [ ] CORS configurado correctamente

### Optimización
- [ ] Imágenes optimizadas
- [ ] Cache configurado
- [ ] CDN habilitado
- [ ] Compresión Gzip/Brotli activa

## Mantenimiento

### Backups
- [ ] Configurar backups automáticos de Firestore
- [ ] Exportar datos regularmente
- [ ] Guardar credenciales de forma segura

### Updates
- [ ] Mantener dependencias actualizadas
- [ ] Revisar security advisories
- [ ] Actualizar Firebase SDK periódicamente

### Soporte
- [ ] Documentar procedimientos
- [ ] Crear guía de usuario
- [ ] Configurar canal de soporte

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview de build
npm run preview

# Lint
npm run lint

# Firebase
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Ver logs de Firebase
firebase functions:log
```

## URLs Importantes

- Firebase Console: https://console.firebase.google.com
- Documentación: https://firebase.google.com/docs
- Estado de Firebase: https://status.firebase.google.com

## Notas

- El plan gratuito de Firebase (Spark) tiene límites generosos para empezar
- Monitorear el uso regularmente para evitar costos inesperados
- Mantener copias de seguridad de las reglas de seguridad
- Documentar cualquier configuración personalizada
