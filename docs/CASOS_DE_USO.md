# 🎯 Casos de Uso Prácticos - Multi-Cliente

## Escenarios Reales de Implementación

---

## 📋 Caso 1: Mostrar a un Cliente Potencial

### Contexto

Tienes una reunión con "Producciones XYZ" y quieres mostrarles el sistema funcionando con su marca.

### Solución Paso a Paso

#### 1. Preparación Previa (30 minutos)

```bash
# A. Crear proyecto Firebase "control-stock-xyz"
# En Firebase Console:
# - Nuevo proyecto
# - Habilitar Authentication (Email/Password)
# - Crear Firestore Database
# - Copiar credenciales

# B. Crear archivo de configuración
cp .env.example .env.cliente-xyz

# Editar .env.cliente-xyz:
VITE_FIREBASE_PROJECT_ID=control-stock-xyz
# ... [otras credenciales del paso A]
VITE_APP_MODE=production
VITE_CLIENT_NAME=xyz
```

#### 2. Personalizar Marca (10 minutos)

```javascript
// src/config/clientConfig.js
xyz: {
  appName: 'Stock Manager - Producciones XYZ',
  companyName: 'Producciones XYZ Internacional',
  supportEmail: 'soporte@produccionesxyz.com',
  showDemoBanner: false,  // Sin banner
  branding: {
    primaryColor: '#FF6B35',  // Naranja corporativo de XYZ
    secondaryColor: '#004E89', // Azul corporativo de XYZ
    logoUrl: 'https://produccionesxyz.com/logo.png'
  }
}
```

#### 3. Poblar con Datos de Ejemplo

```bash
# Crear archivo temporal con materiales de ejemplo relevantes
# public/data/xyz-demo-data.json
```

```javascript
// Usar el script de población adaptado para XYZ
node scripts/poblarDatos.mjs --cliente xyz
```

#### 4. Preparar Demo (5 minutos)

```bash
# Cambiar a configuración XYZ
npm run switch:xyz

# Iniciar servidor
npm run dev

# Crear usuario demo para la presentación
# En Firebase Console → Authentication
Email: demo@produccionesxyz.com
Password: Demo2024!
```

#### 5. Durante la Presentación

```
✅ Mostrar URL: http://localhost:3001/
✅ Login: demo@produccionesxyz.com / Demo2024!
✅ Sin banner de demo (producción)
✅ Logo de XYZ visible
✅ Colores corporativos de XYZ
✅ Materiales de ejemplo relevantes a su industria
```

### Resultado

Cliente ve el sistema funcionando con su marca → Mayor probabilidad de venta

---

## 📋 Caso 2: Demostración en Portfolio

### Contexto

Quieres mostrar el proyecto en tu portfolio o GitHub sin exponer datos de clientes reales.

### Solución

```bash
# 1. Asegurate de estar en modo demo
npm run switch:demo

# 2. Verifica que .env.demo esté en el repositorio
git status

# 3. Sube el código
git add .
git commit -m "feat: Sistema completo con modo demo"
git push origin main

# 4. Deploy público del demo
npm run build:demo
firebase deploy --project control-de-stock-e4f5f
```

### Características del Demo Público

- ✅ Banner claramente visible: "MODO DEMOSTRACIÓN"
- ✅ Credenciales mostradas públicamente
- ✅ Datos ficticios pero realistas
- ✅ Sin información sensible
- ✅ URL pública: https://control-de-stock-e4f5f.web.app

### Para Compartir

```markdown
# En tu README o portfolio

## 🎯 Demo en Vivo

**URL**: https://control-de-stock-e4f5f.web.app
**Usuario**: demo@demo.com
**Contraseña**: demo123

⚠️ NOTA: Este es un demo con datos ficticios para propósitos ilustrativos.
```

---

## 📋 Caso 3: Cliente con Múltiples Sucursales

### Contexto

"EventTech Solutions" tiene operaciones en 3 ciudades y quiere separación lógica pero mismo sistema.

### Estrategia 1: Proyectos Separados por Sucursal

