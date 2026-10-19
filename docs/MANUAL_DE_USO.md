# 📘 Manual de uso: Control de Stock

Guía para el personal que usa el sistema día a día.

## 1. Acceso

1. Entra a la dirección de la app e inicia sesión con el email y la contraseña que te dio el administrador.
2. Si no recuerdas la contraseña, pulsa **¿Olvidaste tu contraseña?**. Te llegará un email con un enlace para crear una nueva.
3. Por seguridad, la sesión se cierra sola tras **30 minutos sin actividad**.

En **Configuración** puedes:

- Cambiar tu nombre.
- Pedir un cambio de contraseña.
- Elegir el tema claro u oscuro.

## 2. Dashboard

Es la pantalla de inicio. Muestra:

- **Materiales, unidades disponibles, en mantenimiento y alertas de stock.** Pulsa cualquier tarjeta para ir al inventario ya filtrado.
- **Requieren atención:** materiales sin stock o por debajo de su mínimo.
- **Actividad reciente:** los últimos movimientos registrados.
- **Inventario por categoría.** Pulsa una fila para ver solo esa categoría.

## 3. Inventario

- **Buscar:** por nombre, código, ubicación o notas.
- **Filtrar:** por categoría, estado (operativo, en mantenimiento, prestado…) y nivel de stock (con alertas, stock bajo, sin stock, en mantenimiento).
- **Ordenar:** por nombre, código, menor o mayor stock, o los más recientes.
- **Vista:** tarjetas o lista. El sistema recuerda tu preferencia.
- **Ficha del material:** pulsa un material para ver su foto, sus cantidades, sus datos y sus últimos movimientos. Desde ahí puedes registrar un movimiento o descargar su reporte en PDF.

**Colores del stock disponible:**

- 🟢 Verde: en stock.
- 🟡 Amarillo: stock bajo. Por defecto, 10 unidades o menos; cada material puede tener su propio mínimo.
- 🔴 Rojo: sin stock.

### Crear o editar un material

Crear lo pueden hacer el administrador y los empleados; editar y eliminar, solo el administrador.

1. Pulsa **Nuevo material**.
2. Completa nombre, código, estado, categoría, ubicación y cantidades.
3. **Código:**
   - 📷 escanea el código de barras de la etiqueta,
   - ✨ genera uno automático, o
   - escríbelo a mano.

   El sistema avisa si el código ya existe.
4. **Foto (opcional):** JPG, PNG o WebP de hasta 2 MB. Se comprime automáticamente.
5. Guarda.

Si creas el material con stock, se registra una *Entrada* en el historial. Si el administrador cambia el stock a mano, queda registrado como *Ajuste*.

## 4. Movimientos

Todo cambio de stock se hace registrando un movimiento. El sistema recalcula las cantidades y guarda quién lo hizo y cuándo.

| Movimiento | Cuándo usarlo | Efecto |
| --- | --- | --- |
| **Salida** | El equipo sale a un evento o préstamo | Disponible → en uso |
| **Devolución** | El equipo vuelve del evento | En uso → disponible |
| **Entrada** | Compra o alta de unidades nuevas | Suma al disponible |
| **Envío a reparación** | Va al servicio técnico | Disponible → mantenimiento |
| **Retorno de reparación** | Vuelve reparado | Mantenimiento → disponible |
| **Transferencia** | Cambia de depósito o ubicación | Cambia la ubicación |
| **Baja** *(solo admin)* | Rotura o pérdida definitiva | Resta del disponible |
| **Ajuste** *(solo admin)* | Recuento físico de inventario | Fija el disponible |

**Cómo registrar uno:**

1. En **Movimientos**, pulsa un acceso rápido (Salida, Devolución…) o **Registrar movimiento**.
2. **Elige el material:** filtra por nombre o código, o pulsa 📷 para escanearlo.
3. Elige el tipo y la cantidad. Verás la vista previa del resultado, por ejemplo *Stock disponible: 10 → 7*.
4. **Motivo:** es obligatorio. Pulsa *Usar* para el sugerido. El proyecto o evento y las notas son opcionales.
5. Pulsa **Registrar**.

