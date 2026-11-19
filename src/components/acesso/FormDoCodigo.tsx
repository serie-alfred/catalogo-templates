'use client';

import React, { useState } from 'react';

import styles from './acesso.module.css';

const ERROS: Record<string, string> = {
  codigo: 'Código incorreto ou vencido. Confira o app e tente de novo.',
  limite: 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.',
  sessao: 'Sua sessão expirou. Entre de novo com e-mail e senha.',
  config: 'O login não está configurado neste ambiente.',
};

/**
 * O campo do código de 6 dígitos (login de todo dia e confirmação do cadastro
 * do app). Com JavaScript, posta por `fetch` e mostra o erro sem recarregar:
 * no cadastro, recarregar a página geraria outro QR code e o app escaneado
 * deixaria de valer. Sem JavaScript, é um form nativo para /api/auth/mfa.
 */
export default function FormDoCodigo({
  fator,
  next,
  botao,
  erroInicial,
}: {
  fator: string;
  next: string;
  botao: string;
  erroInicial?: string;
}) {
  const [erro, setErro] = useState<string | null>(
    erroInicial && ERROS[erroInicial] ? erroInicial : null
  );
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch('/api/auth/mfa', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      const dados = (await res.json().catch(() => ({}))) as {
        erro?: string;
        destino?: string;
      };
      if (res.ok && dados.destino) {
        window.location.assign(dados.destino);
        return;
      }
      if (dados.erro === 'sessao') {
        window.location.assign(`/login?erro=sessao`);
        return;
      }
      setErro(dados.erro ?? 'codigo');
    } catch {
      setErro('codigo');
    }
    setEnviando(false);
  }

  return (
    <form
      className={styles.form}
      method="post"
      action="/api/auth/mfa"
      onSubmit={enviar}
      data-login-codigo=""
    >
      {erro && (
        <p className={styles.erro} role="alert" data-login-erro={erro}>
          {ERROS[erro] ?? ERROS.codigo}
        </p>
      )}
      <input type="hidden" name="fator" value={fator} />
      <input type="hidden" name="next" value={next} />
      <label className={styles.label} htmlFor="codigo">
        Código de 6 dígitos
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
        autoFocus
      />
      <button className={styles.primary} type="submit" disabled={enviando}>
        {enviando ? 'Conferindo…' : botao}
      </button>
    </form>
  );
}
