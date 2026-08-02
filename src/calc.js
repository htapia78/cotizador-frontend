/* Única fuente de verdad de los cálculos.
   Cómputo, Precios, Mano de Obra y Venta leen todos de acá,
   así no puede haber dos números distintos para lo mismo. */
import { K, get, getTipos } from './store';

/** Cómputo consolidado: bocas × recetas + materiales sueltos. */
export function computo(id) {
  const conteos = get(K.bocas(id), {});
  const recetas = get(K.recetas(id), {});
  const extras  = get(K.extras(id), []);
  const acc = {};

  const push = (nombre, cant, unidad, origen) => {
    if (!nombre) return;
    const k = nombre.trim().toUpperCase();
    if (!acc[k]) acc[k] = { nombre:nombre.trim(), cantidad:0, unidad:unidad || 'un', deRecetas:0, deExtras:0 };
    acc[k].cantidad += cant;
    acc[k][origen] += cant;
  };

  Object.entries(conteos).forEach(([clave, cantidad]) => {
    const n = Number(cantidad) || 0;
    if (!n) return;
    const tipoId = clave.split('-')[1];
    const receta = recetas[tipoId] || recetas[Number(tipoId)] || [];
    receta.forEach(m => push(m.nombre, n * (Number(m.cantidad) || 0), m.unidad, 'deRecetas'));
  });

  extras.forEach(m => push(m.nombre, Number(m.cantidad) || 0, m.unidad, 'deExtras'));

  return Object.values(acc)
    .filter(m => m.cantidad > 0)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

/** Cómputo + precio unitario + subtotal. */
export function computoValorizado(id) {
  const precios = get(K.precios(id), {});
  return computo(id).map(m => {
    const precio = Number(precios[m.nombre]) || 0;
    return { ...m, precio, subtotal: m.cantidad * precio };
  });
}

export const totalMateriales = id =>
  computoValorizado(id).reduce((s, m) => s + m.subtotal, 0);

/** Total de bocas por tipo, para el resumen y la propuesta. */
export function bocasPorTipo(id) {
  const conteos = get(K.bocas(id), {});
  const tipos = getTipos(id);
  return tipos.map(t => ({
    ...t,
    total: Object.entries(conteos)
      .filter(([k]) => k.split('-')[1] === String(t.id))
      .reduce((s, [, v]) => s + (Number(v) || 0), 0),
  }));
}

/* ---------- mano de obra ---------- */
/** Cada línea: categoría, valorHora, horasDia, diasMes, meses, dotación. */
export function lineaMO(l) {
  const base = (Number(l.valorHora)||0) * (Number(l.horasDia)||0) * (Number(l.diasMes)||0)
             * (Number(l.meses)||0) * (Number(l.dotacion)||0);
  const noRem = (Number(l.noRemunerativo)||0) * (Number(l.meses)||0) * (Number(l.dotacion)||0);
  const cargas = base * ((Number(l.pctCargas)||0) / 100);
  return { base, noRem, cargas, total: base + noRem + cargas };
}
export const totalManoObra = id =>
  get(K.mo(id), []).reduce((s, l) => s + lineaMO(l).total, 0);

/* ---------- cascada de costos ---------- */
export function cascada(materiales, manoObra, c) {
  const baseEstr = c.baseEstructura === 'mat_mo' ? materiales + manoObra
                 : c.baseEstructura === 'mat'    ? materiales
                 : manoObra;
  const estructura  = baseEstr * (c.pctEstructura / 100);
  const costoNeto   = materiales + manoObra + estructura;
  const imprevistos = costoNeto * (c.pctImprevistos / 100);
  const beneficio   = costoNeto * (c.pctBeneficio / 100);
  const totalNeto   = costoNeto + imprevistos + beneficio;
  const iibb        = totalNeto * (c.pctIIBB / 100);
  const bancarios   = totalNeto * (c.pctBancarios / 100);
  // tres líneas libres sobre el total neto: una resta, dos suman
  const linea = (tipo, valor) => tipo === 'pct' ? totalNeto * ((Number(valor)||0) / 100) : (Number(valor)||0);
  const descuento = linea(c.descTipo, c.descValor);
  const og1       = linea(c.og1Tipo,  c.og1Valor);
  const og2       = linea(c.og2Tipo,  c.og2Valor);
  const ventaSinIVA = totalNeto + iibb + bancarios - descuento + og1 + og2;
  const iva         = ventaSinIVA * (c.pctIVA / 100);
  return {
    materiales, manoObra, baseEstr, estructura, costoNeto,
    imprevistos, beneficio, totalNeto, iibb, bancarios, descuento, og1, og2,
    ventaSinIVA, iva, ventaConIVA: ventaSinIVA + iva,
    margenSobreCosto: costoNeto ? (ventaSinIVA - costoNeto) / costoNeto * 100 : 0,
  };
}

export const resumen = id => {
  const c = get(K.config(id), {});
  const cfg = { baseEstructura:'mo', pctEstructura:13, pctImprevistos:7, pctBeneficio:45,
                pctIIBB:2, pctBancarios:1.8, pctIVA:21,
                descTipo:'pct', descValor:0, og1Tipo:'monto', og1Valor:0,
                og2Tipo:'monto', og2Valor:0, ...c };
  return cascada(totalMateriales(id), totalManoObra(id), cfg);
};
