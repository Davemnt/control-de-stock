import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-main">
        <header className="layout-header">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          <div className="layout-header-content">
            <h1 className="layout-title">Control de Stock</h1>
          </div>
        </header>
        
        <main className="layout-content">
          {children}
        </main>
        
        <footer className="layout-footer">
          <p>© 2025 Control de Stock - Sistema Profesional para Eventos</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
