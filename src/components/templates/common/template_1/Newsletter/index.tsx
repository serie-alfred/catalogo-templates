import styles from './index.module.css';

export default function Newsletter() {
  return (
    <div className={`${styles.footer__newsletter}`}>
      <div className={`${styles.newsletter__container} component__container`}>
        <div className={styles.newsletter__row}>
          <div className={styles.newsletter}>
            {/* Título */}
            <div className={styles.newsletter__title}>
              <span>Assine nossa Newsletter</span>
              <span>Fique por dentro das novidades e ofertas exclusivas!</span>
            </div>

            {/* Formulário */}
            <div className={styles.newsletter__form}>
              <div id="mc_embed_shell">
                <div id="mc_embed_signup">
                  <form
                    action="https://paulibrasexpress.us22.list-manage.com/subscribe/post?u=e3420099959e896421f6775cd&amp;id=602a..."
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    target="_blank"
                    noValidate
                  >
                    <div className={`${styles.form__wrapper}`}>
                      {/* Nome */}
                      <div className={`${styles.form__item} mc-field-group`}>
                        <input
                          type="text"
                          name="FNAME"
                          id="mce-FNAME"
                          placeholder="Seu primeiro nome..."
                        />
                        {/* Mensagem de privacidade */}
                        <span className={styles.newsletter__message}>
                          Ao se inscrever você concorda com nossa Política de
                          Privacidade
                        </span>
                      </div>

                      {/* Email */}
                      <div className={`${styles.form__item} mc-field-group`}>
                        <input
                          type="email"
                          name="EMAIL"
                          id="mce-EMAIL"
                          required
                          placeholder="empresa@email.com.br"
                        />
                      </div>

                      {/* Botão */}
                      <div className={styles['optionalParent']}>
                        <div
                          className={`clear foot ${styles['mc-embedded-subscribe']}`}
                        >
                          <input
                            type="submit"
                            name="subscribe"
                            id="mc-embedded-subscribe"
                            className="button"
                            value="Cadastrar"
                          />
                          <svg
                            fill="none"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 16L14 12L10 8"
                              stroke="#F5F5F5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
