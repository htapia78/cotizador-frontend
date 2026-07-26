/**
 * Zonas - Crear y gestionar zonas del proyecto
 */

import React, { useEffect, useState } from 'react';
import { zonasAPI } from '../api';
import './Zonas.css';

export default function Zonas({ proyectoId }) {
  const [zonas, setZonas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarZonas();
  }, [proyectoId]);

  const cargarZonas = async () => {
    try {
      const res = await zonasAPI.listar(proyectoId);
      setZonas(res.data);
    } catch (err) {
      console.error('Error al cargar zonas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await zonasAPI.crear(proyectoId, nombre, descripcion);
      setZonas([...zonas, res.data]);
      setNombre('');
      setDescripcion('');
    } catch (err) {
      console.error('Error al crear zona:', err);
    }
  };

  const handleEliminar = async (zonaId) => {
    if (window.confirm('¿Eliminar esta zona?')) {
      try {
        await zonasAPI.eliminar(zonaId);
        setZonas(zonas.filter(z => z.id !== zonaId));
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  if (loading) return <div className="loading">Cargando zonas...</div>;

  return (
    <div className="zonas-container">
      <h2>Zonas del Proyecto</h2>

      <form onSubmit={handleCrear} className="form-zona">
        <div className="form-group">
          <label>Nombre de la Zona:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Planta Baja, Piso 1"
          />
        </div>

        <div className="form-group">
          <label>Descripción (opcional):</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Primer piso del hotel"
          />
        </div>

        <button type="submit" className="btn-primary">
          + Agregar Zona
        </button>
      </form>

      <div className="zonas-list">
        {zonas.length === 0 ? (
          <p className="empty">No hay zonas. Crea una para comenzar.</p>
        ) : (
          zonas.map((zona) => (
            <div key={zona.id} className="zona-card">
              <div className="zona-info">
                <h3>{zona.nombre}</h3>
                {zona.descripcion && <p>{zona.descripcion}</p>}
              </div>
              <button
                onClick={() => handleEliminar(zona.id)}
                className="btn-small btn-danger"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
