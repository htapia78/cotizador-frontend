/**
 * Bocas - Ingresar cantidad de bocas por zona
 */

import React, { useEffect, useState } from 'react';
import { zonasAPI, tiposBocaAPI, conteoBocasAPI } from '../api';
import './Bocas.css';

export default function Bocas({ proyectoId }) {
  const [zonas, setZonas] = useState([]);
  const [tiposBoca, setTiposBoca] = useState([]);
  const [conteos, setConteos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = async () => {
    try {
      const [zonasRes, tiposRes, conteosRes] = await Promise.all([
        zonasAPI.listar(proyectoId),
        tiposBocaAPI.listar(proyectoId),
        conteoBocasAPI.listar(proyectoId)
      ]);
      setZonas(zonasRes.data);
      setTiposBoca(tiposRes.data);
      setConteos(conteosRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = async (zonaId, tipoId, cantidad) => {
    try {
      // Buscar si ya existe este conteo
      const existing = conteos.find(
        c => c.zona_id === zonaId && c.tipo_boca_id === tipoId
      );

      if (existing) {
        if (cantidad === 0) {
          // No hacer nada, solo actualizar localmente
          setConteos(conteos.filter(c => c.id !== existing.id));
        } else {
          const res = await conteoBocasAPI.actualizar(existing.id, cantidad);
          setConteos(conteos.map(c =>
            c.id === existing.id ? res.data : c
          ));
        }
      } else if (cantidad > 0) {
        const res = await conteoBocasAPI.crear(proyectoId, zonaId, tipoId, cantidad);
        setConteos([...conteos, res.data]);
      }
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    }
  };

  const getCantidad = (zonaId, tipoId) => {
    const conteo = conteos.find(
      c => c.zona_id === zonaId && c.tipo_boca_id === tipoId
    );
    return conteo?.cantidad || 0;
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="bocas-container">
      <h2>Conteo de Bocas por Zona</h2>

      {zonas.length === 0 ? (
        <p className="empty">Primero crea zonas en la pestaña anterior.</p>
      ) : tiposBoca.length === 0 ? (
        <p className="empty">Primero crea tipos de boca en la pestaña Recetas.</p>
      ) : (
        <div className="bocas-table-wrapper">
          <table className="bocas-table">
            <thead>
              <tr>
                <th>Zona</th>
                {tiposBoca.map((tipo) => (
                  <th key={tipo.id}>{tipo.nombre}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zonas.map((zona) => (
                <tr key={zona.id}>
                  <td className="zona-name">{zona.nombre}</td>
                  {tiposBoca.map((tipo) => (
                    <td key={`${zona.id}-${tipo.id}`}>
                      <input
                        type="number"
                        min="0"
                        value={getCantidad(zona.id, tipo.id)}
                        onChange={(e) =>
                          handleCantidadChange(
                            zona.id,
                            tipo.id,
                            parseInt(e.target.value) || 0
                          )
                        }
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
