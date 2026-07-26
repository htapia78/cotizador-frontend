/**
 * Computo - Vista del cómputo calculado automáticamente
 */

import React, { useEffect, useState } from 'react';
import { computoAPI } from '../api';
import './Computo.css';

export default function Computo({ proyectoId }) {
  const [computo, setComputo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    cargarComputo();
  }, [proyectoId]);

  const cargarComputo = async () => {
    try {
      const res = await computoAPI.calcular(proyectoId);
      setComputo(res.data);
    } catch (err) {
      console.error('Error al calcular cómputo:', err);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [...new Set(computo.map(c => c.categoria))].sort();
  const computoFiltrado = filtroCategoria
    ? computo.filter(c => c.categoria === filtroCategoria)
    : computo;

  const totalMateriales = computoFiltrado.reduce((sum, c) => sum + (c.subtotal || 0), 0);

  if (loading) return <div className="loading">Calculando cómputo...</div>;

  return (
    <div className="computo-container">
      <h2>Cómputo de Materiales</h2>

      <div className="computo-header">
        <button onClick={cargarComputo} className="btn-secondary">
          🔄 Recalcular
        </button>

        <div className="filtro">
          <label>Filtrar por categoría:</label>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {computoFiltrado.length === 0 ? (
        <p className="empty">
          No hay materiales calculados. Ingresa bocas en la pestaña anterior.
        </p>
      ) : (
        <div className="computo-table-wrapper">
          <table className="computo-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Material</th>
                <th>Unidad</th>
                <th>Calculada</th>
                <th>Ajuste</th>
                <th>Final</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {computoFiltrado.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.categoria}</td>
                  <td className="material-name">{item.material_nombre}</td>
                  <td>{item.material_unidad}</td>
                  <td className="qty">{item.cantidad_calculada.toFixed(2)}</td>
                  <td className="qty">{item.cantidad_ajuste.toFixed(2)}</td>
                  <td className="qty-final">
                    <strong>{item.cantidad_final.toFixed(2)}</strong>
                  </td>
                  <td className="price">
                    {item.precio_unitario ? `$${item.precio_unitario.toFixed(2)}` : '-'}
                  </td>
                  <td className="price">
                    {item.subtotal ? `$${item.subtotal.toFixed(2)}` : '$0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {computoFiltrado.length > 0 && (
        <div className="computo-total">
          <div className="total-box">
            <strong>TOTAL MATERIALES</strong>
            <span className="total-value">
              ${totalMateriales.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