```bash
# Sucursal Madrid
.env.eventtech-madrid
VITE_FIREBASE_PROJECT_ID=eventtech-madrid
VITE_CLIENT_NAME=eventtech-madrid

# Sucursal Barcelona
.env.eventtech-barcelona
VITE_FIREBASE_PROJECT_ID=eventtech-barcelona
VITE_CLIENT_NAME=eventtech-barcelona

# Sucursal Valencia
.env.eventtech-valencia
VITE_FIREBASE_PROJECT_ID=eventtech-valencia
VITE_CLIENT_NAME=eventtech-valencia
```

**Ventajas:**

- ✅ Datos totalmente separados
- ✅ Facturación independiente
- ✅ Autonomía por sucursal

**Desventajas:**

- ❌ No hay vista consolidada
- ❌ Múltiples deploys

### Estrategia 2: Proyecto Único con Filtro por Ubicación

```bash
# Un solo proyecto
.env.eventtech
VITE_FIREBASE_PROJECT_ID=eventtech-global
```

```javascript
// Filtrar materiales por ubicación
const materials = await getDocs(
  query(collection(db, "materials"), where("location", "==", "Madrid"))
);
```

**Ventajas:**

- ✅ Vista consolidada posible
- ✅ Un solo deploy
- ✅ Menores costos

**Desventajas:**

- ❌ Menos separación de datos
- ❌ Requiere control de permisos más elaborado

---

## 📋 Caso 4: Transición de Demo a Producción

### Contexto

El cliente quedó convencido con el demo y quiere empezar a usar el sistema en producción.

### Proceso

#### 1. Crear Proyecto de Producción

```bash
# Firebase Console
# Nuevo proyecto: control-stock-clientereal
# Configurar servicios (Auth, Firestore, Hosting)
```

#### 2. Crear Configuración de Producción

```bash
# Crear archivo
cp .env.demo .env.cliente-real

# Editar con credenciales del nuevo proyecto
VITE_FIREBASE_PROJECT_ID=control-stock-clientereal
VITE_APP_MODE=production  # ← Importante: cambiar de demo
VITE_CLIENT_NAME=clientereal
```

#### 3. Migrar Datos Iniciales

```bash
# Exportar datos de demo (si el cliente los quiere)
# Página Materiales → Exportar CSV
# O usar script personalizado

# Importar a proyecto nuevo
node scripts/importarDatos.mjs --source demo-export.csv --target clientereal
```

#### 4. Crear Usuarios Reales

```bash
# Firebase Console → Authentication
# Crear usuario administrador del cliente
Email: admin@clientereal.com
Password: [contraseña segura generada]

# Crear en Firestore
{
  email: "admin@clientereal.com",
  role: "admin",
  name: "Administrador",
  status: "active"
}
```

#### 5. Deploy a Producción

```bash
# Cambiar a configuración del cliente
npm run switch:clientereal

# Build optimizado
npm run build

# Deploy
firebase deploy --project control-stock-clientereal

# Configurar dominio personalizado (opcional)
# stock.clientereal.com
```

#### 6. Capacitación y Entrega

```
✅ Entregar credenciales al cliente
✅ Manual de usuario
✅ Sesión de capacitación (1-2 horas)
✅ Documentación personalizada
✅ Contacto de soporte
```

---

## 📋 Caso 5: Modo Demo para Entrevistas Técnicas

### Contexto

Tienes una entrevista técnica y quieren que presentes un proyecto full-stack.

### Preparación

```bash
# 1. Asegurar que demo funciona
npm run switch:demo
npm run dev

# 2. Preparar puntos a destacar
```

### Durante la Entrevista

#### Mostrar Arquitectura

```
1. Frontend:
   ✅ React 18 con hooks
   ✅ React Router para SPA
   ✅ Context API para estado global
   ✅ CSS modular con variables

2. Backend:
   ✅ Firebase Authentication (JWT)
   ✅ Firestore (NoSQL)
   ✅ Security Rules server-side
   ✅ Real-time updates

3. Características Avanzadas:
   ✅ Escaneo de códigos con WebRTC
   ✅ Generación de PDFs client-side
   ✅ Sistema multi-tenant
   ✅ Dark mode con Context
```

