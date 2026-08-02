/* Capa de datos. Todo vive en localStorage del navegador.
   Las claves por proyecto se mantienen compatibles con la versión anterior
   para no perder los datos ya cargados del Hotel. */

const J = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const S = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error('localStorage lleno', e); } };

export const K = {
  zonas:      id => `zonas-${id}`,
  bocas:      id => `bocas-${id}`,
  tipos:      id => `tipos-boca-${id}`,
  recetas:    id => `recetas-${id}`,
  extras:     id => `materiales-sin-receta-${id}`,
  precios:    id => `precios-${id}`,
  mo:         id => `mano-de-obra-${id}`,
  config:     id => `config-${id}`,
};

export const get = J;
export const set = S;

/* ---------- proyectos ---------- */
const PKEY = 'apx.proyectos';

export const TIPOS_DEFAULT = [
  { id:1, nombre:'Boca de Luz' },
  { id:2, nombre:'Boca Aplique' },
  { id:3, nombre:'Boca Emergencia' },
  { id:4, nombre:'Tomacorriente 10A' },
  { id:5, nombre:'Tomacorriente AA' },
  { id:6, nombre:'Boca TV' },
  { id:7, nombre:'Boca Teléfono' },
  { id:8, nombre:'Acometida TV' },
];

export const CONFIG_DEFAULT = {
  cliente: '', atencion: '', obra: '', lugar: '', referencia: '',
  baseEstructura: 'mo',      // 'mo' | 'mat_mo' | 'mat'
  pctEstructura: 13,
  pctImprevistos: 7,
  pctBeneficio: 45,
  pctIIBB: 2,
  pctBancarios: 1.8,
  pctIVA: 21,
  validezDias: 15,
  anticipoPct: 50,
  alcance: '', exclusiones: '', notas: '',
};

export function listarProyectos() {
  let p = J(PKEY, null);
  if (p === null) {           // primera vez: rescatar datos existentes
    p = [];
    for (let i = 1; i <= 20; i++) {
      if (localStorage.getItem(K.zonas(i)) || localStorage.getItem(K.extras(i)) || localStorage.getItem(K.bocas(i))) {
        p.push({ id:i, nombre:`Proyecto ${i}`, cliente:'', creado:new Date().toISOString() });
      }
    }
    S(PKEY, p);
  }
  return p;
}
export function guardarProyectos(l) { S(PKEY, l); }
export function obtenerProyecto(id) {
  return listarProyectos().find(p => String(p.id) === String(id)) || null;
}
export function crearProyecto(nombre, cliente) {
  const l = listarProyectos();
  const id = l.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
  const p = { id, nombre, cliente, creado:new Date().toISOString() };
  guardarProyectos([...l, p]);
  return p;
}
export function actualizarProyecto(id, campos) {
  guardarProyectos(listarProyectos().map(p => String(p.id) === String(id) ? { ...p, ...campos } : p));
}
export function borrarProyecto(id) {
  guardarProyectos(listarProyectos().filter(p => String(p.id) !== String(id)));
  Object.values(K).forEach(f => localStorage.removeItem(f(id)));
}

/* ---------- config por proyecto ---------- */
export const getConfig = id => ({ ...CONFIG_DEFAULT, ...J(K.config(id), {}) });
export const setConfig = (id, c) => S(K.config(id), c);

/* ---------- tipos de boca (editables por proyecto) ---------- */
export const getTipos = id => J(K.tipos(id), TIPOS_DEFAULT);
export const setTipos = (id, t) => S(K.tipos(id), t);

/* ---------- respaldo ---------- */
export function exportarProyecto(id) {
  const p = obtenerProyecto(id);
  const data = { _formato:'apexcore-cotizador-v1', proyecto:p, datos:{} };
  Object.entries(K).forEach(([n, f]) => { const v = localStorage.getItem(f(id)); if (v) data.datos[n] = JSON.parse(v); });
  return data;
}
export function importarProyecto(data) {
  if (!data || data._formato !== 'apexcore-cotizador-v1') throw new Error('Formato de archivo no reconocido');
  const nuevo = crearProyecto(data.proyecto?.nombre || 'Proyecto importado', data.proyecto?.cliente || '');
  Object.entries(data.datos || {}).forEach(([n, v]) => { if (K[n]) S(K[n](nuevo.id), v); });
  return nuevo;
}
