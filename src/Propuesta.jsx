import React, { useState, useMemo } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } from 'docx';
import { getConfig, setConfig } from './store';
import { totalMateriales, totalManoObra, cascada, bocasPorTipo, computo } from './calc';
import { money, hoy } from './format';
import { numeroALetras, capitalizar } from './letras';
import { Head, Kpi, useToast } from './ui';

const T = (t, o = {}) => new TextRun({ text: t, font: 'Calibri', size: 22, ...o });
const P = (t, o = {}) => new Paragraph({ children: Array.isArray(t) ? t : [T(t)], spacing: { after: 120 }, ...o });
const H = (t, lvl = HeadingLevel.HEADING_1) => new Paragraph({ text: t, heading: lvl, spacing: { before: 260, after: 130 } });
const bullets = txt => (txt || '').split('\n').map(l => l.trim()).filter(Boolean)
  .map(l => new Paragraph({ children: [T(l)], bullet: { level: 0 }, spacing: { after: 70 } }));

const Area = ({ label, k, ph, rows = 5, cfg, set }) => (
  <label className="f"><span>{label}</span>
    <textarea rows={rows} value={cfg[k] || ''} placeholder={ph}
      onChange={e => set(k, e.target.value)} style={{ resize:'vertical', lineHeight:1.6 }} /></label>
);

