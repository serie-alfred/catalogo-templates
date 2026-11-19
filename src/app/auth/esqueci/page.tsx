import { modoAuth } from '@/lib/auth';
import CartaoDeAcesso from '@/components/acesso/CartaoDeAcesso';

import styles from '@/components/acesso/acesso.module.css';

export const dynamic = 'force-dynamic';

const ERROS: Record<string, string> = {
  email: 'Digite um e-mail válido.',
  link: 'O link do e-mail é inválido ou já venceu. Peça um novo abaixo.',
  config: 'O login não está configurado neste ambiente.',
};

/**
 * "Esqueci a senha": o e-mail vai a /api/auth/esqueci, que pede o link ao
 * Supabase. A confirmação é a MESMA exista a conta ou não.
 */
export default async function EsqueciPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const { enviado, erro } = await searchParams;
  const ligado = modoAuth() === 'ligado';

  return (
    <CartaoDeAcesso>
      {enviado ? (
        <div className={styles.config} data-esqueci-enviado="">
          <h1 className={styles.title}>Confira o e-mail</h1>
          <p className={styles.ok} role="status">
            Se esse e-mail tiver acesso ao editor, chega nele em alguns minutos
            um link para criar uma senha nova. Confira também o spam.
          </p>
          <p className={styles.text}>
            O link vale por pouco tempo e só uma vez. Na tela da senha nova,
            quem já usa o app de autenticação digita também o código dele.
          </p>
          <a className={styles.link} href="/login">
            Voltar ao login
          </a>
        </div>
      ) : (
        <form
          className={styles.form}
          method="post"
          action="/api/auth/esqueci"
          data-esqueci-form=""
        >
          <h1 className={styles.title}>Nova senha</h1>
          <p className={styles.text}>
            Digite o e-mail da sua conta. Enviamos um link para você criar uma
            senha nova.
          </p>
          {(erro && ERROS[erro]) || !ligado ? (
            <p
              className={styles.erro}
              role="alert"
              data-esqueci-erro={erro ?? 'config'}
            >
              {ERROS[erro ?? 'config'] ?? ERROS.config}
            </p>
          ) : null}
          <label className={styles.label} htmlFor="email">
            E-mail
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
          />
          <button className={styles.primary} type="submit" disabled={!ligado}>
            Enviar o link
          </button>
          <a className={styles.link} href="/login">
            Voltar ao login
          </a>
        </form>
      )}
    </CartaoDeAcesso>
  );
}
