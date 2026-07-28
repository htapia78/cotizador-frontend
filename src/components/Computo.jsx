import React, { useState, useEffect } from 'react';

export default function Computo({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularComputo();
  }, [proyectoId]);

  const calcularComputo = () => {
    // Cargar datos de localStorage
    const bocasStorageKey = `bocas-${proyectoId}`;
    const recetasStorageKey = `recetas-${proyectoId}`;
    const materilesSinRecetaKey = `materiales-sin-receta-${proyectoId}`;

    const conteos = JSON.parse(localStorage.getItem(bocasStorageKey) || '{}');
    const recetas = JSON.parse(localStorage.getItem(recetasStorageKey) || '{}');
    const materialesSinReceta = JSON.parse(localStorage.getItem(materilesSinRecetaKey) || '[]');

    // Calcular totales por material
    const materiales_calculados = {};

    // 1. MATERIALES CON RECETA (bocas)
    Object.entries(conteos).forEach(([key, cantidad]) => {
      const [zonaId, tipoId] = key.split('-').map(Number);
      
      // Buscar recetas para este tipo
      const recetasDeTipo = recetas[tipoId] || recetas[`${tipoId}`] || [];
      
      recetasDeTipo.forEach(material => {
        const materialKey = material.nombre;
        const cantidadTotal = cantidad * material.cantidad;
        
        if (!materiales_calculados[materialKey]) {
          materiales_calculados[materialKey] = {
            nombre: material.nombre,
            cantidad: 0,
            unidad: material.unidad || 'm'
          };
        }
        materiales_calculados[materialKey].cantidad += cantidadTotal;
      });
    });

    // 2. MATERIALES SIN RECETA (agregados manualmente)
    materialesSinReceta.forEach(material => {
      const materialKey = material.nombre;
      
      if (!materiales_calculados[materialKey]) {
        materiales_calculados[materialKey] = {
          nombre: material.nombre,
          cantidad: 0,
          unidad: material.unidad || 'un'
        };
      }
      materiales_calculados[materialKey].cantidad += material.cantidad;
    });

    // Convertir a array y filtrar zeros
    const materialesArray = Object.values(materiales_calculados)
      .filter(m => m.cantidad > 0)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    setMateriales(materialesArray);
    const totalCalc = materialesArray.reduce((sum, m) => sum + (m.cantidad || 0), 0);
    setTotal(totalCalc);
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>🧮 Cómputo de Materiales</h2>
          <p style={{ color: '#666' }}>Total de materiales necesarios para el proyecto</p>
        </div>
        <button
          onClick={calcularComputo}
          style={{
            background: '#2563a8',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🔄 Recalcular
        </button>
      </div>

      {materiales.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
          Define zonas, bocas y recetas para ver el cómputo
        </p>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1c2d4f' }}>Material</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Cantidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((material, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{material.nombre}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                      {material.cantidad.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                      {material.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
            color: 'white',
            padding: '20px 24px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <p style={{ margin: '0 0 8px 0', opacity: 0.9 }}>TOTAL DE MATERIALES</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
              {total.toFixed(2)} unidades
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
