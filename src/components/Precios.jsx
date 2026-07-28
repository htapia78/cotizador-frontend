import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Precios({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [precios, setPrecios] = useState({});
  const [totalSinIva, setTotalSinIva] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [totalConIva, setTotalConIva] = useState(0);
  const [cargando, setCargando] = useState(false);

  const storageKeyPrecios = `precios-${proyectoId}`;

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = () => {
    const bocasKey = `bocas-${proyectoId}`;
    const recetasKey = `recetas-${proyectoId}`;
    const sinRecetaKey = `materiales-sin-receta-${proyectoId}`;

    const conteos = JSON.parse(localStorage.getItem(bocasKey) || '{}');
    const recetas = JSON.parse(localStorage.getItem(recetasKey) || '{}');
    const sinReceta = JSON.parse(localStorage.getItem(sinRecetaKey) || '[]');

    const materiales_calculados = {};

    Object.entries(conteos).forEach(([key, cantidad]) => {
      const [zonaId, tipoId] = key.split('-').map(Number);
      const recetasDeTipo = recetas[tipoId] || recetas[`${tipoId}`] || [];
      
      recetasDeTipo.forEach(material => {
        const materialKey = material.nombre;
        const cantidadTotal = cantidad * material.cantidad;
        
        if (!materiales_calculados[materialKey]) {
          materiales_calculados[materialKey] = {
            nombre: material.nombre,
            cantidad: 0,
            unidad: material.unidad || 'm'
          };
        }
        materiales_calculados[materialKey].cantidad += cantidadTotal;
      });
    });

    sinReceta.forEach(material => {
      const materialKey = material.nombre;
      if (!materiales_calculados[materialKey]) {
        materiales_calculados[materialKey] = {
          nombre: material.nombre,
          cantidad: 0,
          unidad: material.unidad || 'un'
        };
      }
      materiales_calculados[materialKey].cantidad += material.cantidad;
    });

    const materialesArray = Object.values(materiales_calculados)
      .filter(m => m.cantidad > 0)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    setMateriales(materialesArray);

    const preciosGuardados = JSON.parse(localStorage.getItem(storageKeyPrecios) || '{}');
    setPrecios(preciosGuardados);
    calcularTotales(materialesArray, preciosGuardados);
  };

  const calcularTotales = (mats, precs) => {
    let totalSin = 0;
    mats.forEach(mat => {
      const precio = precs[mat.nombre] || 0;
      totalSin += mat.cantidad * precio;
    });
    
    const iva = totalSin * 0.21;
    const totalCon = totalSin + iva;
    
    setTotalSinIva(totalSin);
    setTotalIva(iva);
    setTotalConIva(totalCon);
  };

  const handlePrecioChange = (nombreMaterial, precio) => {
    const preciosActualizados = { ...precios, [nombreMaterial]: parseFloat(precio) || 0 };
    setPrecios(preciosActualizados);
    localStorage.setItem(storageKeyPrecios, JSON.stringify(preciosActualizados));
    calcularTotales(materiales, preciosActualizados);
  };

  const handleCargarPdf = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCargando(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const pdfData = e.target.result;
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let materialesDelPdf = {};

        // Extraer texto de todas las páginas
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const texto = textContent.items.map(item => item.str).join(' ');

          // Parsear líneas buscando el patrón: código + descripción + cantidad + precio
          const lineas = texto.split('\n');
          for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i];
            // Buscar líneas que tienen formato: código (números) ... descripción ... cantidad ... precio
            const match = linea.match(/^(\d+)\s+(.+?)\s+(\d+)\s+\d+%\s+\$?([\d.,]+)\s+\$/);
            
            if (match) {
              const codigo = match[1];
              const descripcion = match[2].trim().toUpperCase();
              const precio = parseFloat(match[4].replace(/\./g, '').replace(',', '.'));
              
              materialesDelPdf[descripcion] = precio;
            }
          }
        }

        // Matching: asociar materiales del PDF con materiales de la cotización
        const preciosActualizados = { ...precios };
        let actualizados = 0;

        materiales.forEach(mat => {
          const nombreUpper = mat.nombre.toUpperCase();
          
          // Búsqueda exacta primero
          if (materialesDelPdf[nombreUpper]) {
            preciosActualizados[mat.nombre] = materialesDelPdf[nombreUpper];
            actualizados++;
          } else {
            // Búsqueda por similitud (si no hay coincidencia exacta)
            for (const [descPdf, precioPdf] of Object.entries(materialesDelPdf)) {
              if (similitud(nombreUpper, descPdf) > 0.7) {
                preciosActualizados[mat.nombre] = precioPdf;
                actualizados++;
                break;
              }
            }
          }
        });

        setPrecios(preciosActualizados);
        localStorage.setItem(storageKeyPrecios, JSON.stringify(preciosActualizados));
        calcularTotales(materiales, preciosActualizados);

        alert(`✅ Presupuesto cargado. Se actualizaron ${actualizados} precios.`);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      alert('❌ Error al procesar el PDF. Intenta nuevamente.');
    } finally {
      setCargando(false);
      event.target.value = ''; // Limpiar input
    }
  };

  // Función de similitud entre strings (Levenshtein simplificado)
  const similitud = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshtein(longer, shorter);
    return (longer.length - editDistance) / parseFloat(longer.length);
  };

  const levenshtein = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>💲 Precios y Cotización</h2>
          <p style={{ color: '#666' }}>Carga el presupuesto del proveedor y gestiona precios</p>
        </div>
        <label style={{
          background: '#2563a8',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          opacity: cargando ? 0.6 : 1
        }}>
          📤 {cargando ? 'Cargando...' : 'Cargar Presupuesto PDF'}
          <input
            type="file"
            accept=".pdf"
            onChange={handleCargarPdf}
            disabled={cargando}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {materiales.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
          Sin materiales para cotizar
        </p>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1c2d4f' }}>Material</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Cantidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Unidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Precio Unit.</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((material, idx) => {
                  const precio = precios[material.nombre] || 0;
                  const total = material.cantidad * precio;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{material.nombre}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{material.cantidad.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{material.unidad}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={precio || ''}
                          onChange={(e) => handlePrecioChange(material.nombre, e.target.value)}
                          placeholder="$"
                          style={{
                            width: '100px',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '13px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#2563a8' }}>
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>TOTAL SIN IVA</p>
              <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalSinIva.toFixed(2)}</h3>
            </div>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>IVA 21%</p>
              <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>${totalIva.toFixed(2)}</h3>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)', padding: '16px', borderRadius: '8px', color: 'white' }}>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9, fontSize: '12px', fontWeight: '600' }}>TOTAL CON IVA</p>
              <h3 style={{ margin: 0, fontSize: '20px' }}>${totalConIva.toFixed(2)}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
