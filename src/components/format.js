const U = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte'];
const D = ['','','veinti','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
const C = ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];

function hasta999(n) {
  if (n === 0) return '';
  if (n === 100) return 'cien';
  let s = '';
  const c = Math.floor(n / 100), r = n % 100;
  if (c) s += C[c];
  if (r) {
    if (s) s += ' ';
    if (r <= 20) s += U[r];
    else {
      const d = Math.floor(r / 10), u = r % 10;
      s += d === 2 ? 'veinti' + U[u] : D[d] + (u ? ' y ' + U[u] : '');
    }
  }
  return s;
}

/** 190315000 → "ciento noventa millones trescientos quince mil" */
export function numeroALetras(n) {
  n = Math.floor(Math.abs(Number(n) || 0));
  if (n === 0) return 'cero';
  const partes = [];
  const millones = Math.floor(n / 1e6);
  const miles = Math.floor((n % 1e6) / 1000);
  const resto = n % 1000;
  if (millones) partes.push(millones === 1 ? 'un millón' : hasta999(millones) + ' millones');
  if (miles) partes.push(miles === 1 ? 'mil' : hasta999(miles) + ' mil');
  if (resto) partes.push(hasta999(resto));
  return partes.join(' ').replace(/\s+/g, ' ').trim();
}

export const capitalizar = s => s ? s[0].toUpperCase() + s.slice(1) : s;
