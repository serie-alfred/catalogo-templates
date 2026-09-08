'use client';

import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';

import { useLayout } from '@/context/LayoutContext';
import { ArrowDown } from '@/assets/icons/editor';

import styles from './index.module.css';

const MAX_MB = 2;

type SlotProps = {
  title: string;
  hint: string;
  value: string;
  accept: string;
  onChange: (dataUrl: string) => void;
};

/**
 * Um slot de asset: miniatura, título, dica de tamanho e o botão — vermelho
 * tracejado para remover quando há imagem, cinza tracejado para carregar
 * quando não há.
 */
function AssetSlot({ title, hint, value, accept, onChange }: SlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`A imagem excede o tamanho máximo de ${MAX_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className={styles.block}>
      <button
        type="button"
        className={styles.thumb}
        onClick={() => inputRef.current?.click()}
        aria-label={value ? `Trocar ${title}` : `Carregar ${title}`}
      >
        {value ? (
          /* <img> cru de propósito: o valor é uma data URL, que o next/image
             não otimiza. */
          <img src={value} alt={title} className={styles.preview} />
        ) : (
          <span className={styles.empty} aria-hidden />
        )}
      </button>

      <div className={styles.meta}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.hint}>{hint}</p>
      </div>

      {value ? (
        <button
          type="button"
          className={`${styles.action} ${styles.remove}`}
          onClick={() => onChange('')}
        >
          <Trash2 size={16} />
          deletar {title.toLowerCase()}
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.action} ${styles.upload}`}
          onClick={() => inputRef.current?.click()}
        >
          <ArrowDown width={16} height={16} />
          Carregar
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </section>
  );
}

const IMAGE_ACCEPT =
  'image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon,image/vnd.microsoft.icon';

export default function PanelBrandAssets() {
  const { logo, setLogo, favicon, setFavicon, ogImage, setOgImage } =
    useLayout();

  return (
    <div>
      {/* A legenda é a do Figma — "90 × 90 (X Mb)", as medidas da caixa de
          preview. Só o placeholder `X` é resolvido, com o teto real do upload:
          um "(X Mb)" literal não pode ir para produção. */}
      <AssetSlot
        title="Logo"
        hint={`90 × 90 (${MAX_MB} Mb)`}
        value={logo}
        accept={IMAGE_ACCEPT}
        onChange={setLogo}
      />
      <AssetSlot
        title="Favicon"
        hint={`90 × 90 (${MAX_MB} Mb)`}
        value={favicon}
        accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
        onChange={setFavicon}
      />
      <AssetSlot
        title="Share Link"
        hint={`90 × 90 (${MAX_MB} Mb)`}
        value={ogImage}
        accept={IMAGE_ACCEPT}
        onChange={setOgImage}
      />
    </div>
  );
}
