'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ouvirPreview } from '@/utils/previewAoVivo';

/** Intervalo do polling da revisão. A aba escondida não consulta. */
const POLL_MS = 5000;

/**
 * Mantém o /p aberto em dia com a edição (o porquê dos dois caminhos está em
 * src/utils/previewAoVivo.ts): aviso do editor pelo BroadcastChannel, no mesmo
 * navegador, e polling da revisão (`?rev=1`) para os outros. Quando a revisão
 * muda, `router.refresh()` rerenderiza a página no servidor com o snapshot
 * novo — sem recarregar, sem perder a rolagem.
 *
 * `rev` é a revisão que ESTA renderização mostra; ela vem do servidor e anda
 * junto com cada refresh.
 */
export default function PreviewLive({ id, rev }: { id: string; rev: number }) {
  const router = useRouter();
  const atual = useRef(rev);
  atual.current = rev;

  useEffect(() => {
    let pedindo = false;
    const talvezAtualizar = (nova: number) => {
      if (nova > atual.current) {
        atual.current = nova;
        router.refresh();
      }
    };

    const parar = ouvirPreview(id, talvezAtualizar);

    const consultar = async () => {
      if (pedindo || document.visibilityState !== 'visible') return;
      pedindo = true;
      try {
        const res = await fetch(`/api/preview/${id}?rev=1`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const { rev: nova } = (await res.json()) as { rev: number };
          talvezAtualizar(nova);
        }
      } catch {
        /* sem rede agora: a próxima volta tenta de novo */
      } finally {
        pedindo = false;
      }
    };
    const timer = window.setInterval(consultar, POLL_MS);
    // Voltou para a aba: confere na hora, sem esperar a próxima volta.
    const aoVoltar = () => {
      if (document.visibilityState === 'visible') consultar();
    };
    document.addEventListener('visibilitychange', aoVoltar);

    return () => {
      parar();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
  }, [id, router]);

  return null;
}
