# 💡 Ejemplos de Uso - Control de Stock

## 📝 Casos de Uso Prácticos

### 1. Registro de Material Nuevo

**Escenario:** Acabas de adquirir 10 mezcladoras digitales nuevas.

**Pasos:**

1. Login como Admin o Usuario
2. Ir a **Materiales**
3. Click en **Nuevo Material**
4. Completar formulario:
   ```
   Nombre: Mezcladora Digital X32
   Código: AUD-001
   Categoría: Audio
   Subcategoría: Mezcladoras
   Cantidad: 10
   Ubicación: Depósito Principal
   Estado: Operativo
   ```
5. **Crear Material**

**Resultado:** El material aparece en el catálogo y se suma al stock total.

---

### 2. Salida de Material para Evento

**Escenario:** Necesitas 4 mezcladoras para un evento corporativo.

**Pasos:**

1. Ir a **Movimientos**
2. Click en **Registrar Movimiento**
3. Completar:
   ```
   Material: Mezcladora Digital X32
   Tipo: Salida
   Cantidad: 4
   Motivo: Evento corporativo
   Proyecto: Conferencia Anual 2025
   ```
4. **Registrar Movimiento**

**Resultado:**

- Stock se reduce de 10 a 6 unidades
- Movimiento registrado en historial
- Dashboard actualizado automáticamente

---

### 3. Devolución de Material

**Escenario:** El evento finalizó, devuelves las 4 mezcladoras.

**Pasos:**

1. Ir a **Movimientos**
2. **Registrar Movimiento**
3. Seleccionar:
   ```
   Material: Mezcladora Digital X32
   Tipo: Devolución
   Cantidad: 4
   Motivo: Fin de evento
   Proyecto: Conferencia Anual 2025
   ```
4. **Registrar**

**Resultado:**

- Stock vuelve a 10 unidades
- Historial completo del ciclo

---

### 4. Material en Mantenimiento

**Escenario:** Una mezcladora necesita mantenimiento preventivo.

**Pasos:**

1. Ir a **Materiales**
2. Buscar "Mezcladora Digital X32"
3. Click en **Editar**
4. Cambiar:
   ```
   Estado: En Mantenimiento
   Cantidad en Mantenimiento: 1
   Cantidad Disponible: 9
   Observaciones: Mantenimiento preventivo programado
   ```
5. **Actualizar**

**Resultado:**

- Dashboard muestra 1 material en mantenimiento
- Stock disponible se ajusta automáticamente

---

### 5. Consulta de Stock Bajo

**Escenario:** Verificar qué materiales necesitan reposición.

**Pasos:**

1. Ir a **Dashboard**
2. Ver widget **Materiales Críticos**
3. O ir a **Materiales** y filtrar por stock bajo

**Resultado:** Lista de materiales con stock ≤ 10 unidades

---

### 6. Crear Usuario Nuevo

**Escenario:** Incorporas un nuevo técnico al equipo.

**Pasos (Solo Admin):**

1. Ir a **Usuarios**
2. Click en **Nuevo Usuario**
3. Completar:
   ```
   Nombre: Juan Pérez
   Email: juan@eventos.com
   Contraseña: TecnicoJuan123
   Rol: Usuario
   Estado: Activo
   ```
4. **Crear Usuario**

**Resultado:** Juan puede acceder al sistema con sus credenciales.

---

### 7. Exportar Reporte Mensual

**Escenario:** Necesitas enviar un reporte de movimientos del mes.

**Pasos:**

1. Ir a **Historial**
2. Filtrar por fecha/material si es necesario
3. Click en **Exportar CSV**

**Resultado:**

- Archivo `historial_stock_2025-11-24.csv` descargado
- Compatible con Excel
- Listo para enviar

---

### 8. Búsqueda Rápida

**Escenario:** Cliente pregunta por disponibilidad de Moving Heads.

**Pasos:**

1. Ir a **Materiales**
2. Escribir "Moving Head" en el buscador
3. Ver resultados en tiempo real

**Resultado:**

```
Moving Head LED 300W
Código: LUZ-001
Disponible: 12 unidades
Comprometidas: 4 unidades
```

---

### 9. Registro de Material Dañado

**Escenario:** Un proyector se dañó en un evento.

**Pasos:**

1. **Opción A - Cambiar Estado:**

   - Ir a Materiales → Editar proyector
   - Estado: Fuera de Servicio
   - Observaciones: "Dañado en evento - lente rota"

