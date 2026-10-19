# 📦 Control de Stock

**Sistema de gestión de inventario para productoras técnicas de eventos.**
Controla equipamiento de audio, iluminación, video, rigging y estructuras: qué hay disponible, qué está en un evento, qué está en reparación y quién movió cada cosa.

🌐 **Producción:** <https://control-de-stock-e4f5f.web.app>

- **Manual para usuarios:** [docs/MANUAL_DE_USO.md](docs/MANUAL_DE_USO.md)
- **Entregar la app a un cliente:** [docs/ENTREGA_CLIENTE.md](docs/ENTREGA_CLIENTE.md)
- **Marca visual por cliente (logo, colores, fondo del login):** [brands/README.md](brands/README.md)

---

## ✨ Funcionalidades

- **Inventario**
  - Tarjetas o lista, con foto de cada material.
  - Búsqueda y filtros por categoría, estado y nivel de stock.
  - Stock mínimo configurable por material.
- **Movimientos**
  - Entradas, salidas a eventos, devoluciones, envíos y retornos de reparación, transferencias, bajas y ajustes.
  - El stock se recalcula solo, dentro de una transacción, así dos usuarios a la vez no se pisan.
- **Historial auditable** con filtros por material, tipo, usuario y fechas.
- **Escaneo de códigos de barras y QR** con la cámara del móvil, o por teclado y lector USB.
- **Exportación a Excel y PDF** del inventario, del historial y un reporte por material.
- **Dashboard**
  - Métricas.
  - Materiales que requieren atención.
  - Actividad reciente.
- **Tiempo real:** los cambios de otros usuarios aparecen sin recargar.
- **Eventos en lote:** salida de muchos equipos a un evento de una vez y devolución marcando lo que volvió; control de lo pendiente por evento.
- **Indicadores:** movimientos, unidades enviadas, tasa de devolución, bajas, actividad por tipo, material y usuario.
- **Corrección de errores:** el admin corrige motivo, proyecto y notas de un movimiento, o lo anula (el stock se restaura y queda registrado).
- **Etiquetas con QR** en PDF (hoja A4 de 24 o etiqueta individual 62 × 29 mm).
- **Importación desde Excel** con plantilla, vista previa y validación por fila.
- **Avisos por email** de stock bajo (con la extensión *Trigger Email* de Firebase).
- **Sin conexión:** app instalable (PWA); consulta los datos cargados sin señal.
- **Usuarios y roles**, recuperación de contraseña por email y cierre de sesión tras 30 min de inactividad.
- **Tema claro y oscuro**, diseño adaptado a móvil.

## 👥 Roles

| Acción | Admin | Empleado | Encargado de stock | Invitado |
| --- | :-: | :-: | :-: | :-: |
| Ver inventario, historial y dashboard | ✅ | ✅ | ✅ | ✅ |
| Registrar movimientos | ✅ | ✅ | ✅ | — |
| Crear materiales | ✅ | ✅ | — | — |
| Editar y eliminar materiales | ✅ | — | — | — |
| Bajas y ajustes de stock | ✅ | — | — | — |
| Gestionar usuarios y categorías | ✅ | — | — | — |

## 📊 Modelo de stock

Cada material tiene tres cantidades:

- **Disponible**: en depósito.
- **En uso**: en eventos o préstamos.
- **Mantenimiento**: en reparación.

| Movimiento | Efecto |
| --- | --- |
| Entrada | + disponible |
| Salida | disponible → en uso |
| Devolución | en uso → disponible |
| Envío a reparación | disponible → mantenimiento |
| Retorno de reparación | mantenimiento → disponible |
| Transferencia | cambia la ubicación |
| Baja | − disponible (definitivo) |
| Ajuste | fija el disponible a un valor (recuento físico) |

Al crear un material con stock inicial se registra una *Entrada*. Si un admin edita el stock a mano, se registra un *Ajuste*.

---

## 🛠️ Stack

- **Frontend:** React 18, Vite 6, React Router 7, lucide-react, react-hot-toast.
- **Backend:** Firebase 12 (Authentication, Firestore y Hosting).
- **Escaneo:** html5-qrcode.
- **Exportación:** jsPDF + autotable para PDF, SheetJS (xlsx) para Excel. Ambas librerías se cargan solo cuando se usan.

## 🚀 Puesta en marcha

Requisitos: Node.js 18 o superior y un proyecto de Firebase con **Authentication (Email/Password)** y **Firestore** habilitados.

```bash
git clone https://github.com/Davemnt/control-de-stock.git
cd control-de-stock
npm install
cp .env.example .env     # completar con las claves de Firebase
npm run dev              # http://localhost:3000
```

Las claves están en Firebase Console → ⚙️ Configuración del proyecto → *Tus apps* → *Configuración del SDK*:

