import React, { useState, useCallback, useEffect, useRef } from 'react';

export function useToast() {
  const [t, setT] = useState(null);
  const ref = useRef();
  const show = useCallback((msg, err = false) => {
    setT({ msg, err });
    clearTimeout(ref.current);
    ref.current = setTimeout(() => setT(null), 4200);
  }, []);
  useEffect(() => () => clearTimeout(ref.current), []);
  const node = t ? <div className={'toast' + (t.err ? ' err' : '')}>{t.msg}</div> : null;
  return [show, node];
}

export const Head = ({ eyebrow, title, sub, children }) => (
  <div className="page-head between">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 style={{ marginTop: 4 }}>{title}</h2>
      {sub && <p className="dim" style={{ margin: '5px 0 0', fontSize: 13 }}>{sub}</p>}
    </div>
    {children && <div className="row" style={{ flexShrink: 0 }}>{children}</div>}
  </div>
);

export const Empty = ({ title, children }) => (
  <div className="empty"><h3>{title}</h3><p style={{ margin: 0, fontSize: 13 }}>{children}</p></div>
);

export const Field = ({ label, hint, ...p }) => (
  <label className="f">
    <span>{label}{hint && <em className="faint" style={{ fontStyle: 'normal', fontWeight: 400 }}> · {hint}</em>}</span>
    <input {...p} />
  </label>
);

export const Kpi = ({ label, value, hi }) => (
  <div className={'kpi' + (hi ? ' hi' : '')}>
    <span className="eyebrow">{label}</span>
    <b>{value}</b>
  </div>
);

/** Buscador con autocompletado sobre el catálogo. */
export function Autocomplete({ value, onChange, onPick, buscar, placeholder }) {
  const [open, setOpen] = useState(false);
  const box = useRef();
  useEffect(() => {
    const h = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const items = open ? buscar(value) : [];
  return (
    <div style={{ position: 'relative' }} ref={box}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {items.length > 0 && (
        <div className="sug">
          {items.map(m => (
            <button key={m.codigo} type="button" onClick={() => { onPick(m); setOpen(false); }}>
              {m.nombre}<span className="faint num" style={{ marginLeft: 8, fontSize: 11 }}>{m.codigo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
