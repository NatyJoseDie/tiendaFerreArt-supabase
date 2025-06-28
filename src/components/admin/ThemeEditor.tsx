'use client';

import { useSettings } from '@/hooks/useSettings-new';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ThemeSettings = {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  dark_mode: boolean;
};

export function ThemeEditor() {
  const { value: theme, update, isLoading } = useSettings<'theme'>(
    'theme',
    {
      primary_color: "#2563eb",
      secondary_color: "#7c3aed",
      font_family: "Inter, sans-serif",
      dark_mode: false,
    }
  ) as { value: ThemeSettings | null; update: (value: ThemeSettings) => Promise<void>; isLoading: boolean };

  const handleSave = async () => {
    if (!theme) return;
    try {
      await update(theme);
      alert("Configuración guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      alert("Error al guardar la configuración");
    }
  };

  if (isLoading || !theme) {
    return <div>Cargando configuración...</div>;
  }

  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configuración del Tema</h2>
      
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Color Primario</Label>
        <div className="flex items-center gap-2">
          <Input
            id="primaryColor"
            type="color"
            value={theme.primary_color}
            onChange={(e) => update({ ...theme, primary_color: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <span className="text-sm text-gray-600">{theme.primary_color}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Color Secundario</Label>
        <div className="flex items-center gap-2">
          <Input
            id="secondaryColor"
            type="color"
            value={theme.secondary_color}
            onChange={(e) => update({ ...theme, secondary_color: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <span className="text-sm text-gray-600">{theme.secondary_color}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Fuente</Label>
        <select
          id="fontFamily"
          value={theme.font_family}
          onChange={(e) => update({ ...theme, font_family: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Open Sans', sans-serif">Open Sans</option>
          <option value="'Poppins', sans-serif">Poppins</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="darkMode"
          checked={theme.dark_mode}
          onChange={(e) => update({ ...theme, dark_mode: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="darkMode">Modo Oscuro</Label>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <h3 className="font-medium mb-2">Vista Previa:</h3>
        <div 
          className="p-4 rounded"
          style={{
            backgroundColor: theme.dark_mode ? '#1f2937' : '#ffffff',
            color: theme.dark_mode ? '#f3f4f6' : '#111827',
            fontFamily: theme.font_family,
          }}
        >
          <h4 className="text-xl font-bold mb-2" style={{ color: theme.primary_color }}>Título de Ejemplo</h4>
          <p className="mb-4">Este es un texto de ejemplo para mostrar la fuente seleccionada.</p>
          <Button 
            style={{
              backgroundColor: theme.primary_color,
              color: '#ffffff',
            }}
          >
            Botón de Ejemplo
          </Button>
        </div>
      </div>
    </div>
  );
}
