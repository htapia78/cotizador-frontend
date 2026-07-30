import React, { useState, useEffect } from 'react';

const UNIDADES = ['horas', 'días', 'semanas', 'un'];

export default function ManoDeObra({ proyectoId }) {
  const [conceptos, setConceptos] = useState([]);
  const [nuevoConcepto, setNuevoConcepto] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('horas');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const storageKey = `mano-de-obra-${proyectoId}`;

  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        setConceptos(JSON.parse(datos));
      } catch (e) {
        console.error('Error al cargar MO:', e);
      }
    }
  }, [storageKey]);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoConcepto.trim() || !nuevaCantidad || !nuevoPrecio) return;

    const nuevoItem = {
      id: Date.now(),
      concepto: nuevoConcepto,
      cantidad: parseFloat(nuevaCantidad),
      unidad: nuevaUnidad,
      precioUnitario: parseFloat(nuevoPrecio),
      subtotal: parseFloat(nuevaCantidad) * parseFloat(nuevoPrecio)
    };

    const conceptosActualizados = [...conceptos, nuevoItem];
    setConceptos(conceptosActualizados);
    localStorage.setItem(storageKey, JSON.stringify(conceptosActualizados));

    setNuevoConcepto('');
    setNuevaCantidad('');
    setNuevaUnidad('horas');
    setNuevoPrecio('');
  };

  const handleEliminar = (id) => {
    const item = conceptos.find(c => c.id === id);
    if (window.confirm(`¿Eliminar "${item.concepto}"?`)) {
      const conceptosActualizados = conceptos.filter(c => c.id !== id);
      setConceptos(conceptosActualizados);
      localStorage.setItem(storageKey, JSON.stringify(conceptosActualizados));
    }
  };

  const handleActualizar = (id, campo, valor) => {
    const conceptosActualizados = conceptos.map(c => {
      if (c.id === id) {
        const actualizado = { ...c, [campo]: parseFloat(valor) || c[campo] };
        actualizado.subtotal = actualizado.cantidad * actualizado.precioUnitario;
        return actualizado;
      }
      return c;
    });
    setConceptos(conceptosActualizados);
    localStorage.setItem(storageKey, JSON.stringify(conceptosActualizados));
  };

  const totalMO = conceptos.reduce((sum, c) => sum + c.subtotal, 0);

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>👷 Mano de Obra</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Define costos de mano de obra por concepto</p>

      {/* FORMULARIO */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Concepto</h4>
        <form onSubmit={handleAgregar}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={nuevoConcepto}
              onChange={(e) => setNuevoConcepto(e.target.value)}
              placeholder="Ej: Instalador electricista"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
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
            <select
              value={nuevaUnidad}
              onChange={(e) => setNuevaUnidad(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            >
              {UNIDADES.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              placeholder="Precio Unit."
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
      <h4 style={{ color: '#1c2d4f' }}>Conceptos ({conceptos.length})</h4>
      {conceptos.length === 0 ? (
        <p style={{ color: '#999' }}>Sin conceptos agregados</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1c2d4f' }}>Concepto</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '80px' }}>Cantidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '80px' }}>Unidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '100px' }}>Precio Unit.</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '100px' }}>Subtotal</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {conceptos.map((concepto) => (
                  <tr key={concepto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{concepto.concepto}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={concepto.cantidad}
                        onChange={(e) => handleActualizar(concepto.id, 'cantidad', e.target.value)}
                        style={{
                          width: '70px',
                          padding: '6px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          textAlign: 'center',
                          fontSize: '12px'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                      {concepto.unidad}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={concepto.precioUnitario}
                        onChange={(e) => handleActualizar(concepto.id, 'precioUnitario', e.target.value)}
                        style={{
                          width: '90px',
                          padding: '6px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          textAlign: 'center',
                          fontSize: '12px'
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#2563a8' }}>
                      ${concepto.subtotal.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEliminar(concepto.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>TOTAL MANO DE OBRA</p>
            <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalMO.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}
