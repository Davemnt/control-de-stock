# Guía de Escaneo de Códigos de Barras

Esta guía explica cómo utilizar la función de escaneo de códigos de barras en el sistema de Control de Stock.

## 📱 Características

- **Escaneo con Cámara**: Usa la cámara del dispositivo para escanear códigos
- **Múltiples Formatos**: Soporta códigos de barras (Code 128, EAN-13, EAN-8) y códigos QR
- **Fácil de Usar**: Interfaz intuitiva con instrucciones en pantalla
- **Compatible con Móviles**: Optimizado para dispositivos móviles y tablets

## 🚀 Cómo Usar el Escáner

### Desde Materiales

1. **Crear/Editar Material**:

   - Haz clic en "Nuevo Material" o "Editar" en un material existente
   - En el formulario, localiza el campo "Código"
   - Haz clic en el botón "Escanear" con el ícono de cámara

2. **Iniciar Escaneo**:

   - Se abrirá una ventana modal con el escáner
   - Permite el acceso a la cámara cuando el navegador lo solicite
   - Haz clic en "Iniciar Escaneo"

3. **Escanear Código**:
   - Posiciona el código de barras dentro del marco cuadrado
   - El escáner detectará automáticamente el código
   - El código se ingresará automáticamente en el campo

## 🔧 Requisitos Técnicos

### Permisos de Cámara

El navegador solicitará permiso para acceder a la cámara:

- **Chrome/Edge**: Haz clic en "Permitir" en la barra superior
- **Firefox**: Haz clic en "Permitir" en la notificación
- **Safari (iOS)**: Asegúrate de tener iOS 11+ y permite el acceso a la cámara

### Navegadores Soportados

| Navegador | Versión Mínima | Soporte     |
| --------- | -------------- | ----------- |
| Chrome    | 53+            | ✅ Completo |
| Firefox   | 49+            | ✅ Completo |
| Edge      | 79+            | ✅ Completo |
| Safari    | 11+            | ✅ Completo |
| Opera     | 40+            | ✅ Completo |

### Dispositivos

- **Desktop**: Requiere webcam conectada
- **Laptop**: Usa la cámara integrada
- **Móvil/Tablet**: Usa la cámara trasera (recomendado)

## 📋 Formatos de Código Soportados

### Códigos de Barras 1D

- **Code 128**: Estándar industrial, alta densidad
- **EAN-13**: Productos comerciales (13 dígitos)
- **EAN-8**: Productos pequeños (8 dígitos)
- **UPC-A**: Productos norteamericanos (12 dígitos)
- **UPC-E**: Versión compacta de UPC-A

### Códigos 2D

- **QR Code**: Códigos QR estándar
- Soporta URLs, texto, y datos estructurados

## 💡 Consejos para Mejor Escaneo

### Iluminación

- ✅ **Buena iluminación**: Natural o artificial uniforme
- ❌ **Evitar**: Luz directa que cause reflejos

### Distancia

- **Óptima**: 10-20 cm del código
- **Rango**: 5-30 cm dependiendo del tamaño del código

### Estabilidad

- Mantén el dispositivo estable
- Espera a que el escáner se centre
- El código se detectará automáticamente

### Calidad del Código

- Códigos nítidos y sin daños
- Sin arrugas ni manchas
- Contraste adecuado (oscuro sobre claro)

## 🔍 Resolución de Problemas

### "No se pudo acceder a la cámara"

**Causas comunes**:

- Permisos de cámara denegados
- Cámara en uso por otra aplicación
- Navegador no compatible

**Soluciones**:

1. Verifica los permisos en configuración del navegador
2. Cierra otras aplicaciones que usen la cámara
3. Recarga la página e intenta de nuevo
4. Usa un navegador compatible (Chrome, Firefox)

### El código no se detecta

**Soluciones**:

1. Mejora la iluminación
2. Acerca o aleja la cámara
3. Mantén el código dentro del marco
4. Limpia la lente de la cámara
5. Verifica que el código esté completo y legible

### Cámara muestra imagen borrosa

**Soluciones**:

1. Limpia la lente de la cámara
2. Espera a que el enfoque automático funcione
3. Ajusta la distancia al código

## 🎯 Mejores Prácticas

### Para Administradores

1. **Etiquetado Consistente**:

   - Usa el mismo tipo de código para todos los materiales
   - Mantén un registro de códigos asignados
   - Documenta el formato elegido

2. **Calidad de Impresión**:

   - Imprime códigos en alta calidad
   - Usa impresoras especializadas para códigos de barras
   - Verifica que los códigos sean escaneables antes de usar

3. **Ubicación de Etiquetas**:
   - Coloca etiquetas en lugares accesibles
   - Protege las etiquetas del desgaste
   - Duplica etiquetas en equipos críticos

### Para Usuarios

1. **Preparación**:

   - Ten buena luz disponible
   - Limpia la lente de tu dispositivo
   - Practica el escaneo en un ambiente controlado

2. **Durante el Escaneo**:

   - Mantén el dispositivo estable
   - Centra el código en el visor
   - Espera confirmación del escaneo

3. **Verificación**:
   - Confirma que el código escaneado es correcto
   - Verifica en el formulario antes de guardar
   - Reporta códigos problemáticos

## 📱 Uso en Dispositivos Móviles

### Android

1. Abre Chrome o Firefox
2. Accede a la aplicación web
3. Permite acceso a la cámara cuando se solicite
4. Usa la cámara trasera para mejor enfoque

### iOS (iPhone/iPad)

1. Abre Safari (iOS 11+)
2. Accede a la aplicación web
3. Permite acceso a la cámara
4. Mantén el dispositivo horizontal para mejor encuadre

## 🔐 Privacidad y Seguridad

- **Local**: Todo el procesamiento se realiza en el navegador
- **Sin Envío**: Las imágenes no se envían a servidores externos
- **Temporal**: No se almacenan imágenes de la cámara
- **Permisos**: Solo accede a la cámara cuando el usuario lo permite

## 📞 Soporte

Si tienes problemas con el escáner:

1. Verifica los requisitos técnicos
2. Sigue la guía de resolución de problemas
3. Contacta al administrador del sistema
4. Proporciona detalles: navegador, dispositivo, error específico

---

**Última actualización**: Enero 2025
**Versión**: 2.0.0
