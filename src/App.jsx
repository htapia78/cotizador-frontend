import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ProyectoDetalle from './ProyectoDetalle';
import './styles.css';

const Privado = ({ children }) =>
  localStorage.getItem('apx.empresa') ? children : <Navigate to="/login" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/proyectos" element={<Privado><Dashboard /></Privado>} />
        <Route path="/proyecto/:id" element={<Privado><ProyectoDetalle /></Privado>} />
        <Route path="*" element={<Navigate to="/proyectos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
