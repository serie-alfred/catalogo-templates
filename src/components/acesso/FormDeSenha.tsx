import { modoAuth, SENHA_MINIMA } from '@/lib/auth';
import { clienteDoServidor } from '@/lib/supabase/servidor';
import CartaoDeAcesso from './CartaoDeAcesso';

import styles from './acesso.module.css';

const ERROS: Record<string, string> = {
  curta: `A senha precisa de pelo menos ${SENHA_MINIMA} caracteres.`,
  longa: 'Senha longa demais.',
  diferentes: 'As duas senhas não são iguais.',
  fraca: 'Senha fraca demais: use letras, números e símbolos.',
  igual: 'A senha nova é igual à atual. Escolha outra.',
  codigo: 'Código do app incorreto ou vencido.',
  limite: 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.',
  falha: 'Não foi possível salvar a senha. Tente de novo.',
  config: 'O login não está configurado neste ambiente.',
};

/**
 * A tela de definir a senha, com a sessão que o link do e-mail abriu
 * (/auth/callback): a do convite (`definir`) e a do "esqueci a senha"
 * (`nova`). Sem sessão, o link venceu. Quem já tem o app de autenticação
 * cadastrado digita também o código (ver /api/auth/senha).
 */
export default async function FormDeSenha({
  tipo,
  erro,
}: {
  tipo: 'definir' | 'nova';
  erro?: string;
}) {
  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  const { data } = sb ? await sb.auth.getClaims() : { data: null };
  const claims = data?.claims;

  let pedeCodigo = false;
  if (sb && claims?.sub && claims.aal !== 'aal2') {
    const fatores = await sb.auth.mfa.listFactors();
    pedeCodigo = !!fatores.data?.totp.some(f => f.status === 'verified');
  }

  const titulo = tipo === 'definir' ? 'Crie sua senha' : 'Senha nova';

  return (
    <CartaoDeAcesso>
      {!claims?.sub || erro === 'sessao' ? (
        <div className={styles.config} role="alert" data-senha-sem-sessao="">
          <h1 className={styles.title}>Link vencido</h1>
          <p className={styles.text}>
            {tipo === 'definir'
              ? 'O link do convite é inválido ou já foi usado. Peça à agência para reenviar o acesso, ou crie a senha pelo "Esqueci a senha".'
              : 'O link do e-mail é inválido ou já venceu. Peça um novo.'}
          </p>
          <a className={styles.primary} href="/auth/esqueci">
            Pedir um link novo
          </a>
          <a className={styles.link} href="/login">
            Voltar ao login
          </a>
        </div>
      ) : (
        <form
          className={styles.form}
          method="post"
          action="/api/auth/senha"
          data-senha-form={tipo}
        >
          <h1 className={styles.title}>{titulo}</h1>
          <p className={styles.text}>
            Conta: <strong>{String(claims.email ?? '')}</strong>.{' '}
            {tipo === 'definir'
              ? 'Depois da senha, você cadastra o app de autenticação (obrigatório) e entra no editor.'
              : `Pelo menos ${SENHA_MINIMA} caracteres.`}
          </p>
          {erro && ERROS[erro] && (
            <p className={styles.erro} role="alert" data-senha-erro={erro}>
              {ERROS[erro]}
            </p>
          )}
          <input type="hidden" name="tipo" value={tipo} />
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={String(claims.email ?? '')}
            readOnly
            hidden
          />
          <label className={styles.label} htmlFor="senha">
            Senha nova
          </label>
          <input
            className={styles.input}
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            minLength={SENHA_MINIMA}
            maxLength={200}
            required
            autoFocus
          />
          <label className={styles.label} htmlFor="confirmacao">
            Repita a senha
          </label>
          <input
            className={styles.input}
            id="confirmacao"
            name="confirmacao"
            type="password"
            autoComplete="new-password"
            minLength={SENHA_MINIMA}
            maxLength={200}
            required
          />
          {pedeCodigo && (
            <>
              <label className={styles.label} htmlFor="codigo">
                Código do app de autenticação
              </label>
              <input
                className={`${styles.input} ${styles.codigo}`}
                id="codigo"
                name="codigo"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </>
          )}
          <button className={styles.primary} type="submit">
            Salvar a senha
          </button>
        </form>
      )}
    </CartaoDeAcesso>
  );
}
