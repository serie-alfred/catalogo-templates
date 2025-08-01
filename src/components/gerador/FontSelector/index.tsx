'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './index.module.css';

type FontItem = {
  family: string;
};

type FontSelectorProps = {
  label: string;
  cssVariable: string;
  selectedFont: string;
  onFontChange: (font: string) => void;
};

export default function FontSelector({
  label,
  cssVariable,
  selectedFont,
  onFontChange,
}: FontSelectorProps) {
  const [allFonts, setAllFonts] = useState<FontItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(selectedFont || '');
  const [suggestions, setSuggestions] = useState<FontItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/gerador/api/fonts')
      .then(res => res.json())
      .then(data => setAllFonts(data));
  }, []);

  useEffect(() => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}:wght@400;700&display=swap`;
    const linkId = `font-${cssVariable}`;

    const existingLink = document.getElementById(linkId);
    if (existingLink) {
      existingLink.setAttribute('href', fontUrl);
    } else {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }

    document.documentElement.style.setProperty(
      `--${cssVariable}`,
      `'${selectedFont}', sans-serif`
    );
  }, [selectedFont, cssVariable]);

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
    <div className="field">
      <label htmlFor={`font-${cssVariable}`}>{label}</label>
      <input
        id={`input-font-${cssVariable}`}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Digite o nome da fonte..."
        style={{
          fontFamily: selectedFont,
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.fontSuggest}>
          {suggestions.map(font => (
            <li
              key={font.family}
              onClick={() => handleSelectFont(font.family)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                fontFamily: font.family,
              }}
            >
              {font.family}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
