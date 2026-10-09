'use client';

import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/BlackFriday01` do faststore.starter — a LP de campanha
 * inteira (hero, contador, categorias, duas vitrines, bloco institucional, régua
 * de benefícios e newsletter) numa
 * seção só, como o /gerador a entrega. Conteúdo = o `mock.ts` da origem, que é
 * o texto literal do Figma "Templates - Serie A" (7311:6357 / 7311:6207).
 *
 * Mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1. As imagens são
 * os placeholders do Figma (public/gerador/lp/BlackFriday01). Onde o starter usa
 * `<picture media>`, aqui são duas `<img>` trocadas por `@container`: o palco de
 * export renderiza o mobile num div de 375px DENTRO do documento do editor, e o
 * `media` leria a janela.
 */

const IMG = '/gerador/lp/BlackFriday01';
const RETRATO = `${IMG}/ph-card.png`;

// Fontes do design com os pesos e o itálico do Figma — a mesma URL do starter.
const FONTES =
  'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,600;0,800;1,800&family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Manrope:wght@400;500;600;700&display=swap';

// 2 dias, 14 h, 27 min e 36 s a partir da montagem: é o que o Figma mostra.
const DURACAO = ((2 * 24 + 14) * 3600 + 27 * 60 + 36) * 1000;

const UNIDADES = [
  { key: 'd', label: 'Dias' },
  { key: 'h', label: 'Horas' },
  { key: 'm', label: 'Minutos' },
  { key: 's', label: 'Segundos' },
] as const;

type Restante = Record<(typeof UNIDADES)[number]['key'], number>;

function restante(fim: number): Restante {
  const s = Math.floor(Math.max(0, fim - Date.now()) / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const dois = (n: number) => String(n).padStart(2, '0');

const CATEGORIAS = [
  { title: 'Looks\nfemininos', subtitle: 'Estilo e ofertas para\ntodas as ocasiões' },
  { title: 'Looks\nMasculinos', subtitle: 'Essenciais Com\naté 70% OFF' },
  { title: 'Acessórios', subtitle: 'O toque final\npara o seu look' },
  { title: 'Calçados', subtitle: 'Conforto e estilo\nem grandes ofertas' },
];

const PRODUTOS = [1, 2, 3, 4, 5, 6];

const TEXTO_SOBRE =
  'Lorem ipsum dolor sit amet consectetur. Turpis auctor et orci feugiat. Purus tellus a molestie ornare et sed quis justo pellentesque. Scelerisque purus elit et urna aliquam. Dolor vel arcu a adipiscing enim habitasse. Quis cras sapien dignissim hendrerit purus vitae. Nullam ut a sed sit dictumst vitae vel tortor sit. Sollicitudin mattis odio ornare eget dolor enim eu volutpat. Neque tortor cursus nulla quis ullamcorper facilisi. Pretium suspendisse feugiat tellus commodo porttitor arcu turpis maecenas. Ultricies tellus odio amet elementum orci aliquam leo libero.';

const ArrowRight = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15.8333 10H4.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6667 14.1667L15.8333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6667 5.83333L15.8333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Heart = () => (
  <svg aria-hidden="true" width="22.333" height="21.583" viewBox="0 0 22.3333 21.5834" fill="none">
    <path
      d="M9.70981 18.0954C7.12363 16.1615 2 11.7402 2 7.76157C2 5.13183 3.92982 3 6.58333 3C7.95833 3 9.33333 3.45833 11.1667 5.29167C13 3.45833 14.375 3 15.75 3C18.4035 3 20.3333 5.13183 20.3333 7.76157C20.3333 11.7402 15.2097 16.1615 12.6235 18.0954C11.7532 18.7461 10.5801 18.7461 9.70981 18.0954Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BENEFICIOS = [0, 1, 2, 3];

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d={dir === 'next' ? 'M8.33333 13.3333L11.6667 10L8.33333 6.66667' : 'M11.6667 13.3333L8.33333 10L11.6667 6.66667'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Card() {
  return (
    <div className={styles.card} data-role="bf-card">
      <a className={styles.cardLink} href="#" aria-label="Camisa Polo Piquet Manga Curta Azul" />
      <div className={styles.cardMedia}>
        <img className={styles.cardImg} src={RETRATO} alt="Camisa Polo Piquet Manga Curta Azul" width={230} height={345} />
        <div className={styles.cardTags}>
          <span className={styles.cardTag} data-role="bf-card-tag">Novidade</span>
          <span className={styles.cardOff} data-role="bf-card-off">10% OFF</span>
        </div>
        <button type="button" className={styles.cardWish} data-role="bf-card-wish" aria-pressed={false} aria-label="Adicionar à lista de desejos">
          <Heart />
        </button>
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardName} data-role="bf-card-name">Camisa Polo Piquet Manga Curta Azul</h3>
        <div className={styles.cardPrices}>
          <s className={styles.cardList} data-role="bf-card-list">R$ 149,90</s>
          <span className={styles.cardPrice} data-role="bf-card-price">R$ 59,90</span>
        </div>
        <p className={styles.cardPix} data-role="bf-card-pix">
          <strong>R$ 55,90</strong> no pix
        </p>
        <p className={styles.cardInstallment} data-role="bf-card-installment">8x R$ 5,90 no cartão</p>
      </div>
    </div>
  );
}

/** Faixa de cards: rolagem nativa no lugar do Swiper (o canvas é mock). */
function Shelf({ variant }: { variant: 'full' | 'banner' }) {
  return (
    <section
      className={`${styles.shelf} ${variant === 'banner' ? styles.shelfBanner : styles.shelfFull}`}
      data-role={variant === 'banner' ? 'bf-shelf-banner' : 'bf-shelf'}
    >
      <div className={styles.shelfHead}>
        <div className={styles.shelfHeading}>
          <h2 className={styles.shelfTitle} data-role="bf-shelf-title">LOREM IPSUM</h2>
          <p className={styles.shelfSubtitle} data-role="bf-shelf-subtitle">Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <a className={styles.shelfViewAll} href="#" data-role="bf-shelf-viewall">Ver todos</a>
      </div>
      <div className={styles.shelfRow}>
        <div className={styles.shelfCarousel}>
          <div className={styles.track}>
            {PRODUTOS.map(i => (
              <div key={i} className={styles.slide}>
                <Card />
              </div>
            ))}
          </div>
          <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} aria-label="Produtos anteriores" disabled>
            <Chevron dir="prev" />
          </button>
          <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} aria-label="Próximos produtos">
            <Chevron dir="next" />
          </button>
        </div>
        {variant === 'banner' && (
          <a className={styles.shelfBannerLink} href="#" aria-label="Ver ofertas">
            <span className={styles.shelfBannerMedia} data-role="bf-shelf-banner-img">
              <img className={styles.onlyDesktop} src={RETRATO} alt="" width={477} height={485} />
              <img className={styles.onlyMobile} src={`${IMG}/ph-square.png`} alt="" width={358} height={358} />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}

function Benefits() {
  const [atual, setAtual] = useState(0);
  const ir = (passo: number) => setAtual(i => (i + passo + BENEFICIOS.length) % BENEFICIOS.length);

  return (
    <section className={styles.benefits} data-role="bf-benefits" aria-label="Benefícios">
      <button type="button" className={styles.benefitsArrow} aria-label="Benefício anterior" onClick={() => ir(-1)}>
        <Chevron dir="prev" />
      </button>
      <ul className={styles.benefitsList}>
        {BENEFICIOS.map(i => (
          <li key={i} className={`${styles.benefit}${i === atual ? ` ${styles.benefitAtual}` : ''}`} data-role="bf-benefit">
            <p className={styles.benefitTitle} data-role="bf-benefit-title">Frete Grátis</p>
            <p className={styles.benefitText} data-role="bf-benefit-text">Bônus primeira compra</p>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.benefitsArrow} aria-label="Próximo benefício" onClick={() => ir(1)}>
        <Chevron dir="next" />
      </button>
    </section>
  );
}

function Newsletter() {
  return (
    <section className={styles.newsletter} data-role="bf-newsletter">
      <div className={styles.newsletterPanel}>
        <h2 className={styles.newsletterTitle} data-role="bf-newsletter-title">Lorem ipsum dolor sit amet.</h2>
        <p className={styles.newsletterText} data-role="bf-newsletter-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat.
        </p>
      </div>
      <div className={styles.newsletterForm}>
        <p className={styles.newsletterFormTitle} data-role="bf-newsletter-form-title">Lorem ipsum dolor sit amet.</p>
        <form className={styles.newsletterFields} onSubmit={e => e.preventDefault()}>
          <label className={styles.newsletterField}>
            <span className={styles.srOnly}>Lorem ipsum</span>
            <input className={styles.newsletterInput} data-role="bf-newsletter-input" type="text" name="name" placeholder="Lorem ipsum" />
          </label>
          <label className={styles.newsletterField}>
            <span className={styles.srOnly}>Lorem ipsum</span>
            <input className={styles.newsletterInput} data-role="bf-newsletter-input" type="email" name="email" placeholder="Lorem ipsum" />
          </label>
          <button type="submit" className={styles.newsletterButton} data-role="bf-newsletter-button">
            Veja Coleção
          </button>
        </form>
      </div>
    </section>
  );
}

export default function BlackFriday() {
  const [fim] = useState(() => Date.now() + DURACAO);
  const [tempo, setTempo] = useState<Restante>(() => restante(fim));

  useEffect(() => {
    const id = window.setInterval(() => setTempo(restante(fim)), 1000);
    return () => window.clearInterval(id);
  }, [fim]);

  return (
    <div className={styles.blackFriday01} data-role="bf-root">
      <link rel="stylesheet" href={FONTES} />

      <section className={styles.hero} data-role="bf-hero">
        <span className={`${styles.heroMedia} ${styles.heroMediaContain}`} data-role="bf-hero-img">
          <img className={styles.onlyDesktop} src={`${IMG}/ph-square.png`} alt="" width={1280} height={459} />
          <img className={styles.onlyMobile} src={RETRATO} alt="" width={390} height={540} />
        </span>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow} data-role="bf-hero-eyebrow">Moda com até 70% off</p>
          <h1 className={styles.heroTitle} data-role="bf-hero-title">
            <span className={styles.heroTitleDesktop}>{'Black Friday Moda\nque combina com você'}</span>
            <span className={styles.heroTitleMobile}>{'Black Friday\nModa que combina\ncom você'}</span>
          </h1>
          <p className={styles.heroText} data-role="bf-hero-text">
            {'As melhores ofertas de moda feminina, masculina,\ncalçados e acessórios em uma só Black Friday.\nEstilo, qualidade e preços imperdíveis para renovar\no seu guarda-roupa.'}
          </p>
        </div>
      </section>

      <section className={styles.countdown} data-role="bf-countdown">
        <div className={styles.countdownHead}>
          <p className={styles.countdownLabel} data-role="bf-countdown-label">Oferta termina</p>
          <p className={styles.countdownTitle} data-role="bf-countdown-title">
            Black<span className={styles.accent}> Friday</span>
          </p>
        </div>
        <div className={styles.countdownBody}>
          <div className={styles.countdownUnits} role="timer" aria-label="Tempo restante da oferta">
            {UNIDADES.map(u => (
              <div key={u.key} className={styles.countdownUnit} data-role="bf-countdown-unit">
                <span className={styles.countdownValue} suppressHydrationWarning>{dois(tempo[u.key])}</span>
                <span className={styles.countdownUnitLabel}>{u.label}</span>
              </div>
            ))}
          </div>
          <span className={styles.countdownRule} aria-hidden="true" />
          <p className={styles.countdownNote} data-role="bf-countdown-note">{'Produtos com\ndescontos imperdíveis\npor tempo limitado'}</p>
        </div>
      </section>

      <section className={styles.categoryStrip} data-role="bf-categories">
        {CATEGORIAS.map(c => (
          <a key={c.title} className={styles.category} href="#" data-role="bf-category">
            <img className={styles.categoryImg} src={RETRATO} alt="" width={292} height={340} />
            <div className={styles.categoryContent}>
              <p className={styles.categoryTitle} data-role="bf-category-title">{c.title}</p>
              <p className={styles.categoryText} data-role="bf-category-text">{c.subtitle}</p>
              <span className={styles.categoryButton} data-role="bf-category-button">
                <span>Ver Produtos</span>
                <ArrowRight />
              </span>
            </div>
          </a>
        ))}
      </section>

      <Shelf variant="full" />
      <Shelf variant="banner" />

      <section className={styles.about} data-role="bf-about">
        <span className={styles.aboutGlow} aria-hidden="true" />
        <div className={styles.aboutRow}>
          <div className={styles.collage} data-role="bf-collage">
            <span className={styles.collageGlow} aria-hidden="true" />
            <img className={`${styles.collageImg} ${styles.collageA}`} src={RETRATO} alt="" />
            <img className={`${styles.collageImg} ${styles.collageB}`} src={RETRATO} alt="" />
            <img className={`${styles.collageImg} ${styles.collageC}`} src={RETRATO} alt="" />
          </div>
          <div className={styles.aboutText}>
            <p className={styles.aboutEyebrow} data-role="bf-about-eyebrow">
              Black<span className={styles.accent}> Friday</span>
            </p>
            <h2 className={styles.aboutTitle} data-role="bf-about-title">Moda com mais estilo, economia e propósito</h2>
            <p className={styles.aboutBody} data-role="bf-about-text">{TEXTO_SOBRE}</p>
          </div>
        </div>
        <div className={styles.aboutBanners}>
          {[0, 1].map(i => (
            <a key={i} className={styles.aboutBannerLink} href="#" aria-label="Ver ofertas">
              <span className={styles.aboutBanner} data-role="bf-about-banner">
                <img className={styles.onlyDesktop} src={`${IMG}/ph-banner-desktop.png`} alt="" width={507} height={241} />
                <img className={styles.onlyMobile} src={`${IMG}/ph-banner-mobile.png`} alt="" width={342} height={148} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <Benefits />
      <Newsletter />
    </div>
  );
}
