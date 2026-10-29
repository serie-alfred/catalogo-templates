import React, { useRef, useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain14` do faststore.starter (família 14, Esportiva; desenho
 * `BannerMain14` / `BannerMain14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (três
 * slides, sem arte: vale o placeholder do painel, como no desenho). Setas, barras e arraste
 * trocam o slide no estado local, como lá; sem autoplay.
 */
interface BannerMain14Stat {
  /** Número em destaque (ex.: "248 g"). */
  value?: string;
  /** Legenda abaixo do número (ex.: "peso no 41"). */
  label?: string;
}

interface BannerMain14Slide {
  /** Selo lima acima do título (ex.: "Lançamento · Linha Velox"). */
  eyebrow?: string;
  title?: string;
  /** Palavra de destaque depois do título, no paralelogramo vermelho (ex.: "longe"). */
  titleAccent?: string;
  text?: string;
  /** Números de destaque (até 3). */
  stats?: BannerMain14Stat[];
  ctaLabel?: string;
  ctaUrl?: string;
  /** Link sublinhado ao lado do CTA (ex.: "Ver toda a linha"). */
  secondaryLabel?: string;
  secondaryUrl?: string;
  /** Link da arte. */
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerMain14Props {
  slides?: BannerMain14Slide[];
}

const Seta = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="square"
    aria-hidden="true"
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="square"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

// Conteúdo do mock.ts do starter.
const base = {
  eyebrow: 'Lançamento · Linha Velox',
  text: 'Velox Run 3: espuma de alta resposta e cabedal respirável para treinos longos e provas de rua.',
  stats: [
    { value: '248 g', label: 'peso no 41' },
    { value: '8 mm', label: 'de drop' },
    { value: '+12%', label: 'retorno de energia' },
  ],
  ctaLabel: 'Comprar agora',
  ctaUrl: '/s',
  secondaryLabel: 'Ver toda a linha',
  secondaryUrl: '/s',
  url: '/s',
};
const CONTEUDO: BannerMain14Props = {
  slides: [
    {
      ...base,
      title: 'Corra mais',
      titleAccent: 'longe',
      imageAlt: 'Conhecer a linha Velox',
    },
    {
      ...base,
      title: 'Treine sem',
      titleAccent: 'pausa',
      imageAlt: 'Conhecer a linha de treino',
    },
    {
      ...base,
      title: 'Pedale mais',
      titleAccent: 'forte',
      imageAlt: 'Conhecer a linha de ciclismo',
    },
  ],
};

export default function BannerMain14() {
  const { slides = [] } = CONTEUDO;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length) return null;
  const total = slides.length;
  const idx = Math.min(atual, total - 1);
  const ir = (i: number) => setAtual((i + total) % total);
  const s = slides[idx];
  const temArte = !!(s.imageDesktop || s.imageMobile);
  const stats = (s.stats ?? []).filter(st => st.value || st.label).slice(0, 3);

  return (
    <div className={styles.bannerMain14Box}>
      <section
        className={styles.bannerMain14}
        aria-roledescription="carrossel"
        aria-label="Destaques"
        data-role="bm-root"
        onTouchStart={e => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={e => {
          if (toqueX.current === null || total < 2) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1));
        }}
      >
        {/* <link> de stylesheet no body é "body-ok" no HTML: o navegador aplica sem hoist. */}
        <link rel="stylesheet" href={FONTES_14} />
        <a
          className={styles.art}
          href={s.url || s.ctaUrl || '#'}
          aria-label={
            temArte
              ? undefined
              : s.imageAlt ||
                [s.title, s.titleAccent].filter(Boolean).join(' ') ||
                'Ver destaque'
          }
          data-role="bm-image"
        >
          {temArte && (
            <picture>
              {s.imageMobile && (
                <source media="(max-width: 960px)" srcSet={s.imageMobile} />
              )}
              <img
                src={s.imageDesktop || s.imageMobile}
                alt={s.imageAlt ?? ''}
                width={1920}
                height={1000}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                {...(idx === 0 ? { fetchpriority: 'high' } : {})}
              />
            </picture>
          )}
        </a>
        <div className={styles.panel} aria-hidden="true" />
        <div className={styles.stripe} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.copy} aria-live="polite">
            {s.eyebrow && (
              <span className={styles.eyebrow} data-role="bm-eyebrow">
                {s.eyebrow}
              </span>
            )}
            {(s.title || s.titleAccent) && (
              <h2 className={styles.title} data-role="bm-title">
                {s.title}
                {s.title && s.titleAccent && ' '}
                {s.titleAccent && (
                  <span className={styles.accent}>{s.titleAccent}</span>
                )}
              </h2>
            )}
            {s.text && (
              <p className={styles.text} data-role="bm-text">
                {s.text}
              </p>
            )}
            {stats.length > 0 && (
              <dl className={styles.stats} data-role="bm-stats">
                {stats.map((st, i) => (
                  <div key={i} className={styles.stat}>
                    {st.value && (
                      <dt className={styles.statValue}>{st.value}</dt>
                    )}
                    {st.label && (
                      <dd className={styles.statLabel}>{st.label}</dd>
                    )}
                  </div>
                ))}
              </dl>
            )}
            {(s.ctaLabel || s.secondaryLabel) && (
              <div className={styles.actions}>
                {s.ctaLabel && (
                  <a
                    className={styles.cta}
                    href={s.ctaUrl || '#'}
                    data-role="bm-cta"
                  >
                    {s.ctaLabel}
                    <Seta />
                  </a>
                )}
                {s.secondaryLabel && (
                  <a
                    className={styles.secondary}
                    href={s.secondaryUrl || '#'}
                    data-role="bm-link"
                  >
                    {s.secondaryLabel}
                  </a>
                )}
              </div>
            )}
          </div>
          {total > 1 && (
            <div className={styles.nav} data-role="bm-nav">
              <span className={styles.counter} aria-hidden="true">
                {dois(idx + 1)}
                <span className={styles.counterTotal}> / {dois(total)}</span>
              </span>
              <div className={styles.bars}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.barBtn}
                    onClick={() => ir(i)}
                    aria-current={i === idx}
                    aria-label={
                      i === idx
                        ? `Slide ${i + 1} de ${total}, atual`
                        : `Slide ${i + 1} de ${total}`
                    }
                    data-role="bm-dot"
                  >
                    <span
                      className={`${styles.bar}${i === idx ? ` ${styles.barOn}` : ''}`}
                    />
                  </button>
                ))}
              </div>
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.prev}
                  onClick={() => ir(idx - 1)}
                  aria-label="Slide anterior"
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => ir(idx + 1)}
                  aria-label="Próximo slide"
                >
                  <Chevron dir="next" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
