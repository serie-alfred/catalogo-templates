'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import { templatesCompletos } from '@/utils/templatesCompletos';

import styles from './index.module.css';

const BASE = '/images/gerador/';

/**
 * Destino "Por template" do rail: as famílias que montam a loja inteira
 * (derivadas do catálogo, ver utils/templatesCompletos.ts). Escolher uma
 * preenche todas as páginas e leva para "Componentes", onde cada peça continua
 * trocável.
 */
export default function PanelTemplates() {
  const { platform, selections, aplicarTemplate, comecarDoZero } = useLayout();
  const templates = useMemo(() => templatesCompletos(platform), [platform]);

  // O template "em uso": toda seção da loja é da família, e nenhuma peça falta.
  const emUso = useMemo(() => {
    if (selections.length === 0) return null;
    const familias = new Set(
      selections.map(
        s => LAYOUTS[s.layoutKey]?.items.find(i => i.id === s.id)?.template
      )
    );
    if (familias.size !== 1) return null;
    const [t] = [...familias];
    const tpl = templates.find(x => x.template === t);
    return tpl && selections.length >= tpl.itens.length ? t : null;
  }, [selections, templates]);

  if (!platform) {
    return (
      <p className={`${styles.hint} ${styles.vazio}`} data-templates-vazio="">
        Escolha a plataforma acima para ver os templates completos.
      </p>
    );
  }

  return (
    <div className={styles.wrap} data-templates-lista="">
      <p className={styles.hint}>
        Um template preenche todas as páginas (home, categoria e produto) com as
        peças de uma mesma família, com a paleta e as fontes do desenho. Depois
        é só ajustar cores e fontes, ou trocar qualquer peça em Componentes.
      </p>

      {templates.length === 0 && (
        <p className={styles.hint}>Nenhum template completo para {platform}.</p>
      )}

      <ul className={styles.list}>
        {templates.map(t => {
          const ativo = emUso === t.template;
          return (
            <li key={t.template}>
              <button
                type="button"
                className={`${styles.card} ${ativo ? styles.ativo : ''}`}
                data-template={t.template}
                aria-pressed={ativo}
                onClick={() => aplicarTemplate(t)}
              >
                <span className={styles.mosaico} aria-hidden>
                  {t.previa.map(src => (
                    <Image
                      key={src}
                      src={`${BASE}${src}`}
                      alt=""
                      width={372}
                      height={200}
                      sizes="116px"
                    />
                  ))}
                </span>
                <span className={styles.info}>
                  <span className={styles.nome}>
                    {t.nome}
                    {t.tema?.colors && (
                      <span className={styles.paleta} aria-hidden>
                        {[
                          t.tema.colors.colorPrimaryBackground,
                          t.tema.colors.colorSecondaryBackground,
                          t.tema.colors.colorTertiaryBackground,
                          t.tema.colors.colorPrimary,
                        ]
                          .filter(Boolean)
                          .map((c, i) => (
                            <span key={i} style={{ background: c }} />
                          ))}
                      </span>
                    )}
                  </span>
                  <span className={styles.pecas}>
                    {ativo ? 'Em uso · ' : ''}
                    {t.itens.length} peças
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* A aba nova já entra com um template (ENTRADA_PADRAO): esta é a porta
          para a loja vazia, peça por peça. Pede confirmação e vale um Voltar. */}
      <div className={styles.zero}>
        <button
          type="button"
          className={styles.zeroBotao}
          onClick={comecarDoZero}
          data-templates-zero=""
        >
          Começar do zero
        </button>
        <p className={styles.hint}>
          Tira todas as seções da loja para montar peça por peça. Cores e fontes
          ficam.
        </p>
      </div>
    </div>
  );
}
