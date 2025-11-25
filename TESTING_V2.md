# ✅ Checklist de Pruebas - Versión 2.0

## 📱 Escaneo de Códigos de Barras

### Pruebas Funcionales

- [ ] **Abrir Modal de Escaneo**

  - Ir a Materiales → Nuevo Material
  - Hacer clic en botón "Escanear" junto al campo Código
  - El modal debe abrirse correctamente

- [ ] **Solicitar Permisos de Cámara**

  - El navegador debe solicitar acceso a la cámara
  - Permitir el acceso
  - La cámara debe activarse

- [ ] **Iniciar Escaneo**

  - Hacer clic en "Iniciar Escaneo"
  - El visor debe mostrar la imagen de la cámara
  - Debe aparecer el marco de alineación

- [ ] **Escanear Código**

  - Colocar código de barras frente a la cámara
  - El código debe detectarse automáticamente
  - El modal debe cerrarse
  - El código debe aparecer en el campo

- [ ] **Cancelar Escaneo**

  - Hacer clic en "Cancelar Escaneo"
  - La cámara debe detenerse
  - El modal debe cerrarse

- [ ] **Cerrar Modal**
  - Hacer clic en X o fuera del modal
  - La cámara debe detenerse
  - El modal debe cerrarse

### Pruebas de Errores

- [ ] **Sin Cámara Disponible**

  - Debe mostrar mensaje de error apropiado
  - No debe fallar la aplicación

- [ ] **Permisos Denegados**

  - Debe mostrar mensaje claro
  - Ofrecer alternativa (entrada manual)

- [ ] **Código No Legible**
  - Debe continuar escaneando
  - No debe mostrar errores en consola

### Compatibilidad

- [ ] **Chrome Desktop** (última versión)
- [ ] **Firefox Desktop** (última versión)
- [ ] **Edge Desktop** (última versión)
- [ ] **Chrome Android** (última versión)
- [ ] **Safari iOS** (iOS 11+)

---

## 📄 Exportación PDF

### Pruebas de Inventario

- [ ] **Exportar Todo el Inventario**

  - Ir a Materiales
  - No aplicar filtros
  - Hacer clic en "Exportar PDF"
  - Debe descargarse archivo PDF
  - Abrir y verificar contenido completo

- [ ] **Exportar con Filtro de Categoría**

  - Seleccionar categoría (ej: Audio)
  - Exportar PDF
  - Verificar que solo incluye esa categoría

- [ ] **Exportar con Filtro de Estado**

  - Seleccionar estado (ej: Operativo)
  - Exportar PDF
  - Verificar que solo incluye ese estado

- [ ] **Exportar con Búsqueda**

  - Buscar texto específico
  - Exportar PDF
  - Verificar que solo incluye resultados filtrados

- [ ] **Exportar Inventario Vacío**
  - Aplicar filtros que no retornen resultados
  - Intentar exportar
  - Debe mostrar toast de error

### Pruebas de Historial

- [ ] **Exportar Todo el Historial**

  - Ir a Historial
  - No aplicar filtros
  - Exportar PDF
  - Verificar contenido completo

- [ ] **Exportar con Filtro de Material**

  - Seleccionar material específico
  - Exportar PDF
  - Verificar movimientos solo de ese material

- [ ] **Exportar con Filtro de Tipo**

  - Seleccionar tipo (ej: Entrada)
  - Exportar PDF
  - Verificar solo movimientos de ese tipo

- [ ] **Exportar con Búsqueda**
  - Buscar por motivo o usuario
  - Exportar PDF
  - Verificar resultados filtrados

### Verificación de PDF

Para cada PDF generado, verificar:

- [ ] **Encabezado**

  - Título correcto
  - Fecha de generación presente
  - Filtros aplicados mostrados

- [ ] **Contenido**

  - Tabla con todas las columnas esperadas
  - Datos correctos y completos
  - Formato legible

- [ ] **Resumen**

  - Totales correctos
  - Estadísticas coherentes

- [ ] **Pie de Página**

  - Número de página en cada hoja
  - Formato consistente

