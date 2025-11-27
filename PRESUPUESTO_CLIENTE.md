# 📋 PRESUPUESTO - SISTEMA DE CONTROL DE STOCK

## 🏢 INFORMACIÓN DEL PROYECTO

**Sistema:** Control de Stock Profesional para Productora Técnica de Eventos  
**Cliente:** [Nombre de la Empresa]  
**Fecha:** Noviembre 2025  
**Desarrollado por:** David Montenegro  
**Plataforma:** Aplicación Web Progresiva (PWA)

---

## 📦 RESUMEN EJECUTIVO

Sistema web completo de gestión de inventario diseñado específicamente para empresas de producción técnica de eventos, con capacidades de lectura de códigos de barras, generación de reportes PDF y administración multi-usuario.

---

## ✨ CARACTERÍSTICAS PRINCIPALES INCLUIDAS

### 🔐 **1. SISTEMA DE AUTENTICACIÓN Y SEGURIDAD**

- Inicio de sesión seguro con Firebase Authentication
- Gestión de usuarios con 3 roles diferenciados:
  - **Administrador**: Acceso completo (crear, editar, eliminar)
  - **Usuario**: Acceso limitado (solo lectura y creación de movimientos)
  - **Invitado (Demo)**: Acceso de solo lectura con datos de ejemplo
- Cambio de contraseña individual por usuario
- Sistema de cierre de sesión automático por inactividad
- **Cierre automático al cerrar navegador** (nueva funcionalidad)
- **Soporte para múltiples usuarios simultáneos** (nueva funcionalidad)
- Protección contra inspección de código (Ctrl+Shift+I deshabilitado)
- Toggle especial para desarrollador (Ctrl+Alt+Shift+D)

### 📊 **2. GESTIÓN COMPLETA DE MATERIALES**

- **Catálogo de Materiales** con información detallada:
  - Nombre y descripción
  - Código de barras único
  - Categoría (Iluminación, Audio, Video, Estructuras, etc.)
  - Estado (Disponible, En Uso, En Mantenimiento, Dañado, Obsoleto)
  - Cantidad en stock
  - Ubicación física
  - **Imagen del material** (nueva funcionalidad)
  - Observaciones
- **Búsqueda y filtros avanzados**:
  - Por nombre
  - Por categoría
  - Por estado
  - Búsqueda instantánea
- **Operaciones CRUD completas**:
  - Crear nuevos materiales
  - Editar información existente
  - Eliminar materiales (solo admin)
  - Vista detallada por material

### 📷 **3. LECTOR DE CÓDIGOS DE BARRAS**

- Escaneo en tiempo real usando cámara del dispositivo
- Compatible con múltiples formatos de códigos:
  - CODE_128
  - CODE_39
  - EAN_13
  - EAN_8
  - UPC_A
  - UPC_E
  - QR_CODE
- Búsqueda automática después del escaneo
- Funciona en móviles, tablets y escritorio
- Interfaz intuitiva con preview de cámara

### 📝 **4. REGISTRO DE MOVIMIENTOS DE STOCK**

- **Tipos de movimiento**:
  - Entrada
  - Salida
  - Ajuste de inventario
- **Información registrada**:
  - Material afectado
  - Tipo de movimiento
  - Cantidad
  - Fecha y hora automática
  - Usuario que realizó el movimiento
  - Observaciones opcionales
- **Historial completo** de todos los movimientos
- **Filtros por**:
  - Tipo de movimiento
  - Material
  - Rango de fechas
  - Usuario

### 📄 **5. GENERACIÓN DE REPORTES PDF**

- **Catálogo completo de materiales** exportable a PDF
- Información incluida:
  - Tabla completa con todos los materiales
  - Filtros aplicados
  - Fecha de generación
  - Logo de la empresa
  - Diseño profesional con colores corporativos
- Descarga automática con nombre descriptivo
- Formato A4 optimizado para impresión

### 👥 **6. ADMINISTRACIÓN DE USUARIOS**

- Panel de gestión de usuarios (solo admin)
- Crear nuevos usuarios con email y contraseña
- Asignar roles (admin/usuario)
- Ver listado de todos los usuarios
- Eliminar usuarios
- Cada usuario tiene su registro de actividad

