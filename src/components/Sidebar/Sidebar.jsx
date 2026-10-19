import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  Users,
  Settings,
  LogOut,
  X,
  Boxes,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../constants";
import "./Sidebar.css";
import { APP_NAME, APP_TAGLINE, BRAND } from "../../config/branding";

const ALL = [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.USER, ROLES.GUEST];

const MENU = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", roles: ALL, end: true },
  { path: "/materiales", icon: Package, label: "Inventario", roles: ALL },
  {
    path: "/movimientos",
    icon: ArrowLeftRight,
    label: "Movimientos",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.USER],
  },
  { path: "/historial", icon: History, label: "Historial", roles: ALL },
  { path: "/indicadores", icon: BarChart3, label: "Indicadores", roles: ALL },
  { path: "/usuarios", icon: Users, label: "Usuarios", roles: [ROLES.ADMIN] },
  { path: "/configuracion", icon: Settings, label: "Configuración", roles: ALL },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, userData } = useAuth();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const items = MENU.filter((item) => item.roles.includes(userData?.role));

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`} aria-label="Navegación principal">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {BRAND.logo ? (
              <img className="sidebar-logo-img" src={BRAND.logo} alt="" />
            ) : (
              <span className="sidebar-logo-mark">
                <Boxes size={20} />
              </span>
            )}
            <div>
              <p className="sidebar-logo-title">{APP_NAME}</p>
              <p className="sidebar-logo-sub">{APP_TAGLINE}</p>
            </div>
          </div>
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section">Menú</p>
          {items.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-nav-item sidebar-logout-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
