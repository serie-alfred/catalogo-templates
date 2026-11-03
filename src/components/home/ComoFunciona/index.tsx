'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useProvador } from '@/components/home/Provador';

import styles from './index.module.css';

const PASSOS = [
  {
    titulo: 'Escolha o template',
    texto:
      'Lojas completas, cada uma com home, categoria e produto desenhados para funcionar juntos.',
  },
  {
    titulo: 'A gente aplica a sua marca',
    texto:
      'Logo, cores e tipografia da sua marca, ajustados por quem monta lojas todos os dias.',
  },
  {
    titulo: 'Entregamos na sua plataforma',
    texto:
      'VTEX FastStore, Wake ou Tray: o tema chega montado na plataforma que você já usa.',
  },
  {
    titulo: 'Sua loja no ar',
    texto: 'Você revisa, aprova e publica, sem começar do zero.',
  },
];

const PLATAFORMAS = ['VTEX FastStore', 'Wake', 'Tray'];

/**
 * "Da escolha à loja no ar": a seção é alta e o palco fica preso na tela
 * (`sticky`); o quanto ela já rolou escolhe o passo. A loja é a do template
 * provado no hero, e cada passo mexe nela — ganha a marca, as plataformas, o
 * endereço e o carimbo "No ar".
 *
 * No celular (≤ 900px) não cabe o palco inteiro preso: só a loja fica presa no
 * alto, e os passos rolam por baixo dela. O passo é o que cruza a linha a 60%
 * da área que a loja deixa livre embaixo — é onde o olho está.
 */
export default function ComoFunciona() {
  const { atual } = useProvador()!;
  const secao = useRef<HTMLElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const demo = useRef<HTMLDivElement>(null);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    let raf = 0;
    const celular = window.matchMedia('(max-width: 900px)');
    const medir = () => {
      raf = 0;
      const el = secao.current;
      if (!el) return;
      let p = 0;
      if (celular.matches && lista.current && demo.current) {
        const r = lista.current.getBoundingClientRect();
        const livre = Math.max(0, demo.current.getBoundingClientRect().bottom);
        // 60% da área livre: com passos de 30vh, o título do passo ainda está
        // à vista (abaixo da loja) quando o próximo assume.
        const linha = livre + (window.innerHeight - livre) * 0.6;
        p = Math.max(0, Math.min(1, (linha - r.top) / r.height));
      } else {
        const r = el.getBoundingClientRect();
        const curso = r.height - window.innerHeight;
        p = curso > 0 ? Math.max(0, Math.min(1, -r.top / curso)) : 0;
      }
      setProgresso(anterior => (Math.abs(anterior - p) > 0.002 ? p : anterior));
    };
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, []);

  const passo = Math.min(
    PASSOS.length - 1,
    Math.floor(progresso * PASSOS.length)
  );
  const dentroDoPasso = Math.max(
    0,
    Math.min(1, progresso * PASSOS.length - passo)
  );
  const plataformaAtiva =
    passo === 2 ? Math.min(2, Math.floor(dentroDoPasso * 3)) : 0;

  return (
    <section
      ref={secao}
      id="como-funciona"
      className={styles.secao}
      aria-labelledby="como-titulo"
      data-passo={passo}
    >
      <div className={styles.palco}>
        <div className={styles.texto}>
          <div className={styles.cabeca}>
            <h2 id="como-titulo" className={styles.titulo}>
              Da escolha à loja no ar.
            </h2>
            <span className={styles.contador} aria-hidden>
              Passo {passo + 1} de {PASSOS.length}
            </span>
          </div>
          <ol className={styles.passos} ref={lista}>
            {PASSOS.map((p, i) => (
              <li
                key={p.titulo}
                className={styles.passo}
                aria-current={i === passo ? 'step' : undefined}
                style={
                  {
                    // Quanto do passo já foi rolado: cheio nos anteriores,
                    // enchendo no atual, vazio nos próximos.
                    '--feito': i < passo ? 1 : i === passo ? dentroDoPasso : 0,
                  } as React.CSSProperties
                }
              >
                <span className={styles.numero}>{i + 1}</span>
                <span className={styles.passoTexto}>
                  <span className={styles.passoTitulo}>{p.titulo}</span>
                  <span className={styles.passoDescricao}>{p.texto}</span>
                  <span className={styles.progresso} aria-hidden>
                    <span />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.demo} ref={demo}>
          <div className={styles.abas} aria-hidden>
            {PLATAFORMAS.map((nome, i) => (
              <span
                key={nome}
                className={styles.aba}
                data-ativa={i === plataformaAtiva ? '' : undefined}
              >
                {nome}
              </span>
            ))}
          </div>
          <div className={styles.janela}>
            <div className={styles.barra}>
              {passo === 3 ? (
                <span className={styles.digita}>sualoja.com.br</span>
              ) : (
                <span>prévia do tema</span>
              )}
            </div>
            <div className={styles.tela}>
              <Image
                key={atual.slug}
                src={atual.imagem}
                alt={`Loja montada com o template ${atual.visual.nome}`}
                fill
                sizes="(max-width: 900px) 92vw, 640px"
                className={styles.telaImg}
              />
            </div>
            {passo === 3 && (
              <span className={styles.carimbo} aria-hidden>
                No ar
              </span>
            )}
          </div>
          <div className={styles.kit} aria-hidden>
            <span className={styles.kitRotulo}>A sua marca</span>
            <span className={styles.kitNome}>Sua Marca</span>
            <span className={styles.kitCores}>
              <span style={{ background: '#1f4a3d' }} />
              <span style={{ background: '#d9c7a3' }} />
              <span style={{ background: '#2b2b28' }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
