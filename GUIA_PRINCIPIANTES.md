# 🎓 Guía para Principiantes - Paso a Paso

## 👋 ¡Bienvenido!

Esta guía está diseñada para que puedas entender y modificar este proyecto **sin experiencia previa en React**. Te explicaré todo desde cero, de la forma más simple posible.

---

## 📚 Conceptos Básicos que Debes Conocer

### ¿Qué es React?

React es una librería de JavaScript que permite crear interfaces de usuario de forma fácil y organizada. Piensa en React como **LEGO para páginas web** - construyes componentes pequeños y luego los combinas para crear la aplicación completa.

### ¿Qué es un Componente?

Un componente es como un **bloque reutilizable**. Por ejemplo:

- Un botón es un componente
- Un formulario es un componente
- Una tarjeta de material es un componente

**Ejemplo real:**

```jsx
// Este es un componente de botón simple
function Button({ text }) {
  return <button>{text}</button>;
}

// Lo usas así:
<Button text="Guardar" />;
```

### ¿Qué es Firebase?

Firebase es como un **backend en la nube** que Google te da gratis (con límites generosos). Incluye:

- **Authentication**: Sistema de login listo para usar
- **Firestore**: Base de datos que actualiza en tiempo real
- **Storage**: Lugar para guardar imágenes y archivos

---

## 🗂️ Estructura del Proyecto (Qué es cada carpeta)

```
control-de-stock/
│
├── public/              # Archivos públicos (imágenes, iconos)
│   └── vite.svg         # Logo de Vite
│
├── src/                 # AQUÍ ESTÁ TODO TU CÓDIGO
│   │
│   ├── components/      # Componentes reutilizables
│   │   ├── Button/      # Componente de botón
│   │   ├── Input/       # Componente de campo de texto
│   │   ├── Card/        # Componente de tarjeta
│   │   ├── Modal/       # Componente de ventana emergente
│   │   ├── Badge/       # Componente de etiqueta
│   │   ├── Sidebar/     # Barra lateral de navegación
│   │   ├── Layout/      # Estructura general de las páginas
│   │   └── ProtectedRoute/ # Componente que protege rutas privadas
│   │
│   ├── pages/           # Páginas completas de la aplicación
│   │   ├── Login/       # Página de inicio de sesión
│   │   ├── Dashboard/   # Página principal con estadísticas
│   │   ├── Materiales/  # Catálogo de materiales
│   │   ├── Movimientos/ # Registro de movimientos
│   │   ├── Historial/   # Historial completo
│   │   └── Usuarios/    # Gestión de usuarios (solo admin)
│   │
│   ├── contexts/        # Contextos (datos globales)
│   │   └── AuthContext.jsx # Maneja todo lo de autenticación
│   │
│   ├── constants/       # Valores constantes (no cambian)
│   │   └── index.js     # Roles, categorías, estados, etc.
│   │
│   ├── utils/           # Funciones auxiliares
│   │   ├── permissions.js # Verificar permisos de usuario
│   │   ├── formatters.js  # Formatear fechas, números
│   │   └── validation.js  # Validar datos de formularios
│   │
│   ├── firebase.js      # Configuración de Firebase
│   ├── main.jsx         # PUNTO DE ENTRADA de la aplicación
│   ├── App.jsx          # Componente principal con las rutas
│   └── index.css        # Estilos globales
│
├── index.html           # Archivo HTML principal
├── package.json         # Lista de dependencias del proyecto
├── vite.config.js       # Configuración de Vite
└── .env                 # Variables de entorno (credenciales)
```

---

## 🚀 Flujo de la Aplicación (Cómo funciona todo)

### 1. El usuario abre la aplicación

```
Usuario escribe: localhost:3000
         ↓
index.html se carga
         ↓
index.html ejecuta main.jsx
         ↓
main.jsx renderiza App.jsx
         ↓
App.jsx decide qué página mostrar
```

### 2. Login

```
Usuario ve página de Login
         ↓
Usuario ingresa email y contraseña
         ↓
Login.jsx llama a AuthContext.login()
         ↓
AuthContext se conecta a Firebase
         ↓
Firebase verifica credenciales
         ↓
Si es correcto: Firebase devuelve datos del usuario
         ↓
AuthContext guarda los datos en estado
         ↓
App.jsx detecta que hay usuario logueado
         ↓
Redirige al Dashboard
```

