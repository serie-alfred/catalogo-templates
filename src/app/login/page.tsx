import { redirect } from 'next/navigation';
import { destinoSeguro, variaveisFaltando } from '@/lib/auth';
import { estadoDoAcesso, type EstadoDoAcesso } from '@/lib/contaAtual';
import { clienteDoServidor } from '@/lib/supabase/servidor';
import CartaoDeAcesso from '@/components/acesso/CartaoDeAcesso';
import FormDoCodigo from '@/components/acesso/FormDoCodigo';

import styles from '@/components/acesso/acesso.module.css';

// O modo é do ambiente em runtime, e a sessão é do cookie: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

const ERROS: Record<string, string> = {
  credenciais: 'E-mail ou senha incorretos.',
  limite: 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.',
  config: 'O login não está configurado neste ambiente.',
  inativa: 'Seu acesso foi desativado. Fale com a agência.',
  sessao: 'Sua sessão expirou. Entre de novo com e-mail e senha.',
  indisponivel:
    'Não foi possível falar com o serviço de login agora. Tente de novo em instantes.',
};

const BLOQUEIOS: Record<
  Extract<EstadoDoAcesso, { etapa: 'bloqueada' }>['motivo'],
  string
> = {
  'sem-tabela':
    'A tabela de contas ainda não existe no Supabase: rode a migração supabase/migrations/…_contas.sql no SQL Editor do projeto. Até lá, ninguém entra no editor.',
  'sem-conta':
    'Este e-mail entrou, mas não tem acesso ao editor. Fale com a agência.',
  inativa: 'Seu acesso foi desativado. Fale com a agência.',
  'sem-plataforma':
    'Sua conta está sem nenhuma plataforma liberada. Fale com a agência.',
};

/**
 * O cadastro do app de autenticação (primeiro acesso): apaga o cadastro que
 * ficou pela metade (QR gerado e nunca confirmado) e gera um novo. O segredo
 * só existe nesta resposta: o Supabase não o devolve de novo.
 */
async function novoCadastroDoApp() {
  const sb = await clienteDoServidor();
  if (!sb) return null;
  const { data } = await sb.auth.mfa.listFactors();
  for (const f of data?.all ?? [])
    if (f.factor_type === 'totp' && f.status === 'unverified')
      await sb.auth.mfa.unenroll({ factorId: f.id });
  const { data: novo, error } = await sb.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'E-temas',
    friendlyName: `E-temas ${new Date().toISOString()}`,
  });
  if (error || !novo) {
    console.error('Cadastro do 2FA: erro do Supabase', error?.message);
    return null;
  }
  return { fator: novo.id, qr: novo.totp.qr_code, segredo: novo.totp.secret };
}

