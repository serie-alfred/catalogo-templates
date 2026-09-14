import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/ShopByRoom07` do faststore.starter — "Escolha por
 * ambiente": rótulo, título e pills de ambiente, com um ativo.
 */
const conteudo = {
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
  return (
    <div className={styles.shopByRoom07Root}>
      <section className={styles.section} data-role="room-section">
        <p className={styles.eyebrow} data-role="room-eyebrow">
          {conteudo.eyebrow}
        </p>
        <h2 className={styles.title} data-role="room-title">
          {conteudo.title}
        </h2>
        <div className={styles.pills} data-role="room-pills">
          {conteudo.rooms.map((r, i) => (
            <a
              key={i}
              href={r.url}
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