```dotenv
VITE_APP_NAME=Control de Stock     # opcional: nombre que se muestra en la app
VITE_COMPANY_NAME=                 # opcional: empresa (subtítulo, pie, PDF)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | ESLint |
| `npm run deploy` | Compila y publica app + reglas en el proyecto de `.env` |
| `npm run deploy -- acme` | Lo mismo para el cliente `acme` (usa `.env.acme`) |
| `npm run cliente:nuevo` | Crea la configuración de un cliente nuevo |
| `npm run admin:crear [-- acme]` | Crea el primer administrador |

En Windows también puedes usar `deploy-produccion.bat [cliente]` y `create-admin.bat [cliente]`.

## 🔑 Administración y acceso

- **Primer administrador:** `npm run admin:crear` (para un cliente: `npm run admin:crear -- acme`). Te pide email y contraseña. Sólo funciona mientras no exista ningún admin: en cuanto un admin inicia sesión, la app crea `system/bootstrap` y desde entonces los usuarios se crean desde la pantalla Usuarios.
- **Olvidé la contraseña:** en el login pulsa *¿Olvidaste tu contraseña?*. También puedes hacerlo desde Firebase Console → Authentication → Usuarios.
- **Otros scripts en `scripts/`** (además de `deploy.mjs`, `nuevoCliente.mjs` y `createAdmin.mjs`):
  - `cambiarEmailAdmin.mjs`: migra el admin a otro email.
  - `deleteUserCompletely.mjs`: elimina un usuario.
  - `poblarDatos.mjs` y `poblarDatosAdmin.mjs`: cargan materiales de ejemplo.
  - `createAdminMaterials.mjs`: igual que los anteriores, pero iniciando sesión como admin.

## 📤 Publicar cambios

```bash
firebase login                  # una vez, con la cuenta que tiene acceso al proyecto
npm run deploy                  # tu instalación: app + reglas de seguridad
npm run deploy -- acme          # la instalación de un cliente
npm run deploy -- acme --solo-app   # sólo la app, sin tocar las reglas
```

El proyecto de destino sale del propio archivo `.env`, y la publicación se detiene si al archivo le falta alguna clave de Firebase. Así nunca se publica la app de un cliente en el proyecto de otro.

La primera vez que publiques las reglas, **inicia sesión como administrador** en la app: eso cierra la creación libre del primer admin.

### Avisos por email (opcional)

1. En Firebase Console, pasa el proyecto al plan **Blaze** (pago por uso; el envío de avisos cuesta prácticamente cero).
2. Instala la extensión **Trigger Email from Firestore**, con la colección `mail` y los datos SMTP de tu correo (por ejemplo, Gmail con contraseña de aplicación).
3. En la app: Configuración → *Avisos de stock bajo por email* → activar y poner los destinatarios.

> ⚠️ Nunca guardes contraseñas dentro de scripts o documentos del repositorio.

## 📁 Estructura

```text
src/
├── components/   # UI reutilizable: Button, Input, Modal, ConfirmDialog, Layout, Sidebar, BarcodeScanner...
├── contexts/     # AuthContext (sesión y roles), ThemeContext (claro/oscuro)
├── hooks/        # useFirestore: suscripciones en tiempo real (materiales, movimientos, usuarios, categorías)
├── pages/        # Login, Dashboard, Materiales, Movimientos, Historial, Indicadores, Usuarios, Configuracion
├── utils/        # stock.js (movimientos y anulaciones), analytics (indicadores), importMaterials,
│                 # labelsPdf (etiquetas QR), alerts (avisos email), exportExcel, pdfExport...
├── constants/    # roles, estados, tipos de movimiento, permisos
├── config/       # branding.js: nombre, empresa y marca visual (desde .env)
├── firebase.js   # inicialización de Firebase
└── index.css     # tokens de diseño (colores, espaciado) y estilos globales
```

**Colecciones de Firestore:**

- `users`: perfil y rol; el id del documento es el uid de Auth.
- `materials`: los materiales del inventario.
- `movements`: el historial de movimientos.
- `system/categories`: las categorías configurables.
- `system/alerts`: los avisos por email (activado y destinatarios).
- `system/bootstrap`: indica que ya existe un admin.
- `mail`: la cola de emails de la extensión *Trigger Email*.

## 🔒 Seguridad

- **Reglas de Firestore por rol** (`firestore.rules`):
  - Cada rol sólo puede hacer lo que la app le permite, aunque use la API de Firebase directamente.
  - El stock de un material sólo lo cambian los movimientos.
  - Nadie puede asignarse un rol a sí mismo.
  - Los movimientos nunca se borran.
- **`public/security.js`:** sólo se aplica fuera de `localhost`. Su detección de DevTools puede dar falsos positivos (por ejemplo, con la barra lateral del navegador abierta).

---

👨‍💻 **David Monte** · [@Davemnt](https://github.com/Davemnt)
