import React, { useState } from 'react';
import { K, get, set } from './store';
import { lineaMO } from './calc';
import { money } from './format';
import { Head, Empty, Kpi } from './ui';

/* Escala UOCRA CCT 76/75 — Zona A (incluye Mendoza), julio 2026.
   Valores de referencia: actualizalos con cada paritaria. */
const UOCRA = [
  { categoria:'Oficial especializado', valorHora:6800, noRemunerativo:72900 },
  { categoria:'Oficial',               valorHora:5817, noRemunerativo:67100 },
  { categoria:'Medio oficial',         valorHora:5375, noRemunerativo:62000 },
  { categoria:'Ayudante',              valorHora:4948, noRemunerativo:57900 },
];
const NUEVA = {
  categoria:'', valorHora:0, adicional:0, horasDia:8, diasMes:22, meses:1,
  dotacion:1, noRemunerativo:0, pctCargas:0,
};

export default function ManoDeObra({ proyectoId, onCambio }) {
  const key = K.mo(proyectoId);
  const [lineas, setLineas] = useState(() => get(key, []));
  const [cargasGlobal, setCargasGlobal] = useState(() => get(key, [])[0]?.pctCargas ?? 0);

  const guardar = l => { setLineas(l); set(key, l); onCambio?.(); };

  const agregar = (preset) => guardar([...lineas, {
    ...NUEVA, id: Date.now(), ...preset, pctCargas: cargasGlobal,
    adicional: preset ? 0 : 0,
  }]);

  const editar = (id, campo, v) => guardar(lineas.map(l => l.id === id
    ? { ...l, [campo]: campo === 'categoria' ? v : (parseFloat(String(v).replace(',', '.')) || 0) } : l));

  const aplicarCargas = pct => {
    setCargasGlobal(pct);
    guardar(lineas.map(l => ({ ...l, pctCargas: pct })));
  };

  const filas = lineas.map(l => ({ ...l, calc: lineaMO({ ...l, valorHora: (Number(l.valorHora)||0) + (Number(l.adicional)||0) }) }));
  const total = filas.reduce((s, l) => s + l.calc.total, 0);
  const horas = filas.reduce((s, l) => s + (l.horasDia||0)*(l.diasMes||0)*(l.meses||0)*(l.dotacion||0), 0);

  return (
    <>
      <Head eyebrow="Paso 07" title="Mano de obra"
            sub="Valor hora por categoría × horas por día × días por mes × meses × dotación." />

      <div className="grid3" style={{ marginBottom: 16 }}>
        <Kpi label="Total mano de obra" value={money(total)} hi />
        <Kpi label="Horas-hombre" value={horas.toLocaleString('es-AR')} />
        <Kpi label="Cuadrillas cargadas" value={lineas.length} />
      </div>

      <div className="card pad" style={{ marginBottom: 16 }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <div>
            <div className="eyebrow">Escala UOCRA · Zona A · julio 2026</div>
            <p className="faint" style={{ fontSize: 11.5, margin: '4px 0 0' }}>
              Valores de referencia. Editalos en la tabla cuando cambie la paritaria.
            </p>
          </div>
          <label className="row" style={{ gap: 8 }}>
            <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>Cargas sociales %</span>
            <input type="number" step="0.1" className="num" style={{ width: 82 }}
                   value={cargasGlobal} onChange={e => aplicarCargas(parseFloat(e.target.value) || 0)} />
          </label>
        </div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 7 }}>
          {UOCRA.map(u => (
            <button key={u.categoria} className="btn btn-sm" onClick={() => agregar(u)}>
              + {u.categoria} <span className="num faint" style={{ marginLeft: 5 }}>{money(u.valorHora)}/h</span>
            </button>
          ))}
          <button className="btn btn-sm" onClick={() => agregar()}>+ Categoría propia</button>
        </div>
      </div>

      {lineas.length === 0 ? (
        <div className="card"><Empty title="Sin mano de obra cargada">
          Agregá las categorías que van a intervenir. Podés sumar el adicional de electricista sobre el básico.
        </Empty></div>
      ) : (
        <div className="card pad" style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: 940 }}>
            <thead><tr>
              <th style={{ minWidth: 160 }}>Categoría</th>
              <th className="r" style={{ width: 100 }}>$ hora</th>
              <th className="r" style={{ width: 100 }}>+ Adicional</th>
              <th className="r" style={{ width: 72 }}>Hs/día</th>
              <th className="r" style={{ width: 78 }}>Días/mes</th>
              <th className="r" style={{ width: 70 }}>Meses</th>
              <th className="r" style={{ width: 78 }}>Dotación</th>
              <th className="r" style={{ width: 100 }}>No remun.</th>
              <th className="r" style={{ width: 120 }}>Total</th>
              <th style={{ width: 60 }}></th>
            </tr></thead>
            <tbody>
              {filas.map(l => (
                <tr key={l.id}>
                  <td><input value={l.categoria} placeholder="Categoría"
                        onChange={e => editar(l.id, 'categoria', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.valorHora} onChange={e => editar(l.id, 'valorHora', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.adicional} placeholder="0"
                        onChange={e => editar(l.id, 'adicional', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.horasDia} onChange={e => editar(l.id, 'horasDia', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.diasMes} onChange={e => editar(l.id, 'diasMes', e.target.value)} /></td>
                  <td><input type="number" step="0.5" className="num" value={l.meses} onChange={e => editar(l.id, 'meses', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.dotacion} onChange={e => editar(l.id, 'dotacion', e.target.value)} /></td>
                  <td><input type="number" className="num" value={l.noRemunerativo} onChange={e => editar(l.id, 'noRemunerativo', e.target.value)} /></td>
                  <td className="r num" style={{ color: 'var(--lime)' }}>{money(l.calc.total)}</td>
                  <td className="r"><button className="btn-danger"
                        onClick={() => guardar(lineas.filter(x => x.id !== l.id))}>Quitar</button></td>
                </tr>
              ))}
              <tr>
                <td colSpan={8} className="eyebrow" style={{ textAlign: 'right' }}>Total mano de obra</td>
                <td className="r num" style={{ color: 'var(--lime)', fontWeight: 700 }}>{money(total)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p className="faint" style={{ fontSize: 11.5, marginTop: 12 }}>
            Cada línea: (hora + adicional) × hs/día × días/mes × meses × dotación, más la suma no remunerativa
            por mes y por persona, más {cargasGlobal}% de cargas sociales sobre el remunerativo.
          </p>
        </div>
      )}
    </>
  );
}
