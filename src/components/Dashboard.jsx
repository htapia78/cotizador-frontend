import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [cliente, setCliente] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data);
      
      const proyRes = await fetch(`${apiUrl}/api/proyectos/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const proyData = await proyRes.json();
      setProyectos(proyData);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${apiUrl}/api/proyectos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, cliente, descripcion: '' })
      });
      const data = await res.json();
      setProyectos([...proyectos, data]);
      setNombre('');
      setCliente('');
      setMostrarForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
        color: 'white',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0 }}>⚡ Cotizador de Obras Eléctricas</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span>{usuario?.nombre_empresa}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Mis Proyectos</h2>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={{
              background: '#2563a8',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {mostrarForm ? '✕ Cancelar' : '+ Nuevo Proyecto'}
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={handleCrear} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Hotel Mendoza"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cliente:</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
                placeholder="Nombre del cliente"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#2563a8',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Crear Proyecto
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {proyectos.length === 0 ? (
            <p style={{ color: '#999' }}>No hay proyectos. Crea uno para comenzar.</p>
          ) : (
            proyectos.map((proyecto) => (
              <div key={proyecto.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: 'left: 4px solid #2563a8'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1c2d4f' }}>{proyecto.nombre}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}><strong>Cliente:</strong> {proyecto.cliente}</p>
                <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>
                  Creado: {new Date(proyecto.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
