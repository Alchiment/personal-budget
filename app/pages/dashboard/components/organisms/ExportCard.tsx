import React from 'react';
import { Icon } from '@/app/components/atoms/Icon';
import { Button } from '@/app/components/atoms/Button';

export function ExportCard() {
  return (
    <div className="bg-slate-800 dark:bg-slate-700 p-6 rounded-2xl text-white">
      <h3 className="font-bold mb-1">Exportar Reporte</h3>
      <p className="text-sm text-slate-300 mb-4">Descarga el resumen mensual en formato PDF o Excel.</p>
      <Button variant="white" className="w-full">
        <Icon name="download" className="text-sm" /> Descargar Ahora
      </Button>
    </div>
  );
}
