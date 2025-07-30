'use client';

import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import styles from './index.module.css';

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
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(colorKey, color);
  }, [color, colorKey]);

  const togglePicker = () => setShowPicker(!showPicker);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    // Verifica se o valor é um hexa válido
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setColor(newColor);
    } else {
      setColor(newColor); // ainda atualiza para dar feedback mesmo que incompleto
    }
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div
        onClick={togglePicker}
        className={styles.color}
        style={{
          backgroundColor: color,
        }}
      ></div>

      {showPicker && (
        <div className={styles.colorPicker}>
          <HexColorPicker color={color} onChange={setColor} />

          <input
            type="text"
            value={color}
            onChange={handleInputChange}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.3rem',
              fontFamily: 'monospace',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
      )}
    </div>
  );
}
