import React, { useEffect, useState } from 'react';

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

export default function Bocas({ proyectoId }) {
  const [zonas, setZonas] = useState([]);
  const [conteos, setConteos] = useState({});
  const storageKey = `bocas-${proyectoId}`;

  useEffect(() => {
    cargarDatos();
  }, [proyectoId, storageKey]);

  const cargarDatos = () => {
    // Cargar zonas
    const zonasGuardadas = localStorage.getItem(`zonas-${proyectoId}`);
    if (zonasGuardadas) {
      setZonas(JSON.parse(zonasGuardadas));
    }

    // Cargar conteos
    const conteosGuardados = localStorage.getItem(storageKey);
    if (conteosGuardados) {
      setConteos(JSON.parse(conteosGuardados));
    }
  };

  const handleCantidadChange = (zonaId, tipoId, cantidad) => {
    const key = `${zonaId}-${tipoId}`;
    const conteosActualizados = { ...conteos };
    if (cantidad === 0 || cantidad === '') {
      delete conteosActualizados[key];
    } else {
      conteosActualizados[key] = parseInt(cantidad) || 0;
    }
    setConteos(conteosActualizados);
    localStorage.setItem(storageKey, JSON.stringify(conteosActualizados));
  };

  const getCantidad = (zonaId, tipoId) => {
    const key = `${zonaId}-${tipoId}`;
    return conteos[key] || '';
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>🔌 Conteo de Bocas</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Ingresa la cantidad de bocas por zona y tipo</p>

      {zonas.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Crea zonas primero en la pestaña anterior</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white'
          }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1c2d4f', minWidth: '120px' }}>Zona</th>
                {TIPOS_BOCA.map(tipo => (
                  <th key={tipo.id} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', minWidth: '130px', fontSize: '12px' }}>
                    {tipo.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zonas.map(zona => (
                <tr key={zona.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#1c2d4f' }}>{zona.nombre}</td>
                  {TIPOS_BOCA.map(tipo => (
                    <td key={`${zona.id}-${tipo.id}`} style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        value={getCantidad(zona.id, tipo.id)}
                        onChange={(e) => handleCantidadChange(zona.id, tipo.id, e.target.value)}
                        style={{
                          width: '70px',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontSize: '13px'
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
