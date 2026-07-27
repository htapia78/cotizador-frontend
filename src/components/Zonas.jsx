import React, { useState, useEffect } from 'react';

export default function Zonas({ proyectoId }) {
  const [zonas, setZonas] = useState([]);
  const [nombre, setNombre] = useState('');
  const storageKey = `zonas-${proyectoId}`;

  useEffect(() => {
    // Cargar zonas del localStorage
    const zonasGuardadas = localStorage.getItem(storageKey);
    if (zonasGuardadas) {
      setZonas(JSON.parse(zonasGuardadas));
    } else {
      // Si no hay, cargar zonas de ejemplo
      const zonasDefault = [
        { id: 1, nombre: 'Planta Baja', descripcion: 'Piso 0' },
        { id: 2, nombre: 'Primer Piso', descripcion: 'Piso 1' }
      ];
      setZonas(zonasDefault);
      localStorage.setItem(storageKey, JSON.stringify(zonasDefault));
    }
  }, [proyectoId, storageKey]);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      const nuevaZona = { id: Date.now(), nombre, descripcion: '' };
      const zonasActualizadas = [...zonas, nuevaZona];
      setZonas(zonasActualizadas);
      localStorage.setItem(storageKey, JSON.stringify(zonasActualizadas));
      setNombre('');
    }
  };

  const handleEliminar = (id) => {
    const zonasActualizadas = zonas.filter(z => z.id !== id);
    setZonas(zonasActualizadas);
    localStorage.setItem(storageKey, JSON.stringify(zonasActualizadas));
  };

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
      <h2>Zonas del Proyecto</h2>
      
      <form onSubmit={handleAgregar} style={{ marginBottom: '20px', background: '#f9fafb', padding: '15px', borderRadius: '6px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Planta Baja"
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563a8',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Agregar
          </button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: '10px' }}>
        {zonas.map(zona => (
          <div key={zona.id} style={{
            background: '#f9fafb',
            padding: '15px',
            borderRadius: '6px',
            borderLeft: '4px solid #2563a8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{zona.nombre}</h4>
              <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>{zona.descripcion}</p>
            </div>
            <button
              onClick={() => handleEliminar(zona.id)}
              style={{
                background: '#dc2626',
                color: 'white',
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
    </div>
  );
}
