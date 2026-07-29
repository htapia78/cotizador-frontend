import React, { useState, useEffect } from 'react';

const RECETAS_INICIALES = {
  1: [
    { id: 1, nombre: 'CAJA OCTOGONAL GRANDE METALICA', cantidad: 1, unidad: 'un' },
    { id: 2, nombre: 'CAÑO PVC SEMI PESADO 20MM KALOP', cantidad: 9, unidad: 'mts' },
    { id: 3, nombre: 'CONECTOR PVC 20MM', cantidad: 5, unidad: 'un' },
    { id: 4, nombre: 'UNION PVC 20MM', cantidad: 3, unidad: 'un' },
    { id: 5, nombre: 'CURVA PVC 20MM', cantidad: 1, unidad: 'un' },
    { id: 6, nombre: 'ROLLO CABLE 1.5MM ROJO KALOP', cantidad: 1, unidad: 'mts' },
    { id: 7, nombre: 'ROLLO CABLE 1.5MM MARRON KALOP', cantidad: 1, unidad: 'mts' },
    { id: 8, nombre: 'ROLLO CABLE 1.5MM NEGRO KALOP', cantidad: 1, unidad: 'mts' },
    { id: 9, nombre: 'ROLLO CABLE 1.5MM CELESTE KALOP', cantidad: 3, unidad: 'mts' },
    { id: 10, nombre: 'ROLLO CABLE 2.5MM ROJO KALOP', cantidad: 2, unidad: 'mts' },
    { id: 11, nombre: 'ROLLO CABLE 2.5MM MARRON KALOP', cantidad: 2, unidad: 'mts' },
    { id: 12, nombre: 'ROLLO CABLE 2.5MM NEGRO KALOP', cantidad: 2, unidad: 'mts' },
    { id: 13, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 14, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 15, nombre: 'INTERRUPTOR UNIPOLAR BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  2: [
    { id: 16, nombre: 'CAJA OCTOGONAL CHICA METALICA', cantidad: 1, unidad: 'un' },
    { id: 17, nombre: 'CAÑO PVC SEMI PESADO 20MM KALOP', cantidad: 7, unidad: 'mts' },
    { id: 18, nombre: 'CONECTOR PVC 20MM', cantidad: 4, unidad: 'un' },
    { id: 19, nombre: 'UNION PVC 20MM', cantidad: 3, unidad: 'un' },
    { id: 20, nombre: 'CURVA PVC 20MM', cantidad: 1, unidad: 'un' },
    { id: 21, nombre: 'ROLLO CABLE 1.5MM ROJO KALOP', cantidad: 1, unidad: 'mts' },
    { id: 22, nombre: 'ROLLO CABLE 1.5MM MARRON KALOP', cantidad: 1, unidad: 'mts' },
    { id: 23, nombre: 'ROLLO CABLE 1.5MM NEGRO KALOP', cantidad: 1, unidad: 'mts' },
    { id: 24, nombre: 'ROLLO CABLE 2.5MM ROJO KALOP', cantidad: 4, unidad: 'mts' },
    { id: 25, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 26, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 27, nombre: 'INTERRUPTOR UNIPOLAR BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  3: [
    { id: 28, nombre: 'CAJA OCTOGONAL GRANDE METALICA', cantidad: 1, unidad: 'un' },
    { id: 29, nombre: 'ROLLO CABLE 1.5MM NEGRO KALOP', cantidad: 6, unidad: 'mts' },
    { id: 30, nombre: 'ROLLO CABLE 1.5MM CELESTE KALOP', cantidad: 6, unidad: 'mts' },
  ],
  4: [
    { id: 31, nombre: 'CAJA RECTANGULAR METALICA', cantidad: 1, unidad: 'un' },
    { id: 32, nombre: 'CAÑO PVC SEMI PESADO 20MM KALOP', cantidad: 6, unidad: 'mts' },
    { id: 33, nombre: 'CONECTOR PVC 20MM', cantidad: 3, unidad: 'un' },
    { id: 34, nombre: 'UNION PVC 20MM', cantidad: 3, unidad: 'un' },
    { id: 35, nombre: 'CURVA PVC 20MM', cantidad: 1, unidad: 'un' },
    { id: 36, nombre: 'ROLLO CABLE 1.5MM ROJO KALOP', cantidad: 1, unidad: 'mts' },
    { id: 37, nombre: 'ROLLO CABLE 2.5MM ROJO KALOP', cantidad: 2, unidad: 'mts' },
    { id: 38, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 39, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 40, nombre: 'INTERRUPTOR UNIPOLAR BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  5: [
    { id: 41, nombre: 'CAJA RECTANGULAR METALICA', cantidad: 1, unidad: 'un' },
    { id: 42, nombre: 'CAÑO PVC SEMI PESADO 20MM KALOP', cantidad: 6, unidad: 'mts' },
    { id: 43, nombre: 'CONECTOR PVC 20MM', cantidad: 3, unidad: 'un' },
    { id: 44, nombre: 'ROLLO CABLE 2.5MM ROJO KALOP', cantidad: 6, unidad: 'mts' },
    { id: 45, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 46, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 47, nombre: 'INTERRUPTOR UNIPOLAR BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  6: [
    { id: 48, nombre: 'CAJA RECTANGULAR METALICA', cantidad: 1, unidad: 'un' },
    { id: 49, nombre: 'CAÑO PVC SEMI PESADO 25MM KALOP KL05003', cantidad: 9, unidad: 'mts' },
    { id: 50, nombre: 'CONECTOR PVC 25MM', cantidad: 2, unidad: 'un' },
    { id: 51, nombre: 'UNION PVC 25MM', cantidad: 3, unidad: 'un' },
    { id: 52, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 53, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 54, nombre: 'TOMA TV TERMINAL BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  7: [
    { id: 55, nombre: 'CAJA RECTANGULAR METALICA', cantidad: 1, unidad: 'un' },
    { id: 56, nombre: 'CAÑO PVC SEMI PESADO 25MM KALOP KL05003', cantidad: 9, unidad: 'mts' },
    { id: 57, nombre: 'CONECTOR PVC 25MM', cantidad: 2, unidad: 'un' },
    { id: 58, nombre: 'UNION PVC 25MM', cantidad: 3, unidad: 'un' },
    { id: 59, nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', cantidad: 1, unidad: 'un' },
    { id: 60, nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', cantidad: 1, unidad: 'un' },
    { id: 61, nombre: 'TOMA TEL RJ11 BLANCO KALOP', cantidad: 1, unidad: 'un' },
  ],
  8: [
    { id: 62, nombre: 'CAJA RECTANGULAR METALICA', cantidad: 2, unidad: 'un' },
    { id: 63, nombre: 'CAJA CUADRADA 10X10 METALICA', cantidad: 2, unidad: 'un' },
    { id: 64, nombre: 'CAÑO PVC RIGIDO EXTRAPESADO 32MM GENROD', cantidad: 9, unidad: 'mts' },
    { id: 65, nombre: 'CONECTOR PVC 32MM', cantidad: 2, unidad: 'un' },
    { id: 66, nombre: 'UNION PVC 32MM', cantidad: 3, unidad: 'un' },
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
      localStorage.setItem(storageKey, JSON.stringify(RECETAS_INICIALES));
      setMateriales(RECETAS_INICIALES);
    }
  }, [storageKey]);

  const getMateriales = (tipoId) => {
    return materiales[tipoId] || materiales[`${tipoId}`] || [];
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoMaterial.trim() || !nuevaCantidad) return;

    const tipoId = tipoSeleccionado;
    const materialesDelTipo = getMateriales(tipoId);
    
    const nuevoMatObj = {
      id: Date.now(),
      nombre: nuevoMaterial,
      cantidad: parseFloat(nuevaCantidad),
      unidad: 'un'
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
    const material = getMateriales(tipoId).find(m => m.id === materialId);
    if (window.confirm(`¿Eliminar "${material.nombre}" de ${zona.nombre}? Esta acción no se puede deshacer.`)) {
      const materialesDelTipo = getMateriales(tipoId).filter(m => m.id !== materialId);
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
      <p style={{ color: '#666', marginBottom: '24px' }}>Todas las recetas están precargadas. Modifica o agrega según necesites.</p>

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
