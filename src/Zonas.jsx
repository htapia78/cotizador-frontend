import React, { useState } from 'react';
import { K, get, set } from './store';
import { Head, Empty, useToast } from './ui';

export default function Zonas({ proyectoId, onCambio }) {
  const key = K.zonas(proyectoId);
  const [zonas, setZonas] = useState(() => get(key, []));
  const [nombre, setNombre] = useState('');
  const [toast, toastNode] = useToast();

  const guardar = z => { setZonas(z); set(key, z); onCambio?.(); };

  const agregar = e => {
    e.preventDefault();
    const n = nombre.trim(); if (!n) return;
    guardar([...zonas, { id: Date.now(), nombre: n }]);
    setNombre('');
  };

  const eliminar = z => {
    if (!confirm(`Eliminar la zona "${z.nombre}"? Se pierde también su conteo de bocas.`)) return;
    guardar(zonas.filter(x => x.id !== z.id));
    const b = get(K.bocas(proyectoId), {});
    Object.keys(b).forEach(k => { if (k.split('-')[0] === String(z.id)) delete b[k]; });
    set(K.bocas(proyectoId), b);
    toast('Zona eliminada');
  };

  const renombrar = (z, v) => guardar(zonas.map(x => x.id === z.id ? { ...x, nombre: v } : x));

  return (
    <>
      <Head eyebrow="Paso 01" title="Zonas de la obra"
            sub="Sectores en los que vas a contar bocas: plantas, alas, pabellones, casas." />

      <form onSubmit={agregar} className="card pad row" style={{ marginBottom: 16 }}>
        <input className="grow" value={nombre} onChange={e => setNombre(e.target.value)}
               placeholder="Planta baja, Restaurant, Pileta…" />
        <button className="btn-primary">Agregar zona</button>
      </form>

      {zonas.length === 0 ? (
        <div className="card"><Empty title="Sin zonas todavía">
          Empezá por dividir la obra en sectores. Podés cambiarlos cuando quieras.
        </Empty></div>
      ) : (
        <div className="card pad">
          <div className="eyebrow" style={{ marginBottom: 12 }}>{zonas.length} zonas</div>
          <div className="stack" style={{ gap: 8 }}>
            {zonas.map((z, i) => (
              <div key={z.id} className="row">
                <span className="num faint" style={{ width: 24, fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</span>
                <input className="grow" value={z.nombre} onChange={e => renombrar(z, e.target.value)} />
                <button className="btn-danger" onClick={() => eliminar(z)}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {toastNode}
    </>
  );
}
