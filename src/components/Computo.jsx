import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Computo({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [totalSinIva, setTotalSinIva] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [totalConIva, setTotalConIva] = useState(0);
  const [cargando, setCargando] = useState(false);

  const storageKeyMateriales = `materiales-cómputo-${proyectoId}`;

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = () => {
    // Primero intenta cargar materiales importados
    const materialesImportados = localStorage.getItem(storageKeyMateriales);
    if (materialesImportados) {
      try {
        const parsed = JSON.parse(materialesImportados);
        setMateriales(parsed);
        calcularTotales(parsed);
        return;
      } catch (e) {
        console.error('Error al cargar materiales importados:', e);
      }
    }

    // Si no hay importados, calcula desde bocas+recetas+sin receta
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
            unidad: material.unidad || 'mts'
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
    calcularTotales(materialesArray);
  };

  const calcularTotales = (mats) => {
    let totalSin = 0;
    mats.forEach(mat => {
      totalSin += mat.cantidad;
    });
    
    setTotalSinIva(totalSin);
  };

  const handleImportarExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCargando(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const materialesImportados = [];

      // Saltar header (fila 0)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 2) continue;

        const nombre = (row[0] || '').toString().trim();
        const cantidad = parseFloat(row[1]) || 0;

        if (!nombre) continue;

        materialesImportados.push({
          nombre: nombre,
          cantidad: cantidad,
          unidad: 'un'
        });
      }

      setMateriales(materialesImportados);
      localStorage.setItem(storageKeyMateriales, JSON.stringify(materialesImportados));
      calcularTotales(materialesImportados);

      alert(`✅ Excel importado. Se cargaron ${materialesImportados.length} materiales.`);
    } catch (error) {
      console.error('Error al importar:', error);
      alert('❌ Error al procesar el Excel.');
    } finally {
      setCargando(false);
      event.target.value = '';
    }
  };

  const handleActualizarCantidad = (index, nuevaCantidad) => {
    const materialesActualizados = materiales.map((m, i) =>
      i === index ? { ...m, cantidad: parseFloat(nuevaCantidad) || 0 } : m
    );
    setMateriales(materialesActualizados);
    localStorage.setItem(storageKeyMateriales, JSON.stringify(materialesActualizados));
    calcularTotales(materialesActualizados);
  };

  const handleLimpiarImport = () => {
    if (window.confirm('¿Limpiar datos importados y volver a calcular desde Bocas/Recetas?')) {
      localStorage.removeItem(storageKeyMateriales);
      cargarDatos();
    }
  };

  const descargarExcel = () => {
    const datos = [
      ['Material', 'Cantidad', 'Unidad'],
      ...materiales.map(m => [m.nombre, m.cantidad, m.unidad])
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(datos);
    worksheet['!cols'] = [{ wch: 50 }, { wch: 15 }, { wch: 12 }];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cómputo');
    XLSX.writeFile(workbook, `Computo_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const descargarPdf = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('📊 Cómputo de Materiales', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Proyecto: Hotel Mendoza`, 14, 25);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);

    const tableData = materiales.map(m => [
      m.nombre,
      m.cantidad.toFixed(2),
      m.unidad
    ]);

    autoTable(doc, {
      head: [['Material', 'Cantidad', 'Unidad']],
      body: tableData,
      startY: 40,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [37, 99, 168], textColor: 255, fontStyle: 'bold' }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Total de ítems: ${materiales.length}`, 14, finalY);

    doc.save(`Computo_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>📊 Cómputo de Materiales</h2>
          <p style={{ color: '#666' }}>Total de materiales necesarios para el proyecto</p>
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
            opacity: cargando ? 0.6 : 1,
            fontSize: '13px'
          }}>
            📥 {cargando ? 'Importando...' : 'Importar Excel'}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportarExcel}
              disabled={cargando}
              style={{ display: 'none' }}
            />
          </label>
          <button
            onClick={descargarExcel}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            💾 Descargar Excel
          </button>
          <button
            onClick={descargarPdf}
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            📄 Descargar PDF
          </button>
        </div>
      </div>

      {materiales.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
          Sin materiales para mostrar
        </p>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1c2d4f' }}>Material</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '120px' }}>Cantidad</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1c2d4f', width: '100px' }}>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((material, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{material.nombre}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={material.cantidad || ''}
                        onChange={(e) => handleActualizarCantidad(idx, e.target.value)}
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
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{material.unidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '12px', fontWeight: '600' }}>TOTAL DE ÍTEMS</p>
              <h3 style={{ margin: 0, color: '#1c2d4f', fontSize: '20px' }}>{materiales.length}</h3>
            </div>
            <button
              onClick={handleLimpiarImport}
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              🗑️ Limpiar Datos Importados
            </button>
          </div>
        </>
      )}
    </div>
  );
}
