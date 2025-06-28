"use client";

import { useRef } from "react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  cost_price: number | null;
  stock: number;
  category: string | null;
}

interface ProductActionsBarProps {
  refreshAction: () => void;
  products: Product[];
}

export default function ProductActionsBar({ refreshAction, products }: ProductActionsBarProps) {
  const excelInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const handleExcelSelect = () => excelInputRef.current?.click();
  const handleImagesSelect = () => imagesInputRef.current?.click();

  // TODO: conectar con lógica real
  const handleFilePlaceholder = () => alert("Funcionalidad en desarrollo 🛠️");
  const handleExportCsv = () => {
    if (products.length === 0) {
      alert('No hay productos para exportar');
      return;
    }
    const headers = ['id','name','sku','cost_price','stock','category'];
    const rows = products.map(p => [p.id, p.name, p.sku ?? '', p.cost_price ?? '', p.stock, p.category ?? '']);
    const csvContent = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productos-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  const handleExportPdf = () => alert("Descarga PDF pendiente");

  return (
    <div className="flex flex-wrap gap-4 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 rounded-2xl shadow border border-blue-100 mb-8">
      {/* Importar precios */}
      <button
        onClick={handleExcelSelect}
        className="btn btn-secondary btn-outline gap-2"
      >
        📥 Importar precios (Excel/CSV)
      </button>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        ref={excelInputRef}
        onChange={handleFilePlaceholder}
        className="hidden"
      />

      {/* Subida masiva imágenes */}
      <button
        onClick={handleImagesSelect}
        className="btn btn-secondary btn-outline gap-2"
      >
        🖼️ Subir imágenes ZIP (SKU)
      </button>
      <input
        type="file"
        accept=".zip,.rar"
        ref={imagesInputRef}
        onChange={handleFilePlaceholder}
        className="hidden"
      />

      <div className="flex-1" />

      {/* Exportar CSV */}
      <button onClick={handleExportCsv} className="btn btn-success btn-outline gap-2">
        📄 Exportar CSV
      </button>
      {/* Exportar PDF */}
      <button onClick={handleExportPdf} className="btn btn-success gap-2">
        📑 Exportar PDF
      </button>
    </div>
  );
}
