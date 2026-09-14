import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescriptionBanner01` do faststore.starter — o
 * banner livre do produto, que a loja cadastra no campo `descriptionBanner` da
 * VTEX e o componente injeta como HTML.
 *
 * A origem não tem props de CMS: o conteúdo é 100% do produto. Aqui é o mesmo
 * HTML de exemplo que o starter passou a usar quando não há PDP no contexto,
 * com as classes `desktop__only`/`mobile__only` que os seletores de atributo
 * do CSS esperam.
 */
const bannerHTML = `
<img data-role="pdb-img-d" class="desktop__only" src="https://placehold.co/1200x420/2b2b2b/f2f2f2?text=Banner+do+produto+(desktop)" alt="Banner do produto" />
<img data-role="pdb-img-m" class="mobile__only" src="https://placehold.co/720x720/2b2b2b/f2f2f2?text=Banner+do+produto+(mobile)" alt="Banner do produto" />
`.trim();

export default function ProductBanner() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div
          className={styles.productDescription}
          data-role="pdb-banner"
          dangerouslySetInnerHTML={{ __html: bannerHTML }}
        />
      </div>
    </div>
  );
}
