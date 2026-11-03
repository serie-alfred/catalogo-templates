import React from 'react';
import Image from 'next/image';

import { VISUAL_NEUTRO, type TemplateDoProvador } from '@/utils/provador';

import Setas from './Setas';
import styles from './index.module.css';

/**
 * O catálogo inteiro, "na arara": cartões grandes que se arrastam para o
 * lado, cada um com a cor e a fonte do template. É a grade que o funil
 * `2-vitrine` lê — `[data-home-catalogo]` com um `a[data-spot]` por template,
 * do mais novo para o mais antigo, o `h3` com o nome do catálogo e nada
 * clicável dentro do card.
 */
export default function Arara({
  templates,
}: {
  templates: TemplateDoProvador[];
}) {
  return (
    <section
      id="templates"
      className={styles.secao}
      aria-labelledby="arara-titulo"
    >
      <div className={styles.topo}>
        <h2 id="arara-titulo" className={styles.titulo}>
          Todos os estilos,
          <br />
          na arara.
        </h2>
        <div className={styles.lateral}>
          <p className={styles.dica}>
            Role para o lado. Cada um abre a loja por dentro.
          </p>
          <Setas trilho="arara-trilho" />
        </div>
      </div>
      <div id="arara-trilho" className={styles.trilho} data-home-catalogo="">
        <div className={styles.fila}>
          {templates.map(t => {
            const v = t.visual ?? VISUAL_NEUTRO;
            const [numero, nome] = t.titulo.includes(' · ')
              ? t.titulo.split(' · ')
              : [null, t.titulo];
            return (
              <a
                key={t.slug}
                href={t.link}
                data-spot={Number(t.slug)}
                data-rastrear="abrir_template"
                data-rastrear-template={t.slug}
                className={styles.card}
                style={
                  {
                    '--c-fundo': v.amostra,
                    '--c-texto': v.textoNaAmostra,
                    '--c-fonte': v.fonte,
                    '--c-peso': v.peso,
                    '--c-estilo': v.estilo,
                  } as React.CSSProperties
                }
              >
                <h3 className={styles.nome}>
                  {numero && <span className={styles.numero}>{numero} · </span>}
                  <span className={styles.nomeTexto}>{nome}</span>
                </h3>
                <span className={styles.foto}>
                  <Image
                    src={t.imagem}
                    alt={`Home do template ${nome}`}
                    width={800}
                    height={608}
                    sizes="380px"
                  />
                </span>
                <span className={styles.rodape}>
                  <span>
                    {t.fontes ? `${t.fontes} · ` : ''}
                    {t.pecas} peças
                  </span>
                  <span className={styles.ver}>Ver por dentro →</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
      {/* Quanto da arara já passou: enche com a rolagem lateral (CSS, sem JS). */}
      <div className={styles.andamento} aria-hidden>
        <span />
      </div>
    </section>
  );
}
