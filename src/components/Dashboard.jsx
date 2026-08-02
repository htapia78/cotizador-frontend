import React, { useState, useMemo } from 'react';
import { getConfig, setConfig } from '../lib/store';
import { totalMateriales, totalManoObra, cascada } from '../lib/calc';
import { money } from '../lib/format';
import { Head, Kpi } from '../ui';

const BASES = [
  { v:'mo',     l:'Mano de obra' },
  { v:'mat_mo', l:'Materiales + mano de obra' },
  { v:'mat',    l:'Materiales' },
];

export default function Venta({ proyectoId, onCambio }) {
  const [cfg, setCfg] = useState(() => getConfig(proyectoId));
  const mat = useMemo(() => totalMateriales(proyectoId), [proyectoId]);
  const mo  = useMemo(() => totalManoObra(proyectoId), [proyectoId]);
  const c   = cascada(mat, mo, cfg);

  const guardar = n => { setCfg(n); setConfig(proyectoId, n); onCambio?.(); };
  const set = (k, v) => guardar({ ...cfg, [k]: k.startsWith('pct') ? (parseFloat(String(v).replace(',', '.')) || 0) : v });

  const max = c.ventaSinIVA || 1;
  const Fila = ({ label, valor, pct, sub, total }) => (
    <div className={'casc-row' + (sub ? ' sub' : '') + (total ? ' total' : '')}>
      <div className="casc-lbl">{label}{pct != null && <span className="faint num" style={{ marginLeft: 7, fontSize: 11.5 }}>{pct}</span>}</div>
      <div className="casc-val">{money(valor)}</div>
      <div className="casc-bar"><i style={{ width: `${Math.min(100, Math.max(1, valor / max * 100))}%` }} /></div>
    </div>
  );

  const Pct = ({ label, k, hint }) => (
    <label className="f"><span>{label}{hint && <em className="faint" style={{ fontStyle:'normal' }}> · {hint}</em>}</span>
      <input type="number" step="0.1" className="num" value={cfg[k]} onChange={e => set(k, e.target.value)} /></label>
  );

  return (
    <>
      <Head eyebrow="Paso 08" title="Precio de venta"
            sub="De costo de material a precio final. Cada porcentaje es tuyo: tocalo y mirá cómo se mueve." />

      <div className="grid3" style={{ marginBottom: 18 }}>
        <Kpi label="Costo neto" value={money(c.costoNeto)} />
        <Kpi label="Venta sin IVA" value={money(c.ventaSinIVA)} hi />
        <Kpi label="Margen sobre costo" value={c.margenSobreCosto.toFixed(1) + ' %'} />
      </div>

      <div className="card pad" style={{ marginBottom: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Cascada de costos</div>
        <div className="casc">
          <Fila label="Materiales" valor={c.materiales} />
          <Fila label="Mano de obra" valor={c.manoObra} />
          <Fila label="Gastos de estructura" valor={c.estructura}
                pct={`${cfg.pctEstructura}% de ${BASES.find(b => b.v === cfg.baseEstructura)?.l.toLowerCase()}`} />
          <Fila label="Costo neto" valor={c.costoNeto} total />
          <Fila label="Imprevistos" valor={c.imprevistos} pct={`${cfg.pctImprevistos}% del costo neto`} sub />
          <Fila label="Beneficio" valor={c.beneficio} pct={`${cfg.pctBeneficio}% del costo neto`} sub />
          <Fila label="Total neto" valor={c.totalNeto} total />
          <Fila label="Ingresos brutos" valor={c.iibb} pct={`${cfg.pctIIBB}% del total neto`} sub />
          <Fila label="Gastos bancarios" valor={c.bancarios} pct={`${cfg.pctBancarios}% del total neto`} sub />
          <Fila label="Precio de venta sin IVA" valor={c.ventaSinIVA} total />
        </div>
        <hr className="hr" />
        <div className="grid2">
          <div className="kpi"><span className="eyebrow">IVA {cfg.pctIVA}%</span><b>{money(c.iva)}</b></div>
          <div className="kpi hi"><span className="eyebrow">Total con IVA</span><b>{money(c.ventaConIVA)}</b></div>
        </div>
      </div>

      <div className="card pad">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Parámetros</div>
        <div className="grid2" style={{ marginBottom: 14 }}>
          <label className="f"><span>Base de gastos de estructura</span>
            <select value={cfg.baseEstructura} onChange={e => set('baseEstructura', e.target.value)}>
              {BASES.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select></label>
          <Pct label="Gastos de estructura %" k="pctEstructura" />
        </div>
        <div className="grid4" style={{ marginBottom: 14 }}>
          <Pct label="Imprevistos %" k="pctImprevistos" hint="s/costo neto" />
          <Pct label="Beneficio %" k="pctBeneficio" hint="s/costo neto" />
          <Pct label="Ingresos brutos %" k="pctIIBB" hint="s/total neto" />
          <Pct label="Gastos bancarios %" k="pctBancarios" hint="s/total neto" />
        </div>
        <div className="grid4">
          <Pct label="IVA %" k="pctIVA" />
        </div>
      </div>
    </>
  );
}
