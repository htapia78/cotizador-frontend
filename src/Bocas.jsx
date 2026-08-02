import React, { useState } from 'react';
import { K, get, set, getTipos, setTipos } from './store';
import { Head, Empty, Kpi } from './ui';

export default function Bocas({ proyectoId, onCambio }) {
  const zonas = get(K.zonas(proyectoId), []);
  const [tipos, setTiposS] = useState(() => getTipos(proyectoId));
  const [conteo, setConteo] = useState(() => get(K.bocas(proyectoId), {}));
  const [editTipos, setEditTipos] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');

  const guardarConteo = c => { setConteo(c); set(K.bocas(proyectoId), c); onCambio?.(); };
  const guardarTipos = t => { setTiposS(t); setTipos(proyectoId, t); onCambio?.(); };

  const setCell = (zid, tid, v) => {
    const n = parseInt(v, 10);
    const c = { ...conteo };
    if (!n) delete c[`${zid}-${tid}`]; else c[`${zid}-${tid}`] = n;
    guardarConteo(c);
  };

  const totalTipo = tid => zonas.reduce((s, z) => s + (conteo[`${z.id}-${tid}`] || 0), 0);
  const totalZona = zid => tipos.reduce((s, t) => s + (conteo[`${zid}-${t.id}`] || 0), 0);
  const total = tipos.reduce((s, t) => s + totalTipo(t.id), 0);

  const agregarTipo = e => {
    e.preventDefault();
    const n = nuevoTipo.trim(); if (!n) return;
    guardarTipos([...tipos, { id: Math.max(0, ...tipos.map(t => t.id)) + 1, nombre: n }]);
    setNuevoTipo('');
  };
  const borrarTipo = t => {
    if (!confirm(`Eliminar el tipo "${t.nombre}"? Se pierde su conteo y su receta.`)) return;
    guardarTipos(tipos.filter(x => x.id !== t.id));
    const c = { ...conteo };
    Object.keys(c).forEach(k => { if (k.split('-')[1] === String(t.id)) delete c[k]; });
    guardarConteo(c);
  };

  if (zonas.length === 0) return (
    <>
      <Head eyebrow="Paso 02" title="Conteo de bocas" />
      <div className="card"><Empty title="Primero definí las zonas">
        El conteo se organiza por zona. Volvé al paso 01 y cargá al menos una.
      </Empty></div>
    </>
  );

  return (
    <>
      <Head eyebrow="Paso 02" title="Conteo de bocas"
            sub="Cuántas bocas de cada tipo hay en cada zona, según plano.">
        <button className="btn btn-sm" onClick={() => setEditTipos(!editTipos)}>
          {editTipos ? 'Listo' : 'Editar tipos'}
        </button>
      </Head>

      <div className="grid3" style={{ marginBottom: 16 }}>
        <Kpi label="Bocas totales" value={total} hi />
        <Kpi label="Zonas" value={zonas.length} />
        <Kpi label="Tipos de boca" value={tipos.length} />
      </div>

      {editTipos && (
        <div className="card pad" style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Tipos de boca</div>
          <div className="stack" style={{ gap: 8, marginBottom: 14 }}>
            {tipos.map(t => (
              <div key={t.id} className="row">
                <input className="grow" value={t.nombre}
                       onChange={e => guardarTipos(tipos.map(x => x.id === t.id ? { ...x, nombre: e.target.value } : x))} />
                <button className="btn-danger" onClick={() => borrarTipo(t)}>Eliminar</button>
              </div>
            ))}
          </div>
          <form onSubmit={agregarTipo} className="row">
            <input className="grow" value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value)}
                   placeholder="Boca termostato, Caja climatización…" />
            <button className="btn">Agregar tipo</button>
          </form>
        </div>
      )}

      <div className="card pad" style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: 620 }}>
          <thead><tr>
            <th style={{ position: 'sticky', left: 0, background: 'var(--surface)' }}>Zona</th>
            {tipos.map(t => <th key={t.id} className="r">{t.nombre}</th>)}
            <th className="r">Total</th>
          </tr></thead>
          <tbody>
            {zonas.map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 500, position: 'sticky', left: 0, background: 'var(--surface)' }}>{z.nombre}</td>
                {tipos.map(t => (
                  <td key={t.id} className="r" style={{ width: 92 }}>
                    <input type="number" min="0" className="num" value={conteo[`${z.id}-${t.id}`] || ''}
                           onChange={e => setCell(z.id, t.id, e.target.value)} placeholder="0" />
                  </td>
                ))}
                <td className="r num" style={{ color: 'var(--lime)' }}>{totalZona(z.id) || '—'}</td>
              </tr>
            ))}
            <tr>
              <td className="eyebrow" style={{ position: 'sticky', left: 0, background: 'var(--surface)' }}>Total</td>
              {tipos.map(t => <td key={t.id} className="r num" style={{ color: 'var(--lime)' }}>{totalTipo(t.id) || '—'}</td>)}
              <td className="r num" style={{ color: 'var(--lime)', fontWeight: 700 }}>{total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
