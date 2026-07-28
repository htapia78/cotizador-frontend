import React, { useState, useEffect } from 'react';

const CATALOGO = [
  { categoria: 'Canalización', material: 'Caja Octogonal Grande Metálica', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caja Octogonal Chica Metálica', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caja Rectangular Metálica', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caja de Registro', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caja Cuadrada 200x200 PVC', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caja 10x10x8 c/tapa Metálica', unidad: 'un' },
  { categoria: 'Canalización', material: 'Caño PVC 20mm', unidad: 'mts' },
  { categoria: 'Canalización', material: 'Caño PVC 25mm', unidad: 'mts' },
  { categoria: 'Canalización', material: 'Caño PVC 40mm', unidad: 'mts' },
  { categoria: 'Canalización', material: 'Conector 20mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Conector 25mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Conector 40mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Cupla Unión 20mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Cupla Unión 25mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Cupla Unión 40mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Curva 20mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Curva 25mm', unidad: 'un' },
  { categoria: 'Canalización', material: 'Curva 40mm', unidad: 'un' },
  { categoria: 'Canaliz. Esp.', material: 'Caño PVC 32mm', unidad: 'mts' },
  { categoria: 'Canaliz. Esp.', material: 'Curva PVC 32mm', unidad: 'un' },
  { categoria: 'Canaliz. Esp.', material: 'Conector PVC 32mm', unidad: 'un' },
  { categoria: 'Canaliz. Esp.', material: 'Unión PVC 32mm', unidad: 'un' },
  { categoria: 'Cables', material: 'Cable Unipolar 1.5mm Rojo', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 1.5mm Marrón', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 1.5mm Negro', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 1.5mm Celeste', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 1.5mm V/A', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 2.5mm Rojo', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 2.5mm Marrón', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 2.5mm Negro', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 2.5mm Celeste', unidad: 'mts' },
  { categoria: 'Cables', material: 'Cable Unipolar 2.5mm V/A', unidad: 'mts' },
  { categoria: 'Ilum. + Tomas', material: 'Bastidor', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Marco', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Módulo Tapa Ciega', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Punto (llave simple)', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Toma Simple', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Módulo TV', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Módulo Teléfono', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Llave combinada', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Toma Encapsulado Ext.', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Cartel de Salida', unidad: 'un' },
  { categoria: 'Tableros', material: 'Tablero 96 Polos', unidad: 'un' },
  { categoria: 'Tableros', material: 'Tablero 36 Polos', unidad: 'un' },
  { categoria: 'Tableros', material: 'Tablero 60 Polos', unidad: 'un' },
  { categoria: 'Tableros', material: 'Tablero 80 Polos', unidad: 'un' },
  { categoria: 'Tableros', material: 'GABINETE METALICO CON DUCTO IP65 P/ 160 BOCAS 750X900X210', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 2X10A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 2X16A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 4X40A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 4X20A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 4X25A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 4X32A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 4X63A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR DIFERENCIAL 2X40A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR DIFERENCIAL 4X25A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR DIFERENCIAL 4X40A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNETICO 1X10A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNÉTICO 4X80A', unidad: 'un' },
  { categoria: 'Tableros', material: 'INTERRUPTOR TERMOMAGNÉTICO 4X50A', unidad: 'un' },
  { categoria: 'Tableros', material: 'Contactor 4P 32A', unidad: 'un' },
  { categoria: 'Tableros', material: 'Contactor 12V 16A', unidad: 'un' },
  { categoria: 'Tableros', material: 'Trafo 220V/12V 300W', unidad: 'un' },
  { categoria: 'PAT', material: 'Jabalina 3/4" 1500mm', unidad: 'un' },
  { categoria: 'PAT', material: 'Bloquete PAT 3/4" T1', unidad: 'un' },
  { categoria: 'PAT', material: 'Cámara de PAT', unidad: 'un' },
  { categoria: 'PAT', material: 'Carbonilla', unidad: 'un' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 2x2.5+T 2.5mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 2x6mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 4x6mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 4x10mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Unipolar V/A 6mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Unipolar V/A 10mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 4x25mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 4x16mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Subterráneo 2x4mm', unidad: 'mts' },
  { categoria: 'Cables Esp.', material: 'Cable Unipolar V/A 2.5mm', unidad: 'mts' },
  { categoria: 'Canaliz. Esp.', material: 'Pegamento chico', unidad: 'un' },
  { categoria: 'Canaliz. Esp.', material: 'Distribuidor Elent 4 7 125AP', unidad: 'un' },
  { categoria: 'Canaliz. Esp.', material: 'Distribuidor Elent 4 12 125AP', unidad: 'un' },
  { categoria: 'Canalización', material: 'Extractor Monofásico Interior', unidad: 'un' },
  { categoria: 'Tableros', material: 'Dimer Riel Din 10A', unidad: 'un' },
  { categoria: 'Ilum. + Tomas', material: 'Cartel Salida', unidad: 'un' },
  { categoria: 'Tableros', material: 'Fusible 2A', unidad: 'un' },
  { categoria: 'Tableros', material: 'Voltímetro', unidad: 'un' },
  { categoria: 'Tableros', material: 'Amperímetro', unidad: 'un' },
  { categoria: 'Tableros', material: 'Piloto Rojo 220v', unidad: 'un' },
  { categoria: 'Tableros', material: 'Bornerta Portafusible', unidad: 'un' },
];

export default function MaterialesSinReceta({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const storageKey = `materiales-sin-receta-${proyectoId}`;

  useEffect(() => {
    const datos = localStorage.getItem(storageKey);
    if (datos) {
      try {
        setMateriales(JSON.parse(datos));
      } catch (e) {
        console.error('Error al cargar materiales:', e);
      }
    }
  }, [storageKey]);

  const sugerencias = busqueda.trim()
    ? CATALOGO.filter(m =>
        m.material.toLowerCase().includes(busqueda.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSeleccionar = (materialObj) => {
    if (!nuevaCantidad) return;
    
    const nuevoMatObj = {
      id: Date.now(),
      nombre: materialObj.material,
      cantidad: parseFloat(nuevaCantidad),
      unidad: materialObj.unidad
    };

    const materialesActualizados = [...materiales, nuevoMatObj];
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    setBusqueda('');
    setNuevaCantidad('');
    setMostrarSugerencias(false);
  };

  const handleAgregarLibre = (e) => {
    e.preventDefault();
    if (!busqueda.trim() || !nuevaCantidad) return;

    const nuevoMatObj = {
      id: Date.now(),
      nombre: busqueda,
      cantidad: parseFloat(nuevaCantidad),
      unidad: 'un'
    };

    const materialesActualizados = [...materiales, nuevoMatObj];
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    setBusqueda('');
    setNuevaCantidad('');
    setMostrarSugerencias(false);
  };

  const handleEliminar = (id) => {
    const material = materiales.find(m => m.id === id);
    if (window.confirm(`¿Eliminar "${material.nombre}"? Esta acción no se puede deshacer.`)) {
      const materialesActualizados = materiales.filter(m => m.id !== id);
      setMateriales(materialesActualizados);
      localStorage.setItem(storageKey, JSON.stringify(materialesActualizados));
    }
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📦 Materiales sin Receta</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Cables, bandejas, cañería y otros que no tienen receta. Busca en el catálogo o agrega manualmente.</p>

      {/* FORMULARIO */}
      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e5e7eb', position: 'relative' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1c2d4f' }}>Agregar Material</h4>
        <form onSubmit={handleAgregarLibre}>
          <div style={{ marginBottom: '12px', position: 'relative' }}>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              onFocus={() => setMostrarSugerencias(true)}
              placeholder="Busca material (ej: Cable Subterráneo)"
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
                    <strong>{mat.material}</strong>
                    <span style={{ color: '#999', marginLeft: '10px', fontSize: '11px' }}>({mat.unidad})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px' }}>
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
            <button
              type="submit"
              style={{
                background: '#2563a8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px'
              }}
            >
              + Agregar
            </button>
          </div>
        </form>
      </div>

      {/* LISTA */}
      <h4 style={{ color: '#1c2d4f' }}>Materiales ({materiales.length})</h4>
      {materiales.length === 0 ? (
        <p style={{ color: '#999' }}>Sin materiales agregados</p>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {materiales.map(mat => (
            <div key={mat.id} style={{
              background: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#1c2d4f', fontSize: '13px' }}>{mat.nombre}</strong>
                <span style={{ color: '#999', marginLeft: '10px', fontSize: '12px' }}>{mat.cantidad} {mat.unidad}</span>
              </div>
              <button
                onClick={() => handleEliminar(mat.id)}
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
  );
}
