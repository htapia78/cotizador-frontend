import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  if (!proyecto) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
        color: 'white',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <div>
            <h1 style={{ margin: 0 }}>{proyecto.nombre}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Cliente: {proyecto.cliente}</p>
          </div>
        </div>
      </header>

      <nav style={{
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {['zonas', 'bocas', 'recetas', 'computo'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 0,
              padding: '16px 24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              color: tab === t ? '#2563a8' : '#6b7280',
              borderBottom: tab === t ? '2px solid #2563a8' : '2px solid transparent',
              textTransform: 'capitalize'
            }}
          >
            {t === 'bocas' ? 'Conteo de Bocas' : t === 'computo' ? 'Cómputo' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {tab === 'zonas' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
            <h2>Zonas del Proyecto</h2>
            <p style={{ color: '#999' }}>En desarrollo...</p>
          </div>
        )}
        {tab === 'bocas' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
            <h2>Conteo de Bocas</h2>
            <p style={{ color: '#999' }}>En desarrollo...</p>
          </div>
        )}
        {tab === 'recetas' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
            <h2>Recetas</h2>
            <p style={{ color: '#999' }}>En desarrollo...</p>
          </div>
        )}
        {tab === 'computo' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
            <h2>Cómputo de Materiales</h2>
            <p style={{ color: '#999' }}>En desarrollo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
