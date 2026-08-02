import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProyecto, exportarProyecto, get, K } from '../lib/store';
import { computo, totalMateriales, totalManoObra, resumen } from '../lib/calc';
import { compact } from '../lib/format';
import Zonas from './Zonas';
import Bocas from './Bocas';
import Recetas from './Recetas';
import Materiales from './Materiales';
import Computo from './Computo';
import Precios from './Precios';
import ManoDeObra from './ManoDeObra';
import Venta from './Venta';
import Propuesta from './Propuesta';

const PASOS = [
  { id:'zonas',     n:'01', label:'Zonas',           C:Zonas },
  { id:'bocas',     n:'02', label:'Conteo de bocas', C:Bocas },
  { id:'recetas',   n:'03', label:'Recetas',         C:Recetas },
  { id:'materiales',n:'04', label:'Materiales sueltos', C:Materiales },
  { id:'computo',   n:'05', label:'Cómputo',         C:Computo },
  { id:'precios',   n:'06', label:'Precios',         C:Precios },
  { id:'mo',        n:'07', label:'Mano de obra',    C:ManoDeObra },
  { id:'venta',     n:'08', label:'Precio de venta', C:Venta },
  { id:'propuesta', n:'09', label:'Propuesta',       C:Propuesta },
];

export default function ProyectoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tab, setTab] = useState('zonas');
  const [v, setV] = useState(0);                 // fuerza recálculo de los valores del riel
  const refrescar = () => setV(x => x + 1);
  const proyecto = obtenerProyecto(id);

  const vals = useMemo(() => {
    if (!proyecto) return {};
    const c = computo(id);
    const bocas = Object.values(get(K.bocas(id), {})).reduce((s, x) => s + (Number(x) || 0), 0);
    const r = resumen(id);
    return {
      zonas: `${get(K.zonas(id), []).length} zonas`,
      bocas: `${bocas} bocas`,
      recetas: `${Object.values(get(K.recetas(id), {})).filter(x => x?.length).length} definidas`,
      materiales: `${get(K.extras(id), []).length} ítems`,
      computo: `${c.length} materiales`,
      precios: compact(totalMateriales(id)),
      mo: compact(totalManoObra(id)),
      venta: compact(r.ventaSinIVA),
      propuesta: r.ventaSinIVA ? 'lista' : '—',
    };
  }, [id, v, proyecto]);

  if (!proyecto) {
    return (
      <div style={{ maxWidth: 520, margin: '90px auto', padding: 24 }}>
        <div className="card pad">
          <h2>No encontramos ese proyecto</h2>
          <p className="dim" style={{ fontSize: 13 }}>
            Puede que se haya eliminado o que estés en otro navegador: los datos se guardan localmente.
          </p>
          <button className="btn-primary" onClick={() => nav('/proyectos')}>Ver mis proyectos</button>
        </div>
      </div>
    );
  }

  const descargarRespaldo = () => {
    const blob = new Blob([JSON.stringify(exportarProyecto(id), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${proyecto.nombre.replace(/[^\w\s-]/g, '')}-respaldo.json`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  const Actual = PASOS.find(p => p.id === tab)?.C || Zonas;

  return (
    <div className="shell">
      <nav className="rail">
        <div className="rail-head">
          <button className="btn-ghost" style={{ padding: '2px 0', marginBottom: 12, fontSize: 12 }}
                  onClick={() => nav('/proyectos')}>← Proyectos</button>
          <h3 style={{ lineHeight: 1.25 }}>{proyecto.nombre}</h3>
          <div className="faint" style={{ fontSize: 11.5, marginTop: 3 }}>{proyecto.cliente || 'Sin cliente'}</div>
        </div>
        {PASOS.map(p => (
          <button key={p.id} className="step" data-on={tab === p.id ? '1' : '0'} onClick={() => setTab(p.id)}>
            <span className="step-n">{p.n}</span>
            <span><span className="step-l">{p.label}</span><span className="step-v">{vals[p.id]}</span></span>
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px 20px 0' }}>
          <button className="btn btn-sm" style={{ width: '100%' }} onClick={descargarRespaldo}>
            Descargar respaldo
          </button>
          <p className="faint" style={{ fontSize: 10.5, marginTop: 8, lineHeight: 1.5 }}>
            Guardá una copia cada tanto: los datos viven en este navegador.
          </p>
        </div>
      </nav>

      <main className="main">
        <Actual proyectoId={id} onCambio={refrescar} proyecto={proyecto} />
      </main>
    </div>
  );
}
