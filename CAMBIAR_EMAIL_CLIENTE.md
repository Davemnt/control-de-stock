# 📧 Guía para Cambiar Email del Cliente

## ⚠️ **IMPORTANTE: Haz esto SOLO cuando el cliente esté listo para usar su propio email**

Esta guía te permitirá cambiar el email de administrador del sistema para que tu cliente pueda acceder con sus propias credenciales.

## 📋 **Pasos Específicos**

### **1. Preparar las nuevas credenciales del cliente**

```
Nuevo email: [EMAIL_DEL_CLIENTE]
Nueva contraseña: [CONTRASEÑA_DEL_CLIENTE]
```

> Ejemplo: cliente@empresaX.com / MiPassword123!

### **2. Ejecutar el script de cambio de administrador**

Crea el archivo `scripts/cambiarEmailAdmin.mjs` y ejecútalo:

```bash
node scripts/cambiarEmailAdmin.mjs
```

### **3. Verificar el cambio**

Después de ejecutar el script:

1. Ve a https://control-de-stock-e4f5f.web.app
2. Intenta hacer login con las **NUEVAS** credenciales del cliente
3. Verifica que tenga acceso de administrador completo

### **4. Entregar credenciales al cliente**

Proporciona al cliente:

- **URL del sistema**: https://control-de-stock-e4f5f.web.app
- **Email**: [EMAIL_DEL_CLIENTE]
- **Contraseña**: [CONTRASEÑA_DEL_CLIENTE]
- **Rol**: Administrador (acceso completo)

## 🔒 **Credenciales Demo (siempre disponibles)**

Para demostraciones, el cliente siempre puede usar:

- **Email**: demo@demo.com
- **Contraseña**: demo123
- **Rol**: Invitado (solo lectura)

## ⚙️ **Script Automático**

El sistema incluye un script que:

- ✅ Crea la nueva cuenta de administrador
- ✅ Desactiva la cuenta anterior (montedavid07@hotmail.com)
- ✅ Transfiere todos los permisos
- ✅ Mantiene intactos todos los materiales y datos
- ✅ Preserva la cuenta demo

## 🆘 **En caso de problemas**

Si algo sale mal:

1. **Reactiva tu cuenta**: Ejecuta `node scripts/reactivarCuentaOriginal.mjs`
2. **Contacta soporte**: Tendrás acceso nuevamente con montedavid07@hotmail.com

---

## 📞 **¿Listo para hacer el cambio?**

**Antes de continuar, confirma:**

- [ ] Tienes el email definitivo del cliente
- [ ] Tienes la contraseña definitiva del cliente
- [ ] El cliente está listo para recibir las credenciales
- [ ] Tienes acceso al proyecto para ejecutar scripts

**Si todo está listo, avísame y ejecuto el cambio inmediatamente.**