El sistema no deja sacar más unidades de las disponibles.

### Eventos: varios equipos de una vez

En **Movimientos** tienes dos accesos destacados:

- **Salida a evento**
  1. Escribe el nombre del evento.
  2. Agrega equipos buscándolos (Enter agrega el primero de la lista) o escaneándolos con 📷.
  3. Ajusta las cantidades y pulsa *Registrar salida*.

  Si una cantidad supera lo disponible, se marca en rojo y no se guarda nada hasta corregirla.
- **Devolución de evento**
  1. Elige el evento: verás cada equipo con cuánto salió, cuánto volvió y cuánto falta.
  2. Por defecto propone que vuelve todo. Ajusta si algo no volvió y pulsa *Registrar devolución*.

  Lo que no se devuelve queda pendiente para la próxima vez.

Consejo: usa siempre el mismo nombre de evento en salidas y devoluciones. Así funciona el control de pendientes de **Indicadores**.

### Corregir o anular un movimiento (solo admin)

Pulsa cualquier movimiento, en Movimientos o en Historial, para ver su detalle:

- **Corregir datos:** cambia el motivo, el proyecto o las notas. Queda registrado quién lo corrigió.
- **Anular:** deshace el efecto en el stock y el movimiento queda tachado como *Anulado*, con el motivo. No se borra nunca.

Si la cantidad o el material estaban mal: **anula** el movimiento y registra uno nuevo con los datos correctos.

## 5. Indicadores

Elige el período (7 días, 30 días, 90 días, este mes o 12 meses). Verás:

- **Movimientos, unidades enviadas a eventos, tasa de devolución y bajas**, comparados con el período anterior.
- **Actividad en el tiempo:** gráfico de ingresos, egresos y traslados. Pasa el cursor para ver el detalle o pulsa *Ver tabla* para ver los números.
- **Rankings:** movimientos por tipo, materiales con más movimiento y actividad por usuario.
- **Material pendiente de devolución por evento**, con acceso directo a *Registrar devolución*.

Los movimientos anulados no cuentan en los indicadores.

## 6. Historial

Lista completa de movimientos. Puedes:

- Filtrarla por texto, material, tipo, usuario y rango de fechas.
- Exportar lo filtrado a **Excel** o **PDF**.

## 7. Escaneo de códigos de barras

Puedes escanear en tres sitios: en el formulario de material, en la búsqueda del inventario y al elegir material en un movimiento.

1. Pulsa el icono 📷 y luego **Activar cámara**.
2. Acepta el permiso de cámara del navegador.
3. Apunta al código: se detecta solo.

También puedes escribir el código a mano o usar un **lector USB**, que funciona como un teclado.

**Formatos:** Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E y QR.

**Consejos:**

- Usa buena luz y evita reflejos.
- Coloca el móvil a 10–20 cm del código y mantenlo quieto.
- En el móvil se usa la cámara trasera.

**Problemas frecuentes:**

- *"No se pudo acceder a la cámara"*: revisa el permiso de cámara en el candado de la barra de direcciones.
- *"La cámara solo funciona en conexiones seguras"*: la app debe abrirse por `https://`.

## 8. Etiquetas con código QR

Pega una etiqueta en cada equipo y escanéala con la app para abrir su ficha al instante.

- **Varias:** en Inventario, filtra lo que quieras etiquetar y pulsa **Etiquetas**.
- **Una sola:** en la ficha del material, pulsa **Etiqueta**.

Formatos:

- **Hoja A4 de 24 etiquetas (3 × 8):** para hojas adhesivas de 63,5 × 33,9 mm en cualquier impresora.
- **Etiqueta individual de 62 × 29 mm:** para impresoras de etiquetas (Brother, Dymo, Zebra…).

## 9. Importar materiales desde Excel

Lo pueden hacer el administrador y los empleados. Sirve tanto para cargar el inventario inicial como para registrar un listado de material disponible que te envíen, por ejemplo un remito o un recuento de stock.

