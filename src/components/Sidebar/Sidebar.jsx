import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userData, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    {
      path: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["admin", "user", "guest"],
    },
    {
      path: "/materiales",
      icon: Package,
      label: "Materiales",
      roles: ["admin", "user", "guest"],
    },
    {
      path: "/movimientos",
      icon: ArrowLeftRight,
      label: "Movimientos",
      roles: ["admin", "user"],
    },
    {
      path: "/historial",
      icon: History,
      label: "Historial",
      roles: ["admin", "user", "guest"],
    },
    {
      path: "/usuarios",
      icon: Users,
      label: "Usuarios",
      roles: ["admin"],
    },
    {
      path: "/configuracion",
      icon: Settings,
      label: "Configuración",
      roles: ["admin", "user", "guest"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userData?.role)
  );

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Package size={32} />
            <div>
              <h2>Control Stock</h2>
              <p>Sistema Profesional</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {userData?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{userData?.name || "Usuario"}</p>
            <p className="sidebar-user-role">
              {userData?.role === "admin"
                ? "Administrador"
                : userData?.role === "user"
                ? "Usuario"
                : "Invitado"}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
