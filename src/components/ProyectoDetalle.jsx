/**
 * ProyectoDetalle - Vista principal con pestañas
 * Integra: Zonas, Bocas, Recetas, Cómputo, PDF
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proyectosAPI } from '../api';
import Zonas from './Zonas';
import Bocas from './Bocas';
import Recetas from './Recetas';
import Computo from './Computo';
import './ProyectoDetalle.css';

export default function ProyectoDetalle() {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [tab, setTab] = useState('zonas'); // zonas | bocas | recetas | computo | pdf
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProyecto();
  }, [proyectoId]);

  const cargarProyecto = async () => {
    try {
      const res = await proyectosAPI.obtener(proyectoId);
      setProyecto(res.data);
    } catch (err) {
      console.error('Error al cargar proyecto:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!proyecto) return <div>Proyecto no encontrado</div>;

  return (
    <div className="proyecto-detalle">
      <header className="proyecto-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Volver
          </button>
          <div className="proyecto-info">
            <h1>{proyecto.nombre}</h1>
            <p>Cliente: {proyecto.cliente}</p>
          </div>
        </div>
      </header>

      <nav className="tabs-nav">
        <button
          className={`tab ${tab === 'zonas' ? 'active' : ''}`}
          onClick={() => setTab('zonas')}
        >
          Zonas
        </button>
        <button
          className={`tab ${tab === 'bocas' ? 'active' : ''}`}
          onClick={() => setTab('bocas')}
        >
          Conteo de Bocas
        </button>
        <button
          className={`tab ${tab === 'recetas' ? 'active' : ''}`}
          onClick={() => setTab('recetas')}
        >
          Recetas
        </button>
        <button
          className={`tab ${tab === 'computo' ? 'active' : ''}`}
          onClick={() => setTab('computo')}
        >
          Cómputo
        </button>
        <button
          className={`tab ${tab === 'pdf' ? 'active' : ''}`}
          onClick={() => setTab('pdf')}
        >
          Solicitud de Cotización
        </button>
      </nav>

      <div className="tab-content">
        {tab === 'zonas' && <Zonas proyectoId={proyectoId} />}
        {tab === 'bocas' && <Bocas proyectoId={proyectoId} />}
        {tab === 'recetas' && <Recetas proyectoId={proyectoId} />}
        {tab === 'computo' && <Computo proyectoId={proyectoId} />}
        {tab === 'pdf' && <div className="tab-placeholder">PDF - Próximamente</div>}
      </div>
    </div>
  );
}