### 3. Ver Materiales

```
Usuario hace click en "Materiales" en el sidebar
         ↓
React Router cambia la URL a /materiales
         ↓
App.jsx renderiza el componente Materiales
         ↓
Materiales.jsx se conecta a Firestore
         ↓
Obtiene todos los materiales de la colección
         ↓
Renderiza cada material en una Card
```

### 4. Crear Material

```
Usuario hace click en "Nuevo Material"
         ↓
Se abre un Modal con un formulario
         ↓
Usuario llena los campos y hace click en "Guardar"
         ↓
Materiales.jsx valida los datos
         ↓
Si todo está bien, llama a Firebase.addDoc()
         ↓
Firebase guarda el nuevo material
         ↓
Firebase devuelve confirmación
         ↓
Se cierra el Modal y se muestra notificación de éxito
         ↓
La lista se actualiza automáticamente
```

---

## 🔧 Cómo Hacer Cambios Comunes

### ✏️ Cambiar el Color Principal

**Archivo:** `src/index.css`

Busca esta línea:

```css
--c-brand: #de591f; /* Naranja principal */
```

Cámbiala por el color que quieras:

```css
--c-brand: #3b82f6; /* Azul */
--c-brand: #10b981; /* Verde */
--c-brand: #8b5cf6; /* Morado */
```

**Efecto:** Todo lo naranja en la aplicación cambiará al nuevo color.

---

### ✏️ Agregar una Nueva Categoría de Material

**Archivo:** `src/constants/index.js`

Busca el objeto `CATEGORIES`:

```javascript
export const CATEGORIES = {
  AUDIO: "Audio",
  ILUMINACION: "Iluminación",
  VIDEO: "Video",
  // ... más categorías
};
```

Agrega tu nueva categoría:

```javascript
export const CATEGORIES = {
  AUDIO: "Audio",
  ILUMINACION: "Iluminación",
  VIDEO: "Video",
  DRONES: "Drones", // ← NUEVA CATEGORÍA
  // ... más categorías
};
```

**IMPORTANTE:** También actualízala en `CATEGORY_LABELS`:

```javascript
export const CATEGORY_LABELS = {
  [CATEGORIES.AUDIO]: "🎵 Audio",
  [CATEGORIES.ILUMINACION]: "💡 Iluminación",
  [CATEGORIES.VIDEO]: "📹 Video",
  [CATEGORIES.DRONES]: "🚁 Drones", // ← NUEVA CATEGORÍA
  // ... más categorías
};
```

**Efecto:** Ahora puedes seleccionar "Drones" al crear un material.

---

### ✏️ Cambiar el Texto del Botón de Login

**Archivo:** `src/pages/Login/Login.jsx`

Busca esta línea (aproximadamente línea 50-60):

```jsx
<Button type="submit" fullWidth disabled={loading}>
  {loading ? "Cargando..." : "Iniciar Sesión"}
</Button>
```

Cámbiala por:

```jsx
<Button type="submit" fullWidth disabled={loading}>
  {loading ? "Espera..." : "Entrar"}
</Button>
```

**Efecto:** El botón dirá "Entrar" en lugar de "Iniciar Sesión".

---

### ✏️ Agregar un Nuevo Campo al Formulario de Materiales

**Archivo:** `src/pages/Materiales/Materiales.jsx`

1. **Agrega el campo al estado inicial** (busca `formData`):

```javascript
const [formData, setFormData] = useState({
  name: "",
  code: "",
  // ... otros campos
  fabricante: "", // ← NUEVO CAMPO
});
```

2. **Agrega el input en el formulario** (busca la sección del formulario):

```jsx
<Input
  label="Fabricante"
  value={formData.fabricante}
  onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
  placeholder="Ej: Yamaha, Shure, etc."
/>
```

3. **Actualiza la función de reseteo** (busca `resetForm`):

```javascript
const resetForm = () => {
  setFormData({
    name: "",
    code: "",
    // ... otros campos
    fabricante: "", // ← NUEVO CAMPO
  });
};
```

