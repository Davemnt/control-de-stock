/* 🔐 COMPONENTE LOGIN - VERSIÓN PRODUCCIÓN
   ========================================
   Autenticación con Firebase, validación, mostrar/ocultar contraseña
   y recuperación de contraseña por email.
*/

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Boxes,
  ArrowLeft,
  PackageCheck,
  ScanLine,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth, getAuthErrorMessage } from "../../contexts/AuthContext";
import { isValidEmail } from "../../utils/validation";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./Login.css";
import { APP_NAME, BRAND, COMPANY_NAME } from "../../config/branding";

const FEATURES = [
  { icon: PackageCheck, text: "Inventario en tiempo real por categoría y ubicación" },
  { icon: ScanLine, text: "Escaneo de códigos de barras desde el móvil" },
  { icon: FileSpreadsheet, text: "Historial completo y exportación a PDF y Excel" },
];

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email.trim())) {
      setError("Introduce un email válido");
      return;
    }
    if (!password) {
      setError("Introduce tu contraseña");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email.trim())) {
      setError("Introduce un email válido");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Si el email existe, recibirás un enlace para restablecer la contraseña");
      setMode("login");
    } catch (err) {
      setError(getAuthErrorMessage(err, "No se pudo enviar el email"));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="login">
      <aside
        className={`login-hero ${BRAND.loginBackground ? "has-image" : ""}`}
        style={BRAND.loginBackground ? { backgroundImage: `url(${BRAND.loginBackground})` } : undefined}
      >
        <div className="login-hero-inner">
          <div className="login-brand">
            {BRAND.logo ? (
              <img className="login-brand-logo" src={BRAND.logo} alt="" />
            ) : (
              <span className="login-brand-mark">
                <Boxes size={22} />
              </span>
            )}
            <span>{APP_NAME}</span>
          </div>

          <div className="login-hero-panel">
            <div className="login-hero-copy">
              <h2>Todo tu equipamiento técnico, bajo control.</h2>
              <p>Gestiona audio, iluminación, video y estructuras de cada evento desde un solo lugar.</p>
            </div>

            <ul className="login-features">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="login-feature-icon">
                    <Icon size={16} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="login-panel">
        {BRAND.loginBackground && (
          <div
            className="login-mobile-banner"
            style={{ backgroundImage: `url(${BRAND.loginBackground})` }}
            aria-hidden="true"
          />
        )}
        <div className="login-card">
          {BRAND.logo ? (
            <img className="login-header-logo" src={BRAND.logo} alt={BRAND.name || APP_NAME} />
          ) : (
            <div className="login-mobile-brand">
              <span className="login-brand-mark">
                <Boxes size={22} />
              </span>
            </div>
          )}

          {mode === "login" ? (
            <>
              <div className="login-header">
                <h1>Iniciar sesión</h1>
                <p>Accede con las credenciales que te dio tu administrador.</p>
              </div>

              <form onSubmit={handleLogin} className="login-form" noValidate>
                {error && (
                  <div className="login-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  icon={Mail}
                  autoComplete="email"
                  autoFocus
                  required
                />

                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  autoComplete="current-password"
                  required
                  suffix={
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <div className="login-row">
                  <button type="button" className="login-link" onClick={() => switchMode("reset")}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Iniciar sesión
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="login-header">
                <h1>Recuperar contraseña</h1>
                <p>Te enviaremos un enlace para crear una contraseña nueva.</p>
              </div>

              <form onSubmit={handleReset} className="login-form" noValidate>
                {error && (
                  <div className="login-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  icon={Mail}
                  autoComplete="email"
                  autoFocus
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Enviar enlace
                </Button>

                <Button
                  variant="ghost"
                  icon={ArrowLeft}
                  fullWidth
                  onClick={() => switchMode("login")}
                  disabled={loading}
                >
                  Volver a iniciar sesión
                </Button>
              </form>
            </>
          )}

          <p className="login-copyright">
            © {new Date().getFullYear()} {COMPANY_NAME || APP_NAME}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
