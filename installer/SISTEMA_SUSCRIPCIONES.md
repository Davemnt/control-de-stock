# 🎯 SISTEMA DE SUSCRIPCIONES Y CONTROL DE PAGOS

## 📋 Resumen

Sistema completo de:

- ✅ Período de prueba (7 días configurable)
- ✅ Validación automática de suscripciones
- ✅ Bloqueo de app si no paga
- ✅ Panel de administración para gestionar pagos
- ✅ Notificaciones para el cliente

---

## 🔧 INSTALACIÓN EN TU PROYECTO

### 1. Proyecto Firebase Maestro

Necesitas UN proyecto Firebase MAESTRO (tuyo) donde guardar info de suscripciones de TODOS tus clientes.

**Opción:** Usa `control-de-stock-e4f5f` como proyecto maestro

```bash
# Crear colección 'subscriptions' en Firestore
# Cada cliente tendrá un documento con su projectId
```

### 2. Configurar Service Account

```bash
# Descargar desde:
# https://console.firebase.google.com/project/control-de-stock-e4f5f/settings/serviceaccounts/adminsdk

# Guardar como: installer/serviceAccountKey.json
# ⚠️ NUNCA subir a Git (ya está en .gitignore)
```

### 3. Integrar en App del Cliente

En cada instalación de cliente, agrega el `SubscriptionGuard`:

```jsx
// src/App.jsx
import SubscriptionGuard from "./components/SubscriptionGuard/SubscriptionGuard";

function App() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  return (
    <SubscriptionGuard projectId={projectId}>
      <AuthProvider>{/* Tu app normal */}</AuthProvider>
    </SubscriptionGuard>
  );
}
```

---

## 🚀 FLUJO COMPLETO

### Paso 1: Cliente Nuevo (Instalación)

```bash
cd installer
node install-client-autonomo.mjs
```

**El instalador automáticamente:**

1. Crea suscripción de prueba (7 días)
2. Guarda en tu Firebase maestro
3. Cliente puede usar app normalmente

### Paso 2: Cliente Usa App (Período de Prueba)

**Días 1-4:**

- ✅ App funciona normal
- Sin advertencias

**Días 5-7:**

- ⚠️ Banner amarillo: "Te quedan X días de prueba"
- App sigue funcionando

**Día 8+:**

- 🔒 App bloqueada
- Pantalla con info de planes
- Contacto para pagar

### Paso 3: Cliente Contacta para Pagar

**Cliente te escribe:** "Quiero pagar el plan PRO"

**Tú le envías:**

- Link de pago de Mercado Pago
- O solicitas transferencia bancaria

### Paso 4: Recibes el Pago

**Verificas el pago y ejecutas:**

```bash
cd installer
node admin-panel.mjs
```

**Menú:**

```
1. Ver lista de clientes
2. Aprobar pago ← Selecciona esto
3. Suspender cliente
4. Ver historial de pagos
```

**Seleccionas:**

- Cliente: proyecto-cliente-123
- Plan: PRO ($70/mes)
- Referencia: MP-12345
- Método: Mercado Pago

✅ **App del cliente se desbloquea INMEDIATAMENTE**

### Paso 5: Cobros Mensuales

**Cada mes:**

1. Panel admin → Ver historial de pagos
2. Ves cuándo vence cada cliente
3. Envías recordatorio 3 días antes
4. Cliente paga
5. Apruebas desde panel
6. App sigue funcionando

**Si NO paga:**

```bash
node admin-panel.mjs
→ Suspender cliente
→ App se bloquea automáticamente
```

---

## 💰 CONFIGURACIÓN DE MERCADO PAGO

### Opción A: Links de Pago (Recomendado)

```bash
# 1. Crea cuenta en Mercado Pago
# 2. Ir a: https://www.mercadopago.com.ar/tools/create

# 3. Crear links para cada plan:

Plan Básico: $40 USD/mes
https://mpago.la/tu-link-basico

Plan PRO: $70 USD/mes
https://mpago.la/tu-link-pro

Plan Enterprise: $150 USD/mes
https://mpago.la/tu-link-enterprise
```

**Template de Email:**

