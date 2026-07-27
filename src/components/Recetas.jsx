import React, { useState, useEffect } from 'react';

export default function Recetas({ proyectoId }) {
  const [tipos, setTipos] = useState([
    { id: 1, nombre: 'Toma Monofásica' },
    { id: 2, nombre: 'Aplique' },
    { id: 3, nombre: 'Punto Luz' }
  ]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [recetas, setRecetas] = useState({});
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const storageKey = `recetas-${proyectoId}`;
  const tiposStorageKey = `tipos-${proyectoId}`;

  useEffect(() => {
    // Cargar tipos guardados
    const tiposGuardados = localStorage.getItem(tiposStorageKey);
    if (tiposGuardados) {
      setTipos(JSON.parse(tiposGuardados));
      setTipoSeleccionado(JSON.parse(tiposGuardados)[0].id);
    } else {
      setTipoSeleccionado(1);
    }

    // Cargar recetas
    const recetasGuardadas = localStorage.getItem(storageKey);
    if (recetasGuardadas) {
      setRecetas(JSON.parse(recetasGuardadas));
    }
  }, [proyectoId, storageKey, tiposStorageKey]);

  const handleAgregarTipo = (e) => {
    e.preventDefault();
    if (nuevoTipo.trim()) {
      const nuevoTypeObj = { id: Date.now(), nombre: nuevoTipo };
      const tiposActualizados = [...tipos, nuevoTypeObj];
      setTipos(tiposActualizados);
      localStorage.setItem(tiposStorageKey, JSON.stringify(tiposActualizados));
      setTipoSeleccionado(nuevoTypeObj.id);
      setNuevoTipo('');
    }
  };

  const handleAgregarMaterial = (e) => {
    e.preventDefault();
    if (nuevoMaterial.trim() && nuevaCantidad) {
      const tipoId = tipoSeleccionado;
      const materialesDelTipo = recetas[tipoId] || [];
      const nuevoMaterialObj = {
        id: Date.now(),
        nombre: nuevoMaterial,
        cantidad: parseFloat(nuevaCantidad),
        unidad: 'm'
      };
      const recetasActualizadas = {
        ...recetas,
        [tipoId]: [...materialesDelTipo, nuevoMaterialObj]
      };
      setRecetas(recetasActualizadas);
      localStorage.setItem(storageKey, JSON.stringify(recetasActualizadas));
      setNuevoMaterial('');
      setNuevaCantidad('');
    }
  };

  const handleEliminarMaterial = (tipoId, materialId) => {
    const materialesDelTipo = recetas[tipoId] || [];
    const materialesActualizados = materialesDelTipo.filter(m => m.id !== materialId);
    const recetasActualizadas = { ...recetas, [tipoId]: materialesActualizados };
    setRecetas(recetasActualizadas);
    localStorage.setItem(storageKey, JSON.stringify(recetasActualizadas));
  };

  const materialesDelTipoSeleccionado = recetas[tipoSeleccionado] || [];

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📋 Recetas de Materiales</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Define qué materiales lleva cada tipo de boca</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* PANEL IZQUIERDO: Tipos de Boca */}
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Tipos de Boca</h4>
          <div style={{ display: 'grid', gap: '8px', marginBottom: '15px' }}>
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
                  fontWeight: tipoSeleccionado === tipo.id ? '600' : '500',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>

          <form onSubmit={handleAgregarTipo} style={{ borderTop: '1px solid #d1d5db', paddingTop: '15px' }}>
            <input
              type="text"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
              placeholder="Nuevo tipo"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '8px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '8px',
                background: '#2563a8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px'
              }}
            >
              + Tipo
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: Receta del Tipo Seleccionado */}
        <div>
          {tipoSeleccionado && (
            <>
              <h3 style={{ color: '#1c2d4f', marginTop: 0 }}>
                {tipos.find(t => t.id === tipoSeleccionado)?.nombre}
              </h3>

              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Material</h4>
                <form onSubmit={handleAgregarMaterial}>
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
                      placeholder="Cantidad"
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
                        fontWeight: '600'
                      }}
                    >
                      + Agregar
                    </button>
                  </div>
                </form>
              </div>

              <h4 style={{ color: '#1c2d4f' }}>Materiales en esta boca</h4>
              {materialesDelTipoSeleccionado.length === 0 ? (
                <p style={{ color: '#999' }}>No hay materiales. Agrega uno.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {materialesDelTipoSeleccionado.map(material => (
                    <div key={material.id} style={{
                      background: '#f9fafb',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ color: '#1c2d4f' }}>{material.nombre}</strong>
                        <span style={{ color: '#999', marginLeft: '10px' }}>{material.cantidad} {material.unidad}</span>
                      </div>
                      <button
                        onClick={() => handleEliminarMaterial(tipoSeleccionado, material.id)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
