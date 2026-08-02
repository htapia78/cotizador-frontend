import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { K, get, set } from './store';
import { computoValorizado } from './calc';
import { lineasDePdf, itemsDePresupuesto } from './parsePdf';
import { mejorMatch } from './match';
import { money, qty } from './format';
import { Head, Empty, Kpi, useToast } from './ui';

export default function Precios({ proyectoId, onCambio }) {
  const key = K.precios(proyectoId);
  const [precios, setPrecios] = useState(() => get(key, {}));
  const [cargando, setCargando] = useState(false);
  const [soloSin, setSoloSin] = useState(false);
  const [toast, toastNode] = useToast();

  const items = useMemo(() => computoValorizado(proyectoId).map(m =>
    ({ ...m, precio: Number(precios[m.nombre]) || 0, subtotal: m.cantidad * (Number(precios[m.nombre]) || 0) })
  ), [proyectoId, precios]);

  const total = items.reduce((s, m) => s + m.subtotal, 0);
  const sinPrecio = items.filter(m => !m.precio).length;
  const visibles = soloSin ? items.filter(m => !m.precio) : items;

  const guardar = p => { setPrecios(p); set(key, p); onCambio?.(); };
  const editar = (nombre, v) => guardar({ ...precios, [nombre]: parseFloat(String(v).replace(',', '.')) || 0 });

  const aplicar = (encontrados, origen) => {
    const p = { ...precios };
    let ok = 0, aprox = 0;
    const faltan = [];
    items.forEach(m => {
      const r = mejorMatch(m.nombre, encontrados);
      if (!r) { faltan.push(m.nombre); return; }
      p[m.nombre] = r.item.precio;
      r.via === 'exacto' ? ok++ : aprox++;
    });
    guardar(p);
    const msg = `${origen}: ${encontrados.length} ítems leídos.\n` +
      `${ok} precios exactos${aprox ? ` · ${aprox} por aproximación` : ''}` +
      `${faltan.length ? `\n${faltan.length} sin precio en el archivo` : ''}`;
    toast(msg, ok + aprox === 0);
    if (faltan.length) console.log('Sin precio en el archivo:', faltan);
  };

  const importarPdf = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    setCargando(true);
    try {
      const encontrados = itemsDePresupuesto(await lineasDePdf(await f.arrayBuffer()));
      if (!encontrados.length) toast('No reconocimos ninguna fila de producto en ese PDF.', true);
      else aplicar(encontrados, 'PDF');
    } catch (err) { console.error(err); toast('No pudimos leer el PDF.', true); }
    setCargando(false); e.target.value = '';
  };

  const importarExcel = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    setCargando(true);
    try {
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
      const filas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      const col = (o, ...alt) => {
        const k = Object.keys(o).find(k => alt.some(a =>
          k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(a)));
        return k ? o[k] : '';
      };
      const encontrados = filas.map(r => {
        const nombre = String(col(r, 'descrip', 'material', 'detalle', 'producto')).trim();
        const raw = String(col(r, 'sin iva', 'p. unit', 'precio unit', 'precio', 'unitario'));
        const precio = parseFloat(raw.replace(/[$\s]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.'));
        return { codigo: String(col(r, 'codigo', 'cod')), nombre, precio };
      }).filter(x => x.nombre && x.precio > 0);
      if (!encontrados.length) toast('No encontramos columnas de descripción y precio en esa planilla.', true);
      else aplicar(encontrados, 'Excel');
    } catch (err) { console.error(err); toast('No pudimos leer la planilla.', true); }
    setCargando(false); e.target.value = '';
  };

  const pedido = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Código', 'Material', 'Cantidad', 'Unidad', 'P. unitario s/IVA', 'Subtotal'],
      ...items.map(m => ['', m.nombre, m.cantidad, m.unidad, m.precio || '', m.precio ? m.subtotal : '']),
    ]);
    ws['!cols'] = [{ wch: 10 }, { wch: 52 }, { wch: 11 }, { wch: 8 }, { wch: 18 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Pedido');
    XLSX.writeFile(wb, 'Pedido_de_cotizacion.xlsx');
  };

  if (!items.length) return (
    <>
      <Head eyebrow="Paso 06" title="Precios de materiales" />
      <div className="card"><Empty title="Sin materiales computados">
        Cargá bocas, recetas o materiales sueltos y volvé acá a ponerles precio.
      </Empty></div>
    </>
  );

  return (
    <>
      <Head eyebrow="Paso 06" title="Precios de materiales"
            sub="Cargá el presupuesto del proveedor y los precios se completan solos. Todo sin IVA.">
        <button className="btn btn-sm" onClick={pedido}>Pedido de cotización</button>
        <label className="btn file-btn btn-sm">{cargando ? 'Leyendo…' : 'Cargar Excel'}
          <input type="file" accept=".xlsx,.xls,.csv" disabled={cargando} onChange={importarExcel} /></label>
        <label className="btn-primary file-btn btn-sm">{cargando ? 'Leyendo…' : 'Cargar PDF'}
          <input type="file" accept=".pdf" disabled={cargando} onChange={importarPdf} /></label>
      </Head>

      <div className="grid3" style={{ marginBottom: 16 }}>
        <Kpi label="Total materiales s/IVA" value={money(total)} hi />
        <Kpi label="Ítems con precio" value={`${items.length - sinPrecio} / ${items.length}`} />
        <Kpi label="Sin precio" value={sinPrecio} />
      </div>

      {sinPrecio > 0 && (
        <button className="btn btn-sm" style={{ marginBottom: 12 }} onClick={() => setSoloSin(!soloSin)}>
          {soloSin ? 'Ver todos los materiales' : `Ver sólo los ${sinPrecio} sin precio`}
        </button>
      )}

      <div className="card pad">
        <table>
          <thead><tr>
            <th>Material</th><th className="r">Cantidad</th><th className="r">Un.</th>
            <th className="r" style={{ width: 130 }}>P. unitario</th><th className="r" style={{ width: 130 }}>Subtotal</th>
          </tr></thead>
          <tbody>
            {visibles.map(m => (
              <tr key={m.nombre}>
                <td>{m.nombre}</td>
                <td className="r num">{qty(m.cantidad)}</td>
                <td className="r faint">{m.unidad}</td>
                <td className="r">
                  <input type="number" step="0.01" className="num" value={precios[m.nombre] || ''}
                         placeholder="0,00" onChange={e => editar(m.nombre, e.target.value)} />
                </td>
                <td className="r num" style={{ color: m.subtotal ? 'var(--lime)' : 'var(--text-faint)' }}>
                  {m.subtotal ? money(m.subtotal) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toastNode}
    </>
  );
}
