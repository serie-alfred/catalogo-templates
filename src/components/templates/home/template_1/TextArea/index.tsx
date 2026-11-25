import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import index from './index.module.scss';

/**
 * Espelha `molecules/TextArea` do faststore.starter. Lá o campo `html` vai cru
 * para `dangerouslySetInnerHTML`; aqui NÃO: o /p é público, e o conteúdo do CS
 * chega ao navegador de quem abre o link. O campo é texto, num formato mínimo:
 * linha em branco separa os blocos, e o bloco que começa com "# " é um título
 * (o `<h2>` do desenho). O mock é o texto de exemplo de sempre, no mesmo formato.
 */

interface TextAreaConteudo {
  html?: string;
}

const MOCK: TextAreaConteudo = {
  html: '# Lorem Ipsum\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.',
};

export default function TextArea() {
  const { html } = useConteudoDaSecao(MOCK);
  const blocos = String(html ?? '')
    .split(/\n\s*\n/)
    .map(b => b.trim())
    .filter(Boolean);
  if (!blocos.length) return null;
  return (
    <div className={index.container}>
      <div className={index.html}>
        {blocos.map((b, i) =>
          /^#\s/.test(b) ? (
            <h2 key={i}>{b.replace(/^#\s+/, '')}</h2>
          ) : (
            <p key={i} style={{ whiteSpace: 'pre-line' }}>
              {b}
            </p>
          )
        )}
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
TextArea.conteudoPadrao = MOCK;
