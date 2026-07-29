import React, { useState, useEffect } from 'react';

const CATALOGO = [
  { codigo: '00978', nombre: 'CAJA OCTOGONAL GRANDE METALICA', unidad: 'un', precio: 610.0 },
  { codigo: '00976', nombre: 'CAJA OCTOGONAL CHICA METALICA', unidad: 'un', precio: 283.0 },
  { codigo: '00988', nombre: 'CAJA RECTANGULAR METALICA', unidad: 'un', precio: 283.0 },
  { codigo: '00918', nombre: 'CAJA CUADRADA 10X10 METALICA', unidad: 'un', precio: 758.0 },
  { codigo: '102116', nombre: 'CAJA ESTANCA PLASTICA 210X210X110 BLANCA IP65', unidad: 'un', precio: 7516.0 },
  { codigo: '102802', nombre: 'CAJA DE PASE 10X10X8', unidad: 'un', precio: 3340.0 },
  { codigo: '104516', nombre: 'CAÑO PVC SEMI PESADO 20MM KALOP', unidad: 'mts', precio: 1529.0 },
  { codigo: '104517', nombre: 'CAÑO PVC SEMI PESADO 25MM KALOP KL05003', unidad: 'mts', precio: 2158.0 },
  { codigo: '01175', nombre: 'CAÑO PVC RIGIDO EXTRAPESADO 40MM GENROD', unidad: 'mts', precio: 5106.0 },
  { codigo: '01535', nombre: 'CONECTOR PVC 20MM', unidad: 'un', precio: 128.0 },
  { codigo: '01537', nombre: 'CONECTOR PVC 25MM', unidad: 'un', precio: 274.0 },
  { codigo: '01539', nombre: 'CONECTOR PVC 40MM', unidad: 'un', precio: 794.0 },
  { codigo: '06088', nombre: 'UNION PVC 20MM', unidad: 'un', precio: 108.0 },
  { codigo: '06090', nombre: 'UNION PVC 25MM', unidad: 'un', precio: 167.0 },
  { codigo: '06092', nombre: 'UNION PVC 40MM', unidad: 'un', precio: 610.0 },
  { codigo: '01869', nombre: 'CURVA PVC 20MM', unidad: 'un', precio: 253.0 },
  { codigo: '01873', nombre: 'CURVA PVC 25MM', unidad: 'un', precio: 483.0 },
  { codigo: '01879', nombre: 'CURVA PVC 40MM', unidad: 'un', precio: 1563.0 },
  { codigo: '01174', nombre: 'CAÑO PVC RIGIDO EXTRAPESADO 32MM GENROD', unidad: 'mts', precio: 4183.0 },
  { codigo: '01876', nombre: 'CURVA PVC 32MM', unidad: 'un', precio: 919.0 },
  { codigo: '01538', nombre: 'CONECTOR PVC 32MM', unidad: 'un', precio: 630.0 },
  { codigo: '06091', nombre: 'UNION PVC 32MM', unidad: 'un', precio: 444.0 },
  { codigo: '04371', nombre: 'ROLLO CABLE 1.5MM ROJO KALOP', unidad: 'mts', precio: 44262.0 },
  { codigo: '04369', nombre: 'ROLLO CABLE 1.5MM MARRON KALOP', unidad: 'mts', precio: 44262.0 },
  { codigo: '04370', nombre: 'ROLLO CABLE 1.5MM NEGRO KALOP', unidad: 'mts', precio: 44262.0 },
  { codigo: '04368', nombre: 'ROLLO CABLE 1.5MM CELESTE KALOP', unidad: 'mts', precio: 44262.0 },
  { codigo: '04372', nombre: 'ROLLO CABLE 1.5MM V/A KALOP', unidad: 'mts', precio: 44262.0 },
  { codigo: '04383', nombre: 'ROLLO CABLE 2.5MM ROJO KALOP', unidad: 'mts', precio: 71343.0 },
  { codigo: '04381', nombre: 'ROLLO CABLE 2.5MM MARRON KALOP', unidad: 'mts', precio: 71343.0 },
  { codigo: '04382', nombre: 'ROLLO CABLE 2.5MM NEGRO KALOP', unidad: 'mts', precio: 71343.0 },
  { codigo: '04380', nombre: 'ROLLO CABLE 2.5MM CELESTE KALOP', unidad: 'mts', precio: 71343.0 },
  { codigo: '04384', nombre: 'ROLLO CABLE 2.5MM V/A KALOP', unidad: 'mts', precio: 71343.0 },
  { codigo: '00477', nombre: 'BASTIDOR 3 MODULOS UNICO KALOP', unidad: 'un', precio: 526.0 },
  { codigo: '04820', nombre: 'TAPA RECTANGULAR BLANCA CIVIL KALOP', unidad: 'un', precio: 505.0 },
  { codigo: '04866', nombre: 'TAPON CIEGO BLANCO KALOP', unidad: 'un', precio: 133.0 },
  { codigo: '02931', nombre: 'INTERRUPTOR UNIPOLAR BLANCO KALOP', unidad: 'un', precio: 1324.0 },
  { codigo: '05666', nombre: 'TOMA TV TERMINAL BLANCO KALOP', unidad: 'un', precio: 3484.0 },
  { codigo: '05649', nombre: 'TOMA TEL RJ11 BLANCO KALOP', unidad: 'un', precio: 1985.0 },
  { codigo: '02838', nombre: 'INTERRUPTOR COMBINACION BLANCO KALOP', unidad: 'un', precio: 2151.0 },
  { codigo: '00914', nombre: 'CAJA CAPSULADA PARA BASE 16A KL48880', unidad: 'un', precio: 3102.0 },
  { codigo: '04622', nombre: 'SOPORTE CON TOMA KD48251', unidad: 'un', precio: 1729.0 },
  { codigo: '104931', nombre: 'SEÑALIZADOR LED SALIDA MACROLED', unidad: 'un', precio: 23274.0 },
  { codigo: '02629', nombre: 'GABINETE ESTANCO DIN 96 M 600X750X100 FORLI 10096', unidad: 'un', precio: 232251.0 },
  { codigo: '106459', nombre: 'GABINETE ESTANCO DIN 36 M 300X450X150 FORLI 15036', unidad: 'un', precio: 143857.0 },
  { codigo: '103087', nombre: 'GABINETE ESTANCO DIN 60 M 450X450X100 FORLI 10060', unidad: 'un', precio: 139037.0 },
  { codigo: '02635', nombre: 'GABINETE ESTANCO DIN 80 M 450X750X100 FORLI 10080', unidad: 'un', precio: 190117.0 },
  { codigo: '103537', nombre: 'GABINETE CON DUCTO 750X900X225 160M FORLI DF759022', unidad: 'un', precio: 894902.0 },
  { codigo: '103868', nombre: 'TERMICA EASY9 2X10A 4.5KA SCHNEIDER', unidad: 'un', precio: 13915.0 },
  { codigo: '103909', nombre: 'TERMICA EASY9 2X16A 4.5KA SCHNEIDER', unidad: 'un', precio: 13915.0 },
  { codigo: '103879', nombre: 'TERMICA EASY9 4X40A 4.5KA SCHNEIDER', unidad: 'un', precio: 38235.0 },
  { codigo: '103931', nombre: 'TERMICA EASY9 4X20A 4.5KA SCHNEIDER', unidad: 'un', precio: 30474.0 },
  { codigo: '103878', nombre: 'TERMICA EASY9 4X25A 4.5KA SCHNEIDER', unidad: 'un', precio: 30474.0 },
  { codigo: '103869', nombre: 'TERMICA EASY9 4X32A 4.5KA SCHNEIDER', unidad: 'un', precio: 38235.0 },
  { codigo: '103881', nombre: 'TERMICA EASY9 4X63A 4.5KA SCHNEIDER', unidad: 'un', precio: 64273.0 },
  { codigo: '103883', nombre: 'DISYUNTOR DIFERENCIAL EASY9 2X40A 30MA SCHNEIDER', unidad: 'un', precio: 62352.0 },
  { codigo: '103884', nombre: 'DISYUNTOR DIFERENCIAL EASY9 4X25A 30MA SCHNEIDER', unidad: 'un', precio: 86468.0 },
  { codigo: '103885', nombre: 'DISYUNTOR DIFERENCIAL EASY9 4X40A 30MA SCHNEIDER', unidad: 'un', precio: 92326.0 },
  { codigo: '103870', nombre: 'TERMICA EASY9 1X10A 4.5KA SCHNEIDER', unidad: 'un', precio: 6856.0 },
  { codigo: '05000', nombre: 'TERMICA C120N 4X80A SCHNEIDER A9N18372', unidad: 'un', precio: 315198.0 },
  { codigo: '103880', nombre: 'TERMICA EASY9 4X50A 4.5KA SCHNEIDER', unidad: 'un', precio: 64273.0 },
  { codigo: '105055', nombre: 'CONTACTOR TRIPOLAR 32A 220VCA CHINT NXC-32 220', unidad: 'un', precio: 42777.0 },
  { codigo: '02961', nombre: 'JABALINA IRAM 3/4 1500MM ARGENJAB', unidad: 'un', precio: 21258.0 },
  { codigo: '03668', nombre: 'TOMACABLE NORMALIZADO T3 (3/4")', unidad: 'un', precio: 4724.0 },
  { codigo: '01004', nombre: 'CAMARA DE INSPECCION PVC 15X15', unidad: 'un', precio: 2272.0 },
  { codigo: '00512', nombre: 'BOLSA DE CARBONILLA 12 KG.', unidad: 'un', precio: 6000.0 },
  { codigo: '06949', nombre: 'CABLE SUBTERRANEO 3X2.5MM', unidad: 'mts', precio: 2760.0 },
  { codigo: '100791', nombre: 'CABLE SUBTERRANEO 2X6MM', unidad: 'mts', precio: 4249.0 },
  { codigo: '100204', nombre: 'CABLE SUBTERRANEO 4X6MM', unidad: 'mts', precio: 7713.0 },
  { codigo: '101226', nombre: 'CABLE SUBTERRANEO 4X10MM', unidad: 'mts', precio: 12344.0 },
  { codigo: '04398', nombre: 'ROLLO CABLE 6MM V/A KALOP', unidad: 'mts', precio: 169931.0 },
  { codigo: '00862', nombre: 'CABLE UNIPOLAR 10MM VERDE/AMARILLO', unidad: 'mts', precio: 2900.0 },
  { codigo: '104547', nombre: 'ADHESIVO PARA CAÑOS VALINCO 60 CC', unidad: 'un', precio: 1614.0 },
  { codigo: '00538', nombre: 'BORNERA DISTRIBUCION TETRAPOLAR 7 POLOS 125A ELENT', unidad: 'un', precio: 23063.0 },
  { codigo: '00539', nombre: 'BORNERA DISTRIBUCION TETRAPOLAR 12 POLOS 125A ELENT', unidad: 'un', precio: 29383.0 },
  { codigo: '102757', nombre: 'CABLE SUBTERRANEO 3X25+N', unidad: 'mts', precio: 27634.0 },
  { codigo: '00799', nombre: 'CABLE SUBTERRANEO 4X16MM', unidad: 'mts', precio: 19376.0 },
  { codigo: '100789', nombre: 'CABLE SUBTERRANEO 2X4MM', unidad: 'mts', precio: 2930.0 },
  { codigo: '103758', nombre: 'TIMER DIGITAL PARA RIEL DIN 8 PROGRAMAS 16A', unidad: 'un', precio: 18110.0 },
  { codigo: '104322', nombre: 'EXTRACTOR DE AIRE PARA BAÑO 4 BLANCO KUDU', unidad: 'un', precio: 17100.0 },
  { codigo: '102814', nombre: 'CARTUCHO FUSIBLE 10X38 2A', unidad: 'un', precio: 1701.0 },
  { codigo: '107002', nombre: 'MINI VOLTIMETRO + AMPERIMETRO DE PANEL ROJO', unidad: 'un', precio: 12258.0 },
  { codigo: '03892', nombre: 'PILOTO LUMINOSO PLASTICO 22MM 230V ROJO', unidad: 'un', precio: 3330.0 },
  { codigo: '04492', nombre: 'SECCIONADOR PORTAFUSIBLE UNIPOLAR 10X38', unidad: 'un', precio: 10449.0 },
];

