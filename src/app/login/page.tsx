import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  COOKIE_SESSAO,
  destinoSeguro,
  modoAuth,
  sessaoValida,
  variaveisFaltando,
} from '@/lib/auth';
import { EtemasMark } from '@/assets/icons/editor';

import styles from './index.module.css';

// O modo é do ambiente em runtime, e a sessão é do cookie: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

const ERROS: Record<string, string> = {
  credenciais: 'Usuário ou senha incorretos.',
  limite: 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.',
  config: 'O login não está configurado neste ambiente.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string; saiu?: string }>;
}) {
  const { next, erro, saiu } = await searchParams;
  const destino = destinoSeguro(next);
  const modo = modoAuth();

  if (
    modo === 'ligado' &&
    (await sessaoValida((await cookies()).get(COOKIE_SESSAO)?.value))
  ) {
    redirect(destino);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <EtemasMark width={27.4} height={24} />
          <span className={styles.brandName}>E-temas</span>
          <span className={styles.badge}>Editor de Temas</span>
        </div>

        {modo === 'fechado' ? (
          <div className={styles.config} role="alert" data-login-fechado="">
            <h1 className={styles.title}>Acesso fechado</h1>
            <p className={styles.text}>
              O login do editor não está configurado neste ambiente, e sem ele o
              /gerador fica fechado. Cadastre no projeto da Vercel (Environment
              Variables) e faça um novo deploy:
            </p>
            <ul className={styles.vars}>
              {variaveisFaltando().map(v => (
                <li key={v}>
                  <code>{v}</code>
                </li>
              ))}
            </ul>
            <p className={styles.text}>
              O preview compartilhado (/p/…) continua no ar.
            </p>
          </div>
        ) : modo === 'desligado-dev' ? (
          <div className={styles.config} role="status" data-login-desligado="">
            <h1 className={styles.title}>Login desligado</h1>
            <p className={styles.text}>
              Em desenvolvimento, sem as variáveis ETEMAS_LOGIN_USER,
              ETEMAS_LOGIN_PASSWORD e ETEMAS_SESSION_SECRET, o editor abre sem
              login. Em produção, sem elas, o acesso fica fechado.
            </p>
            <a className={styles.primary} href={destino}>
              Abrir o editor
            </a>
          </div>
        ) : (
          <form
            className={styles.form}
            method="post"
            action="/api/auth/login"
            data-login-form=""
          >
            <h1 className={styles.title}>Entrar</h1>
            <p className={styles.text}>
              Use a conta da agência para abrir o editor e o histórico de temas.
            </p>
            {erro && ERROS[erro] && (
              <p className={styles.erro} role="alert" data-login-erro={erro}>
                {ERROS[erro]}
              </p>
            )}
            {saiu && !erro && (
              <p className={styles.ok} role="status">
                Você saiu do editor.
              </p>
            )}
            <input type="hidden" name="next" value={destino} />
            <label className={styles.label} htmlFor="usuario">
              Usuário
            </label>
            <input
              className={styles.input}
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              required
              autoFocus
            />
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <input
              className={styles.input}
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
            />
            <button className={styles.primary} type="submit">
              Entrar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
