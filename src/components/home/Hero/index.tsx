'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { useProvador } from '@/components/home/Provador';
import LinkComercial from '@/components/site/LinkComercial';
import type { TemplateDoProvador } from '@/utils/provador';

import styles from './index.module.css';

const TROCA_MS = 3200;

/**
 * O hero é o provador: o título termina no nome do template, na fonte dele;
 * o leque de amostras escolhe; a loja inclinada troca de roupa e a página
 * inteira muda de cor junto (Provador). Enquanto ninguém escolhe, troca
 * sozinho — só com o hero na tela e a aba visível.
 *
 * A órbita são os `novos` (os mais recentes do catálogo), cada um um link para
 * a vitrine — é a faixa `[data-home-novos]` que o funil `2-vitrine` confere.
 */
export default function Hero({
  novos,
  whatsapp,
}: {
  novos: TemplateDoProvador[];
  whatsapp: boolean;
}) {
  const p = useProvador()!;
  const { provaveis, indice, escolhido, provar, avancar, atual } = p;
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    if (escolhido) return;
    let visivel = true;
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
    });
    if (raiz.current) obs.observe(raiz.current);
    const id = setInterval(() => {
      if (
        visivel &&
        document.visibilityState === 'visible' &&
        document.documentElement.dataset.intro !== 'rodando'
      )
        avancar();
    }, TROCA_MS);
    return () => {
      clearInterval(id);
      obs.disconnect();
    };
  }, [escolhido, avancar]);

  // No celular o leque rola para o lado: a amostra provada fica à vista.
  const leque = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = leque.current;
    const ativa = el?.children[indice] as HTMLElement | undefined;
    if (!el || !ativa || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({
      left: ativa.offsetLeft - el.clientWidth / 2 + ativa.offsetWidth / 2,
      behavior: 'smooth',
    });
  }, [indice]);

  return (
    <section ref={raiz} className={styles.hero} aria-labelledby="hero-titulo">
      <div className={styles.texto}>
        <h1 id="hero-titulo" className={styles.titulo}>
          <span className={styles.linha}>
            <span>Prove uma</span>
          </span>
          <span className={styles.linha}>
            <span>loja nova:</span>
          </span>
          <span className="siteSr">{atual.visual.nome}.</span>
          <span className={styles.rolo} aria-hidden>
            <span
              className={styles.roloTrilho}
              style={{ transform: `translateY(${-indice * 1.12}em)` }}
            >
              {provaveis.map(t => (
                <span
                  key={t.slug}
                  style={{
                    fontFamily: t.visual.fonte,
                    fontWeight: t.visual.peso,
                    fontStyle: t.visual.estilo,
                    color: t.visual.acento,
                  }}
                >
                  {t.visual.nome}.
                </span>
              ))}
            </span>
          </span>
        </h1>
        <p className={styles.lead}>
          Templates completos para VTEX FastStore, Wake e Tray. Prove os estilos
          aqui, escolha o seu e receba a loja montada com a sua marca.
        </p>
        <div className={styles.acoes}>
          <a
            href="#templates"
            className={styles.principal}
            data-rastrear="cta_ver_templates"
          >
            Ver os templates
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <LinkComercial
            whatsapp={whatsapp}
            origem="hero"
            className={styles.secundario}
          >
            Falar com o comercial
          </LinkComercial>
        </div>

        <div className={styles.provar}>
          <span id="leque-rotulo" className={styles.provarRotulo}>
            Prove os estilos — a página inteira veste o escolhido.
          </span>
          <div
            role="group"
            aria-labelledby="leque-rotulo"
            className={styles.leque}
            ref={leque}
          >
            {provaveis.map((t, i) => {
              const ativo = i === indice;
              const distancia = i - indice;
              return (
                <button
                  key={t.slug}
                  type="button"
                  className={styles.amostra}
                  aria-pressed={ativo}
                  aria-label={`Provar o template ${t.visual.nome}`}
                  onClick={() => provar(i)}
                  style={
                    {
                      '--a-fundo': t.visual.amostra,
                      '--a-texto': t.visual.textoNaAmostra,
                      '--a-fonte': t.visual.fonte,
                      '--a-peso': t.visual.peso,
                      '--a-estilo': t.visual.estilo,
                      '--a-giro': `${ativo ? 0 : Math.max(-14, Math.min(14, distancia * 3.2))}deg`,
                      '--a-sobe': ativo ? '-30px' : '0px',
                      '--a-atraso': `${0.9 + i * 0.06}s`,
                      zIndex: ativo ? 20 : 10 - Math.abs(distancia),
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.amostraAa}>Aa</span>
                  <span className={styles.amostraNome}>{t.visual.nome}</span>
                  <span className={styles.amostraNum}>{t.slug}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.palco}>
        <div className={styles.orbita} data-home-novos="" aria-hidden>
          {novos.map((t, k) => {
            const giro = (360 / novos.length) * k + 15;
            return (
              <div
                key={t.slug}
                className={styles.orbitaBraco}
                style={{
                  transform: `rotate(${giro}deg) translateX(var(--raio)) rotate(${-giro}deg)`,
                }}
              >
                <div className={styles.orbitaContra}>
                  <a
                    href={t.link}
                    data-spot={Number(t.slug)}
                    className={styles.orbitaCard}
                    style={{ animationDelay: `${1.3 + k * 0.08}s` }}
                    tabIndex={-1}
                    aria-label={t.titulo}
                  >
                    <Image
                      src={t.imagem}
                      alt=""
                      width={256}
                      height={194}
                      sizes="128px"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.loja}>
          <div className={styles.lojaFlutua}>
            <div className={styles.barra}>sualoja.com.br</div>
            <div className={styles.tela}>
              {provaveis.map((t, i) => (
                <Image
                  key={t.slug}
                  src={t.imagem}
                  alt={i === indice ? `Home do template ${t.visual.nome}` : ''}
                  fill
                  sizes="(max-width: 900px) 92vw, 600px"
                  priority={i === 0}
                  className={styles.telaImg}
                  data-ativo={i === indice ? '' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