```
Asunto: 💳 Instrucciones de Pago - Control de Stock

Hola [Cliente],

Tu período de prueba ha finalizado. Para continuar usando el sistema:

📦 Plan seleccionado: [PRO - $70 USD/mes]

💳 PAGAR AHORA:
→ https://mpago.la/tu-link-pro

Métodos aceptados:
✅ Tarjeta de crédito/débito
✅ Mercado Pago
✅ Transferencia bancaria

Una vez realizado el pago:
1. Envíame el comprobante a este email
2. En 15 minutos apruebaré tu cuenta
3. Tu sistema se reactivará automáticamente

¿Preguntas? Responde este email.

Saludos,
[Tu nombre]
```

### Opción B: Suscripciones Automáticas (Avanzado)

Requiere integración con API de Mercado Pago:

```bash
# Instalar SDK
npm install mercadopago

# Configurar webhooks para pagos automáticos
# Ver: https://www.mercadopago.com.ar/developers/es/docs/subscriptions
```

---

## 📊 PANEL DE ADMINISTRACIÓN

### Comandos Disponibles

```bash
# Gestionar suscripciones
node admin-panel.mjs
```

### Funciones:

**1. Ver lista de clientes**

```
Project ID          Estado          Plan    Activo  Días restantes
cliente-abc         trial           TRIAL   ✅      5
cliente-xyz         active          PRO     ✅      N/A
cliente-123         trial_expired   TRIAL   ❌      0
```

**2. Aprobar pago**

- Selecciona cliente
- Selecciona plan (BASIC/PRO/ENTERPRISE)
- Ingresa referencia de pago
- ✅ Cliente desbloqueado

**3. Suspender cliente**

- Selecciona cliente activo
- Ingresa razón
- ⚠️ Cliente bloqueado

**4. Ver historial de pagos**

```
Cliente       Plan  Monto        Último Pago   Próximo Pago  Método
cliente-abc   PRO   $70 USD      01/12/2025    01/01/2026    Mercado Pago
cliente-xyz   BASIC $40 USD      15/11/2025    15/12/2025    Transferencia

💰 Ingreso mensual total: $110 USD
```

---

## 🎯 DONDE SUBIR Y OFRECER LA APP

### 1. Landing Page (Recomendado)

**Crear página simple para vender:**

```bash
# Herramientas gratuitas:
- Vercel (hosting gratis): https://vercel.com
- Next.js + Tailwind CSS
- Template: https://cruip.com (templates gratis)

# Contenido necesario:
1. Hero: "Control de Stock Profesional"
2. Demo en vivo (tu proyecto demo)
3. Características y beneficios
4. Precios (3 planes)
5. Testimonios (inventados al inicio)
6. Formulario de contacto
7. CTA: "Prueba Gratis 7 Días"
```

**Estructura:**

```
mi-landing-stock.vercel.app/
├── Hero + CTA
├── Demo interactivo
├── Características
├── Precios
├── FAQ
└── Contacto
```

### 2. Marketplaces

**Argentinos:**

- ❌ MercadoLibre (no permite apps SaaS)
- ✅ Workana (servicios)
- ✅ Freelancer.com

**Internacionales:**

- ✅ Gumroad: https://gumroad.com (vender licencias)
- ✅ Sellfy: https://sellfy.com
- ❌ Shopify (más para productos físicos)

### 3. Redes Sociales

**LinkedIn (Mejor para B2B):**

```
Postea cada semana:
- Caso de uso: "Cómo [empresa] organizó su inventario"
- Tips: "5 errores comunes en control de stock"
- Demo en video
- Testimonios de clientes
```

**Instagram:**

```
- Reels mostrando funcionalidades
- Stories con mini tutoriales
- Carrusel con beneficios
- Link en bio → Landing page
```

**Facebook Groups:**

```
Únete a grupos de:
- Emprendedores
- Empresas de eventos
- Catering
- Administración de negocios

Publica (sin spam):
- Ofrece ayuda primero
- Comparte la herramienta naturalmente
```

### 4. Email Marketing

**Herramientas gratuitas:**

- Mailchimp (2,000 contactos gratis)
- SendGrid (100 emails/día gratis)

**Estrategia:**