- [ ] **Diseño**
  - Colores corporativos visibles
  - Filas alternadas en tablas
  - Márgenes apropiados
  - Legible al imprimir

### Compatibilidad de Visualización

- [ ] **Adobe Reader**
- [ ] **Chrome PDF Viewer**
- [ ] **Firefox PDF Viewer**
- [ ] **Edge PDF Viewer**
- [ ] **Preview (macOS)**
- [ ] **App de PDF en móvil**

---

## 🎨 Interfaz de Usuario

### Nuevos Botones

- [ ] **Botón "Exportar PDF" en Materiales**

  - Visible en header
  - Ícono correcto (FileDown)
  - Estilo ghost aplicado
  - Hover funcional

- [ ] **Botón "Exportar PDF" en Historial**

  - Visible en header junto a "Exportar CSV"
  - Ícono y estilo correctos
  - Funcional

- [ ] **Botón "Escanear" en Formulario**
  - Visible junto al campo Código
  - Ícono de cámara visible
  - Alineación correcta
  - Responsive

### Layout Actualizado

- [ ] **Header con Múltiples Acciones**

  - Botones alineados correctamente
  - Espaciado apropiado
  - Responsive en móvil (wrap)

- [ ] **Input con Scanner**
  - Input y botón alineados
  - Gap apropiado
  - Responsive

---

## 📱 Responsive

### Desktop (>1024px)

- [ ] Modal de escáner centrado
- [ ] Botones en una fila
- [ ] PDF viewer funcional

### Tablet (768px-1024px)

- [ ] Modal de escáner adaptado
- [ ] Botones pueden hacer wrap
- [ ] PDF descarga correctamente

### Móvil (<768px)

- [ ] Modal de escáner pantalla completa
- [ ] Botones verticales
- [ ] Cámara trasera por defecto
- [ ] PDF se descarga correctamente

---

## 🐛 Pruebas de Edge Cases

### Escaneo

- [ ] Escanear mientras hay error previo
- [ ] Cambiar de cámara (si hay múltiples)
- [ ] Escanear código parcialmente visible
- [ ] Escanear en condiciones de poca luz

### PDF

- [ ] Exportar con 0 resultados (debe fallar gracefully)
- [ ] Exportar con 1000+ registros (paginación)
- [ ] Exportar con caracteres especiales en datos
- [ ] Exportar con campos vacíos/null

---

## 📊 Performance

### Tiempos Esperados

- [ ] Modal de escáner abre en <500ms
- [ ] Cámara se activa en <2s
- [ ] Código se detecta en <1s (con buen código)
- [ ] PDF de 100 items se genera en <2s
- [ ] PDF de 1000 items se genera en <10s

### Recursos

- [ ] Uso de cámara se detiene al cerrar
- [ ] Memoria se libera correctamente
- [ ] No hay memory leaks en escáner
- [ ] No hay errores en consola

---

## ✅ Criterios de Aceptación

### Escaneo de Códigos

- ✅ Funciona en Chrome, Firefox, Edge, Safari
- ✅ Funciona en Android e iOS
- ✅ Maneja errores gracefully
- ✅ UI intuitiva y clara
- ✅ Performance aceptable (<3s total)

### Exportación PDF

- ✅ Genera PDFs válidos y legibles
- ✅ Respeta filtros aplicados
- ✅ Diseño profesional
- ✅ Funciona con datasets grandes
- ✅ Compatible con todos los viewers

### Experiencia General

- ✅ No breaking changes en funcionalidad existente
- ✅ Integración natural con UI existente
- ✅ Responsive en todos los tamaños
- ✅ Sin errores en consola
- ✅ Documentación completa

---

## 📝 Notas de Testing

**Tester**: ******\_\_\_******  
**Fecha**: ******\_\_\_******  
**Navegador**: ******\_\_\_******  
**Dispositivo**: ******\_\_\_******

**Bugs Encontrados**:

1. ***
2. ***
3. ***

**Comentarios**:

---

---

---

---

**Estado**: [ ] Aprobado [ ] Requiere Correcciones
