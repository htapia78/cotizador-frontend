/**
 * Recetas - Definir qué materiales contiene cada tipo de boca
 */

import React, { useEffect, useState } from 'react';
import { tiposBocaAPI, materialesAPI, recetasAPI } from '../api';
import './Recetas.css';

export default function Recetas({ proyectoId }) {
  const [tiposBoca, setTiposBoca] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [recetasAgrupadas, setRecetasAgrupadas] = useState({});
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre: '',
    unidad: '',
    categoria: ''
  });
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState('ver'); // ver | crearTipo | crearMaterial

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = async () => {
    try {
      const [tiposRes, materialesRes] = await Promise.all([
        tiposBocaAPI.listar(proyectoId),
        materialesAPI.listar(proyectoId)
      ]);

      setTiposBoca(tiposRes.data);
      setMateriales(materialesRes.data);

      // Cargar recetas para cada tipo
      const recetasMap = {};
      for (const tipo of tiposRes.data) {
        try {
          const recetasRes = await recetasAPI.listar(tipo.id);
          recetasMap[tipo.id] = recetasRes.data;
        } catch {
          recetasMap[tipo.id] = [];
        }
      }
      setRecetasAgrupadas(recetasMap);

      if (tiposRes.data.length > 0) {
        setTipoSeleccionado(tiposRes.data[0].id);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearTipo = async (e) => {
    e.preventDefault();
    try {
      const res = await tiposBocaAPI.crear(proyectoId, nuevoTipo, '');
      setTiposBoca([...tiposBoca, res.data]);
      setRecetasAgrupadas({ ...recetasAgrupadas, [res.data.id]: [] });
      setTipoSeleccionado(res.data.id);
      setNuevoTipo('');
      setModo('ver');
    } catch (err) {
      console.error('Error al crear tipo:', err);
    }
  };

  const handleCrearMaterial = async (e) => {
    e.preventDefault();
    try {
      const res = await materialesAPI.crear(
        nuevoMaterial.nombre,
        nuevoMaterial.unidad,
        nuevoMaterial.categoria,
        0,
        null
      );
      setMateriales([...materiales, res.data]);
      setNuevoMaterial({ nombre: '', unidad: '', categoria: '' });
      setModo('ver');
    } catch (err) {
      console.error('Error al crear material:', err);
    }
  };

  const handleAgregarMaterial = async (e) => {
    e.preventDefault();
    if (!tipoSeleccionado || !materialSeleccionado || !cantidad) return;

    try {
      const res = await recetasAPI.crear(
        tipoSeleccionado,
        materialSeleccionado,
        parseFloat(cantidad)
      );
      setRecetasAgrupadas({
        ...recetasAgrupadas,
        [tipoSeleccionado]: [...(recetasAgrupadas[tipoSeleccionado] || []), res.data]
      });
      setCantidad('');
      setMaterialSeleccionado(null);
    } catch (err) {
      console.error('Error al agregar material:', err);
    }
  };

  const handleEliminarReceta = async (recetaId) => {
    try {
      await recetasAPI.eliminar(recetaId);
      setRecetasAgrupadas({
        ...recetasAgrupadas,
        [tipoSeleccionado]: recetasAgrupadas[tipoSeleccionado].filter(
          r => r.id !== recetaId
        )
      });
    } catch (err) {
      console.error('Error al eliminar receta:', err);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const recetasActuales = tipoSeleccionado ? (recetasAgrupadas[tipoSeleccionado] || []) : [];
  const tipoActual = tiposBoca.find(t => t.id === tipoSeleccionado);

  return (
    <div className="recetas-container">
      <h2>Recetas de Materiales</h2>

      <div className="recetas-layout">
        {/* PANEL IZQUIERDO: Tipos de Boca */}
        <div className="recetas-panel tipos-panel">
          <h3>Tipos de Boca</h3>
          <div className="tipos-list">
            {tiposBoca.map((tipo) => (
              <button
                key={tipo.id}
                className={`tipo-item ${tipoSeleccionado === tipo.id ? 'active' : ''}`}
                onClick={() => setTipoSeleccionado(tipo.id)}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModo('crearTipo')}
            className="btn-primary btn-block"
          >
            + Agregar Tipo
          </button>
        </div>

        {/* PANEL DERECHO: Receta del Tipo Seleccionado */}
        <div className="recetas-panel receta-panel">
          {modo === 'crearTipo' ? (
            <form onSubmit={handleCrearTipo}>
              <h3>Nuevo Tipo de Boca</h3>
              <input
                type="text"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                placeholder="Nombre del tipo"
                required
              />
              <button type="submit" className="btn-primary">
                Crear
              </button>
              <button
                type="button"
                onClick={() => setModo('ver')}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </form>
          ) : tipoActual ? (
            <>
              <h3>{tipoActual.nombre}</h3>

              <div className="receta-form">
                <h4>Agregar Material a esta Boca</h4>
                <form onSubmit={handleAgregarMaterial}>
                  <div className="form-group">
                    <label>Material:</label>
                    <select
                      value={materialSeleccionado || ''}
                      onChange={(e) => setMaterialSeleccionado(parseInt(e.target.value))}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {materiales.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.nombre} ({mat.unidad})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="Ej: 3"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Agregar
                  </button>
                </form>

                <button
                  onClick={() => setModo('crearMaterial')}
                  className="btn-secondary"
                >
                  + Material Nuevo
                </button>
              </div>

              <div className="receta-items">
                <h4>Contenido</h4>
                {recetasActuales.length === 0 ? (
                  <p className="empty">No hay materiales en esta boca.</p>
                ) : (
                  recetasActuales.map((receta) => (
                    <div key={receta.id} className="receta-item">
                      <div>
                        <strong>{receta.material_nombre}</strong>
                        <span className="qty">
                          {receta.cantidad} {receta.material_unidad}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEliminarReceta(receta.id)}
                        className="btn-small btn-danger"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p className="empty">Selecciona un tipo de boca o crea uno nuevo.</p>
          )}
        </div>
      </div>

      {/* MODAL CREAR MATERIAL */}
      {modo === 'crearMaterial' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nuevo Material</h3>
            <form onSubmit={handleCrearMaterial}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nuevoMaterial.nombre}
                  onChange={(e) =>
                    setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Unidad:</label>
                <input
                  type="text"
                  value={nuevoMaterial.unidad}
                  onChange={(e) =>
                    setNuevoMaterial({ ...nuevoMaterial, unidad: e.target.value })
                  }
                  placeholder="mts, un, cajas"
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría:</label>
                <select
                  value={nuevoMaterial.categoria}
                  onChange={(e) =>
                    setNuevoMaterial({ ...nuevoMaterial, categoria: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Canalización">Canalización</option>
                  <option value="Cables">Cables</option>
                  <option value="Ilum.+Tomas">Ilum.+Tomas</option>
                  <option value="Tableros">Tableros</option>
                  <option value="PAT">PAT</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setModo('ver')}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
