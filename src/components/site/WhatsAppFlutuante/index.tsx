'use client';

import React, { useEffect, useState } from 'react';

import LinkComercial from '@/components/site/LinkComercial';

import styles from './index.module.css';

/**
 * O atalho do comercial que acompanha a rolagem. Só existe com o time
 * cadastrado em `COMERCIAIS`, e só aparece depois do hero — lá em cima os
 * botões do próprio hero já fazem isso — e some no rodapé.
 */
export default function WhatsAppFlutuante({ whatsapp }: { whatsapp: boolean }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // Some também no rodapé, onde o botão do WhatsApp e o formulário já estão.
    let noContato = false;
    const aoRolar = () =>
      setVisivel(!noContato && window.scrollY > window.innerHeight * 0.8);
    const contato = document.getElementById('contato');
    const obs = new IntersectionObserver(([e]) => {
      noContato = e.isIntersecting;
      aoRolar();
    });
    if (contato) obs.observe(contato);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', aoRolar);
    };
  }, []);

  if (!whatsapp) return null;
  return (
    <div className={styles.flutuante} data-visivel={visivel ? '' : undefined}>
      <LinkComercial
        whatsapp
        origem="flutuante"
        className={styles.botao}
        aria-label="Falar com o comercial pelo WhatsApp"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 20l1.4-4.2A8 8 0 1 1 8.6 19z" />
        </svg>
        <span>Comercial</span>
      </LinkComercial>
    </div>
  );
}
