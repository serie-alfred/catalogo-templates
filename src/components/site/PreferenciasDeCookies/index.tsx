'use client';

import React from 'react';

import { gravarConsentimento, temRastreio } from '@/lib/tracking/consentimento';

/** Reabre o banner de cookies: apaga a escolha guardada. */
export default function PreferenciasDeCookies() {
  if (!temRastreio()) return null;
  return (
    <button
      type="button"
      onClick={() => gravarConsentimento(null)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: 4,
      }}
    >
      Preferências de cookies
    </button>
  );
}
