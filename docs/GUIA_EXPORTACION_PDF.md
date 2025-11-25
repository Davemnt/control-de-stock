# Guía de Exportación a PDF

Esta guía explica cómo generar y exportar informes en formato PDF desde el sistema de Control de Stock.

## 📄 Características

- **Múltiples Reportes**: Inventario completo, historial de movimientos, reportes individuales
- **Personalización**: Aplica filtros antes de exportar
- **Diseño Profesional**: PDFs con logo, tablas formateadas y resúmenes
- **Paginación Automática**: Documentos multipágina con numeración

## 🚀 Tipos de Reportes PDF

### 1. Inventario de Materiales

Exporta la lista completa o filtrada de materiales del inventario.

**Ubicación**: Página "Materiales" → Botón "Exportar PDF"

**Contenido**:

- Código de material
- Nombre y descripción
- Categoría y subcategoría
- Cantidad disponible
- Cantidad comprometida
- Ubicación física
- Estado operativo

**Filtros disponibles**:

- Por categoría (Audio, Iluminación, Video, etc.)
- Por estado (Operativo, Mantenimiento, Dañado)
- Por búsqueda de texto

### 2. Historial de Movimientos

Exporta el registro completo de movimientos de stock.

**Ubicación**: Página "Historial" → Botón "Exportar PDF"

**Contenido**:

- Fecha y hora del movimiento
- Tipo de operación (Entrada, Salida, Ajuste, etc.)
- Material afectado
- Cantidad modificada
- Ubicaciones origen/destino
- Usuario responsable
- Motivo del movimiento

**Filtros disponibles**:

- Por material específico
- Por tipo de movimiento
- Por rango de fechas
- Por usuario

### 3. Reporte Individual de Material

Genera un informe detallado de un material específico.

**Ubicación**: Próximamente en página de detalle

**Contenido**:

- Información completa del material
- Estadísticas de uso
- Historial de movimientos
- Estado actual y proyecciones

## 📋 Cómo Exportar

### Desde Materiales

1. **Aplicar Filtros** (opcional):

   ```
   - Selecciona categoría: "Audio"
   - Selecciona estado: "Operativo"
   - Busca: "Microfono"
   ```

2. **Exportar**:

   - Haz clic en botón "Exportar PDF"
   - El PDF se genera automáticamente
   - Se descarga: `inventario-materiales-2025-01-20.pdf`

3. **Revisar**:
   - Abre el archivo descargado
   - Verifica que los datos sean correctos
   - Comparte o imprime según necesites

### Desde Historial

1. **Aplicar Filtros** (opcional):

   ```
   - Material: "Consola Yamaha QL5"
   - Tipo: "Salida"
   - Busca: "evento"
   ```

2. **Exportar**:

   - Haz clic en "Exportar PDF"
   - Se genera con filtros aplicados
   - Descarga: `historial-movimientos-2025-01-20.pdf`

3. **Usar**:
   - Documenta el reporte
   - Archiva para auditorías
   - Comparte con el equipo

## 🎨 Formato del PDF

### Estructura del Documento

```
┌─────────────────────────────────┐
│ HEADER                          │
│ - Logo y título                 │
│ - Fecha de generación           │
│ - Filtros aplicados             │
├─────────────────────────────────┤
│ CONTENIDO                       │
│ - Tablas con datos              │
│ - Información detallada         │
│ - Múltiples páginas si necesario│
├─────────────────────────────────┤
│ RESUMEN                         │
│ - Total de registros            │
│ - Estadísticas clave            │
├─────────────────────────────────┤
│ FOOTER                          │
│ - Número de página              │
│ - Fecha/hora de generación      │
└─────────────────────────────────┘
```

### Elementos Visuales

