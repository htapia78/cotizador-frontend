import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProyectoDetalle from './components/ProyectoDetalle';

function PrivateRoute({ children }) {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setAutenticado(!!token);
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
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/proyecto/:id" element={<PrivateRoute><ProyectoDetalle /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