#### Demo en Vivo

```
1. Login (2 min)
   - Mostrar autenticación
   - Explicar protección de rutas

2. Dashboard (3 min)
   - Métricas en tiempo real
   - Uso de Firestore listeners

3. CRUD Materiales (5 min)
   - Validaciones client y server
   - Filtros y búsqueda
   - Escaneo de códigos (si hay cámara)

4. Exportación PDF (2 min)
   - Generación client-side
   - Diseño profesional

5. Multi-cliente (3 min)
   - Mostrar switch de configuración
   - Explicar separación de datos
   - Demostrar modo demo
```

### Código a Destacar

```javascript
// 1. Custom Hook de Autenticación
// src/contexts/AuthContext.jsx
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

// 2. Protected Route Component
// src/components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, adminOnly }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

// 3. Multi-cliente Configuration
// src/config/clientConfig.js
export const getClientConfig = () => {
  const mode = import.meta.env.VITE_APP_MODE || "demo";
  return clientConfigs[mode] || clientConfigs.demo;
};
```

---

## 📋 Caso 6: Cliente Requiere Personalización Extrema

### Contexto

"LuxEvents" quiere colores específicos, categorías custom y funcionalidades adicionales.

### Solución

#### 1. Configuración Visual Completa

```javascript
// src/config/clientConfig.js
luxevents: {
  appName: 'LuxStock Manager',
  companyName: 'LuxEvents Premium',

  branding: {
    primaryColor: '#D4AF37',      // Dorado
    secondaryColor: '#1A1A1A',    // Negro elegante
    accentColor: '#8B4513',       // Marrón cálido
    logoUrl: '/clients/luxevents/logo.svg',
    faviconUrl: '/clients/luxevents/favicon.ico',
  },

  customCategories: [
    { key: 'MobiliaroDeLujo', label: 'Mobiliario de Lujo' },
    { key: 'DecoracionFloral', label: 'Decoración Floral Premium' },
    { key: 'VajilaFina', label: 'Vajilla Fina y Cristalería' },
    { key: 'ManteleriaBordada', label: 'Mantelería Bordada' },
  ],

  features: {
    barcodeScanner: true,
    pdfExport: true,
    csvExport: true,
    userManagement: true,
    advancedReports: true,     // Nueva feature
    clientManagement: true,    // Nueva feature
    eventPlanning: true,       // Nueva feature
  }
}
```

#### 2. CSS Personalizado

```css
/* src/themes/luxevents.css */
:root {
  --c-brand: #d4af37;
  --c-secondary: #1a1a1a;
  --c-accent: #8b4513;

  /* Fuentes premium */
  --font-primary: "Playfair Display", serif;
  --font-secondary: "Montserrat", sans-serif;
}
```

#### 3. Componentes Personalizados

```javascript
// src/pages/Clientes/Clientes.jsx (nuevo para LuxEvents)
// Gestión de clientes de eventos
```

#### 4. Deploy Independiente

```bash
# Dominio personalizado
stock.luxevents.com

# Firebase Hosting con dominio custom
firebase target:apply hosting luxevents luxevents-stock
```

---

## 🎯 Resumen de Estrategias

| Escenario               | Estrategia                           | Tiempo Setup |
| ----------------------- | ------------------------------------ | ------------ |
| Demo a cliente          | Nuevo proyecto + personalización     | 30-45 min    |
| Portfolio público       | Modo demo existente                  | 5 min        |
| Múltiples sucursales    | Según necesidad: separado o filtrado | 1-2 horas    |
| Demo → Producción       | Nuevo proyecto + migración           | 1-2 horas    |
| Entrevista técnica      | Modo demo + preparación              | 1 hora       |
| Personalización extrema | Custom config + components           | 2-4 horas    |

---

## 📞 Soporte

Para más casos de uso específicos, consulta:

- `CONFIGURACION_RAPIDA.md` - Setup básico
- `GUIA_CONFIGURACION_CLIENTE.md` - Configuración avanzada

---

**Última actualización**: Noviembre 2024  
**Versión**: 2.0.0
