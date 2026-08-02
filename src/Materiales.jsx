import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { K, get, set } from './store';
import { buscar, UNIDADES } from './catalogo';
import { Head, Autocomplete, useToast, Empty } from './ui';

export default function Materiales({ proyectoId, onCambio }) {
  const key = K.extras(proyectoId);
  const [lista, setLista] = useState(() => get(key, []));
  const [busq, setBusq] = useState('');
  const [cant, setCant] = useState('');
  const [uni, setUni] = useState('un');
  const [toast, toastNode] = useToast();

  const guardar = l => { setLista(l); set(key, l); onCambio?.(); };

  const agregar = e => {
    e.preventDefault();
    const n = busq.trim(); const c = parseFloat(cant);
    if (!n || !c) return;
    guardar([...lista, { id: Date.now(), nombre: n, cantidad: c, unidad: uni }]);
    setBusq(''); setCant(''); setUni('un');
  };
  const editar = (id, campo, v) =>
    guardar(lista.map(m => m.id === id ? { ...m, [campo]: campo === 'cantidad' ? (parseFloat(v) || 0) : v } : m));

  const importar = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
      const filas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, blankrows: false });
      const nuevos = [];
      filas.slice(1).forEach((r, i) => {
        const nombre = String(r?.[0] ?? '').trim();
        const c = parseFloat(String(r?.[1] ?? '').replace(',', '.'));
        if (nombre && c) nuevos.push({ id: Date.now() + i, nombre, cantidad: c, unidad: String(r?.[2] ?? 'un').trim() || 'un' });
      });
      if (!nuevos.length) return toast('No encontramos filas con Material y Cantidad. Usá esas dos columnas, con encabezado en la fila 1.', true);
      guardar([...lista, ...nuevos]);
      toast(`Se agregaron ${nuevos.length} materiales.`);
    } catch { toast('No pudimos leer el archivo.', true); }
    e.target.value = '';
  };

  return (
    <>
      <Head eyebrow="Paso 04" title="Materiales sueltos"
            sub="Todo lo que no sale de una boca: tableros, alimentadores, jabalinas, cables subterráneos.">
        <label className="btn file-btn btn-sm">Importar Excel
          <input type="file" accept=".xlsx,.xls,.csv" onChange={importar} /></label>
      </Head>

      <form onSubmit={agregar} className="card pad" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px auto', gap: 9, alignItems: 'end' }}>
          <Autocomplete value={busq} onChange={setBusq} buscar={buscar}
            placeholder="Buscá en el catálogo o escribí un material nuevo"
            onPick={m => { setBusq(m.nombre); setUni(m.unidad); }} />
          <input type="number" step="0.01" className="num" value={cant}
                 onChange={e => setCant(e.target.value)} placeholder="Cantidad" />
          <select value={uni} onChange={e => setUni(e.target.value)}>
            {UNIDADES.map(u => <option key={u}>{u}</option>)}
          </select>
          <button className="btn-primary">Agregar</button>
        </div>
        <p className="faint" style={{ fontSize: 11.5, margin: '11px 0 0' }}>
          El Excel se lee con tres columnas: Material · Cantidad · Unidad (encabezado en la primera fila).
        </p>
      </form>

      <div className="card pad">
        {lista.length === 0 ? (
          <Empty title="Sin materiales sueltos">Agregalos de a uno o importá una planilla.</Empty>
        ) : (
          <>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{lista.length} ítems</div>
            <table>
              <thead><tr><th>Material</th><th className="r" style={{ width: 110 }}>Cantidad</th>
                <th className="r" style={{ width: 90 }}>Unidad</th><th style={{ width: 80 }}></th></tr></thead>
              <tbody>
                {lista.map(m => (
                  <tr key={m.id}>
                    <td><input value={m.nombre} onChange={e => editar(m.id, 'nombre', e.target.value)} /></td>
                    <td className="r"><input type="number" step="0.01" className="num" value={m.cantidad}
                          onChange={e => editar(m.id, 'cantidad', e.target.value)} /></td>
                    <td><select value={m.unidad} onChange={e => editar(m.id, 'unidad', e.target.value)}>
                          {UNIDADES.map(u => <option key={u}>{u}</option>)}</select></td>
                    <td className="r"><button className="btn-danger"
                          onClick={() => guardar(lista.filter(x => x.id !== m.id))}>Quitar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {toastNode}
    </>
  );
}
