/* 🔐 COMPONENTE LOGIN - VERSIÓN PRODUCCIÓN
   ========================================
   
   Sistema de autenticación profesional para Control de Stock.
   Versión optimizada para entornos de producción.
   
   📋 CARACTERÍSTICAS:
   - ✅ Autenticación segura con Firebase
   - ✅ Responsive design completo
   - ✅ Validación de formularios
   - ✅ Manejo de estados de carga
*/

// 📦 IMPORTS - Dependencias necesarias
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./Login.css";

// 🏗️ COMPONENTE PRINCIPAL LOGIN
const Login = () => {
  // 📊 Estados del componente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔌 Hooks y contextos
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🚀 Manejo del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Renderizado del componente
  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">📦</div>
          </div>
          <h1>Control de Stock</h1>
          <p>Sistema Profesional</p>
        </div>

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

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="login-footer">
          <p className="login-copyright">
            © 2025 Control de Stock. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
