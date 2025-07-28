'use client';

import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';

type ColorPickerProps = {
  label: string;
  colorKey: string; // Ex: '--primary-color'
  defaultColor?: string;
};

export default function ColorPicker({
  label,
  colorKey,
  defaultColor = '#000000',
}: ColorPickerProps) {
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    document.documentElement.style.setProperty(colorKey, color);
  }, [color, colorKey]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label
        style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}
      >
        {label}
      </label>
      <HexColorPicker color={color} onChange={setColor} />
      <div style={{ marginTop: '0.5rem', fontFamily: 'monospace' }}>
        {color}
      </div>
    </div>
  );
}
