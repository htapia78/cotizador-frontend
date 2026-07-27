import React, { useState, useEffect } from 'react';

// Datos precargados del Excel
const RECETAS_INICIALES = {
  1: [
    { id: Date.now() + 1, nombre: 'Caja Octogonal Grande', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 2, nombre: 'Caño PVC 20mm', cantidad: 9, unidad: 'mts' },
    { id: Date.now() + 3, nombre: 'Conector 20mm', cantidad: 5, unidad: 'un' },
    { id: Date.now() + 4, nombre: 'Cupla Unión 20mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 5, nombre: 'Curva 20mm', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 6, nombre: 'Cable Unipolar 1.5mm Rojo', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 7, nombre: 'Cable Unipolar 1.5mm Marrón', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 8, nombre: 'Cable Unipolar 1.5mm Negro', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 9, nombre: 'Cable Unipolar 1.5mm Celeste', cantidad: 3, unidad: 'mts' },
    { id: Date.now() + 10, nombre: 'Cable Unipolar 2.5mm Rojo', cantidad: 2, unidad: 'mts' },
    { id: Date.now() + 11, nombre: 'Cable Unipolar 2.5mm Marrón', cantidad: 2, unidad: 'mts' },
    { id: Date.now() + 12, nombre: 'Cable Unipolar 2.5mm Negro', cantidad: 2, unidad: 'mts' },
    { id: Date.now() + 13, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 14, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 15, nombre: 'Punto (llave simple)', cantidad: 1, unidad: 'un' },
  ],
  2: [
    { id: Date.now() + 16, nombre: 'Caja Octogonal Chica', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 17, nombre: 'Caño PVC 20mm', cantidad: 7, unidad: 'mts' },
    { id: Date.now() + 18, nombre: 'Conector 20mm', cantidad: 4, unidad: 'un' },
    { id: Date.now() + 19, nombre: 'Cupla Unión 20mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 20, nombre: 'Curva 20mm', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 21, nombre: 'Cable Unipolar 1.5mm Rojo', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 22, nombre: 'Cable Unipolar 1.5mm Marrón', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 23, nombre: 'Cable Unipolar 1.5mm Negro', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 24, nombre: 'Cable Unipolar 2.5mm Rojo', cantidad: 4, unidad: 'mts' },
    { id: Date.now() + 25, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 26, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 27, nombre: 'Punto (llave simple)', cantidad: 1, unidad: 'un' },
  ],
  3: [
    { id: Date.now() + 28, nombre: 'Caja Octogonal Grande', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 29, nombre: 'Cable Unipolar 1.5mm Negro', cantidad: 6, unidad: 'mts' },
    { id: Date.now() + 30, nombre: 'Cable Unipolar 1.5mm Celeste', cantidad: 6, unidad: 'mts' },
  ],
  4: [
    { id: Date.now() + 31, nombre: 'Caja Rectangular', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 32, nombre: 'Caño PVC 20mm', cantidad: 6, unidad: 'mts' },
    { id: Date.now() + 33, nombre: 'Conector 20mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 34, nombre: 'Cupla Unión 20mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 35, nombre: 'Curva 20mm', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 36, nombre: 'Cable Unipolar 1.5mm Rojo', cantidad: 1, unidad: 'mts' },
    { id: Date.now() + 37, nombre: 'Cable Unipolar 2.5mm Rojo', cantidad: 2, unidad: 'mts' },
    { id: Date.now() + 38, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 39, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 40, nombre: 'Toma Simple', cantidad: 1, unidad: 'un' },
  ],
  5: [
    { id: Date.now() + 41, nombre: 'Caja Rectangular', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 42, nombre: 'Caño PVC 20mm', cantidad: 6, unidad: 'mts' },
    { id: Date.now() + 43, nombre: 'Conector 20mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 44, nombre: 'Cable Unipolar 2.5mm Rojo', cantidad: 6, unidad: 'mts' },
    { id: Date.now() + 45, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 46, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 47, nombre: 'Toma Simple 10A (AA)', cantidad: 1, unidad: 'un' },
  ],
  6: [
    { id: Date.now() + 48, nombre: 'Caja Rectangular', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 49, nombre: 'Caño PVC 25mm', cantidad: 9, unidad: 'mts' },
    { id: Date.now() + 50, nombre: 'Conector 25mm', cantidad: 2, unidad: 'un' },
    { id: Date.now() + 51, nombre: 'Cupla Unión 25mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 52, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 53, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 54, nombre: 'Módulo TV', cantidad: 1, unidad: 'un' },
  ],
  7: [
    { id: Date.now() + 55, nombre: 'Caja Rectangular', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 56, nombre: 'Caño PVC 25mm', cantidad: 9, unidad: 'mts' },
    { id: Date.now() + 57, nombre: 'Conector 25mm', cantidad: 2, unidad: 'un' },
    { id: Date.now() + 58, nombre: 'Cupla Unión 25mm', cantidad: 3, unidad: 'un' },
    { id: Date.now() + 59, nombre: 'Bastidor', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 60, nombre: 'Marco', cantidad: 1, unidad: 'un' },
    { id: Date.now() + 61, nombre: 'Módulo Teléfono', cantidad: 1, unidad: 'un' },
  ],
  8: [
    { id: Date.now() + 62, nombre: 'Caja Rectangular', cantidad: 2, unidad: 'un' },
    { id: Date.now() + 63, nombre: 'Caja Cuadrada 200x200', cantidad: 2, unidad: 'un' },
    { id: Date.now() + 64, nombre: 'Caño PVC 32mm', cantidad: 9, unidad: 'mts' },
    { id: Date.now() + 65, nombre: 'Conector 32mm', cantidad: 2, unidad: 'un' },
    { id: Date.now() + 66, nombre: 'Cupla Unión 32mm', cantidad: 3, unidad: 'un' },
  ],
};

const TIPOS_BOCA = [
  { id: 1, nombre: 'Boca de Luz' },
  { id: 2, nombre: 'Boca Aplique' },
  { id: 3, nombre: 'Boca Emergencia' },
  { id: 4, nombre: 'Tomacorriente 10A' },
  { id: 5, nombre: 'Tomacorriente AA' },
  { id: 6, nombre: 'Boca TV' },
  { id: 7, nombre: 'Boca Teléfono' },
  { id: 8, nombre: 'Acometida TV' },
];

export default function Recetas({ proyectoId }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(1);
  const [materiales, setMateriales] = useState({});
  const [nuevoMaterial, setNuevoMaterial] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const storageKey = `recetas-${proyectoId}`;

  // Cargar recetas al montar
  // Cargar recetas al montar
  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        const parsed = JSON.parse(datos);
        setMateriales(parsed);
      } catch (e) {
        console.error('Error al cargar recetas:', e);
        localStorage.setItem(storageKey, JSON.stringify(RECETAS_INICIALES));
        setMateriales(RECETAS_INICIALES);
      }
    } else {
      // Primera vez: cargar predefinidas
      localStorage.setItem(storageKey, JSON.stringify(RECETAS_INICIALES));
      setMateriales(RECETAS_INICIALES);
    }
  }, [storageKey]);

  // Acceso a materiales asegurando conversión de tipo
  const getMateriales = (tipoId) => {
    return materiales[tipoId] || materiales[`${tipoId}`] || [];
  };

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
    const zona = TIPOS_BOCA.find(t => t.id === tipoId);
    const material = (materiales[tipoId] || []).find(m => m.id === materialId);
    if (window.confirm(`¿Eliminar "${material.nombre}" de ${zona.nombre}? Esta acción no se puede deshacer.`)) {
      const materialesDelTipo = getMateriales(tipoId);).filter(m => m.id !== materialId);
      const materialesActualizados = { ...materiales, [tipoId]: materialesDelTipo };
      setMateriales(materialesActualizados);
      localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    }
  };

  const materialesDelTipo = getMateriales(tipoSeleccionado);
  const tipoActual = TIPOS_BOCA.find(t => t.id === tipoSeleccionado);

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📋 Recetas de Materiales</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Todas las recetas están precargadas del Excel. Modifica o agrega según necesites.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* TIPOS */}
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', height: 'fit-content', maxHeight: '600px', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Tipos de Boca</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {TIPOS_BOCA.map(tipo => (
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
                  textAlign: 'left',
                  fontSize: '13px'
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
                    boxSizing: 'border-box',
                    fontSize: '13px'
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
                    borderRadius: '6px',
                    fontSize: '13px'
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
                    fontSize: '12px'
                  }}
                >
                  + Agregar
                </button>
              </div>
            </form>
          </div>

          {/* LISTA */}
          <h4 style={{ color: '#1c2d4f' }}>Materiales ({materialesDelTipo.length})</h4>
          {materialesDelTipo.length === 0 ? (
            <p style={{ color: '#999' }}>Sin materiales</p>
          ) : (
            <div style={{ display: 'grid', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
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
                    <strong style={{ color: '#1c2d4f', fontSize: '13px' }}>{mat.nombre}</strong>
                    <span style={{ color: '#999', marginLeft: '10px', fontSize: '12px' }}>{mat.cantidad} {mat.unidad || 'un'}</span>
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
      </div>
    </div>
  );
}
