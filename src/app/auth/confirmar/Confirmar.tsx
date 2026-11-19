'use client';

import React, { useEffect, useState } from 'react';

import styles from '@/components/acesso/acesso.module.css';

/** Só caminho desta origem (mesma regra de `destinoSeguro`, em src/lib/auth.ts). */
function destino(next: string | null): string {
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.startsWith('/\\')
  )
    return '/gerador';
  return next;
}

/**
 * Lê `#access_token`/`#refresh_token` do fragmento, tira os dois da barra de
 * endereço na hora e entrega ao servidor (/api/auth/sessao), que confere no
 * Supabase e grava a sessão nos cookies. Nenhum cliente do Supabase roda aqui:
 * o navegador só repassa.
 */
export default function Confirmar() {
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const next = destino(
      new URLSearchParams(window.location.search).get('next')
    );
    // O token não fica no histórico nem vaza num print da barra.
    window.history.replaceState(null, '', window.location.pathname);

    const access_token = hash.get('access_token');
    const refresh_token = hash.get('refresh_token');
    if (!access_token || !refresh_token) {
      setFalhou(true);
      return;
    }
    fetch('/api/auth/sessao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, refresh_token }),
    })
      .then(res => {
        if (res.ok) window.location.replace(next);
        else setFalhou(true);
      })
      .catch(() => setFalhou(true));
  }, []);

  return falhou ? (
    <div className={styles.config} role="alert" data-confirmar-falhou="">
      <h1 className={styles.title}>Link vencido</h1>
      <p className={styles.text}>
        O link do e-mail é inválido, já foi usado ou venceu. Peça à agência para
        reenviar o acesso, ou crie a senha pelo &quot;Esqueci a senha&quot;.
      </p>
      <a className={styles.primary} href="/auth/esqueci">
        Esqueci a senha
      </a>
      <a className={styles.link} href="/login">
        Voltar ao login
      </a>
    </div>
  ) : (
    <div className={styles.config} role="status" data-confirmar="">
      <h1 className={styles.title}>Um instante</h1>
      <p className={styles.text}>Conferindo o link do e-mail…</p>
    </div>
  );
}