export default function Propuesta({ proyectoId, proyecto, onCambio }) {
  const [cfg, setCfg] = useState(() => getConfig(proyectoId));
  const [toast, toastNode] = useToast();
  const mat = useMemo(() => totalMateriales(proyectoId), [proyectoId]);
  const mo  = useMemo(() => totalManoObra(proyectoId), [proyectoId]);
  const c   = cascada(mat, mo, cfg);
  const bocas = bocasPorTipo(proyectoId).filter(b => b.total);
  const nItems = computo(proyectoId).length;

  const empresa = localStorage.getItem('apx.empresa') || 'APEXCORE S.A.S.';
  const cuit = localStorage.getItem('apx.cuit') || '';
  const dirEmpresa = localStorage.getItem('apx.dir') || '';

  const guardar = n => { setCfg(n); setConfig(proyectoId, n); onCambio?.(); };
  const set = (k, v) => guardar({ ...cfg, [k]: v });

  const redondeado = Math.ceil(c.ventaSinIVA / 1000) * 1000;
  const enLetras = capitalizar(numeroALetras(redondeado)) + ' pesos más IVA';
  const ref = cfg.referencia || `${new Date().getFullYear()}_OF___Rev_0_${proyecto?.nombre || ''}_PC`;

  const descargarWord = async () => {
    const filaTotal = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [6000, 3000],
      rows: [
        new TableRow({ children: [
          new TableCell({ width:{size:6000,type:WidthType.DXA},
            shading:{type:ShadingType.CLEAR, fill:'A4C639'},
            children:[P([T('Precio total sin IVA', { bold:true })])] }),
          new TableCell({ width:{size:3000,type:WidthType.DXA},
            shading:{type:ShadingType.CLEAR, fill:'A4C639'},
            children:[P([T(money(redondeado), { bold:true })], { alignment: AlignmentType.RIGHT })] }),
        ]}),
      ],
    });

    const doc = new Document({
      styles: { default: { document: { run: { font:'Calibri', size:22 } } } },
      sections: [{ children: [
        new Paragraph({ children:[T(empresa,{bold:true,size:30})], spacing:{after:60} }),
        new Paragraph({ children:[T([dirEmpresa, cuit && 'CUIT ' + cuit].filter(Boolean).join(' · '),{size:18,color:'707070'})], spacing:{after:340} }),

        new Paragraph({ children:[T((proyecto?.nombre || 'Obra').toUpperCase(),{bold:true,size:34})], spacing:{after:80} }),
        new Paragraph({ children:[T(cfg.obra || 'Instalación eléctrica de baja tensión',{size:24,color:'707070'})], spacing:{after:40} }),
        new Paragraph({ children:[T(ref,{size:18,color:'707070'})], spacing:{after:40} }),
        new Paragraph({ children:[T('Propuesta comercial · ' + hoy(),{size:18,color:'707070'})], spacing:{after:380} }),

        P([T('Sres. ', {bold:true}), T(cfg.cliente || proyecto?.cliente || '', {bold:true})]),
        cfg.atencion ? P([T('At. ' + cfg.atencion, {bold:true}), T(' — Presente')]) : P(''),
        P('De nuestra mayor consideración:'),
        P('Por medio de la presente tenemos el agrado de dirigirnos a usted para presentar nuestra propuesta comercial, correspondiente a los trabajos detallados a continuación, incluyendo provisión de materiales y mano de obra, conforme a la documentación emitida por el cliente.'),
        P('Quedamos a su disposición para ampliar cualquier información, atender consultas o recibir sugerencias que nos permitan adecuar aún más nuestra propuesta a sus requerimientos.'),
        P('Sin otro particular, saludamos atentamente.'),

        H('1. Alcance de productos y servicios'),
        ...(cfg.alcance ? bullets(cfg.alcance) : [P('—')]),

        H('2. Provisión de materiales'),
        P(`La propuesta contempla la provisión de ${nItems} ítems de materiales computados según los planos provistos.`),
        ...(bocas.length ? bocas.map(b => new Paragraph({
          children:[T(`${b.total} × ${b.nombre}`)], bullet:{level:0}, spacing:{after:70} })) : []),

        H('3. Productos y servicios no incluidos'),
        ...(cfg.exclusiones ? bullets(cfg.exclusiones) : [P('—')]),

        H('4. Condiciones comerciales'),
        H('4.1 Precio', HeadingLevel.HEADING_2),
        P([T('El precio por la provisión de materiales y mano de obra asciende a la suma de '),
           T(money(redondeado) + ' + IVA', {bold:true}),
           T(` (${enLetras}).`)]),
        filaTotal,
        new Paragraph({ children:[T('')], spacing:{after:130} }),
        ...bullets([
          'Los valores expresados no incluyen IVA y están expresados en pesos.',
          'Las certificaciones serán ajustadas por IPC de forma trimestral, tomando como mes base el del presente presupuesto.',
        ].join('\n')),

        H('4.2 Plan de certificaciones', HeadingLevel.HEADING_2),
        P(`Anticipo financiero desacopiable del ${cfg.anticipoPct}% pagadero mediante transferencia bancaria, con el objeto de congelar el precio de los materiales.`),
        P('Certificaciones parciales quincenales contra avance de obra.'),

        H('4.3 Validez de la oferta', HeadingLevel.HEADING_2),
        P(`La validez de la presente oferta es de ${cfg.validezDias} días.`),

        H('4.4 Plazo y lugar de entrega', HeadingLevel.HEADING_2),
        P('Plazo a coordinar con la dirección de obra.'),
        P(cfg.lugar ? `Los trabajos se ejecutarán en ${cfg.lugar}.` : '—'),

        ...(cfg.notas ? [H('5. Notas'), ...bullets(cfg.notas)] : []),
      ]}],
    });

    const blob = await Packer.toBlob(doc);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${ref.replace(/[^\w\-. ]/g, '')}.docx`;
    a.click(); URL.revokeObjectURL(a.href);
    toast('Propuesta descargada. Abrila en Word para ajustar lo que quieras.');
  };

  return (
    <>
      <Head eyebrow="Paso 09" title="Propuesta comercial"
            sub="Los datos de la obra y el precio ya salen del cómputo. Completá el alcance y descargá el Word.">
        <button className="btn-primary" onClick={descargarWord} disabled={!c.ventaSinIVA}>Descargar Word</button>
      </Head>

      {/* resumen de alto impacto */}
      <div className="card" style={{ padding:'34px 32px', marginBottom:18,
        background:'linear-gradient(155deg, rgba(164,198,57,.13), rgba(164,198,57,.02) 55%), var(--surface)',
        borderColor:'var(--lime-dim)' }}>
        <div className="eyebrow">{proyecto?.cliente || cfg.cliente || 'Cliente'} · {hoy()}</div>
        <h1 style={{ margin:'8px 0 4px', fontSize:30 }}>{proyecto?.nombre}</h1>
        <p className="dim" style={{ margin:0, fontSize:14 }}>{cfg.obra || 'Instalación eléctrica de baja tensión'}</p>

        <div style={{ margin:'26px 0 8px' }}>
          <div className="eyebrow">Precio total sin IVA</div>
          <div className="num" style={{ fontSize:44, color:'var(--lime)', letterSpacing:'-.04em', lineHeight:1.1 }}>
            {money(redondeado)}
          </div>
          <div className="dim" style={{ fontSize:12.5, marginTop:6 }}>{enLetras}</div>
        </div>

        <hr className="hr" />
        <div className="grid4">
          <div><div className="eyebrow">Materiales</div><div className="num" style={{ fontSize:15 }}>{money(mat)}</div></div>
          <div><div className="eyebrow">Mano de obra</div><div className="num" style={{ fontSize:15 }}>{money(mo)}</div></div>
          <div><div className="eyebrow">Bocas</div><div className="num" style={{ fontSize:15 }}>{bocas.reduce((s,b)=>s+b.total,0)}</div></div>
          <div><div className="eyebrow">Ítems computados</div><div className="num" style={{ fontSize:15 }}>{nItems}</div></div>
        </div>
      </div>

      <div className="grid2" style={{ marginBottom:16 }}>
        <Kpi label={`Anticipo ${cfg.anticipoPct}%`} value={money(redondeado * cfg.anticipoPct / 100)} />
        <Kpi label="Total con IVA" value={money(redondeado * (1 + cfg.pctIVA / 100))} hi />
      </div>

      <div className="card pad">
        <div className="eyebrow" style={{ marginBottom:14 }}>Datos de la propuesta</div>
        <div className="grid2" style={{ marginBottom:14 }}>
          <label className="f"><span>Cliente</span>
            <input value={cfg.cliente} placeholder={proyecto?.cliente || 'AESA'} onChange={e => set('cliente', e.target.value)} /></label>
          <label className="f"><span>Atención</span>
            <input value={cfg.atencion} placeholder="Nombre del contacto" onChange={e => set('atencion', e.target.value)} /></label>
          <label className="f"><span>Trabajo</span>
            <input value={cfg.obra} placeholder="Instalación eléctrica BT / Climatización" onChange={e => set('obra', e.target.value)} /></label>
          <label className="f"><span>Lugar</span>
            <input value={cfg.lugar} placeholder="Las Compuertas, Luján de Cuyo" onChange={e => set('lugar', e.target.value)} /></label>
          <label className="f"><span>Referencia</span>
            <input value={cfg.referencia} placeholder={ref} onChange={e => set('referencia', e.target.value)} /></label>
          <div className="grid2">
            <label className="f"><span>Validez (días)</span>
              <input type="number" className="num" value={cfg.validezDias}
                onChange={e => set('validezDias', parseFloat(e.target.value) || 0)} /></label>
            <label className="f"><span>Anticipo %</span>
              <input type="number" className="num" value={cfg.anticipoPct}
                onChange={e => set('anticipoPct', parseFloat(e.target.value) || 0)} /></label>
          </div>
        </div>
        <div className="stack">
          <Area cfg={cfg} set={set} label="Alcance — una línea por ítem" k="alcance"
                ph={'Materiales computados según planos provistos\nProvisión de tableros eléctricos completos\nPruebas y mediciones correspondientes\nMano de obra instalación eléctrica'} />
          <Area cfg={cfg} set={set} label="No incluido — una línea por ítem" k="exclusiones"
                ph={'Obra civil de ningún tipo ni materiales asociados\nArtefactos de iluminación y sus accesorios\nAforos ni tasas municipales'} />
          <Area cfg={cfg} set={set} label="Notas" k="notas" rows={3} ph="Aclaraciones que quieras dejar asentadas." />
        </div>
      </div>
      {toastNode}
    </>
  );
}
