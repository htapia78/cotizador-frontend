import React, { useState, useMemo } from 'react';
import { getConfig, setConfig } from './store';
import { totalMateriales, totalManoObra, cascada } from './calc';
import { money } from './format';
import { Head, Kpi } from './ui';

const BASES = [
  { v:'mo',     l:'Mano de obra' },
  { v:'mat_mo', l:'Materiales + mano de obra' },
  { v:'mat',    l:'Materiales' },
];


/* Definidos fuera del componente: si viven adentro, React los recrea en cada
   tecleo y el input pierde el foco. */
const Fila = ({ label, valor, pct, sub, total, max }) => (
  <div className={'casc-row' + (sub ? ' sub' : '') + (total ? ' total' : '')}>
    <div className="casc-lbl">{label}
      {pct != null && <span className="faint num" style={{ marginLeft: 7, fontSize: 11.5 }}>{pct}</span>}</div>
    <div className="casc-val">{money(valor)}</div>
    <div className="casc-bar">
      <i style={{ width: `${Math.min(100, Math.max(1, Math.abs(valor) / max * 100))}%`,
                  background: valor < 0 ? 'var(--amber)' : undefined }} /></div>
  </div>
);

const Pct = ({ label, k, hint, cfg, set }) => (
  <label className="f">
    <span>{label}{hint && <em className="faint" style={{ fontStyle:'normal' }}> · {hint}</em>}</span>
    <input type="number" step="0.1" className="num" value={cfg[k]} onChange={e => set(k, e.target.value)} />
  </label>
);

const Libre = ({ nombre, tipo, valor, signo, cfg, upd }) => (
  <div style={{ display:'grid', gridTemplateColumns:'22px 1fr 110px 130px', gap:9, alignItems:'center' }}>
    <span className="num" style={{ color: signo === '−' ? 'var(--amber)' : 'var(--text-faint)', textAlign:'center' }}>{signo}</span>
    <input value={cfg[nombre] || ''} placeholder="Nombre del concepto"
           onChange={e => upd(nombre, e.target.value)} />
    <select value={cfg[tipo]} onChange={e => upd(tipo, e.target.value)}>
      <option value="monto">Monto $</option>
      <option value="pct">% del neto</option>
    </select>
    <input type="number" step="0.01" className="num" value={cfg[valor] ?? 0}
           onChange={e => upd(valor, parseFloat(String(e.target.value).replace(',', '.')) || 0)} />
  </div>
);

export default function Venta({ proyectoId, onCambio }) {
  const [cfg, setCfg] = useState(() => getConfig(proyectoId));
  const mat = useMemo(() => totalMateriales(proyectoId), [proyectoId]);
  const mo  = useMemo(() => totalManoObra(proyectoId), [proyectoId]);
  const c   = cascada(mat, mo, cfg);

  const guardar = n => { setCfg(n); setConfig(proyectoId, n); onCambio?.(); };
  const set = (k, v) => guardar({ ...cfg, [k]: k.startsWith('pct') ? (parseFloat(String(v).replace(',', '.')) || 0) : v });
  const upd = (k, v) => guardar({ ...cfg, [k]: v });

  const max = c.ventaSinIVA || 1;

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
          <Fila max={max} label="Materiales" valor={c.materiales} />
          <Fila max={max} label="Mano de obra" valor={c.manoObra} />
          <Fila max={max} label="Gastos de estructura" valor={c.estructura}
                pct={`${cfg.pctEstructura}% de ${BASES.find(b => b.v === cfg.baseEstructura)?.l.toLowerCase()}`} />
          <Fila max={max} label="Costo neto" valor={c.costoNeto} total />
          <Fila max={max} label="Imprevistos" valor={c.imprevistos} pct={`${cfg.pctImprevistos}% del costo neto`} sub />
          <Fila max={max} label="Beneficio" valor={c.beneficio} pct={`${cfg.pctBeneficio}% del costo neto`} sub />
          <Fila max={max} label="Total neto" valor={c.totalNeto} total />
          <Fila max={max} label="Ingresos brutos" valor={c.iibb} pct={`${cfg.pctIIBB}% del total neto`} sub />
          <Fila max={max} label="Gastos bancarios" valor={c.bancarios} pct={`${cfg.pctBancarios}% del total neto`} sub />
          {c.descuento !== 0 && <Fila max={max} label={cfg.descNombre || 'Descuento'} valor={-c.descuento}
                pct={cfg.descTipo === 'pct' ? `${cfg.descValor}% del total neto` : 'monto fijo'} sub />}
          {c.og1 !== 0 && <Fila max={max} label={cfg.og1Nombre || 'Otros gastos 1'} valor={c.og1}
                pct={cfg.og1Tipo === 'pct' ? `${cfg.og1Valor}% del total neto` : 'monto fijo'} sub />}
          {c.og2 !== 0 && <Fila max={max} label={cfg.og2Nombre || 'Otros gastos 2'} valor={c.og2}
                pct={cfg.og2Tipo === 'pct' ? `${cfg.og2Valor}% del total neto` : 'monto fijo'} sub />}
          <Fila max={max} label="Precio de venta sin IVA" valor={c.ventaSinIVA} total />
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
          <Pct cfg={cfg} set={set} label="Gastos de estructura %" k="pctEstructura" />
        </div>
        <div className="grid4" style={{ marginBottom: 14 }}>
          <Pct cfg={cfg} set={set} label="Imprevistos %" k="pctImprevistos" hint="s/costo neto" />
          <Pct cfg={cfg} set={set} label="Beneficio %" k="pctBeneficio" hint="s/costo neto" />
          <Pct cfg={cfg} set={set} label="Ingresos brutos %" k="pctIIBB" hint="s/total neto" />
          <Pct cfg={cfg} set={set} label="Gastos bancarios %" k="pctBancarios" hint="s/total neto" />
        </div>
        <div className="grid4">
          <Pct cfg={cfg} set={set} label="IVA %" k="pctIVA" />
        </div>

        <hr className="hr" />
        <div className="eyebrow" style={{ marginBottom: 4 }}>Ajustes sobre el total neto</div>
        <p className="faint" style={{ fontSize: 11.5, margin: '0 0 14px' }}>
          El primero resta, los otros dos suman. Poneles el nombre que quieras y elegí si es un monto o un porcentaje.
        </p>
        <div className="stack" style={{ gap: 10 }}>
          <Libre cfg={cfg} upd={upd} nombre="descNombre" tipo="descTipo" valor="descValor" signo="−" />
          <Libre cfg={cfg} upd={upd} nombre="og1Nombre"  tipo="og1Tipo"  valor="og1Valor"  signo="+" />
          <Libre cfg={cfg} upd={upd} nombre="og2Nombre"  tipo="og2Tipo"  valor="og2Valor"  signo="+" />
        </div>
      </div>
    </>
  );
}
