import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const fillDemoCredentials = () => {
    setEmail("demo@demo.com");
    setPassword("demo123");
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">📦</div>
          </div>
          <h1>Control de Stock</h1>
          <p>Versión DEMO - Pruebas y Demostraciones</p>
        </div>

        {/* Banner informativo */}
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
            size="lg"
            fullWidth
            loading={loading}
          >
            Iniciar Sesión
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={fillDemoCredentials}
            disabled={loading}
          >
            Usar Credenciales Demo
          </Button>
        </form>

        <div className="login-footer">
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
          <p className="login-copyright">
            © 2025 David Monte. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
