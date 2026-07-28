import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Computo({ proyectoId }) {
  const [materiales, setMateriales] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularComputo();
  }, [proyectoId]);

  const calcularComputo = () => {
    const bocasStorageKey = `bocas-${proyectoId}`;
    const recetasStorageKey = `recetas-${proyectoId}`;
    const materilesSinRecetaKey = `materiales-sin-receta-${proyectoId}`;

    const conteos = JSON.parse(localStorage.getItem(bocasStorageKey) || '{}');
    const recetas = JSON.parse(localStorage.getItem(recetasStorageKey) || '{}');
    const materialesSinReceta = JSON.parse(localStorage.getItem(materilesSinRecetaKey) || '[]');

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

    materialesSinReceta.forEach(material => {
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
    const totalCalc = materialesArray.reduce((sum, m) => sum + (m.cantidad || 0), 0);
    setTotal(totalCalc);
  };

  const descargarExcel = () => {
    // Crear workbook
    const ws = XLSX.utils.aoa_to_sheet([
      ['APEXCORE S.A.S.', '', '', ''],
      ['Solicitud de Cotización de Materiales', '', '', ''],
      ['', '', '', ''],
      ['Datos de la Empresa:', '', 'Datos del Proveedor:', ''],
      ['Dirección: JOAQUIN V. GONZALEZ 855', '', 'Proveedor:', ''],
      ['Ciudad: GODOY CRUZ', '', 'Contacto:', ''],
      ['Provincia: MENDOZA', '', 'Teléfono:', ''],
      ['C.U.I.T.: 30-71899092-7', '', 'E-mail:', ''],
      ['', '', '', ''],
      ['MATERIAL', 'CANTIDAD', 'UNIDAD', 'PRECIO UNITARIO'],
      ...materiales.map(m => [m.nombre, m.cantidad.toFixed(2), m.unidad, '']),
      ['', '', '', ''],
      ['TOTAL ITEMS', materiales.length, '', ''],
    ]);

    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 40 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 }
    ];

    // Estilos básicos
    for (let i = 0; i < materiales.length + 10; i++) {
      const cellA = ws[`A${i + 1}`];
      if (cellA) {
        cellA.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitud');
    XLSX.writeFile(wb, `Pedido_Precios_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const descargarPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 15;

    // Header
    doc.setFontSize(16);
    doc.setTextColor(28, 45, 79); // Color #1c2d4f
    doc.text('APEXCORE S.A.S.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.text('SOLICITUD DE COTIZACIÓN DE MATERIALES', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Datos empresa
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Datos de la Empresa:', 15, yPos);
    yPos += 5;
    doc.setFontSize(8);
    doc.text('Dirección: JOAQUIN V. GONZALEZ 855', 15, yPos);
    yPos += 4;
    doc.text('Ciudad: GODOY CRUZ | Provincia: MENDOZA', 15, yPos);
    yPos += 4;
    doc.text('C.U.I.T.: 30-71899092-7', 15, yPos);
    yPos += 10;

    // Tabla
    const tableData = materiales.map(m => [
      m.nombre,
      m.cantidad.toFixed(2),
      m.unidad
    ]);

    autoTable(doc, {
      head: [['Material', 'Cantidad', 'Unidad']],
      body: tableData,
      startY: yPos,
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' }
      },
      headStyles: {
        fillColor: [28, 45, 79],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });

    // Total al final
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(`Total de items: ${materiales.length}`, 15, finalY);

    doc.save(`Pedido_Precios_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#1c2d4f', marginTop: 0 }}>🧮 Cómputo de Materiales</h2>
          <p style={{ color: '#666' }}>Total de materiales necesarios para el proyecto</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={calcularComputo}
            style={{
              background: '#6366f1',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            🔄 Recalcular
          </button>
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
              fontSize: '14px'
            }}
          >
            📥 Descargar Excel
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
              fontSize: '14px'
            }}
          >
            📄 Descargar PDF
          </button>
        </div>
      </div>

      {materiales.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
          Define zonas, bocas y recetas para ver el cómputo
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
                </tr>
              </thead>
              <tbody>
                {materiales.map((material, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1c2d4f', fontWeight: '500' }}>{material.nombre}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                      {material.cantidad.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                      {material.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1c2d4f 0%, #2563a8 100%)',
            color: 'white',
            padding: '20px 24px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <p style={{ margin: '0 0 8px 0', opacity: 0.9 }}>TOTAL DE MATERIALES</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
              {total.toFixed(2)} unidades
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