```
1. Ofrecer ebook gratis: "Guía de Control de Stock"
2. Recopilar emails
3. Enviar secuencia:
   - Email 1: Bienvenida + ebook
   - Email 3: Caso de éxito
   - Email 5: Oferta especial
   - Email 7: Demo gratuita
```

### 5. Directorios de Software

**Listar gratis en:**

- ✅ Product Hunt: https://producthunt.com
- ✅ Capterra: https://capterra.com
- ✅ AlternativeTo: https://alternativeto.net
- ✅ SaaSHub: https://saashub.com

### 6. Google Ads (Pago)

**Presupuesto mínimo:** $10-20/día

**Palabras clave:**

```
- "sistema control stock"
- "software inventario"
- "control stock para eventos"
- "gestión inventario empresas"
```

**CPC estimado:** $0.50 - $2.00 (Argentina)

---

## 📝 TEMPLATE DE PROPUESTA COMERCIAL

```markdown
# PROPUESTA: SISTEMA DE CONTROL DE STOCK

**Para:** [Nombre Empresa]
**Fecha:** [Fecha]

## 🎯 OBJETIVO

Implementar sistema profesional de control de inventario con:

- Gestión de materiales
- Seguimiento de movimientos
- Reportes automatizados
- Múltiples usuarios

## 💡 SOLUCIÓN

Sistema web completo alojado en infraestructura Google Cloud:

- Acceso desde cualquier dispositivo
- Datos 100% seguros y privados
- Actualizaciones automáticas
- Sin instalación de software

## 💰 INVERSIÓN

**Setup Inicial:** $900 USD (pago único)
Incluye:

- Instalación completa
- Configuración personalizada
- Capacitación (2 horas)
- Importación de datos existentes
- Soporte instalación (1 mes)

**Mantenimiento Mensual:** $70 USD
Incluye:

- Hosting y base de datos
- Actualizaciones del sistema
- Soporte técnico por email
- Backups automáticos diarios
- Seguridad y monitoreo

**OFERTA LANZAMIENTO:**
🎁 Prueba GRATIS por 7 días
🎁 50% descuento primer mes
🎁 Capacitación extendida (3 horas)

## 📅 CRONOGRAMA

- Día 1: Aprobación y pago inicial
- Día 2-3: Instalación y configuración
- Día 4: Capacitación del equipo
- Día 5: Importación de datos
- Día 6-7: Ajustes finales
- Día 8: Sistema en producción

## 🤝 PRÓXIMOS PASOS

1. Aprobar propuesta
2. Agendar reunión técnica (30 min)
3. Iniciar instalación

¿Preguntas?
📧 montedavid07@hotmail.com
📱 WhatsApp: [Tu número]
```

---

## 🎨 REDUCCIÓN DE BOTONES (HECHO)

✅ Botones de login más compactos (44px altura)
✅ Botón demo en formato horizontal
✅ Tamaño de fuente reducido
✅ Padding optimizado

---

## 📞 RESUMEN PARA TI

### Qué hacer cuando te contactan:

**1. Lead inicial:**

```bash
→ Enviar propuesta comercial
→ Agendar demo en vivo (15 min)
→ Ofrecer prueba gratuita 7 días
```

**2. Cliente acepta:**

```bash
→ Crear proyecto Firebase (cliente o tú)
→ Ejecutar instalador
→ Capacitar (2 horas)
→ Entregar credenciales
```

**3. Fin de prueba:**

```bash
→ Email automático: "Prueba finalizada"
→ Cliente decide plan
→ Envías link de Mercado Pago
→ Recibes pago
→ Apruebas desde panel
→ App desbloqueada
```

**4. Mensual:**

```bash
→ Ver panel admin
→ Revisar próximos vencimientos
→ Enviar recordatorios
→ Procesar pagos
→ Aprobar desde panel
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Crear landing page** (Vercel + Next.js)
2. **Configurar Mercado Pago** (links de pago)
3. **Probar sistema completo** (instalar + aprobar pago)
4. **Primeros posteos** en LinkedIn
5. **Buscar primer cliente** (conocidos, referidos)

---

**¿Dudas?** Revisa este documento o consulta.
