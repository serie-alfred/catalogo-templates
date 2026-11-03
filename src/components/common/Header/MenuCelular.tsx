'use client';

import React, { useEffect, useRef, useState } from 'react';

import LinkComercial from '@/components/site/LinkComercial';

import styles from './MenuCelular.module.css';

const LINKS = [
  { href: '/#templates', rotulo: 'Templates' },
  { href: '/#como-funciona', rotulo: 'Como funciona' },
  { href: '/#quem-faz', rotulo: 'Quem faz' },
  { href: '/#contato', rotulo: 'Contato' },
];

/**
 * O menu do header no celular (até 820px, onde os links e o botão do
 * comercial do header somem): o botão abre uma folha na cor do template
 * provado, com as seções da página e o comercial. Fecha no link, no Esc e no
 * próprio botão; enquanto aberta, a página não rola por baixo.
 */
export default function MenuCelular({ whatsapp }: { whatsapp: boolean }) {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const folha = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = 'hidden';
    folha.current?.querySelector<HTMLElement>('a')?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botao.current?.focus();
      }
    };
    // Virou desktop com o menu aberto (girou o tablet): fecha.
    const largo = window.matchMedia('(min-width: 821px)');
    const aoAlargar = () => largo.matches && setAberto(false);
    document.addEventListener('keydown', tecla);
    largo.addEventListener('change', aoAlargar);
    return () => {
      raiz.style.overflow = antes;
      document.removeEventListener('keydown', tecla);
      largo.removeEventListener('change', aoAlargar);
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botao}
        type="button"
        className={styles.botao}
        aria-expanded={aberto}
        aria-controls="menu-celular"
        aria-label={aberto ? 'Fechar o menu' : 'Abrir o menu'}
        onClick={() => setAberto(a => !a)}
      >
        <span className={styles.risco} />
        <span className={styles.risco} />
      </button>

      <div
        ref={folha}
        id="menu-celular"
        className={styles.folha}
        data-aberto={aberto ? '' : undefined}
        // Fechada, a folha sai da ordem de Tab e do leitor de tela.
        inert={!aberto}
      >
        <nav aria-label="Seções da página" className={styles.links}>
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              style={{ '--i': i } as React.CSSProperties}
            >
              {l.rotulo}
            </a>
          ))}
        </nav>
        <div className={styles.rodape}>
          <LinkComercial
            whatsapp={whatsapp}
            origem="menu-celular"
            className={styles.cta}
          >
            Falar com o comercial
          </LinkComercial>
          <a href="tel:+551141158384" className={styles.contato}>
            +55 11 4115-8384
          </a>
        </div>
      </div>
    </>
  );
}
