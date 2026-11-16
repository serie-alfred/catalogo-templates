import { redirect } from 'next/navigation';
import { destinoSeguro, modoAuth, variaveisFaltando } from '@/lib/auth';
import { contaAtual } from '@/lib/contaAtual';
import Logo from '@/components/common/Logo';

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
  searchParams: Promise<{
    next?: string;
    erro?: string;
    saiu?: string;
    revogada?: string;
  }>;
}) {
  const { next, erro, saiu, revogada } = await searchParams;
  const destino = destinoSeguro(next);
  const modo = modoAuth();

  // A conta INTEIRA, não só o cookie: a sessão de um convidado revogado tem
  // assinatura válida, e mandá-lo ao editor (que o devolve para cá) dava laço.
  if (modo === 'ligado' && (await contaAtual().catch(() => null))) {
    redirect(destino);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Logo tamanho={24} />
          <span className={styles.badge}>Editor de temas</span>
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
              Use a conta da agência, ou a conta que a agência criou para você.
            </p>
            {revogada && !erro && (
              <p
                className={styles.erro}
                role="alert"
                data-login-erro="revogada"
              >
                Seu acesso foi alterado ou desativado. Entre de novo, ou fale
                com a agência.
              </p>
            )}
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
