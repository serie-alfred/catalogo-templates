import React from 'react';

/**
 * Ícones remanescentes do editor antigo.
 *
 * Tinha 14 chaves; 13 eram os ícones das abas da dock inferior, removida no
 * redesign. Os ícones novos vivem em `editor.tsx` (proprietários, exportados do
 * Figma) e em `lucide-react`.
 */
export const iconsGenerator = {
  closeSide: (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2771 0.244081C14.9454 -0.0813604 14.4077 -0.0813604 14.0761 0.244081L7.88152 6.32274L1.68699 0.244081C1.35535 -0.0813604 0.817648 -0.0813604 0.486009 0.244081C0.154362 0.569515 0.154362 1.09716 0.486009 1.42259L6.68055 7.50124L0.486027 13.5798C0.154379 13.9053 0.154379 14.4329 0.486027 14.7584C0.817665 15.0838 1.35537 15.0838 1.68701 14.7584L7.88152 8.67974L14.0761 14.7584C14.4077 15.0838 14.9454 15.0838 15.2771 14.7584C15.6087 14.4329 15.6087 13.9053 15.2771 13.5799L9.08249 7.50124L15.2771 1.42259C15.6087 1.09716 15.6087 0.569515 15.2771 0.244081Z"
        fill="#0F0F0F"
      />
    </svg>
  ),
};
