import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Materiales from './pages/Materiales/Materiales';
import Movimientos from './pages/Movimientos/Movimientos';
import Historial from './pages/Historial/Historial';
import Usuarios from './pages/Usuarios/Usuarios';

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" /> : <Login />}
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/materiales"
        element={
          <ProtectedRoute>
            <Materiales />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/movimientos"
        element={
          <ProtectedRoute>
            <Movimientos />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <Historial />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute adminOnly>
            <Usuarios />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
