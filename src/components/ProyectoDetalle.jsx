import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Zonas from './Zonas';
import Bocas from './Bocas';
import Recetas from './Recetas';
import MaterialesSinReceta from './MaterialesSinReceta';
import Computo from './Computo';
import Precios from './Precios';

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [tab, setTab] = useState('zonas');

  useEffect(() => {
    const proyectos = JSON.parse(localStorage.getItem('proyectos') || '[]');
    const p = proyectos.find(pry => pry.id === parseInt(id));
    if (p) {
      setProyecto(p);
    }
  }, [id]);

  if (!proyecto) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Cargando proyecto...</div>;
  }

  const tabs = [
    { id: 'zonas', label: '🗺️ Zonas' },
    { id: 'bocas', label: '💡 Bocas' },
    { id: 'recetas', label: '📋 Recetas' },
    { id: 'materiales', label: '📦 Materiales' },
    { id: 'computo', label: '📊 Cómputo' },
    { id: 'precios', label: '💲 Precios' },   
  ];

  return (
    <div style={{ padding: '24px', background: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '8px 16px',
            background: '#e5e7eb',
            color: '#1c2d4f',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px'
          }}
        >
          ← Volver
        </button>

        <h1 style={{ color: '#1c2d4f', margin: '0 0 8px 0' }}>{proyecto.nombre}</h1>
        <p style={{ color: '#666', margin: '0 0 24px 0' }}>Hotel Mendoza - Godoy Cruz, Mendoza</p>

        <nav style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #e5e7eb',
          overflowX: 'auto',
          paddingBottom: '12px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: tab === t.id ? '#2563a8' : 'white',
                color: tab === t.id ? 'white' : '#1c2d4f',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: tab === t.id ? '600' : '500',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ maxWidth: '1200px' }}>
          {tab === 'zonas' && <Zonas proyectoId={id} />}
          {tab === 'bocas' && <Bocas proyectoId={id} />}
          {tab === 'recetas' && <Recetas proyectoId={id} />}
          {tab === 'materiales' && <MaterialesSinReceta proyectoId={id} />}
          {tab === 'computo' && <Computo proyectoId={id} />}
          {tab === 'precios' && <Precios proyectoId={id} />}       
        </div>
      </div>
    </div>
  );
}
