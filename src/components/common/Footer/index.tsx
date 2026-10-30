import React from 'react';

import ContactForm from './ContactForm';

import styles from './index.module.css';

/*
 * Sem selos: os PNGs eram do tamanho exato em que apareciam (borravam em tela
 * de alta densidade) e não há versão oficial em vetor que possa morar neste
 * repo público. Sem links para páginas que não existem: "Quem somos", "Seja
 * parceiro", "Trabalhe conosco" e "Saiba mais" voltam quando houver conteúdo.
 */
export default function Footer() {
  return (
    <footer>
      <div className={styles.footerTopContainer} id="contato">
        <div className={styles.footerTop}>
          <div className={styles.footerEsq}>
            <div className={styles.containerTitle}>
              <h2>Que tal lançar sua loja dos sonhos em órbita?</h2>
              <p>
                Compartilhe os desafios da sua empresa com nossa tripulação de
                especialistas, que vai te ajudar!
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
      <div className={styles.footerMiddleContainer}>
        <div className={styles.footerMiddle}>
          <div className={styles.menu}>
            <span className={styles.menuTitle}>Atendimento</span>
            <ul className={styles.menuContainer}>
              <li>+55 11 4115-8384</li>
              <li>comercial@e-temas.com.br</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.footerBottomContainer}>
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>© 2026 E-TEMAS - Empresa P4C Group</p>
            <a href="/privacidade">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
