import React, { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { computo, bocasPorTipo } from './calc';
import { qty } from './format';
import { Head, Empty, Kpi } from './ui';

export default function Computo({ proyectoId, proyecto }) {
  const items = useMemo(() => computo(proyectoId), [proyectoId]);
  const bocas = useMemo(() => bocasPorTipo(proyectoId).filter(b => b.total), [proyectoId]);
  const totalBocas = bocas.reduce((s, b) => s + b.total, 0);

  const excel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Material', 'Cantidad', 'Unidad', 'De recetas', 'Sueltos'],
      ...items.map(m => [m.nombre, m.cantidad, m.unidad, m.deRecetas, m.deExtras]),
    ]);
    ws['!cols'] = [{ wch: 52 }, { wch: 12 }, { wch: 9 }, { wch: 12 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Cómputo');
    XLSX.writeFile(wb, `Computo_${proyecto?.nombre || 'obra'}.xlsx`);
  };

  const pdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(15); doc.text('Cómputo de materiales', 14, 16);
    doc.setFontSize(9); doc.setTextColor(110);
    doc.text(`${proyecto?.nombre || ''}${proyecto?.cliente ? ' · ' + proyecto.cliente : ''}`, 14, 22);
    doc.text(new Date().toLocaleDateString('es-AR'), 14, 27);
    autoTable(doc, {
      head: [['Material', 'Cantidad', 'Un.']],
      body: items.map(m => [m.nombre, qty(m.cantidad), m.unidad]),
      startY: 33, styles: { fontSize: 8, cellPadding: 2.2 },
      headStyles: { fillColor: [164, 198, 57], textColor: 20 },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'center' } },
    });
    doc.save(`Computo_${proyecto?.nombre || 'obra'}.pdf`);
  };

  if (!items.length) return (
    <>
      <Head eyebrow="Paso 05" title="Cómputo de materiales" />
      <div className="card"><Empty title="Todavía no hay nada que computar">
        El cómputo se arma solo: conteo de bocas × recetas, más los materiales sueltos.
      </Empty></div>
    </>
  );

  return (
    <>
      <Head eyebrow="Paso 05" title="Cómputo de materiales"
            sub="Bocas × recetas, más los materiales sueltos. Se recalcula solo.">
        <button className="btn btn-sm" onClick={excel}>Excel</button>
        <button className="btn btn-sm" onClick={pdf}>PDF</button>
      </Head>

      <div className="grid3" style={{ marginBottom: 16 }}>
        <Kpi label="Materiales distintos" value={items.length} hi />
        <Kpi label="Bocas computadas" value={totalBocas} />
        <Kpi label="Tipos con conteo" value={bocas.length} />
      </div>

      <div className="card pad">
        <table>
          <thead><tr>
            <th>Material</th><th className="r">De recetas</th><th className="r">Sueltos</th>
            <th className="r">Total</th><th className="r">Un.</th>
          </tr></thead>
          <tbody>
            {items.map(m => (
              <tr key={m.nombre}>
                <td>{m.nombre}</td>
                <td className="r num faint">{m.deRecetas ? qty(m.deRecetas) : '—'}</td>
                <td className="r num faint">{m.deExtras ? qty(m.deExtras) : '—'}</td>
                <td className="r num" style={{ color: 'var(--lime)' }}>{qty(m.cantidad)}</td>
                <td className="r faint">{m.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
