import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/ShopByRoom07` do faststore.starter — "Escolha por
 * ambiente": rótulo, título e pills de ambiente, com um ativo. Conteúdo = o mock.ts
 * de lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */
interface ShopByRoomConteudo {
  eyebrow?: string;
  title?: string;
  rooms: { label?: string; url?: string; active?: boolean }[];
}

const MOCK: ShopByRoomConteudo = {
  eyebrow: 'Inspire-se',
  title: 'Escolha por ambiente',
  rooms: [
    { label: 'Sala', url: '/ambientes/sala', active: true },
    { label: 'Quarto', url: '/ambientes/quarto', active: false },
    { label: 'Banheiro', url: '/ambientes/banheiro', active: false },
    { label: 'Cozinha', url: '/ambientes/cozinha', active: false },
    { label: 'Entrada', url: '/ambientes/entrada', active: false },
  ],
};

export default function ShopByRoom() {
  const { eyebrow, title, rooms } = useConteudoDaSecao(MOCK);

  return (
    <div className={styles.shopByRoom07Root}>
      <section className={styles.section} data-role="room-section">
        {eyebrow && (
          <p className={styles.eyebrow} data-role="room-eyebrow">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className={styles.title} data-role="room-title">
            {title}
          </h2>
        )}
        <div className={styles.pills} data-role="room-pills">
          {rooms.map((r, i) => (
            <a
              key={i}
              href={r.url || '#'}
              className={r.active ? styles.pillActive : styles.pill}
              data-role="room-pill"
            >
              {r.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShopByRoom.conteudoPadrao = MOCK;
