/** Normaliza un nombre de material para poder compararlo. */
export const norm = s => String(s || '')
  .toUpperCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // acentos
  .replace(/[^A-Z0-9]+/g, ' ')
  .trim();

const tokens = s => norm(s).split(' ').filter(t => t.length > 1);

/** Puntaje 0..1 entre dos nombres, por coincidencia de palabras. */
export function score(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.length || !B.length) return 0;
  const setB = new Set(B);
  const comunes = A.filter(t => setB.has(t)).length;
  return (2 * comunes) / (A.length + B.length);
}

/**
 * Busca el mejor candidato para `nombre` dentro de `items` ({nombre, codigo, precio}).
 * Devuelve {item, score, via} o null.
 */
export function mejorMatch(nombre, items, minimo = 0.62) {
  const n = norm(nombre);
  let exacto = items.find(i => norm(i.nombre) === n);
  if (exacto) return { item: exacto, score: 1, via: 'exacto' };

  let mejor = null;
  for (const i of items) {
    const s = score(nombre, i.nombre);
    if (!mejor || s > mejor.score) mejor = { item: i, score: s, via: 'aproximado' };
  }
  return mejor && mejor.score >= minimo ? mejor : null;
}
