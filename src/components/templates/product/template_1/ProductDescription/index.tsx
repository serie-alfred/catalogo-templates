import React from 'react';
import styles from './index.module.css';

export default function ProductDescription() {
  return (
    <div className={styles.productDescription}>
      <div className={`${styles.descriptionContainer} component__container`}>
        <div className={styles.descriptionRow}>
          <div className={styles.descriptionTitle}>
            <h2>Descrição</h2>
          </div>

          {/* Tabs fixas */}
          <div id="ProdBlock" className={styles.hidden}>
            <div
              id="ProdAbas"
              className={`${styles.abasProduto} ${styles.hidden}`}
            >
              <ul>
                <li id="description" className={styles.aberta}>
                  <a
                    href="#"
                    data-tab-container-id="container1"
                    data-tab-url="/descricao"
                  >
                    Descrição
                  </a>
                </li>
                <li id="downloads">
                  <a
                    href="#"
                    data-tab-container-id="container2"
                    data-tab-url="/downloads"
                  >
                    Downloads
                  </a>
                </li>
              </ul>
            </div>

            {/* Conteúdos fixos das abas */}
            <div className={styles.customContent}>
              <p>Conteúdo personalizado da aba.</p>
            </div>
            <div className={styles.downloadsContent}>
              <p>Conteúdo fixo de downloads.</p>
            </div>
          </div>

          {/* Descrição fixa */}
          <div className={styles.descriptionWrapper}>
            <p>
              <strong>Lorem Ipsum </strong> is simply dummy text of the printing
              and typesetting industry. Lorem Ipsum has been the industry
              standard dummy text ever since the 1500s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
