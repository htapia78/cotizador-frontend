import React, { useState, useEffect } from 'react';

export default function Zonas({ proyectoId }) {
  const [zonas, setZonas] = useState([]);
  const [nombre, setNombre] = useState('');
  const storageKey = `zonas-${proyectoId}`;

  useEffect(() => {
    const zonasGuardadas = localStorage.getItem(storageKey);
    if (zonasGuardadas) {
      setZonas(JSON.parse(zonasGuardadas));
    } else {
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
    const zona = zonas.find(z => z.id === id);
    if (window.confirm(`¿Eliminar la zona "${zona.nombre}"? Esta acción no se puede deshacer.`)) {
      const zonasActualizadas = zonas.filter(z => z.id !== id);
      setZonas(zonasActualizadas);
      localStorage.setItem(storageKey, JSON.stringify(zonasActualizadas));
    }
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📍 Zonas del Proyecto</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Define las diferentes áreas o pisos del proyecto</p>
      
      <form onSubmit={handleAgregar} style={{ 
        marginBottom: '32px', 
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        padding: '24px', 
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Planta Baja, Piso 1, etc."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563a8';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            + Agregar Zona
          </button>
        </div>
      </form>

      {zonas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
          <p style={{ fontSize: '16px' }}>No hay zonas aún. Crea una para comenzar.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {zonas.map(zona => (
            <div key={zona.id} style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              padding: '18px 20px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #c8a84b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderLeftColor = '#2563a8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderLeftColor = '#c8a84b';
            }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', color: '#1c2d4f', fontWeight: '600' }}>📌 {zona.nombre}</h4>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>{zona.descripcion || 'Sin descripción'}</p>
              </div>
              <button
                onClick={() => handleEliminar(zona.id)}
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fee2e2';
                }}
              >
                ✕ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