**Efecto:** Ahora puedes agregar el fabricante al crear un material.

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Module not found"

**Causa:** Importaste un archivo que no existe o la ruta está mal.

**Solución:**

1. Verifica que el archivo existe
2. Verifica que la ruta sea correcta (distingue mayúsculas/minúsculas)
3. Asegúrate de incluir la extensión `.jsx` si es necesario

**Ejemplo:**

```javascript
// ❌ MAL - falta .jsx
import Button from "./components/Button/Button";

// ✅ BIEN
import Button from "./components/Button/Button.jsx";
```

---

### ❌ Error: "Cannot read property of undefined"

**Causa:** Estás intentando acceder a una propiedad de algo que es `undefined` o `null`.

**Solución:** Usa optional chaining (`?.`) o verifica antes:

```javascript
// ❌ MAL - puede romper si user es undefined
const name = user.name;

// ✅ BIEN - optional chaining
const name = user?.name;

// ✅ BIEN - verificación
const name = user && user.name;
```

---

### ❌ Error: "Too many re-renders"

**Causa:** Estás causando un ciclo infinito, probablemente en un `useEffect` sin dependencias correctas.

**Solución:** Revisa tus `useEffect` y asegúrate de tener las dependencias correctas:

```javascript
// ❌ MAL - se ejecutará infinitamente
useEffect(() => {
  setCount(count + 1);
});

// ✅ BIEN - solo se ejecuta al montar el componente
useEffect(() => {
  loadData();
}, []);

// ✅ BIEN - se ejecuta cuando cambia 'id'
useEffect(() => {
  loadData(id);
}, [id]);
```

---

### ❌ La aplicación se ve en blanco

**Causas posibles:**

1. Error en el código JavaScript
2. Firebase no está configurado
3. El archivo `.env` está mal

**Solución:**

1. Presiona **F12** en el navegador
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Copia el error y búscalo en Google o pregunta

---

## 📖 Recursos para Aprender Más

### React

- [Documentación oficial de React](https://react.dev/) - La mejor fuente
- [React Tutorial](https://react.dev/learn/tutorial-tic-tac-toe) - Tutorial interactivo

### Firebase

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)

### JavaScript Moderno

- [MDN Web Docs](https://developer.mozilla.org/es/) - Referencia completa
- [JavaScript.info](https://javascript.info/) - Tutorial paso a paso

---

## 🎯 Próximos Pasos Recomendados

1. **Lee los comentarios en el código**

   - Abre `src/main.jsx` y lee todos los comentarios
   - Abre `src/App.jsx` y lee todos los comentarios
   - Así entenderás cómo fluye la aplicación

2. **Haz un cambio pequeño**

   - Cambia el color principal
   - Cambia algún texto
   - Agrega un console.log() para ver datos

3. **Experimenta sin miedo**

   - Git te permite revertir cambios
   - No puedes "romper" nada permanentemente
   - La mejor forma de aprender es probando

4. **Lee la documentación de React**

   - Dedica 30 minutos al día
   - Empieza con conceptos básicos: componentes, props, state

5. **Pregunta cuando no entiendas algo**
   - Busca en Google el error específico
   - Lee Stack Overflow
   - Pregunta en comunidades de React

---

## 💡 Consejos Finales

✅ **Lee el código de arriba hacia abajo**

- Empieza por `main.jsx`, luego `App.jsx`, luego las páginas

✅ **Usa console.log() para debuggear**

- `console.log('datos:', datos)` te muestra qué contiene una variable

✅ **No copies y pegues código sin entender**

- Lee línea por línea
- Pregúntate qué hace cada línea

✅ **Usa las herramientas de desarrollo del navegador**

- F12 abre las DevTools
- La pestaña Console muestra errores
- La pestaña Network muestra peticiones a Firebase

✅ **Git es tu amigo**

- Haz commits frecuentes: `git commit -m "Cambio X"`
- Si algo se rompe: `git checkout -- .` revierte cambios

---

¡Felicitaciones! Ya tienes las bases para entender y modificar este proyecto. 🎉

Recuerda: **Todos empezamos sin saber nada**. Lo importante es practicar y tener curiosidad.
