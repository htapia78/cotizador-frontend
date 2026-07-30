import React, { useState, useEffect } from 'react';

export default function PresupuestoVenta({ proyectoId }) {
  const [totalMateriales, setTotalMateriales] = useState(0);
  const [totalMO, setTotalMO] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [gastosEstructura, setGastosEstructura] = useState(0);
  const [otrosGastos, setOtrosGastos] = useState(0);
  const [margenGanancia, setMargenGanancia] = useState(20);

  useEffect(() => {
    calcularTotales();
  }, [proyectoId]);

  const calcularTotales = () => {
    const preciosKey = `precios-${proyectoId}`;
    const preciosData = JSON.parse(localStorage.getItem(preciosKey) || '{}');
    
    const bocasKey = `bocas-${proyectoId}`;
    const recetasKey = `recetas-${proyectoId}`;
    const sinRecetaKey = `materiales-sin-receta-${proyectoId}`;

    const conteos = JSON.parse(localStorage.getItem(bocasKey) || '{}');
    const recetas = JSON.parse(localStorage.getItem(recetasKey) || '{}');
    const sinReceta = JSON.parse(localStorage.getItem(sinRecetaKey) || '[]');

    let totalMat = 0;

    Object.entries(conteos).forEach(([key, cantidad]) => {
      const [zonaId, tipoId] = key.split('-').map(Number);
      const recetasDeTipo = recetas[tipoId] || [];
      
      recetasDeTipo.forEach(material => {
        const precio = preciosData[material.nombre] || 0;
        totalMat += cantidad * material.cantidad * precio;
      });
    });

    sinReceta.forEach(material => {
      const precio = preciosData[material.nombre] || 0;
      totalMat += material.cantidad * precio;
    });

    setTotalMateriales(totalMat);

    const moKey = `mano-de-obra-${proyectoId}`;
    const moData = JSON.parse(localStorage.getItem(moKey) || '[]');
    const totalMO_calc = moData.reduce((sum, c) => sum + c.subtotal, 0);
    setTotalMO(totalMO_calc);
  };

  const costoNeto = totalMateriales + totalMO;
  const impuestosCalc = (costoNeto * impuestos) / 100;
  const totalConImpuestos = costoNeto + impuestosCalc + gastosEstructura + otrosGastos;
  const ganancia = (totalConImpuestos * margenGanancia) / 100;
  const totalFinal = totalConImpuestos + ganancia;
  const totalConIVA = totalFinal * 1.21;

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📄 Presupuesto de Venta</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Resumen ejecutivo + gastos + margen</p>

      {/* CAMPOS EDITABLES */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Parámetros</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
              Impuestos (%)
            </label>
            <input
              type="number"
              value={impuestos}
              onChange={(e) => setImpuestos(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
              Gastos de Estructura ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={gastosEstructura}
              onChange={(e) => setGastosEstructura(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
              Otros Gastos ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={otrosGastos}
              onChange={(e) => setOtrosGastos(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#666', fontSize: '12px', fontWeight: '600' }}>
              Margen de Ganancia (%)
            </label>
            <input
              type="number"
              value={margenGanancia}
              onChange={(e) => setMargenGanancia(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* RESUMEN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Materiales</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${totalMateriales.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Mano de Obra</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${totalMO.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Impuestos</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${impuestosCalc.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Gastos Estructura</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${gastosEstructura.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Otros Gastos</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${otrosGastos.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>Ganancia</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '18px' }}>${ganancia.toFixed(2)}</h3>
        </div>
      </div>

      {/* TOTALES FINALES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>TOTAL SIN IVA</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalFinal.toFixed(2)}</h3>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>IVA 21%</p>
          <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${(totalConIVA - totalFinal).toFixed(2)}</h3>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)', padding: '16px', borderRadius: '8px', color: 'white' }}>
          <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '12px', fontWeight: '600' }}>TOTAL CON IVA</p>
          <h3 style={{ margin: 0, fontSize: '20px' }}>${totalConIVA.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}
