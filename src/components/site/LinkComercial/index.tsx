'use client';

import React from 'react';

import { useProvador } from '@/components/home/Provador';
import { rastrear } from '@/lib/tracking';

/**
 * Todo "Falar com o comercial" do site. Com o time cadastrado (`whatsapp`,
 * decidido no servidor por `lib/comercial.ts`), passa pelo `/api/comercial`,
 * que escolhe a pessoa do rodízio e abre o WhatsApp com o template provado na
 * mensagem, em outra aba. Sem ninguém cadastrado, rola até o formulário.
 */
export default function LinkComercial({
  whatsapp,
  origem,
  className,
  children,
  template: templateFixo,
  'aria-label': ariaLabel,
}: {
  whatsapp: boolean;
  origem: string;
  /** Fora da home não há template provado: a vitrine diz qual é. */
  template?: string;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
}) {
  const provador = useProvador();
  const template = templateFixo ?? provador?.atual.visual.nome;

  if (!whatsapp) {
    return (
      <a href="/#contato" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  const href = template
    ? `/api/comercial?template=${encodeURIComponent(template)}`
    : '/api/comercial';
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      data-comercial={origem}
      onClick={() => rastrear('clique_whatsapp', { origem, template })}
    >
      {children}
    </a>
  );
}