1. **Archivo:** en Inventario pulsa **Importar** → **Elegir archivo** y sube el Excel tal como lo recibiste (.xlsx, .xls o .csv).
   - No hace falta adaptarlo: la app encuentra sola la fila de encabezados, aunque haya títulos arriba.
   - Si tiene varias hojas, elige cuál importar.
   - ¿Prefieres un formato fijo? Usa **Descargar plantilla**.
2. **Columnas:** indica qué columna del archivo es cada dato (nombre, código, cantidad, categoría…).
   - La app propone una asignación y muestra ejemplos de cada columna para comprobarla.
   - Solo el **nombre** es obligatorio.
   - La próxima vez que subas un archivo con el mismo formato, recordará tu elección.
3. **Revisión:** cada fila se marca como:
   - **Nuevo:** el material se va a crear. Si no trae código, se genera uno (por ejemplo, `AUD-0001`).
   - **Existe:** ya está en el inventario. Se reconoce por el código o, si el archivo no tiene códigos, por el nombre.
   - **Error:** se explica el motivo y esa fila no se importa.
4. Si el archivo trae cantidades de materiales que ya existen, **elige qué hacer**:
   - **Sumar al stock (llegó material):** se registra una *Entrada* por la cantidad del archivo.
   - **Reemplazar el stock (recuento físico):** el disponible pasa a ser el del archivo y se registra un *Ajuste*. Solo admin.
   - **No modificar el stock.**

   La columna *Qué pasará* muestra el resultado de cada material, por ejemplo «Stock 3 → 5».
5. Pulsa **Importar**. Todo queda registrado en el historial.

**¿Y si llega un PDF?** Por ahora la app importa Excel. Convierte el PDF a Excel antes de subirlo: Adobe Acrobat, Word (abriendo el PDF) o un conversor en línea lo hacen. Revisa que los números hayan quedado bien.

## 10. Avisos por email (solo admin)

En **Configuración → Avisos de stock bajo por email**, activa los avisos y escribe los destinatarios. Se envía un email cuando un material pasa a estar por debajo de su mínimo o se queda sin stock.

Requiere una configuración previa en Firebase: se explica en el README.

## 11. Sin conexión

- **Instalar la app:** en el móvil, usa *Agregar a pantalla de inicio*; en el ordenador, el icono de instalar de la barra de direcciones.
- **Sin señal:** aparece un aviso amarillo. Puedes consultar el inventario y el historial ya cargados.
- **Movimientos de stock:** necesitan conexión, para que dos personas no descuadren el stock a la vez. Regístralos al recuperar la señal.

## 12. Exportar reportes

| Reporte | Dónde | Formatos |
| --- | --- | --- |
| Inventario (con los filtros aplicados) | Inventario → *Excel* / *PDF* | Excel, PDF |
| Historial (con los filtros aplicados) | Historial → *Excel* / *PDF* | Excel, PDF |
| Reporte de un material y sus movimientos | Ficha del material → *Reporte PDF* | PDF |

Los archivos se descargan con la fecha en el nombre, por ejemplo `inventario-materiales-2026-10-19.xlsx`.

## 13. Administración (solo admin)

**Roles disponibles:**

| Rol | Puede |
| --- | --- |
| **Administrador** | Todo: inventario, movimientos, correcciones, usuarios y configuración |
| **Empleado** | Crear materiales, importar y registrar movimientos |
| **Encargado de stock** | Registrar entradas, salidas, devoluciones y reparaciones (también eventos en lote). No crea ni edita materiales |
| **Invitado** | Solo consultar |

Para alguien que solo debe registrar las entradas y salidas de material, elige **Encargado de stock**.

**Usuarios:**

- Crear, editar el rol y activar o desactivar usuarios.
- Enviarles un email para restablecer su contraseña.
- Eliminarlos.

Para bloquear el acceso de forma temporal, usa **Desactivar** en lugar de eliminar. Nadie puede cambiar su propio rol ni desactivarse.

**Categorías:** en Configuración puedes crearlas y renombrarlas. Solo se pueden eliminar si no tienen materiales.
