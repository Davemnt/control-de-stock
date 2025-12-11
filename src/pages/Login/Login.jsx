/* 📚 GUÍA TRAINEE - COMPONENTE LOGIN
   ================================
   
   Este es el componente principal de autenticación del sistema.
   Maneja dos versiones: DEMO y PRODUCCIÓN con diferentes estilos y funcionalidades.
   
   📋 CARACTERÍSTICAS PRINCIPALES:
   - ✅ Autenticación con Firebase
   - ✅ Detección automática de modo (demo/producción)
   - ✅ Responsive design completo
   - ✅ Credenciales automáticas para demo
   - ✅ Validación de formularios
   - ✅ Manejo de estados de carga
*/

// 📦 IMPORTS - Dependencias necesarias
import React, { useState } from "react"; // ⚛️ Hook de estado de React
import { useNavigate } from "react-router-dom"; // 🧭 Navegación entre páginas
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react"; // 🎨 Íconos
import { useAuth } from "../../contexts/AuthContext"; // 🔐 Contexto de autenticación
import Input from "../../components/Input/Input"; // 📝 Componente input personalizado
import Button from "../../components/Button/Button"; // 🔘 Componente botón personalizado
import "./Login.css"; // 🎨 Estilos específicos del login

// 🏗️ COMPONENTE PRINCIPAL LOGIN
const Login = () => {
  /* 📊 ESTADOS DEL COMPONENTE
     Estados que controlan el comportamiento y la UI del login */

  const [email, setEmail] = useState(""); // 📧 Email del usuario
  const [password, setPassword] = useState(""); // 🔒 Contraseña del usuario
  const [loading, setLoading] = useState(false); // ⏳ Estado de carga durante login
  const [showPassword, setShowPassword] = useState(false); // 👁️ Mostrar/ocultar contraseña

  /* 🔌 HOOKS Y CONTEXTOS
     Conexiones con servicios externos y navegación */
  const { login } = useAuth(); // 🔐 Función de login desde contexto de autenticación
  const navigate = useNavigate(); // 🧭 Hook para navegar entre páginas

  /* 🎯 DETECCIÓN DE MODO DEMO
     ========================
     
     Esta lógica determina si la aplicación está en modo DEMO o PRODUCCIÓN.
     Es CRUCIAL para aplicar diferentes estilos y comportamientos.
     
     🔍 CRITERIOS DE DETECCIÓN:
     1. Project ID de Firebase === 'control-stock-demo'
     2. URL contiene 'control-stock-demo'
     3. URL es localhost (para desarrollo)
  */
  const isDemo =
    import.meta.env.VITE_FIREBASE_PROJECT_ID === "control-stock-demo" || // 🟢 Firebase Demo Project
    window.location.href.includes("control-stock-demo") || // 🌐 URL Demo
    window.location.href.includes("localhost"); // 💻 Desarrollo local

  /* 🚨 IMPORTANTE PARA TRAINEE:
     Esta variable 'isDemo' se usa en todo el componente para:
     - Aplicar clase CSS 'demo-login' 
     - Mostrar botones grandes
     - Mostrar banner informativo
     - Habilitar credenciales automáticas
  */

  /* 🚀 FUNCIÓN DE ENVÍO DEL FORMULARIO
     ===================================
     
     Maneja el proceso de autenticación cuando el usuario envía el formulario.
     Incluye validaciones, manejo de errores y redirección.
  */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🛑 Prevenir recarga de página

    /* 📝 VALIDACIÓN BÁSICA
       Verificar que ambos campos estén llenos */
    if (!email || !password) {
      // 🚨 TODO: Agregar mensaje de error al usuario
      return;
    }

    setLoading(true); // ⏳ Activar estado de carga (deshabilita botón)

    try {
      /* 🔐 PROCESO DE AUTENTICACIÓN
         Llamada asíncrona al servicio de Firebase Auth */
      await login(email, password); // 🚀 Intentar login con credenciales
      navigate("/"); // 🧭 Redirigir al dashboard si es exitoso
    } catch (error) {
      /* 🚨 MANEJO DE ERRORES
         Capturar y procesar errores de autenticación */
      console.error("Login error:", error); // 📝 Log para desarrollador

      /* 💡 MEJORA FUTURA: Mostrar mensaje de error al usuario
         Ejemplo: setErrorMessage('Credenciales incorrectas'); */
    } finally {
      /* 🏁 LIMPIAR ESTADO
         Siempre ejecutar, sin importar si fue exitoso o error */
      setLoading(false); // ⏹️ Desactivar estado de carga
    }
  };

  /* 🎮 FUNCIÓN DE CREDENCIALES AUTOMÁTICAS DEMO
     ============================================
     
     Solo disponible en modo DEMO. Llena automáticamente los campos
     con credenciales de demostración para facilitar las pruebas.
     
     📧 Credenciales Demo:
     - Email: demo@demo.com
     - Password: demo123
  */
  const fillDemoCredentials = () => {
    setEmail("demo@demo.com"); // 📧 Email de demostración
    setPassword("demo123"); // 🔒 Contraseña de demostración

    /* 💡 MEJORA FUTURA: Podrías agregar un efecto visual
       como animación de escritura automática */
  };

  /* 🎨 RENDERIZADO DEL COMPONENTE (JSX)
     =====================================
     
     Esta sección define cómo se ve y estructura la interfaz.
     Usa clases CSS condicionales según el modo (demo/producción).
  */
  return (
    /* 🏗️ CONTENEDOR PRINCIPAL
       Clase condicional: agrega 'demo-login' solo en modo demo */
    <div className={`login-container ${isDemo ? "demo-login" : ""}`}>
      {/* 🎨 FONDO DECORATIVO
          Elemento visual de fondo con gradientes */}
      <div className="login-background"></div>

      {/* 🎴 TARJETA PRINCIPAL DEL LOGIN
          Contenedor de todo el formulario y contenido */}
      <div className="login-card">
        {/* 🏷️ HEADER - Información de la aplicación */}
        <div className="login-header">
          {/* 📦 LOGO
              Ícono visual de la aplicación */}
          <div className="login-logo">
            <div className="login-logo-icon">📦</div>
          </div>

          {/* 📋 TÍTULO PRINCIPAL */}
          <h1>Control de Stock</h1>

          {/* 🏷️ SUBTÍTULO CONDICIONAL
              Cambia según el modo: DEMO o PRODUCCIÓN */}
          <p>
            {isDemo
              ? "Versión DEMO - Pruebas y Demostraciones" // 🎮 Texto para demo
              : "Sistema Profesional"}{" "}
            {/* 💼 Texto para producción */}
          </p>
        </div>

        {/* Banner informativo solo en demo */}
        {isDemo && (
          <div className="demo-info-banner">
            <AlertCircle size={20} />
            <div>
              <strong>Versión de Demostración</strong>
              <p>
                Esta versión contiene datos ficticios para pruebas. Puedes
                explorar todas las funcionalidades sin restricciones.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            icon={Mail}
            required
            autoComplete="email"
          />

          <div className="password-input-container">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isDemo ? (
            <div className="demo-buttons-container">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
              >
                Iniciar Sesión
              </Button>
              <div className="demo-buttons">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={fillDemoCredentials}
                  disabled={loading}
                >
                  Usar Credenciales Demo
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          )}
        </form>

        <div className="login-footer">
          {isDemo && (
            <div className="demo-credentials">
              <p>
                <strong>Credenciales de acceso:</strong>
              </p>
              <p>
                📧 Email: <code>demo@demo.com</code>
              </p>
              <p>
                🔑 Password: <code>demo123</code>
              </p>
            </div>
          )}
          <p className="login-copyright">
            © 2025 Control de Stock. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