2. **Opción B - Registrar Baja:**
   - Ir a Movimientos
   - Tipo: Baja
   - Cantidad: 1
   - Motivo: "Material dañado irreparable"

**Resultado:** Stock ajustado y evento documentado.

---

### 10. Consulta de Historial por Material

**Escenario:** Quieres ver todos los movimientos de un material específico.

**Pasos:**

1. Ir a **Historial**
2. Filtro "Material" → Seleccionar material
3. Ver timeline completo

**Resultado:**

```
24/11/2025 14:30 - Salida - 4 unidades - Evento X
20/11/2025 09:15 - Entrada - 10 unidades - Compra
15/11/2025 16:45 - Devolución - 2 unidades - Evento Y
```

---

## 🎯 Flujos de Trabajo Completos

### Flujo: Evento Completo

1. **Planificación:**

   - Consultar disponibilidad en Materiales
   - Verificar stock suficiente

2. **Salida:**

   - Registrar movimiento de salida
   - Especificar proyecto/evento
   - Material se marca como "Comprometido"

3. **Durante Evento:**

   - Si hay incidentes, actualizar estado
   - Registrar notas en observaciones

4. **Devolución:**

   - Registrar movimiento de devolución
   - Verificar estado del material
   - Si hay daños, cambiar a mantenimiento

5. **Post-Evento:**
   - Revisar historial
   - Exportar reporte para cliente
   - Actualizar inventario

---

### Flujo: Mantenimiento Preventivo

1. **Planificación:**

   - Dashboard muestra materiales críticos
   - Identificar equipos que necesitan servicio

2. **Registro:**

   - Cambiar estado a "En Mantenimiento"
   - Actualizar cantidad en mantenimiento
   - Agregar notas con fecha programada

3. **Seguimiento:**

   - Dashboard muestra equipos en mantenimiento
   - Consultar regularmente

4. **Finalización:**
   - Cambiar estado a "Operativo"
   - Ajustar cantidades
   - Registrar en observaciones

---

### Flujo: Compra de Material Nuevo

1. **Recepción:**

   - Crear nuevo material o editar existente
   - Registrar cantidad recibida

2. **Movimiento:**

   - Registrar como "Entrada"
   - Motivo: "Compra nueva"
   - Incluir proveedor en notas

3. **Verificación:**
   - Dashboard actualizado
   - Stock total incrementado

---

## 📱 Atajos y Tips

### Búsqueda Rápida

- Use el buscador en Materiales para encontrar por nombre, código o subcategoría
- Los filtros se aplican en tiempo real

### Navegación

- Sidebar siempre accesible en desktop
- Menú hamburguesa en móvil
- Breadcrumbs para orientación

### Notificaciones

- Verde: Operación exitosa
- Rojo: Error o validación
- Se cierran automáticamente

### Validaciones

- Stock bajo: alerta visual
- Stock insuficiente: no permite salida
- Campos requeridos: marcados con \*

---

## ⚠️ Errores Comunes y Soluciones

### "Stock insuficiente"

**Causa:** Intentas retirar más material del disponible
**Solución:** Verifica stock actual o reduce cantidad

### "Usuario no autorizado"

**Causa:** Tu rol no tiene permisos para la operación
**Solución:** Contacta al administrador

### "Material no encontrado"

**Causa:** El material fue eliminado
**Solución:** Verifica en el catálogo o crea uno nuevo

### "Sesión expirada"

**Causa:** Tiempo de inactividad prolongado
**Solución:** Vuelve a iniciar sesión

---

## 🎓 Mejores Prácticas

1. **Códigos Únicos:** Usa convención consistente (CAT-000)
2. **Descripciones Claras:** Incluye marca, modelo, especificaciones
3. **Ubicaciones Específicas:** "Depósito A - Rack 3 - Estante 2"
4. **Movimientos Detallados:** Siempre incluye motivo y proyecto
5. **Actualizaciones Regulares:** Mantén el inventario al día
6. **Respaldos:** Exporta CSV periódicamente
7. **Capacitación:** Asegura que todos conozcan el sistema

---

## 📞 ¿Necesitas Ayuda?

- Revisa la documentación en `SETUP.md`
- Consulta funcionalidades en `FEATURES.md`
- Ver guía de despliegue en `DEPLOYMENT.md`

**Sistema Profesional de Control de Stock v1.0** 🚀
