import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** Um banner de categoria do schema do MultiCategories04. */
interface MultiCategories04Card {
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
  link?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do MultiCategories04. */
interface MultiCategories04Conteudo {
  title?: string;
  description?: string;
  cards: MultiCategories04Card[];
}

const MOCK: MultiCategories04Conteudo = {
  title: 'Browse by rooms',
  description:
    'Sit massa etiam urna id. Non pulvinar aenean ultrices lectus vitae imperdiet vulputate a eu. Aliquet ullamcorper leo mi vel sit pretium euismod eget.',
  cards: [
    { image: 'https://placehold.co/580x456', alt: 'Living Room', title: 'Living Room', description: '15 products', link: '#' },
    { image: 'https://placehold.co/570x278', alt: 'Bedroom', title: 'Bedroom', description: '24 products', link: '#' },
    { image: 'https://placehold.co/275x275', alt: 'Walk-in Closet', title: 'Walk-in Closet', description: '30 products', link: '#' },
    { image: 'https://placehold.co/275x275', alt: 'Kitchen', title: 'Kitchen', description: '24 products', link: '#' },
  ],
};

/** O banner com selo de nome e contagem; o mosaico põe cada um no seu lugar. */
function Card({ card }: { card?: MultiCategories04Card }) {
  if (!card) return null;
  return (
    <div className={styles.bannerImageText} data-role="mc-card">
      <a href={card.link || '#'}>
        <img
          src={card.image}
          alt={card.alt ?? ''}
          loading="lazy"
          data-role="mc-card-image"
        />
      </a>
      <div className={styles.bannerText}>
        <div className={styles.containerBannerText}>
          {card.title && <h2 data-role="mc-card-title">{card.title}</h2>}
          {card.description && <p data-role="mc-card-text">{card.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function MultiCategories() {
  const { title, description, cards } = useConteudoDaSecao(MOCK);

  return (
    <section className={styles.homeBIR} data-role="mc-root">
      <div className={`${styles.roomBrowserSection} component__container`}>
        <div className={styles.roomBrowserContent}>
          {/* Living Room */}
          <div className={styles.livingRoomContainer}>
            <div className={styles.roomBrowserHeader}>
              {title && <h3 className={styles.roomBrowserTitle} data-role="mc-title">{title}</h3>}
              {description && (
                <div className={styles.roomBrowserDescription} data-role="mc-description">
                  {description}
                </div>
              )}
            </div>

            <div className={styles.livingRoomImageWrapper}>
              <Card card={cards[0]} />
            </div>
          </div>

          {/* Bedroom + Others */}
          <div className={styles.bedroomContainer}>
            <div className={styles.bedroomImageWrapper}>
              <Card card={cards[1]} />
            </div>

            {/* Walk-in Closet + Kitchen */}
            <div className={styles.customRow}>
              <div className={styles.customRowContent}>
                <div className={styles.walkInClosetColumn}>
                  <div className={styles.walkInClosetContainer}>
                    <div className={styles.walkInClosetImage}>
                      <Card card={cards[2]} />
                    </div>
                  </div>
                </div>

                <div className={styles.kitchenColumn}>
                  <div className={styles.kitchenContainer}>
                    <div className={styles.kitchenImage}>
                      <Card card={cards[3]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
MultiCategories.conteudoPadrao = MOCK;
