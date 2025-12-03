# 🚀 INSTALADOR PROFESIONAL - CONTROL DE STOCK

Sistema completo de instalación y gestión de suscripciones para Control de Stock.

---

## 📦 CONTENIDO

### Scripts Disponibles:

```bash
npm run install-client       # Instalador clásico (tú gestionas Firebase)
npm run install-autonomo     # Instalador autónomo (cliente gestiona Firebase) ⭐
npm run admin                # Panel de administración de suscripciones
npm run guia                 # Guía rápida de uso
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### ✅ Sistema de Suscripciones Completo

- **Período de Prueba:** 7 días automáticos
- **Validación Automática:** Verifica estado en cada carga
- **Bloqueo Inteligente:** Bloquea app si no hay pago
- **Panel Admin:** Gestiona pagos desde terminal
- **Notificaciones:** Avisa al cliente cuando vence

### ✅ Dos Métodos de Instalación

**Método A: Tú Gestionas (install-client)**

- Proyecto Firebase en tu cuenta
- Tú tienes acceso total
- Cliente paga a través tuyo
- **Precio:** $600 + $40/mes

**Método B: Cliente Autónomo (install-autonomo)** ⭐ RECOMENDADO

- Proyecto Firebase en cuenta del cliente
- Cero responsabilidad legal para ti
- Cliente paga directo a Google
- **Precio:** $900 + $60/mes

---

## 🚀 INICIO RÁPIDO

### 1. Instalación de Dependencias

```bash
cd installer
npm install
```

### 2. Ver Guía Rápida

```bash
npm run guia
```

### 3. Instalar Cliente (Autonomo Recomendado)

```bash
npm run install-autonomo
```

El script te guiará paso a paso.

---

## 💰 CONFIGURACIÓN DE PAGOS

### Mercado Pago (Recomendado)

1. Ir a: https://www.mercadopago.com.ar/tools/create
2. Crear 3 links (uno por plan):

```
Plan Básico: $40 USD/mes
Plan PRO: $70 USD/mes
Plan Enterprise: $150 USD/mes
```

**Template de Email cuando cliente quiere pagar:**

```
Asunto: 💳 Activar Suscripción - Control de Stock

Hola [Cliente],

Tu período de prueba ha finalizado.

Para continuar:
→ Pagar aquí: https://mpago.la/[tu-link]

Una vez pagado:
• Envíame el comprobante
• En 15 min apruebo tu cuenta
• Tu app se reactivará automáticamente

Saludos,
[Tu nombre]
```

---

## 🛠️ PANEL DE ADMINISTRACIÓN

### Acceso:

```bash
cd installer
npm run admin
```

### Funciones:

**1. Ver Lista de Clientes**

- Muestra todos con estado de suscripción

**2. Aprobar Pago**

- Cuando recibes un pago
- Selecciona cliente y plan
- App se desbloquea automáticamente

**3. Suspender Cliente**

- Si no paga
- App se bloquea automáticamente

**4. Ver Historial de Pagos**

- Todos los pagos recibidos
- Próximos vencimientos
- Ingreso mensual total

---

## 📚 DOCUMENTACIÓN COMPLETA

### Archivos de Referencia:

```
installer/
├── SISTEMA_SUSCRIPCIONES.md    # Guía completa del sistema
├── INSTALACION_AUTONOMA.md      # Método autónomo detallado
├── MODELO_DE_NEGOCIO.md         # Estrategias de monetización
└── README.md                    # Este archivo
```

---

## 💡 PREGUNTAS FRECUENTES

### ¿Cómo sé qué clientes pagaron?

```bash
npm run admin → Ver historial de pagos
```

### ¿Cómo apruebo un pago?

```bash
npm run admin → Aprobar pago → Seleccionar cliente
```

### ¿Cómo bloqueo si no pagan?

```bash
npm run admin → Suspender cliente
```

### ¿Demo también se bloquea?

**NO.** La versión demo (`control-stock-demo`) NO tiene restricciones.

---

## 🌐 DÓNDE OFRECER LA APP

1. **Landing Page** (Vercel gratis)
2. **LinkedIn** (B2B)
3. **Instagram** (Reels + Stories)
4. **Facebook Groups**
5. **Gumroad** (vender licencias)
6. **Product Hunt**

Ver `SISTEMA_SUSCRIPCIONES.md` para detalles completos.

---

## 📞 SOPORTE

**Desarrollador:** David Monte  
**Email:** montedavid07@hotmail.com

---

**Última Actualización:** Diciembre 2025  
**Versión:** 2.0.0