### 🎯 **7. MODO DEMOSTRACIÓN**

- Base de datos completamente separada para demos
- Datos de ejemplo pre-cargados:
  - 10+ materiales profesionales de ejemplo
  - Diferentes categorías representadas
  - Estados variados
- Acceso de invitado con credenciales públicas
- Banner visual indicando "Modo Demostración"
- Separación total de datos reales vs demo
- Ideal para capacitaciones y pruebas

### 📱 **8. DISEÑO RESPONSIVE**

- **Adaptable a cualquier dispositivo**:
  - Computadoras de escritorio
  - Laptops
  - Tablets (iPad, Android tablets)
  - Smartphones (iOS, Android)
- Interfaz táctil optimizada para móviles
- Menú hamburguesa en pantallas pequeñas
- Formularios adaptables
- Tablas con scroll horizontal en móviles

### 🎨 **9. INTERFAZ DE USUARIO PROFESIONAL**

- Diseño moderno y limpio
- Esquema de colores corporativo:
  - Naranja principal (#DE591F)
  - Gris oscuro para textos (#2c3e50)
  - Verde/Rojo para estados
- Iconografía coherente (Lucide Icons)
- Animaciones suaves
- Feedback visual inmediato
- Notificaciones toast para acciones
- Loading states en operaciones

### ⚙️ **10. PANEL DE CONFIGURACIÓN**

- Vista de perfil del usuario
- Información de cuenta
- Cambio de contraseña
- Selección de tema (preparado para futuro)
- Toggle entre modo administrador/demo
- Información del sistema

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### **Frontend**

- **React 18.2**: Framework JavaScript moderno
- **Vite 5.1**: Build tool ultrarrápido
- **React Router 6**: Navegación SPA
- **Lucide React**: Iconografía profesional
- **React Hot Toast**: Notificaciones elegantes

### **Backend y Base de Datos**

- **Firebase Authentication**: Autenticación segura
- **Firebase Firestore**: Base de datos NoSQL en tiempo real
- **Firebase Hosting**: Hosting web con CDN global

### **Librerías Especializadas**

- **html5-qrcode 2.3.8**: Lectura de códigos de barras
- **jsPDF**: Generación de PDFs
- **jspdf-autotable**: Tablas profesionales en PDF

### **Infraestructura**

- Hosting en servidores de Google (Firebase)
- SSL/HTTPS incluido
- CDN global para carga rápida
- Backup automático de datos
- 99.9% de uptime garantizado por Google

---

## 🎁 FUNCIONALIDADES ADICIONALES

### **Seguridad**

- Reglas de seguridad de Firestore configuradas
- Validación de permisos en cada operación
- Sesiones seguras con tokens JWT
- Protección CSRF incluida

### **Rendimiento**

- Carga inicial optimizada (< 3 segundos)
- Lazy loading de componentes
- Caché de datos en cliente
- Compresión Gzip activada

### **Mantenibilidad**

- Código documentado extensivamente
- Arquitectura modular y escalable
- Componentes reutilizables
- Fácil de mantener y extender

### **Usabilidad**

- Interfaz intuitiva sin capacitación extensa
- Mensajes de error claros y útiles
- Validaciones en tiempo real
- Confirmaciones antes de acciones destructivas
- Accesos directos por teclado

---

## 📚 DOCUMENTACIÓN INCLUIDA

1. **Manual de Usuario** (en desarrollo)

   - Guía paso a paso de todas las funcionalidades
   - Screenshots y ejemplos
   - Casos de uso comunes

2. **Documentación Técnica**

   - Arquitectura del sistema
   - Estructura de base de datos
   - Guía de deployment
   - Comentarios en código

3. **Scripts de Administración**
   - `createAdminMaterials.mjs`: Crear materiales de ejemplo
   - `cleanDemoData.mjs`: Limpiar datos de demostración
   - `cambiarEmailAdmin.mjs`: Migrar admin a nuevo email
   - `reactivarCuentaOriginal.mjs`: Recuperación de emergencia

---

## 🔄 SOPORTE Y MANTENIMIENTO

### **Incluido en la Entrega**

- Instalación y configuración inicial
- Capacitación básica de 2 horas
- Migración de datos iniciales (si aplica)
- 30 días de soporte técnico

### **Mantenimiento Mensual** (Opcional)

- Actualizaciones de seguridad
- Corrección de bugs
- Optimizaciones de rendimiento
- Soporte técnico prioritario
- Backup semanal de datos
- Monitoreo de uptime

---

## 💰 ESTRUCTURA DE COSTOS

### **DESARROLLO COMPLETO**

**Sistema completo funcional y desplegado**

✅ Todas las funcionalidades listadas  
✅ Base de datos configurada  
✅ Hosting por 1 año  
✅ SSL/HTTPS incluido  
✅ Dominio personalizado (opcional)  
✅ Capacitación inicial  
✅ 30 días de soporte

**Precio:** [MONTO A DEFINIR]

---

### **COSTOS OPERATIVOS MENSUALES**

**Firebase (Google):**

- Hosting: $0 - $5 USD/mes (hasta 10GB transferencia)
- Firestore: $0 - $10 USD/mes (según uso)
- Authentication: Gratis (hasta 10,000 usuarios)
- **Total estimado: $0 - $15 USD/mes** para uso normal

**Dominio personalizado** (opcional):

- .com: $12 USD/año (~$1 USD/mes)
- .com.ar: $15 USD/año (~$1.25 USD/mes)

**Total operativo estimado: $0 - $20 USD/mes**

---

### **MANTENIMIENTO Y SOPORTE** (Opcional)

**Plan Básico - $50 USD/mes:**

- 2 horas de soporte técnico
- Actualizaciones de seguridad
- Corrección de bugs menores
- Email support (48h respuesta)

**Plan Profesional - $100 USD/mes:**

- 5 horas de soporte técnico
- Todo del Plan Básico
- Nuevas funcionalidades menores
- Optimizaciones de rendimiento
- WhatsApp support (24h respuesta)

**Plan Premium - $200 USD/mes:**

- 10 horas de soporte técnico
- Todo del Plan Profesional
- Desarrollo de nuevas features
- Consultoría técnica
- Support prioritario (12h respuesta)

---

## 🚀 POSIBLES MEJORAS FUTURAS

### **Funcionalidades Adicionales** (Cotizables por separado)

1. **Sistema de Reservas y Eventos**

   - Calendario de eventos
   - Asignación de materiales a eventos
   - Control de disponibilidad por fecha
   - Alertas de conflictos
   - **Estimado:** 40-60 horas dev

2. **Integración con Códigos QR**

   - Generación de etiquetas QR
   - Impresión de códigos
   - Escaneo masivo
   - **Estimado:** 15-20 horas dev

3. **Reportes Avanzados y Analytics**

   - Dashboard con gráficos
   - Estadísticas de uso de materiales
   - Reportes de mantenimiento
   - Predicción de necesidades
   - **Estimado:** 30-40 horas dev

4. **Sistema de Mantenimiento Preventivo**

   - Programación de mantenimientos
   - Alertas automáticas
   - Historial de reparaciones
   - Costos de mantenimiento
   - **Estimado:** 25-35 horas dev

5. **Módulo de Facturación**

   - Generación de presupuestos
   - Facturas PDF
   - Control de pagos
   - Integración con sistemas contables
   - **Estimado:** 50-70 horas dev

6. **App Móvil Nativa**

   - Android (Google Play)
   - iOS (App Store)
   - Funcionalidad offline
   - Notificaciones push
   - **Estimado:** 80-100 horas dev

7. **✅ Sistema de Fotos de Materiales** (IMPLEMENTADO)

   - ✅ Subida de imágenes
   - ✅ Compresión automática
   - ✅ Vista previa instantánea
   - ✅ Eliminación de imágenes
   - 🔄 Múltiples fotos por material (mejora futura)
   - 🔄 Galería de imágenes (mejora futura)

8. **Integración con APIs Externas**

   - WhatsApp Business API (notificaciones)
   - Email automático (alertas)
   - Google Calendar (eventos)
   - **Estimado:** 15-20 horas dev por integración

9. **Multi-Idioma**

   - Español e Inglés
   - Selector de idioma
   - Traducciones completas
   - **Estimado:** 10-15 horas dev

10. **Modo Offline**
    - Funcionamiento sin internet
    - Sincronización automática
    - Caché inteligente
    - **Estimado:** 30-40 horas dev

---

## 📞 CONDICIONES DE CONTRATACIÓN

### **Proceso de Desarrollo**

1. **Adelanto del 50%** al inicio del proyecto
2. **Desarrollo y testeo** (2-4 semanas)
3. **Revisión con cliente** y ajustes menores
4. **Pago del 50% restante** antes del deployment final
5. **Entrega y capacitación**

### **Forma de Pago**

- Transferencia bancaria
- PayPal (+5% comisión)
- Criptomonedas (USDT, BTC)
- Mercado Pago (solo Argentina)

### **Garantías**

- 30 días de garantía en funcionalidad
- Corrección de bugs sin costo adicional (si no son causados por uso indebido)
- Datos respaldados por Google (99.999% durabilidad)

### **Propiedad Intelectual**

- Código fuente permanece propiedad del desarrollador
- Cliente recibe licencia de uso exclusiva e ilimitada
- Acceso completo a base de datos y panel de Firebase
- Posibilidad de comprar código fuente (+ 40% del costo)

---

## 📈 RETORNO DE INVERSIÓN (ROI)

### **Beneficios Cuantificables**

- ⏱️ **Ahorro de tiempo:** 3-5 horas/semana en gestión manual
- 📉 **Reducción de errores:** 95% menos errores de inventario
- 📊 **Mejor control:** Visibilidad completa del stock en tiempo real
- 💼 **Profesionalismo:** Imagen corporativa mejorada
- 📱 **Movilidad:** Acceso desde cualquier lugar y dispositivo

### **Ejemplo de Ahorro Anual**

Si un empleado dedica 4 horas/semana a inventario manual:

- 4 horas/semana × 52 semanas = **208 horas/año**
- A $10 USD/hora = **$2,080 USD ahorrados/año**
- **ROI en menos de 3 meses** (considerando precio del sistema)

---

## 🎯 PRÓXIMOS PASOS

1. **Revisión del presupuesto** por parte del cliente
2. **Reunión de ajuste** para personalizar requerimientos
3. **Firma de contrato** y pago inicial
4. **Inicio del desarrollo** con timeline definido
5. **Revisiones semanales** de progreso
6. **Testing y ajustes finales**
7. **Deployment y capacitación**
8. **Go Live** 🚀

---

## 📧 CONTACTO

**Desarrollador:** David Montenegro  
**Email:** montedavid07@hotmail.com  
**Teléfono/WhatsApp:** [Tu número]  
**GitHub:** github.com/Davemnt  
**LinkedIn:** [Tu perfil]

---

## 📝 NOTAS ADICIONALES

- Todos los precios están sujetos a revisión según requerimientos específicos
- Los tiempos de desarrollo pueden variar según complejidad y revisiones
- Costos de Firebase pueden aumentar con uso intensivo (empresas grandes)
- Posibilidad de descuentos por pago anticipado completo
- Paquetes personalizados disponibles según necesidades

---

**Este presupuesto es válido por 30 días desde su emisión**

---

## ✅ ESTADO ACTUAL DEL PROYECTO

**Sistema 100% FUNCIONAL y DESPLEGADO**

- ✅ Todas las funcionalidades principales implementadas
- ✅ Base de datos Firebase configurada
- ✅ Hosting activo: https://control-de-stock-e4f5f.web.app
- ✅ SSL/HTTPS habilitado
- ✅ Modo demostración funcional
- ✅ 10 materiales de ejemplo cargados
- ✅ Sistema multi-usuario operativo
- ✅ Lector de códigos de barras funcionando
- ✅ Generación de PDFs operativa

**El sistema está listo para producción inmediata tras la migración del email administrativo.**

---

_Documento generado: Noviembre 2025_  
_Versión: 1.0_
