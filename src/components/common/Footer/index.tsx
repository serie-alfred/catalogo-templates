import React from 'react';
import Link from 'next/link';

import Logo from '@/components/common/Logo';
import LinkComercial from '@/components/site/LinkComercial';
import PreferenciasDeCookies from '@/components/site/PreferenciasDeCookies';
import { comerciais } from '@/lib/comercial';
import { templatesDaVitrine } from '@/utils/vitrineTemplates';
import { VISUAL_DOS_TEMPLATES } from '@/utils/provador';

import ContactForm from './ContactForm';

import styles from './index.module.css';

/*
 * O fechamento do site: o convite final, os dois canais do comercial
 * (WhatsApp pelo rodízio e o formulário, que vai para a caixa central) e a
 * linha de baixo. Sempre claro: não veste o template provado.
 */
export default function Footer() {
  const whatsapp = comerciais().length > 0;
  const templates = templatesDaVitrine()
    .map(t => VISUAL_DOS_TEMPLATES[t.template]?.nome)
    .filter((n): n is string => Boolean(n));

  return (
    <footer className={styles.footer}>
      <section
        id="contato"
        className={styles.contato}
        aria-labelledby="contato-titulo"
      >
        <div className={styles.convite}>
          <h2 id="contato-titulo" className={styles.titulo}>
            Gostou de algum?
          </h2>
          <p className={styles.texto}>
            O comercial te ajuda a escolher o template e fala com você pelo
            WhatsApp ou por e-mail, como preferir.
          </p>
          {whatsapp && (
            <LinkComercial whatsapp origem="rodape" className={styles.botao}>
              Chamar no WhatsApp
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </LinkComercial>
          )}
          <ul className={styles.atendimento}>
            <li>
              <a href="tel:+551141158384">+55 11 4115-8384</a>
            </li>
            <li>
              <a href="mailto:comercial@e-temas.com.br">
                comercial@e-temas.com.br
              </a>
            </li>
          </ul>
        </div>
        <ContactForm templates={templates} />
      </section>

      <div className={styles.base}>
        <Link
          href="/"
          aria-label="e-temas, página inicial"
          className={styles.baseLogo}
        >
          <Logo tamanho={22} />
        </Link>
        <span>VTEX FastStore · Wake · Tray</span>
        <span>© 2026 E-TEMAS · Empresa P4C Group</span>
        <span className={styles.baseLinks}>
          <a href="/privacidade">Política de Privacidade</a>
          <PreferenciasDeCookies />
        </span>
      </div>
    </footer>
  );
}
