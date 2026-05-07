'use client';

import { useRef } from 'react';
import styles from './index.module.css';

type ImageUploaderProps = {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  accept?: string;
  maxSizeMB?: number;
};

export default function ImageUploader({
  label,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon,image/vnd.microsoft.icon',
  maxSizeMB = 2,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`A imagem excede o tamanho máximo de ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`${styles.field} field`}>
      <button
        type="button"
        className={`${styles.dropzone} ${value ? styles.filled : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt={label} className={styles.preview} />
        ) : (
          <span className={styles.placeholder}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M5 5h22a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                stroke="#7A7A7A"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                stroke="#7A7A7A"
                strokeWidth="1.6"
              />
              <path
                d="M29 21l-7-7-13 13"
                stroke="#7A7A7A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.label}>{label}</span>
          </span>
        )}
      </button>

      {value && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={handleRemove}
        >
          Remover
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />
    </div>
  );
}
