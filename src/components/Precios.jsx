import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

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

  const handleCantidadChange = (nombreMaterial, nuevaCantidad) => {
    const materialesActualizados = materiales.map(m =>
      m.nombre === nombreMaterial ? { ...m, cantidad: parseFloat(nuevaCantidad) || 0 } : m
    );
    setMateriales(materialesActualizados);
    calcularTotales(materialesActualizados, precios);
  };

  const handleImportarDatos = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCargando(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const preciosActualizados = { ...precios };
      let actualizados = 0;

      // Saltar header (fila 0)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 3) continue;

        const materialNombre = (row[0] || '').toString().trim();
        const cantidad = parseFloat(row[1]) || 0;
        const precio = parseFloat(row[2]) || 0;

        if (!materialNombre) continue;

        // Buscar coincidencia exacta
        const matEncontrado = materiales.find(m => 
          m.nombre.toUpperCase() === materialNombre.toUpperCase()
        );

        if (matEncontrado) {
          preciosActualizados[matEncontrado.nombre] = precio;
          actualizados++;
        }
      }

      setPrecios(preciosActualizados);
      localStorage.setItem(storageKeyPrecios, JSON.stringify(preciosActualizados));
      calcularTotales(materiales, preciosActualizados);

      alert(`✅ Datos importados. Se actualizaron ${actualizados} precios.`);
    } catch (error) {
      console.error('Error al importar:', error);
      alert('❌ Error al procesar el Excel.');
    } finally {
      setCargando(false);
      event.target.value = '';
    }
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

        // Extraer TODO el texto
        let textoCompleto = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const texto = textContent.items.map(item => item.str).join(' ');
          textoCompleto += '\n' + texto;
        }

        console.log('Texto extraído (primeros 1000 chars):', textoCompleto.substring(0, 1000));

        // Buscar TODOS los códigos de 5 dígitos + precio más cercano
        const codigoRegex = /(\d{5})/g;
        const precioRegex = /\$[\d.]+/g;

        let match;
        while ((match = codigoRegex.exec(textoCompleto)) !== null) {
          const codigo = match[1];
          const posicion = match.index;

          // Buscar los próximos 200 caracteres para encontrar un precio
          const siguientePorcion = textoCompleto.substring(posicion, posicion + 300);
          const precioMatch = siguientePorcion.match(/\$[\d.]+/);

          if (precioMatch) {
            const precioStr = precioMatch[0].replace('$', '').replace(/\./g, '');
            const precio = parseFloat(precioStr);

            if (precio > 0 && precio < 10000000) { // Rango razonable
              // Extraer descripción (entre código y precio)
              const desc = siguientePorcion
                .substring(0, precioMatch.index)
                .replace(/\d+\s*%\s*/, '') // Remover porcentajes
                .replace(/\d+\s*$/, '') // Remover números finales
                .trim()
                .toUpperCase();

              if (desc.length > 3) {
                materialesDelPdf[desc] = precio;
                console.log(`✓ ${codigo} | ${desc.substring(0, 50)} | $${precio}`);
              }
            }
          }
        }

        console.log(`✅ Extraídos ${Object.keys(materialesDelPdf).length} precios del PDF`);

        // Matching
        const preciosActualizados = { ...precios };
        let actualizados = 0;

        materiales.forEach(mat => {
          const nombreUpper = mat.nombre.toUpperCase();

          // Búsqueda 1: Exacta
          if (materialesDelPdf[nombreUpper]) {
            preciosActualizados[mat.nombre] = materialesDelPdf[nombreUpper];
            actualizados++;
            return;
          }

          // Búsqueda 2: Contención
          for (const [desc, precio] of Object.entries(materialesDelPdf)) {
            if (nombreUpper.includes(desc) || desc.includes(nombreUpper)) {
              preciosActualizados[mat.nombre] = precio;
              actualizados++;
              break;
            }
          }
        });

        console.log(`✅ Actualizados: ${actualizados}/${materiales.length}`);

        setPrecios(preciosActualizados);
        localStorage.setItem(storageKeyPrecios, JSON.stringify(preciosActualizados));
        calcularTotales(materiales, preciosActualizados);

        alert(`✅ Se actualizaron ${actualizados} de ${materiales.length} precios.`);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al procesar el PDF.');
    } finally {
      setCargando(false);
      event.target.value = '';
    }
  };
  
  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>💲 Precios y Cotización</h2>
          <p style={{ color: '#666' }}>Carga datos directamente o desde presupuesto PDF</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <label style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: cargando ? 0.6 : 1
          }}>
            📥 {cargando ? 'Importando...' : 'Importar Excel'}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportarDatos}
              disabled={cargando}
              style={{ display: 'none' }}
            />
          </label>
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
            📤 {cargando ? 'Cargando...' : 'Cargar PDF'}
            <input
              type="file"
              accept=".pdf"
              onChange={handleCargarPdf}
              disabled={cargando}
              style={{ display: 'none' }}
            />
          </label>
        </div>
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
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          step="0.1"
                          value={material.cantidad || ''}
                          onChange={(e) => handleCantidadChange(material.nombre, e.target.value)}
                          style={{
                            width: '80px',
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '12px'
                          }}
                        />
                      </td>
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
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '12px'
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
