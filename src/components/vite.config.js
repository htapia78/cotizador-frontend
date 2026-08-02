const nf = new Intl.NumberFormat('es-AR', { minimumFractionDigits:2, maximumFractionDigits:2 });
const nf0 = new Intl.NumberFormat('es-AR', { maximumFractionDigits:0 });
export const money = v => '$ ' + nf.format(Number(v) || 0);
export const money0 = v => '$ ' + nf0.format(Number(v) || 0);
export const qty = v => nf.format(Number(v) || 0).replace(/,00$/, '');
export const compact = v => {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 1e9) return '$' + (n/1e9).toFixed(1).replace('.', ',') + 'MM';
  if (Math.abs(n) >= 1e6) return '$' + (n/1e6).toFixed(1).replace('.', ',') + 'M';
  if (Math.abs(n) >= 1e3) return '$' + Math.round(n/1e3) + 'k';
  return '$' + Math.round(n);
};
export const hoy = () => new Date().toLocaleDateString('es-AR');
