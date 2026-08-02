import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarProyectos, crearProyecto, borrarProyecto, importarProyecto, actualizarProyecto } from './store';
import { resumen } from './calc';
import { compact } from './format';
import { useToast, Head, Empty } from './ui';

export default function Dashboard() {
  const [lista, setLista] = useState(listarProyectos);
  const [form, setForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cliente, setCliente] = useState('');
  const [toast, toastNode] = useToast();
  const nav = useNavigate();
  const empresa = localStorage.getItem('apx.empresa') || 'APEXCORE';

  const crear = e => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const p = crearProyecto(nombre.trim(), cliente.trim());
    setLista(listarProyectos());
    setNombre(''); setCliente(''); setForm(false);
    nav(`/proyecto/${p.id}`);
  };

  const renombrar = (e, p) => {
    e.stopPropagation();
    const n = prompt('Nombre de la obra', p.nombre);
    if (n === null) return;
    const c = prompt('Cliente', p.cliente || '');
    actualizarProyecto(p.id, { nombre: n.trim() || p.nombre, cliente: (c ?? p.cliente ?? '').trim() });
    setLista(listarProyectos());
  };

  const eliminar = (e, p) => {
    e.stopPropagation();
    if (!confirm(`Eliminar "${p.nombre}" y todos sus datos? No se puede deshacer.`)) return;
    borrarProyecto(p.id);
    setLista(listarProyectos());
    toast('Proyecto eliminado');
  };

  const importar = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const p = importarProyecto(JSON.parse(await f.text()));
      setLista(listarProyectos());
      toast(`Importado: ${p.nombre}`);
    } catch (err) { toast('No se pudo importar: ' + err.message, true); }
    e.target.value = '';
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '46px 24px 80px' }}>
      <div className="between" style={{ marginBottom: 34 }}>
        <div className="row" style={{ gap: 9 }}>
          <span style={{ width: 7, height: 22, background: 'var(--lime)', borderRadius: 2 }} />
          <span className="eyebrow" style={{ letterSpacing: '.2em' }}>{empresa}</span>
        </div>
        <button className="btn-ghost" onClick={() => { localStorage.removeItem('apx.empresa'); nav('/login'); }}>
          Cambiar empresa
        </button>
      </div>

      <Head eyebrow="Cotizador" title="Proyectos" sub={`${lista.length} ${lista.length === 1 ? 'proyecto' : 'proyectos'} en este navegador`}>
        <label className="btn file-btn btn-sm">Importar respaldo
          <input type="file" accept=".json" onChange={importar} /></label>
        <button className="btn-primary" onClick={() => setForm(!form)}>
          {form ? 'Cancelar' : 'Nuevo proyecto'}
        </button>
      </Head>

      {form && (
        <form onSubmit={crear} className="card pad" style={{ marginBottom: 18 }}>
          <div className="grid2" style={{ marginBottom: 14 }}>
            <label className="f"><span>Nombre de la obra</span>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Hotel Las Compuertas" autoFocus /></label>
            <label className="f"><span>Cliente</span>
              <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="AESA" /></label>
          </div>
          <button className="btn-primary">Crear proyecto</button>
        </form>
      )}

      {lista.length === 0 ? (
        <div className="card"><Empty title="Todavía no hay proyectos">
          Creá el primero para empezar a computar bocas y materiales.
        </Empty></div>
      ) : (
        <div className="stack">
          {lista.map(p => {
            const r = resumen(p.id);
            return (
              <div key={p.id} className="card pad between" style={{ cursor: 'pointer' }}
                   onClick={() => nav(`/proyecto/${p.id}`)}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ marginBottom: 3 }}>{p.nombre}</h3>
                  <div className="faint" style={{ fontSize: 12 }}>
                    {p.cliente || 'Sin cliente'} · creado {new Date(p.creado).toLocaleDateString('es-AR')}
                  </div>
                </div>
                <div className="row" style={{ gap: 20 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="eyebrow">Venta s/IVA</div>
                    <div className="num" style={{ fontSize: 17, color: r.ventaSinIVA ? 'var(--lime)' : 'var(--text-faint)' }}>
                      {compact(r.ventaSinIVA)}
                    </div>
                  </div>
                  <button className="btn-ghost btn-sm" onClick={e => renombrar(e, p)}>Renombrar</button>
                  <button className="btn-danger" onClick={e => eliminar(e, p)}>Eliminar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {toastNode}
    </div>
  );
}
