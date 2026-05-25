import { useState } from 'react';
import styles from './index.module.css';

const FooterNovo = () => {
  const [open, setOpen] = useState(true);

  return (
    <footer className={styles.siteFooter} role="contentinfo">
      <section className={styles.benefits} aria-label="Benefícios da loja">
        <div className={styles.benefitsInner}>
          <article className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M3 7h11v8H3z" />
                <path d="M14 10h4l3 3v2h-7" />
                <circle cx="7" cy="17.5" r="1.6" />
                <circle cx="17" cy="17.5" r="1.6" />
              </svg>
            </span>
            <div>
              <p className={styles.benefitTitle}>
                Frete grátis acima de R$ 350
              </p>
              <p className={styles.benefitSub}>
                Para todo o Brasil, em compras à vista ou em até 6×.
              </p>
            </div>
          </article>

          <article className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M4 11a8 8 0 0 1 14-5.3" />
                <path d="M18 3v4h-4" />
                <path d="M20 13a8 8 0 0 1-14 5.3" />
                <path d="M6 21v-4h4" />
              </svg>
            </span>
            <div>
              <p className={styles.benefitTitle}>Troca fácil em 30 dias</p>
              <p className={styles.benefitSub}>
                Devolução simples e rápida em qualquer Correios.
              </p>
            </div>
          </article>

          <article className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
                <path d="m9.5 12.2 1.8 1.8 3.5-3.7" />
              </svg>
            </span>
            <div>
              <p className={styles.benefitTitle}>Compra 100% segura</p>
              <p className={styles.benefitSub}>
                Criptografia SSL, dados protegidos e antifraude.
              </p>
            </div>
          </article>

          <article className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M4 13a8 8 0 0 1 16 0v3a3 3 0 0 1-3 3h-1v-6h4" />
                <path d="M4 13v3a3 3 0 0 0 3 3h1v-6H4" />
              </svg>
            </span>
            <div>
              <p className={styles.benefitTitle}>Atendimento especializado</p>
              <p className={styles.benefitSub}>
                Time fluente em fits, tamanhos e novos drops.
              </p>
            </div>
          </article>

          <article className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M5 5h14v14H5z" />
                <path d="M3 9h18" />
                <path d="M9 3v4" />
                <path d="M15 3v4" />
                <path d="m12 13 1.2 2.5 2.8.4-2 2 .5 2.7-2.5-1.3-2.5 1.3.5-2.7-2-2 2.8-.4Z" />
              </svg>
            </span>
            <div>
              <p className={styles.benefitTitle}>Drops toda semana</p>
              <p className={styles.benefitSub}>
                Coleções limitadas, todas as quintas, às 19h.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.footerMain}>
        <div className={styles.footerMainInner}>
          <div className={styles.footerBrand}>
            <a href="#" className={styles.brandLogo}>
              NORTE<span>.</span>
            </a>
            <p>
              Moda masculina streetwear com estética urbana, acabamento premium
              e atitude contemporânea. Feita em pequenas tiragens, em
              São&nbsp;Paulo.
            </p>
            <div className={styles.socials} aria-label="Redes sociais">
              <a href="#" aria-label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17"
                    cy="7"
                    r=".9"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
                  <path d="M14 4c.4 2.5 2.4 4.3 5 4.5" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="6" width="18" height="12" rx="3" />
                  <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="Pinterest">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M11 8c2 0 3.5 1.3 3.5 3.3 0 2.4-1.6 4.2-3.4 4.2-1 0-1.7-.5-2-1.2" />
                  <path d="M10.6 12 9 21" />
                </svg>
              </a>
            </div>
          </div>

          <details className={styles.col} open>
            <summary className={styles.colHead}>
              <span>Institucional</span>
              <span className={styles.colChev}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <ul className={styles.colList}>
              <li>
                <a href="#">Sobre a marca</a>
              </li>
              <li>
                <a href="#">Nossa história</a>
              </li>
              <li>
                <a href="#">Lojas e showroom</a>
              </li>
              <li>
                <a href="#">Trabalhe conosco</a>
              </li>
              <li>
                <a href="#">Blog · Diário NORTE</a>
              </li>
              <li>
                <a href="#">Imprensa</a>
              </li>
              <li>
                <a href="#">Sustentabilidade</a>
              </li>
            </ul>
          </details>

          <details className={styles.col} open>
            <summary className={styles.colHead}>
              <span>Atendimento</span>
              <div className={styles.colChev}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </summary>
            <ul className={`${styles.colList}`}>
              <li>
                <a href="#">Central de atendimento</a>
              </li>
              <li>
                <a href="#">Trocas e devoluções</a>
              </li>
              <li>
                <a href="#">Política de entrega</a>
              </li>
              <li>
                <a href="#">Dúvidas frequentes</a>
              </li>
              <li>
                <a href="#">Rastrear pedido</a>
              </li>
              <li>
                <a href="#">Guia de tamanhos</a>
              </li>
              <li>
                <a href="#">Fale conosco</a>
              </li>
            </ul>
          </details>

          <details className={styles.col} open>
            <summary className={styles.colHead}>
              <span>Categorias</span>
              <span className={styles.colChev}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <ul className={styles.colList}>
              <li>
                <a href="#">Novidades</a>
              </li>
              <li>
                <a href="#">Camisetas</a>
              </li>
              <li>
                <a href="#">Moletons</a>
              </li>
              <li>
                <a href="#">Calças</a>
              </li>
              <li>
                <a href="#">Jaquetas</a>
              </li>
              <li>
                <a href="#">Acessórios</a>
              </li>
              <li>
                <a href="#" className={styles.colSale}>
                  Sale
                </a>
              </li>
            </ul>
          </details>

          <details className={`${styles.col} ${styles.colPolicies}`}>
            <summary className={styles.colHead}>
              <span>Políticas</span>
              <span className={styles.colChev}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <ul className={styles.colList}>
              <li>
                <a href="#">Política de privacidade</a>
              </li>
              <li>
                <a href="#">Termos de uso</a>
              </li>
              <li>
                <a href="#">Política de cookies</a>
              </li>
              <li>
                <a href="#">Política de troca</a>
              </li>
              <li>
                <a href="#">LGPD</a>
              </li>
            </ul>
          </details>

          <div className={styles.nl}>
            <p className={styles.nlEyebrow}>Newsletter</p>
            <h3 className={styles.nlTitle}>Fique por dentro dos novos drops</h3>
            <p className={styles.nlSub}>
              Receba lançamentos, ofertas exclusivas e novidades da marca em
              primeira mão — todas as quintas, antes de irem ao ar.
            </p>
            <form
              className={styles.nlForm}
              id="nl-form"
              onSubmit={e => {
                e.preventDefault();
                // @ts-ignore (evita erro do typescript caso o window._nlSubmit não esteja tipado)
                window._nlSubmit && window._nlSubmit();
              }}
            >
              <input
                className={styles.nlInput}
                id="nl-input"
                type="email"
                placeholder="Seu e-mail"
                autoComplete="email"
                required
              />
              <button type="submit" className={styles.nlBtn}>
                Cadastrar
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </form>
            <div
              className={styles.nlSuccess}
              id="nl-success"
              role="status"
              aria-live="polite"
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5 10 17l9-9.5" />
              </svg>
              <span className={styles.nlSuccessTxt}>
                <b>Pronto.</b> Você está na lista do próximo drop.
              </span>
            </div>
            <p className={styles.nlLegal}>
              Ao se cadastrar, você concorda com nossa{' '}
              <a href="#">Política de Privacidade</a> e com receber comunicações
              da NORTE.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.trust}>
        <div className={styles.trustInner}>
          <div className={styles.trustGroup}>
            <span className={styles.trustLabel}>Pagamento</span>
            <div className={styles.payRow}>
              <span className={styles.payChip}>
                <span className={styles.payChipLbl}>VISA</span>
              </span>
              <span className={styles.payChip}>
                <svg viewBox="0 0 30 18" width="22" height="13">
                  <circle cx="11" cy="9" r="6" fill="#000" />
                  <circle cx="19" cy="9" r="6" fill="#e73888" opacity=".95" />
                  <path
                    d="M15 4.6a6 6 0 0 1 0 8.8 6 6 0 0 1 0-8.8Z"
                    fill="#000"
                    opacity=".6"
                  />
                </svg>
              </span>
              <span className={styles.payChip}>
                <span className={styles.payChipLbl}>AMEX</span>
              </span>
              <span className={styles.payChip}>
                <span className={styles.payChipLbl}>ELO</span>
              </span>
              <span className={styles.payChip}>
                <span className={styles.payChipLbl}>HIPER</span>
              </span>
              <span className={styles.payChip}>
                <span
                  className={`${styles.payChipLbl} ${styles.payChipLblRose}`}
                >
                  PIX
                </span>
              </span>
              <span className={styles.payChip}>
                <span className={styles.payChipLbl}>BOLETO</span>
              </span>
            </div>
          </div>
          <div className={styles.secRow}>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="10" width="14" height="9" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              SSL · Certificado
            </span>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
                <path d="m9.5 12.2 1.8 1.8 3.5-3.7" />
              </svg>
              Compra protegida
            </span>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3.5" y="5" width="17" height="11" rx="2" />
                <path d="M3.5 9h17" />
                <path d="M7 13h3" />
              </svg>
              Pagamento criptografado
            </span>
          </div>
        </div>
      </section>

      <section className={styles.legal}>
        <div className={styles.legalInner}>
          <span className={styles.legalBrand}>
            © 2026 NORTE<span>.</span> Todos os direitos reservados.
          </span>
          <span className={styles.legalCnpj}>
            NORTE Streetwear Ltda. · CNPJ 38.482.117/0001-04 · Rua&nbsp;Augusta,
            2.840 — São&nbsp;Paulo, SP
          </span>
          <a href="#" className={styles.legalPlatform}>
            <span className={styles.legalPlatformBrand}>
              SÉRIE<span>//</span>A
            </span>
            <span className={styles.legalPlatformSep}></span>
            <span className={styles.legalPlatformRole}>Plataforma</span>
          </a>
        </div>
      </section>
    </footer>
  );
};

export default FooterNovo;
