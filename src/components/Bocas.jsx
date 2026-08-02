import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [empresa, setEmpresa] = useState(localStorage.getItem('apx.empresa') || 'APEXCORE S.A.S.');
  const [cuit, setCuit] = useState(localStorage.getItem('apx.cuit') || '30-71899092-7');
  const [dir, setDir] = useState(localStorage.getItem('apx.dir') || 'Joaquín V. González 855, Godoy Cruz, Mendoza');
  const nav = useNavigate();

  const entrar = e => {
    e.preventDefault();
    if (!empresa.trim()) return;
    localStorage.setItem('apx.empresa', empresa.trim());
    localStorage.setItem('apx.cuit', cuit.trim());
    localStorage.setItem('apx.dir', dir.trim());
    nav('/proyectos');
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ marginBottom: 26 }}>
          <div className="row" style={{ gap: 9, marginBottom: 14 }}>
            <span style={{ width: 9, height: 26, background: 'var(--lime)', borderRadius: 2, display: 'inline-block' }} />
            <span className="eyebrow" style={{ letterSpacing: '.2em' }}>APEXCORE</span>
          </div>
          <h1>Cotizador de obras eléctricas</h1>
          <p className="dim" style={{ margin: '8px 0 0', fontSize: 13.5 }}>
            Del cómputo de bocas al precio de venta. Los datos se guardan en este navegador.
          </p>
        </div>

        <form onSubmit={entrar} className="card pad stack">
          <label className="f"><span>Empresa</span>
            <input value={empresa} onChange={e => setEmpresa(e.target.value)} autoFocus /></label>
          <label className="f"><span>CUIT</span>
            <input className="num" value={cuit} onChange={e => setCuit(e.target.value)} style={{ textAlign: 'left' }} /></label>
          <label className="f"><span>Domicilio</span>
            <input value={dir} onChange={e => setDir(e.target.value)} /></label>
          <button className="btn-primary" style={{ marginTop: 4 }}>Entrar</button>
        </form>

        <p className="faint" style={{ fontSize: 11.5, marginTop: 16, lineHeight: 1.6 }}>
          Estos datos encabezan los presupuestos y propuestas que generes.
        </p>
      </div>
    </div>
  );
}
