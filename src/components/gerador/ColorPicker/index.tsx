'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';

import styles from './index.module.css';

type ColorPickerProps = {
  label: string;
  color: string;
  setColor: (value: string) => void;
  /** Quando true, ainda não há valor próprio: o campo herda o token global. */
  unset?: boolean;
  /** Nome amigável do token herdado, ex.: "cor de texto secundária". */
  inheritsLabel?: string;
  /** Derivada por luminância: exibe o valor, não deixa editar. */
  readOnly?: boolean;
  /**
   * Some com o rótulo visível — o `label` continua sendo o nome acessível do
   * controle. Usado nas Variáveis Globais, onde o título bold do bloco JÁ é o
   * rótulo e repeti-lo duplicaria o texto.
   */
  hideLabel?: boolean;
};

const PICKER_W = 232;
const PICKER_H = 240;

export default function ColorPicker({
  label,
  color,
  setColor,
  unset = false,
  inheritsLabel,
  readOnly = false,
  hideLabel = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  /**
   * O popover é portalizado para o <body>: os painéis do shell são
   * `overflow: auto/clip`, e um `position: absolute` aqui dentro seria
   * recortado na borda do painel.
   */
  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: Math.min(r.bottom + 8, window.innerHeight - PICKER_H - 8),
      left: Math.min(Math.max(8, r.left), window.innerWidth - PICKER_W - 8),
    });
  }, []);

  const toggle = () => {
    if (readOnly) return;
    place();
    setOpen(prev => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !anchorRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', place);
    // `capture` para acompanhar o scroll do painel, que não borbulha.
    window.addEventListener('scroll', place, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  return (
    <div className={styles.field}>
      {!hideLabel && <span className={styles.label}>{label}</span>}

      <div ref={anchorRef} className={styles.row}>
        <button
          type="button"
          onClick={toggle}
          disabled={readOnly}
          className={`${styles.swatch} ${unset ? styles.swatchUnset : ''}`}
          style={unset ? undefined : { backgroundColor: color }}
          aria-label={unset ? `Definir ${label}` : `${label}: ${color}`}
        >
          {unset && <X size={16} strokeWidth={1.5} />}
        </button>

        {unset ? (
          <p className={styles.inherits}>
            Usando variável da {inheritsLabel ?? 'configuração global'}{' '}
            <button type="button" className={styles.inheritsCta} onClick={toggle}>
              (clique aqui para alterar)
            </button>
          </p>
        ) : (
          <input
            type="text"
            value={color}
            readOnly={readOnly}
            className={styles.value}
            onChange={e => setColor(e.target.value)}
            onFocus={readOnly ? undefined : toggle}
            aria-label={label}
          />
        )}
      </div>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popoverRef}
            className={styles.popover}
            style={{ top: pos.top, left: pos.left }}
          >
            <HexColorPicker color={color} onChange={setColor} />
          </div>,
          document.body
        )}
    </div>
  );
}
