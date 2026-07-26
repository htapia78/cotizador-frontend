/**
 * Dashboard - Lista de proyectos
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { proyectosAPI, authAPI } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cliente, setCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuarioRes, proyectosRes] = await Promise.all([
        authAPI.getMe(),
        proyectosAPI.listar()
      ]);
      setUsuario(usuarioRes.data);
      setProyectos(proyectosRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    try {
      const nuevo = await proyectosAPI.crear(nombre, cliente, descripcion);
      setProyectos([...proyectos, nuevo.data]);
      setNombre('');
      setCliente('');
      setDescripcion('');
      setMostrarForm(false);
    } catch (err) {
      console.error('Error al crear proyecto:', err);
    }
  };

  const handleEliminar = async (proyectoId) => {
    if (window.confirm('¿Eliminar este proyecto?')) {
      try {
        await proyectosAPI.eliminar(proyectoId);
        setProyectos(proyectos.filter(p => p.id !== proyectoId));
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚡ Cotizador de Obras Eléctricas</h1>
        <div className="header-info">
          <span>{usuario?.nombre_empresa}</span>
          <button onClick={handleLogout} className="btn-logout">
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="projects-section">
          <div className="section-header">
            <h2>Mis Proyectos</h2>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="btn-primary"
            >
              {mostrarForm ? '✕ Cancelar' : '+ Nuevo Proyecto'}
            </button>
          </div>

          {mostrarForm && (
            <form onSubmit={handleCrearProyecto} className="form-nuevo-proyecto">
              <div className="form-group">
                <label>Nombre del Proyecto:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Hotel Mendoza"
                />
              </div>

              <div className="form-group">
                <label>Cliente:</label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  required
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="form-group">
                <label>Descripción (opcional):</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles del proyecto..."
                />
              </div>

              <button type="submit" className="btn-primary">
                Crear Proyecto
              </button>
            </form>
          )}

          <div className="projects-grid">
            {proyectos.length === 0 ? (
              <p className="empty-state">No hay proyectos. Crea uno para comenzar.</p>
            ) : (
              proyectos.map((proyecto) => (
                <div key={proyecto.id} className="project-card">
                  <div className="project-header">
                    <h3>{proyecto.nombre}</h3>
                    <span className={`status ${proyecto.estado}`}>
                      {proyecto.estado}
                    </span>
                  </div>

                  <div className="project-details">
                    <p><strong>Cliente:</strong> {proyecto.cliente}</p>
                    {proyecto.descripcion && (
                      <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
                    )}
                    <p className="fecha">
                      Creado: {new Date(proyecto.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="project-actions">
                    <button
                      onClick={() => navigate(`/proyecto/${proyecto.id}`)}
                      className="btn-secondary"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => handleEliminar(proyecto.id)}
                      className="btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