const TIPOS_BOCA = [
  { id: 1, nombre: 'Boca de Luz' },
  { id: 2, nombre: 'Boca Aplique' },
  { id: 3, nombre: 'Boca Emergencia' },
  { id: 4, nombre: 'Tomacorriente 10A' },
  { id: 5, nombre: 'Tomacorriente AA' },
  { id: 6, nombre: 'Boca TV' },
  { id: 7, nombre: 'Boca Teléfono' },
  { id: 8, nombre: 'Acometida TV' },
];

export default function Recetas({ proyectoId }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(1);
  const [materiales, setMateriales] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('un');
  const storageKey = `recetas-${proyectoId}`;

  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        setMateriales(JSON.parse(datos));
      } catch (e) {
        console.error('Error al cargar recetas:', e);
        setMateriales({});
      }
    }
  }, [storageKey]);

  const getMateriales = (tipoId) => {
    return materiales[tipoId] || materiales[`${tipoId}`] || [];
  };

  const sugerencias = busqueda.trim()
    ? CATALOGO.filter(m =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.codigo.includes(busqueda)
      ).slice(0, 8)
    : [];

  const handleSeleccionar = (materialObj) => {
    setBusqueda(materialObj.nombre);
    setNuevaUnidad(materialObj.unidad);
    setMostrarSugerencias(false);
  };

  const handleAgregarMaterial = (e) => {
    e.preventDefault();
    if (!busqueda.trim() || !nuevaCantidad) return;

    const tipoId = tipoSeleccionado;
    const materialesDelTipo = getMateriales(tipoId);
    
    const nuevoMatObj = {
      id: Date.now(),
      nombre: busqueda,
      cantidad: parseFloat(nuevaCantidad),
      unidad: nuevaUnidad
    };

    const materialesActualizados = {
      ...materiales,
      [tipoId]: [...materialesDelTipo, nuevoMatObj]
    };

    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    setBusqueda('');
    setNuevaCantidad('');
    setNuevaUnidad('un');
    setMostrarSugerencias(false);
  };

  const handleActualizarMaterial = (tipoId, materialId, campo, valor) => {
    const materialesDelTipo = getMateriales(tipoId);
    const materialesActualizados = {
      ...materiales,
      [tipoId]: materialesDelTipo.map(m =>
        m.id === materialId ? { ...m, [campo]: valor } : m
      )
    };
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
  };

  const handleEliminar = (tipoId, materialId) => {
    const material = getMateriales(tipoId).find(m => m.id === materialId);
    if (window.confirm(`¿Eliminar "${material.nombre}"?`)) {
      const materialesDelTipo = getMateriales(tipoId).filter(m => m.id !== materialId);
      const materialesActualizados = { ...materiales, [tipoId]: materialesDelTipo };
      setMateriales(materialesActualizados);
      localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    }
  };

  const materialesDelTipo = getMateriales(tipoSeleccionado);
  const tipoActual = TIPOS_BOCA.find(t => t.id === tipoSeleccionado);

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📋 Recetas de Materiales</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Define qué materiales necesita cada tipo de boca.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* TIPOS */}
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', height: 'fit-content', maxHeight: '600px', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Tipos de Boca</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {TIPOS_BOCA.map(tipo => (
              <button
                key={tipo.id}
                onClick={() => setTipoSeleccionado(tipo.id)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  background: tipoSeleccionado === tipo.id ? '#2563a8' : 'white',
                  color: tipoSeleccionado === tipo.id ? 'white' : '#1c2d4f',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textAlign: 'left',
                  fontSize: '13px'
                }}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* RECETA */}
        <div>
          <h3 style={{ color: '#1c2d4f', marginTop: 0 }}>{tipoActual?.nombre}</h3>

          {/* FORMULARIO */}
          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb', position: 'relative' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Material</h4>
            <form onSubmit={handleAgregarMaterial}>
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setMostrarSugerencias(true);
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  placeholder="Busca material por nombre o código"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    fontSize: '13px'
                  }}
                />
                
                {/* SUGERENCIAS */}
                {mostrarSugerencias && sugerencias.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {sugerencias.map((mat, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSeleccionar(mat)}
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer',
                          color: '#1c2d4f',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <strong>{mat.nombre}</strong>
                        <span style={{ color: '#999', marginLeft: '10px', fontSize: '11px' }}>({mat.codigo}) - {mat.unidad}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 100px', gap: '8px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                  placeholder="Cantidad"
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                />
                <select
                  value={nuevaUnidad}
                  onChange={(e) => setNuevaUnidad(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  <option value="un">un</option>
                  <option value="mts">mts</option>
                  <option value="kg">kg</option>
                  <option value="lt">lt</option>
                </select>
                <button
                  type="submit"
                  style={{
                    background: '#2563a8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    gridColumn: 'span 1'
                  }}
                >
                  + Agregar
                </button>
              </div>
            </form>
          </div>

          {/* LISTA */}
          <h4 style={{ color: '#1c2d4f' }}>Materiales ({materialesDelTipo.length})</h4>
          {materialesDelTipo.length === 0 ? (
            <p style={{ color: '#999' }}>Sin materiales agregados</p>
          ) : (
            <div style={{ display: 'grid', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
              {materialesDelTipo.map(mat => (
                <div key={mat.id} style={{
                  background: '#f9fafb',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  display: 'grid',
                  gridTemplateColumns: '1fr 70px 70px 40px',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ color: '#1c2d4f', fontSize: '13px' }}>{mat.nombre}</strong>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={mat.cantidad || ''}
                    onChange={(e) => handleActualizarMaterial(tipoSeleccionado, mat.id, 'cantidad', parseFloat(e.target.value) || 0)}
                    style={{
                      padding: '6px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  />
                  <select
                    value={mat.unidad || 'un'}
                    onChange={(e) => handleActualizarMaterial(tipoSeleccionado, mat.id, 'unidad', e.target.value)}
                    style={{
                      padding: '6px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <option value="un">un</option>
                    <option value="mts">mts</option>
                    <option value="kg">kg</option>
                    <option value="lt">lt</option>
                  </select>
                  <button
                    onClick={() => handleEliminar(tipoSeleccionado, mat.id)}
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
