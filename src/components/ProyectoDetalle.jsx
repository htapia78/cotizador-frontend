import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Zonas from './Zonas';
import Bocas from './Bocas';
import Recetas from './Recetas';
import Computo from './Computo';
import MaterialesSinReceta from './MaterialesSinReceta';

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [tab, setTab] = useState('zonas');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    cargarProyecto();
  }, [id]);

  const cargarProyecto = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${apiUrl}/api/proyectos/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const proy = data.find(p => p.id === parseInt(id));
      setProyecto(proy);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (!proyecto) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: '#999'
    }}>
      Cargando...
    </div>
  );

  const tabsConfig = [
    { id: 'zonas', label: 'Zonas', icon: '📍' },
    { id: 'bocas', label: 'Conteo de Bocas', icon: '🔌' },
    { id: 'recetas', label: 'Recetas', icon: '📋' },
    { id: 'materiales', label: 'Materiales sin Receta', icon: '📦' },
    { id: 'computo', label: 'Cómputo', icon: '🧮' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
      <header style={{
        background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
        color: 'white',
        padding: '32px 24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        borderBottom: '3px solid #c8a84b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
          >
            ← Volver
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>⚡ {proyecto.nombre}</h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Cliente: {proyecto.cliente}</p>
          </div>
        </div>
      </header>

      <nav style={{
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflowX: 'auto'
      }}>
        {tabsConfig.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: '0 0 auto',
              padding: '18px 24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: tab === t.id ? '600' : '500',
              color: tab === t.id ? '#c8a84b' : '#6b7280',
              borderBottom: tab === t.id ? '3px solid #c8a84b' : '3px solid transparent',
              transition: 'all 0.2s',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {tab === 'zonas' && <Zonas proyectoId={id} />}
        {tab === 'bocas' && <Bocas proyectoId={id} />}
        {tab === 'recetas' && <Recetas proyectoId={id} />}
        {tab === 'materiales' && <MaterialesSinReceta proyectoId={id} />}
        {tab === 'computo' && <Computo proyectoId={id} />}
      </div>
    </div>
  );
}
