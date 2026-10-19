import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, Settings, LogOut, WifiOff } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useMaterials } from "../../hooks/useFirestore";
import { ROLE_LABELS } from "../../constants";
import { getStockLevel } from "../../utils/stock";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import "./Layout.css";
import { APP_NAME, COMPANY_NAME } from "../../config/branding";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/materiales": "Inventario",
  "/movimientos": "Movimientos",
  "/historial": "Historial",
  "/indicadores": "Indicadores",
  "/usuarios": "Usuarios",
  "/configuracion": "Configuración",
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "U";

const UserMenu = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="user-menu-avatar">{getInitials(userData?.name)}</span>
        <span className="user-menu-text">
          <span className="user-menu-name">{userData?.name || "Usuario"}</span>
          <span className="user-menu-role">{ROLE_LABELS[userData?.role] || "Invitado"}</span>
        </span>
        <ChevronDown size={16} className="user-menu-chevron" />
      </button>

      {open && (
        <div className="user-menu-panel" role="menu">
          <div className="user-menu-header">
            <strong>{userData?.name}</strong>
            <span>{userData?.email}</span>
          </div>
          <Link to="/configuracion" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            <Settings size={16} /> Configuración
          </Link>
          <button type="button" className="user-menu-item danger" role="menuitem" onClick={handleLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { materials } = useMaterials();
  const online = useOnlineStatus();

  const alertCount = useMemo(
    () => materials.filter((m) => getStockLevel(m) !== "ok").length,
    [materials]
  );

  // Cierra el menú móvil al navegar
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Atajo "/" para enfocar el buscador
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    navigate(`/materiales?buscar=${encodeURIComponent(term)}`);
    setQuery("");
    searchRef.current?.blur();
  };

  const title = PAGE_TITLES[location.pathname] || APP_NAME;

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout-main">
        <header className="layout-topbar">
          <button
            type="button"
            className="topbar-icon-btn menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <div className="topbar-title">
            <span className="topbar-crumb">{APP_NAME}</span>
            <span className="topbar-sep">/</span>
            <span className="topbar-page">{title}</span>
          </div>

          <form className="topbar-search" onSubmit={handleSearch} role="search">
            <Search size={16} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar material o código..."
              aria-label="Buscar material"
            />
            <kbd>/</kbd>
          </form>

          <Link
            to="/materiales?stock=alert"
            className="topbar-icon-btn topbar-bell"
            aria-label={`${alertCount} alertas de stock`}
            title={alertCount ? `${alertCount} materiales con stock bajo o sin stock` : "Sin alertas de stock"}
          >
            <Bell size={18} />
            {alertCount > 0 && <span className="topbar-badge">{alertCount > 99 ? "99+" : alertCount}</span>}
          </Link>

          <UserMenu />
        </header>

        {!online && (
          <div className="offline-banner" role="status">
            <WifiOff size={16} />
            <span>
              <strong>Sin conexión.</strong> Puedes consultar los datos ya cargados; los movimientos
              de stock se podrán registrar al volver la señal.
            </span>
          </div>
        )}

        <main className="layout-content" key={location.pathname}>
          {children}
        </main>

        <footer className="layout-footer">
          © {new Date().getFullYear()} {COMPANY_NAME || APP_NAME}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
