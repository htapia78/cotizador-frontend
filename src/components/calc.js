import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/** Reconstruye las líneas de texto de un PDF usando las coordenadas reales (transform). */
export async function lineasDePdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const lineas = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const { items } = await page.getTextContent();
    const filas = new Map();
    for (const it of items) {
      if (!it.str || !it.str.trim()) continue;
      const x = it.transform[4], y = Math.round(it.transform[5]);   // ← acá estaba el error
      let clave = y;
      for (const k of filas.keys()) if (Math.abs(k - y) <= 2) { clave = k; break; }
      if (!filas.has(clave)) filas.set(clave, []);
      filas.get(clave).push({ x, s: it.str });
    }
    [...filas.entries()]
      .sort((a, b) => b[0] - a[0])
      .forEach(([, celdas]) => {
        const txt = celdas.sort((a, b) => a.x - b.x).map(c => c.s).join(' ')
          .replace(/\s+/g, ' ').trim();
        if (txt) lineas.push(txt);
      });
  }
  return lineas;
}

const aNumero = s => {
  const t = String(s).replace(/\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
};

/**
 * Extrae ítems de un presupuesto de proveedor.
 * Formato Materiales Belgrano: CODIGO DESCRIPCION CANT BONIF% $P.SIN.IVA $P.TOTAL
 * Devuelve [{codigo, nombre, cantidad, precio}]
 */
export function itemsDePresupuesto(lineas) {
  const out = [];
  const re = /^(\d{3,7})\s+(.+?)\s+([\d.,]+)\s+([\d.,]+)\s*%?\s+\$?\s*([\d.,]+)\s+\$?\s*([\d.,]+)\s*$/;
  for (const l of lineas) {
    const m = l.match(re);
    if (!m) continue;
    const nombre = m[2].trim();
    const precio = aNumero(m[5]);
    const cantidad = aNumero(m[3]);
    if (!nombre || nombre.length < 4 || !precio || precio <= 0) continue;
    if (/^[\d\s.,$%]+$/.test(nombre)) continue;
    out.push({ codigo: m[1], nombre, cantidad: cantidad || 0, precio });
  }
  return out;
}
