# 🚚 Entregar la app a un cliente

Guía para instalar una copia de la app para un cliente nuevo, configurarla y entregársela. La instalación técnica lleva unos 30 minutos.

## 1. Decide el modelo

**Una instalación (un proyecto de Firebase) por cliente. Siempre.** Las reglas de seguridad no separan empresas entre sí: si dos clientes compartieran proyecto, verían los datos del otro.

| | **A. El proyecto es del cliente** (recomendado) | **B. El proyecto es tuyo (SaaS)** |
| --- | --- | --- |
| Cuenta de Google | La del cliente; a ti te agrega como colaborador | La tuya |
| Datos | Son del cliente desde el día 1 | Los custodias tú |
| Costes de Firebase | Los paga el cliente (normalmente 0 €) | Los pagas tú y los incluyes en la cuota |
| Si deja de pagarte | Conserva su app; tú pierdes el acceso | Puedes suspender el servicio |
| Ideal para | Venta con pago único + soporte | Cuota mensual |

En el modelo A, el cliente entra a <https://console.firebase.google.com> con su cuenta, crea el proyecto y te invita en ⚙️ *Usuarios y permisos* con el rol **Propietario**, o como mínimo **Editor**.

## 2. Crear el proyecto de Firebase

En Firebase Console, con la cuenta que corresponda según el modelo:

1. **Agregar proyecto** → ponle un nombre, por ejemplo `stock-acme`. Google Analytics no hace falta.
2. **Authentication** → *Comenzar* → **Correo electrónico/contraseña** → habilitar.
3. **Firestore Database** → *Crear base de datos* → modo **producción** → elige la ubicación más cercana al cliente. Por ejemplo, `southamerica-east1` para Sudamérica o `europe-southwest1` para España.
4. **Configuración del proyecto** (⚙️) → *Tus apps* → icono **`</>`** (web) → registra la app → copia el bloque `firebaseConfig = { ... }`.

## 3. Configurar, publicar y crear el administrador

Desde la carpeta del proyecto en tu ordenador:

```bash
firebase login                       # con la cuenta que tiene acceso al proyecto del cliente
npm run cliente:nuevo                # pide empresa, nombre de la app y el firebaseConfig copiado
npm run deploy -- acme               # compila con la marca del cliente y publica app + reglas
npm run admin:crear -- acme          # crea el usuario administrador del cliente
```

`acme` es el identificador corto que elegiste; la configuración queda en `.env.acme`.

Después, **entra a `https://<proyecto>.web.app` con el admin recién creado.** Ese primer inicio de sesión cierra el alta libre de administradores: a partir de ahí, los usuarios solo se crean desde la pantalla *Usuarios*.

Para probar la versión del cliente en tu ordenador antes de entregarla: `npx vite --mode acme`.

> ⚠️ Los archivos `.env.<cliente>` no se suben a git. Guárdalos también en un lugar seguro (por ejemplo, un gestor de contraseñas o una carpeta privada en la nube): los necesitas para publicar cada actualización.

## 4. Dejarla lista para el cliente

En la app, como administrador:

- **Configuración → Categorías:** las del rubro del cliente.
- **Inventario → Importar:** carga su inventario desde Excel con la plantilla.
- **Inventario → Etiquetas:** imprime las etiquetas QR, si las va a usar.
- **Usuarios:** crea las cuentas de su equipo con el rol adecuado.
- **Avisos por email** (opcional): plan Blaze más la extensión *Trigger Email*. Los pasos están en el README.
- **Dominio propio** (opcional): Firebase Console → *Hosting* → *Agregar dominio personalizado*, por ejemplo `stock.acme.com`. Sigue las instrucciones de DNS y el certificado se genera solo.

## 5. Qué se personaliza por cliente

| Qué | Dónde | ¿Requiere código? |
| --- | --- | --- |
| Nombre de la app y de la empresa | `.env.<cliente>` (`VITE_APP_NAME`, `VITE_COMPANY_NAME`) | No |
| Proyecto de Firebase | `.env.<cliente>` | No |
| Categorías, usuarios, inventario, avisos | Dentro de la app | No |
| Dominio | Firebase Console | No |
| Logo, fondo del login, iconos, colores y fuente | Carpeta `brands/<cliente>/` + `VITE_BRAND` en `.env.<cliente>` | No (ver [brands/README.md](../brands/README.md)) |

Si el cliente tiene identidad propia, crea su marca **antes** de `npm run cliente:nuevo`, para poder elegirla ahí. Aurea ya tiene la suya en `brands/aurea/`.

## 6. Qué entregar

**Al cliente:**

- La dirección de la app y el email del administrador. La contraseña no la mandes por escrito: que use **¿Olvidaste tu contraseña?** y elija la suya.
- El manual de uso: [MANUAL_DE_USO.md](MANUAL_DE_USO.md). Puedes exportarlo a PDF desde VS Code o cualquier visor de Markdown.
- Una capacitación corta (30-60 min): registrar salidas y devoluciones de evento, escanear, consultar indicadores.
- El contrato o licencia. Puedes partir de [LICENCIA.md](LICENCIA.md) e incluir:
  - Alcance y precio.
  - Soporte (canal, horario, tiempo de respuesta).
  - Actualizaciones incluidas.
  - **Que los datos son del cliente.**
  - Qué pasa si se termina la relación (exportación de datos a Excel).

**Lo que no entregas:**

- El código fuente, salvo que lo vendas.
- Tu `.env` ni los `.env` de otros clientes.
- Acceso a tu cuenta de Google.

## 7. Actualizar a los clientes

Cada vez que mejores la app:

```bash
npm run deploy                       # tu instalación
npm run deploy -- acme               # cada cliente
npm run deploy -- otro-cliente
```

Las personas que tengan la app abierta reciben la versión nueva automáticamente al recargar.

## 8. Costes de Firebase

El plan gratuito (**Spark**) alcanza para la mayoría de los clientes pequeños y medianos:

| Recurso | Límite gratuito | Uso típico de la app |
| --- | --- | --- |
| Lecturas de Firestore | 50.000 / día | Cada pantalla lee el inventario y el historial. Con miles de movimientos y varios usuarios conectados todo el día, se puede acercar al límite. |
| Escrituras | 20.000 / día | Sobra: un movimiento son 2 escrituras. |
| Almacenamiento | 1 GB | Sobra. Las fotos se guardan comprimidas (aprox. 100 KB cada una). |
| Hosting | 10 GB y 360 MB/día de descarga | Sobra. |

Si un cliente supera el límite, la app deja de leer datos hasta el día siguiente. Para clientes con mucho movimiento, pasa su proyecto al plan **Blaze** (pago por uso). Cuesta unos céntimos por cada 100.000 lecturas, y es obligatorio si quiere los avisos por email. Configura una **alerta de presupuesto** en Google Cloud para que no haya sorpresas.

## ✅ Checklist de entrega

- [ ] Proyecto de Firebase creado, con Authentication (email) y Firestore activos.
- [ ] Tengo acceso como Propietario o Editor (modelo A).
- [ ] `.env.<cliente>` creado y guardado en lugar seguro.
- [ ] `npm run deploy -- <cliente>` sin errores.
- [ ] Admin creado y primer inicio de sesión hecho (cierra el alta de administradores).
- [ ] Categorías, inventario y usuarios cargados.
- [ ] Probado con un usuario de cada rol: registrar movimiento, salida de evento, escáner en el móvil.
- [ ] Dominio y avisos por email configurados (si aplica).
- [ ] Entregados la URL, el acceso, el manual y el contrato; capacitación hecha.
