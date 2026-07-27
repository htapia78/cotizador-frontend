import React, { useState, useEffect } from 'react';

export default function Recetas({ proyectoId }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(1);
  const [materiales, setMateriales] = useState({});
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const storageKey = `recetas-${proyectoId}`;

  // Tipos de boca predefinidos
  const tipos = [
    { id: 1, nombre: 'Toma Monofásica' },
    { id: 2, nombre: 'Aplique' },
    { id: 3, nombre: 'Punto Luz' }
  ];

  // Cargar materiales al montar
  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        setMateriales(JSON.parse(datos));
      } catch (e) {
        console.error('Error al cargar recetas:', e);
      }
    }
  }, [storageKey]);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoMaterial.trim() || !nuevaCantidad) return;

    const tipoId = tipoSeleccionado;
    const materialesDelTipo = materiales[tipoId] || [];
    
    const nuevoMatObj = {
      id: Date.now(),
      nombre: nuevoMaterial,
      cantidad: parseFloat(nuevaCantidad)
    };

    const materialesActualizados = {
      ...materiales,
      [tipoId]: [...materialesDelTipo, nuevoMatObj]
    };

    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    setNuevoMaterial('');
    setNuevaCantidad('');
  };

  const handleEliminar = (tipoId, materialId) => {
    const materialesDelTipo = (materiales[tipoId] || []).filter(m => m.id !== materialId);
    const materialesActualizados = { ...materiales, [tipoId]: materialesDelTipo };
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
  };

  const materialesDelTipo = materiales[tipoSeleccionado] || [];
  const tipoActual = tipos.find(t => t.id === tipoSeleccionado);

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📋 Recetas de Materiales</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Define qué materiales lleva cada tipo de boca</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* TIPOS */}
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Tipos de Boca</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {tipos.map(tipo => (
              <button
                key={tipo.id}
                onClick={() => setTipoSeleccionado(tipo.id)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  background: tipoSeleccionado === tipo.id ? '#2563a8' : 'white',
                  color: tipoSeleccionado === tipo.id ? 'white' : '#1c2d4f',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* RECETA */}
        <div>
          <h3 style={{ color: '#1c2d4f', marginTop: 0 }}>{tipoActual?.nombre}</h3>

          {/* FORMULARIO */}
          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Material</h4>
            <form onSubmit={handleAgregar}>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  value={nuevoMaterial}
                  onChange={(e) => setNuevoMaterial(e.target.value)}
                  placeholder="Ej: Cable 2x1.5mm"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                  placeholder="Cantidad (m)"
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#2563a8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  + Agregar
                </button>
              </div>
            </form>
          </div>

          {/* LISTA */}
          <h4 style={{ color: '#1c2d4f' }}>Materiales en esta boca</h4>
          {materialesDelTipo.length === 0 ? (
            <p style={{ color: '#999' }}>No hay materiales. Agrega uno.</p>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {materialesDelTipo.map(mat => (
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
                    <strong style={{ color: '#1c2d4f' }}>{mat.nombre}</strong>
                    <span style={{ color: '#999', marginLeft: '10px' }}>{mat.cantidad} m</span>
                  </div>
                  <button
                    onClick={() => handleEliminar(tipoSeleccionado, mat.id)}
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
