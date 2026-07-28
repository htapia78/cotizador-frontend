import React, { useState, useEffect } from 'react';

export default function MaterialesSinReceta({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('mts');
  const storageKey = `materiales-sin-receta-${proyectoId}`;

  const unidades = ['mts', 'un', 'kg', 'l'];

  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        setMateriales(JSON.parse(datos));
      } catch (e) {
        console.error('Error al cargar materiales:', e);
      }
    }
  }, [storageKey]);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoMaterial.trim() || !nuevaCantidad) return;

    const nuevoMatObj = {
      id: Date.now(),
      nombre: nuevoMaterial,
      cantidad: parseFloat(nuevaCantidad),
      unidad: nuevaUnidad
    };

    const materialesActualizados = [...materiales, nuevoMatObj];
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    setNuevoMaterial('');
    setNuevaCantidad('');
    setNuevaUnidad('mts');
  };

  const handleEliminar = (id) => {
    const material = materiales.find(m => m.id === id);
    if (window.confirm(`¿Eliminar "${material.nombre}"? Esta acción no se puede deshacer.`)) {
      const materialesActualizados = materiales.filter(m => m.id !== id);
      setMateriales(materialesActualizados);
      localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    }
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📦 Materiales sin Receta</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Cables, bandejas, cañería y otros materiales que no tienen receta predefinida</p>

      {/* FORMULARIO */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Material</h4>
        <form onSubmit={handleAgregar}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={nuevoMaterial}
              onChange={(e) => setNuevoMaterial(e.target.value)}
              placeholder="Ej: Cable 2x1.5mm Subterráneo"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxSizing: 'border-box',
                fontSize: '13px'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '8px' }}>
            <input
              type="number"
              step="0.1"
              value={nuevaCantidad}
              onChange={(e) => setNuevaCantidad(e.target.value)}
              placeholder="Cantidad"
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
            <select
              value={nuevaUnidad}
              onChange={(e) => setNuevaUnidad(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            >
              {unidades.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                background: '#2563a8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px'
              }}
            >
              + Agregar
            </button>
          </div>
        </form>
      </div>

      {/* LISTA */}
      <h4 style={{ color: '#1c2d4f' }}>Materiales ({materiales.length})</h4>
      {materiales.length === 0 ? (
        <p style={{ color: '#999' }}>Sin materiales agregados</p>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {materiales.map(mat => (
            <div key={mat.id} style={{
              background: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#1c2d4f', fontSize: '13px' }}>{mat.nombre}</strong>
                <span style={{ color: '#999', marginLeft: '10px', fontSize: '12px' }}>{mat.cantidad} {mat.unidad}</span>
              </div>
              <button
                onClick={() => handleEliminar(mat.id)}
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