function Sair({ rotulo }: { rotulo: string }) {
  return (
    <form method="post" action="/api/auth/logout">
      <button type="submit" className={styles.link} data-login-sair="">
        {rotulo}
      </button>
    </form>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    erro?: string;
    saiu?: string;
    revogada?: string;
    senha?: string;
  }>;
}) {
  const { next, erro, saiu, revogada, senha } = await searchParams;
  const destino = destinoSeguro(next);

  let estado: EstadoDoAcesso;
  let falhou = false;
  try {
    estado = await estadoDoAcesso();
  } catch (e) {
    console.error('Login: falha ao ler a sessão', e);
    estado = { etapa: 'senha' };
    falhou = true;
  }

  // Sessão aal2 com conta ativa: já pode entrar.
  if (estado.etapa === 'pronto') redirect(destino);

  const cadastro =
    estado.etapa === 'cadastro-2fa' ? await novoCadastroDoApp() : null;
  const erroDaTela = falhou ? 'indisponivel' : erro;

  return (
    <CartaoDeAcesso>
      {estado.etapa === 'fechado' ? (
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
      ) : estado.etapa === 'sem-login' ? (
        <div className={styles.config} role="status" data-login-desligado="">
          <h1 className={styles.title}>Login desligado</h1>
          <p className={styles.text}>
            Em desenvolvimento, sem as variáveis NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SECRET_KEY, o editor
            abre sem login. Em produção, sem elas, o acesso fica fechado.
          </p>
          <a className={styles.primary} href={destino}>
            Abrir o editor
          </a>
        </div>
      ) : estado.etapa === 'bloqueada' ? (
        <div className={styles.config} role="alert" data-login-bloqueada="">
          <h1 className={styles.title}>Sem acesso</h1>
          <p className={styles.erro} data-login-bloqueio={estado.motivo}>
            {BLOQUEIOS[estado.motivo]}
          </p>
          <p className={styles.text}>
            Conta: <strong>{estado.email}</strong>
          </p>
          <Sair rotulo="Sair e usar outra conta" />
        </div>
      ) : estado.etapa === 'codigo' ? (
        <div className={styles.config} data-login-etapa="codigo">
          <h1 className={styles.title}>Código</h1>
          <p className={styles.text}>
            Abra o app de autenticação e digite o código do E-temas para{' '}
            <strong>{estado.email}</strong>.
          </p>
          {senha === 'nova' && (
            <p className={styles.ok} role="status">
              Senha trocada. Falta o código para entrar.
            </p>
          )}
          <FormDoCodigo
            fator={estado.fator}
            next={destino}
            botao="Entrar"
            erroInicial={erroDaTela}
          />
          <div className={styles.rodape}>
            <Sair rotulo="Usar outra conta" />
          </div>
        </div>
      ) : estado.etapa === 'cadastro-2fa' ? (
        <div className={styles.config} data-login-etapa="cadastro-2fa">
          <h1 className={styles.title}>Duas etapas</h1>
          {senha && (
            <p className={styles.ok} role="status">
              Senha definida. Falta só um passo.
            </p>
          )}
          <p className={styles.text}>
            Para entrar no editor, a verificação em duas etapas é obrigatória.
            Faça uma vez só:
          </p>
          <ol className={styles.passos}>
            <li>
              Abra um app de autenticação (Google Authenticator, Microsoft
              Authenticator, 1Password, Authy…).
            </li>
            <li>Escaneie o QR code, ou digite a chave abaixo.</li>
            <li>Digite o código de 6 dígitos que o app mostrar.</li>
          </ol>
          {cadastro ? (
            <>
              {/* SVG em data URL, gerado pelo Supabase. */}
              <img
                className={styles.qr}
                src={cadastro.qr}
                alt="QR code para cadastrar o E-temas no app de autenticação"
                data-login-qr=""
              />
              <code className={styles.segredo} data-login-segredo="">
                {cadastro.segredo}
              </code>
              <FormDoCodigo
                fator={cadastro.fator}
                next={destino}
                botao="Confirmar e entrar"
                erroInicial={erroDaTela}
              />
            </>
          ) : (
            <p className={styles.erro} role="alert">
              Não foi possível gerar o QR code agora. Recarregue a página.
            </p>
          )}
          <div className={styles.rodape}>
            <Sair rotulo="Usar outra conta" />
          </div>
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
            Use o e-mail da agência, ou o e-mail em que você recebeu o convite.
          </p>
          {revogada && !erroDaTela && (
            <p className={styles.erro} role="alert" data-login-erro="revogada">
              Seu acesso foi alterado ou desativado. Entre de novo, ou fale com
              a agência.
            </p>
          )}
          {erroDaTela && ERROS[erroDaTela] && (
            <p
              className={styles.erro}
              role="alert"
              data-login-erro={erroDaTela}
            >
              {ERROS[erroDaTela]}
            </p>
          )}
          {saiu && !erroDaTela && (
            <p className={styles.ok} role="status">
              Você saiu do editor.
            </p>
          )}
          <input type="hidden" name="next" value={destino} />
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
            Continuar
          </button>
          <a className={styles.link} href="/auth/esqueci" data-login-esqueci="">
            Esqueci a senha
          </a>
        </form>
      )}
    </CartaoDeAcesso>
  );
}
