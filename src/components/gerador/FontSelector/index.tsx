'use client';

import { useEffect, useState, useRef } from 'react';

import { loadGoogleFont } from '@/utils/googleFont';

import styles from './index.module.css';

type FontItem = {
  family: string;
};

type FontSelectorProps = {
  label: string;
  cssVariable: string;
  selectedFont: string;
  onFontChange: (font: string) => void;
  /** Quando true, ainda não há fonte própria (herda do global): não aplica em :root. */
  unset?: boolean;
  /** Nome amigável do token herdado, ex.: "fonte dos títulos". */
  inheritsLabel?: string;
  /** Ver ColorPicker: `block` na esquerda (sem rótulo), `field` na direita. */
  variant?: 'block' | 'field';
};

export default function FontSelector({
  label,
  cssVariable,
  selectedFont,
  onFontChange,
  unset = false,
  inheritsLabel,
  variant = 'field',
}: FontSelectorProps) {
  const [allFonts, setAllFonts] = useState<FontItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(selectedFont || '');
  const [suggestions, setSuggestions] = useState<FontItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/gerador/api/fonts')
      .then(res => res.json())
      .then(data => setAllFonts(Array.isArray(data) ? data : []))
      .catch(() => setAllFonts([]));
  }, []);

  /**
   * Só carrega a face no documento do editor — quem escreve as custom
   * properties é outra pessoa.
   *
   * Este efeito fazia `setProperty` no `:root`, e isso estava errado de dois
   * jeitos: as variáveis globais já são escritas pelo useLayoutGenerator (com
   * a grafia certa, `--font-secundary`), e as variáveis POR COMPONENTE não são
   * únicas por instância — definir a fonte de um Showcase gravava
   * `--showcase-font` no `:root` e passava a valer para todos os outros, sem
   * nunca ser removida. O preview por instância vem do estilo inline que o
   * ThemeRenderer põe no wrapper da seção.
   *
   * A face precisa existir NESTE documento mesmo assim: é ele que o
   * ExportStage fotografa para os PNGs.
   */
  useEffect(() => {
    if (unset || !selectedFont) return;
    loadGoogleFont(selectedFont);
  }, [selectedFont, unset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        setSuggestions([]);
        return;
      }

      const results = allFonts
        .filter(font => font.family.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);

      setSuggestions(results);
      setShowSuggestions(true);
    }, 150);
  };

  const handleSelectFont = (font: string) => {
    onFontChange(font);
    setSearchTerm(font);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={styles.field} data-variant={variant}>
      {variant === 'field' && (
        <label className={styles.label} htmlFor={`input-font-${cssVariable}`}>
          {label}
        </label>
      )}

      <div className={styles.control}>
        <input
          id={`input-font-${cssVariable}`}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Lorem Ipsum"
          className={styles.input}
          style={{ fontFamily: unset ? undefined : selectedFont }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className={`${styles.fontSuggest} ed-scroll`}>
            {suggestions.map(font => (
              <li key={font.family}>
                <button
                  type="button"
                  className={styles.suggestion}
                  style={{ fontFamily: font.family }}
                  onMouseDown={() => handleSelectFont(font.family)}
                >
                  {font.family}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {unset && (
        <p className={styles.inherits}>
          Usando variável da {inheritsLabel ?? 'configuração global'}{' '}
          <button
            type="button"
            className={styles.inheritsCta}
            onClick={() =>
              document.getElementById(`input-font-${cssVariable}`)?.focus()
            }
          >
            (clique aqui para alterar)
          </button>
        </p>
      )}
    </div>
  );
}
