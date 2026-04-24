import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from './index.module.css';

type ColorPickerProps = {
  label: string;
  color: string;
  setColor: (value: string) => void;
};

export default function ColorPicker({
  label,
  color,
  setColor,
}: ColorPickerProps) {
  // const [showPicker, setShowPicker] = useState(false);
  const [open, setOpen] = useState(false)
  const colorPickerref = useRef<HTMLDivElement>(null)

  // const togglePicker = () => setShowPicker(!showPicker);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setColor(newColor);
    } else {
      setColor(newColor); // Permite digitar parcialmente
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {

      if(colorPickerref.current && !colorPickerref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <div ref={colorPickerref} className={`${styles.field} field`}>
      <label>{label}</label>
      <div className={styles.colorWrapper}>
        <div
          onClick={() => setOpen(prev => !prev)}
          className={styles.color}
          style={{
            backgroundColor: color,
          }}
        ></div>
        <input
          type="text"
          value={color}
          className={styles.colorInput}
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

      {open && (
        <div className={styles.colorPicker}>
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
}