- **Colores Corporativos**: Naranja (#DE591F) para encabezados
- **Tipografía**: Profesional y legible
- **Tablas Alternadas**: Filas con colores alternos para mejor lectura
- **Bordes y Separadores**: Diseño limpio y organizado

## 💡 Consejos para Mejores Reportes

### Antes de Exportar

1. **Limpia los Datos**:

   - Revisa que la información esté actualizada
   - Corrige errores evidentes
   - Completa campos vacíos importantes

2. **Aplica Filtros Relevantes**:

   - Exporta solo lo necesario
   - Usa filtros para enfocarte en información específica
   - Reduce el tamaño del PDF filtrando

3. **Verifica el Orden**:
   - Los datos se exportan en el orden mostrado
   - Ordena antes de exportar si es importante

### Durante la Exportación

1. **Permite Descargas**:

   - Algunos navegadores bloquean descargas automáticas
   - Permite descargas del sitio si aparece una notificación

2. **Espera la Generación**:

   - PDFs grandes pueden tardar unos segundos
   - No cierres la ventana durante la generación

3. **Confirma Descarga**:
   - Verifica que el archivo se descargó
   - Busca en la carpeta de descargas

### Después de Exportar

1. **Revisa el Contenido**:

   - Abre y verifica el PDF generado
   - Confirma que tiene toda la información esperada

2. **Nombra Adecuadamente**:

   - Renombra con nombre descriptivo si es necesario
   - Ejemplo: `Inventario_Audio_Enero2025.pdf`

3. **Archiva Correctamente**:
   - Guarda en ubicación apropiada
   - Mantén versionado si haces múltiples exportaciones

## 📊 Casos de Uso

### 1. Auditoría Mensual

```
Objetivo: Documentar inventario mensual
Pasos:
1. Ir a "Materiales"
2. No aplicar filtros (exportar todo)
3. Exportar PDF
4. Guardar como: Auditoria_Enero_2025.pdf
5. Firmar y archivar
```

### 2. Reporte por Proyecto

```
Objetivo: Documentar materiales usados en evento
Pasos:
1. Ir a "Historial"
2. Filtrar por fechas del evento
3. Buscar nombre del proyecto
4. Exportar PDF
5. Adjuntar a documentación del proyecto
```

### 3. Inventario por Categoría

```
Objetivo: Revisar stock de categoría específica
Pasos:
1. Ir a "Materiales"
2. Filtrar por categoría (ej: "Iluminación")
3. Exportar PDF
4. Revisar disponibilidad
5. Planificar compras si es necesario
```

### 4. Reporte de Mantenimiento

```
Objetivo: Listar equipos que requieren mantenimiento
Pasos:
1. Ir a "Materiales"
2. Filtrar por estado "Mantenimiento"
3. Exportar PDF
4. Entregar a técnicos
5. Seguimiento de reparaciones
```

## 🔧 Configuración Avanzada

### Personalización (Próximamente)

En futuras versiones podrás:

- Elegir qué columnas incluir
- Personalizar logo de la empresa
- Ajustar colores corporativos
- Añadir notas personalizadas

### Programación de Reportes

Puedes configurar exportaciones automáticas:

- Reportes mensuales programados
- Alertas por email con PDF adjunto
- Integración con sistemas externos

## 📱 Compatibilidad

### Generación del PDF

- **Navegadores**: Todos los modernos (Chrome, Firefox, Edge, Safari)
- **Dispositivos**: Desktop, laptop, tablet, móvil
- **Tamaño**: Sin límite práctico (se pagina automáticamente)

### Visualización del PDF

- **Adobe Reader**: Recomendado
- **Navegador web**: Funciona en todos
- **Aplicaciones móviles**: Cualquier lector PDF

## 🔐 Seguridad y Privacidad

- **Generación Local**: El PDF se crea en tu navegador
- **Sin Envío**: No se envía información a servidores externos
- **Datos Sensibles**: Trata los PDFs como documentos confidenciales
- **Compartición**: Usa canales seguros para compartir

## 🐛 Resolución de Problemas

### "No se descarga el PDF"

**Soluciones**:

1. Verifica que las descargas no estén bloqueadas
2. Revisa la carpeta de descargas
3. Intenta con otro navegador
4. Deshabilita extensiones de bloqueo

### "PDF vacío o incompleto"

**Soluciones**:

1. Verifica que haya datos para exportar
2. Quita algunos filtros
3. Recarga la página e intenta de nuevo
4. Verifica tu conexión a internet

### "Error al generar PDF"

**Soluciones**:

1. Reduce la cantidad de datos (aplica filtros)
2. Actualiza el navegador
3. Limpia la caché del navegador
4. Contacta soporte técnico

## 📞 Soporte

Para problemas con exportación de PDF:

1. Verifica los requisitos técnicos
2. Sigue la guía de resolución de problemas
3. Contacta al administrador del sistema
4. Proporciona: tipo de reporte, filtros usados, mensaje de error

## 🎯 Mejores Prácticas

### Organización

- **Nombrado**: Usa nombres descriptivos y fechas
- **Estructura**: Crea carpetas por año/mes
- **Versionado**: Mantén historial de reportes importantes

### Frecuencia

- **Auditorías**: Mensual o trimestral
- **Proyectos**: Al inicio y fin de cada evento
- **Mantenimiento**: Antes de cada revisión técnica
- **Backups**: Semanal para respaldo

### Distribución

- **Interna**: Comparte con equipo relevante
- **Externa**: Solo con autorización
- **Formato**: Considera convertir a PDF/A para archivo permanente

---

**Última actualización**: Enero 2025
**Versión**: 2.0.0
