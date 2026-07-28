import React, { useState, useEffect } from 'react';

export default function Precios({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [precios, setPrecios] = useState({});
  const [totalSinIva, setTotalSinIva] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [totalConIva, setTotalConIva] = useState(0);

  const storageKeyPrecios = `precios-${proyectoId}`;
  const storageKeyComputo = `materiales-sin-receta-${proyectoId}`;

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = () => {
    // Cargar materiales del cómputo
    const bocasKey = `bocas-${proyectoId}`;
    const recetasKey = `recetas-${proyectoId}`;
    const sinRecetaKey = `materiales-sin-receta-${proyectoId}`;

    const conteos = JSON.parse(localStorage.getItem(bocasKey) || '{}');
    const recetas = JSON.parse(localStorage.getItem(recetasKey) || '{}');
    const sinReceta = JSON.parse(localStorage.getItem(sinRecetaKey) || '[]');

    // Calcular materiales (igual que en Computo)
    const materiales_calculados = {};

    Object.entries(conteos).forEach(([key, cantidad]) => {
      const [zonaId, tipoId] = key.split('-').map(Number);
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

    sinReceta.forEach(material => {
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

    const materialesArray = Object.values(materiales_calculados)
      .filter(m => m.cantidad > 0)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    setMateriales(materialesArray);

    // Cargar precios guardados
    const preciosGuardados = JSON.parse(localStorage.getItem(storageKeyPrecios) || '{}');
    setPrecios(preciosGuardados);

    // Calcular totales
    calcularTotales(materialesArray, preciosGuardados);
  };

  const calcularTotales = (mats, precs) => {
    let totalSin = 0;
    mats.forEach(mat => {
      const precio = precs[mat.nombre] || 0;
      totalSin += mat.cantidad * precio;
    });
    
    const iva = totalSin * 0.21;
    const totalCon = totalSin + iva;
    
    setTotalSinIva(totalSin);
    setTotalIva(iva);
    setTotalConIva(totalCon);
  };

  const handlePrecioChange = (nombreMaterial, precio) => {
    const preciosActualizados = { ...precios, [nombreMaterial]: parseFloat(precio) || 0 };
    setPrecios(preciosActualizados);
    localStorage.setItem(storageKeyPrecios, JSON.stringify(preciosActualizados));
    calcularTotales(materiales, preciosActualizados);
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>💲 Precios y Cotización</h2>
          <p style={{ color: '#666' }}>Carga el presupuesto del proveedor y gestiona precios</p>
        </div>
        <button
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
          📤 Cargar Presupuesto PDF
        </button>
      </div>

      {materiales.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
          Sin materiales para cotizar
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
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Precio Unit.</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((material, idx) => {
                  const precio = precios[material.nombre] || 0;
                  const total = material.cantidad * precio;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{material.nombre}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{material.cantidad.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{material.unidad}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={precio || ''}
                          onChange={(e) => handlePrecioChange(material.nombre, e.target.value)}
                          placeholder="$"
                          style={{
                            width: '100px',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '13px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#2563a8' }}>
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>TOTAL SIN IVA</p>
              <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalSinIva.toFixed(2)}</h3>
            </div>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>IVA 21%</p>
              <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalIva.toFixed(2)}</h3>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)', padding: '16px', borderRadius: '8px', color: 'white' }}>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '12px', fontWeight: '600' }}>TOTAL CON IVA</p>
              <h3 style={{ margin: 0, fontSize: '20px' }}>${totalConIva.toFixed(2)}</h3>
            </div>
          </div>

          {/* BOTONES DESCARGA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              style={{
                background: '#10b981',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📥 Descargar Excel
            </button>
            <button
              style={{
                background: '#f59e0b',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📄 Descargar PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
