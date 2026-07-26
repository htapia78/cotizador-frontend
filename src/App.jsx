/**
 * App.jsx - Router y estructura principal
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './api';

// Componentes
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProyectoDetalle from './components/ProyectoDetalle';

import './App.css';

function PrivateRoute({ children }) {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const verificar = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAutenticado(false);
        return;
      }

      try {
        await authAPI.getMe();
        setAutenticado(true);
      } catch (err) {
        localStorage.removeItem('access_token');
        setAutenticado(false);
      }
    };

    verificar();
  }, []);

  if (autenticado === null) return <div className="loading">Verificando...</div>;
  if (!autenticado) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/proyecto/:proyectoId"
          element={
            <PrivateRoute>
              <ProyectoDetalle />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
