import React from 'react';
import fs from 'node:fs';
import path from 'node:path';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import Provador, { type Provado } from '@/components/home/Provador';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import ComoFunciona from '@/components/home/ComoFunciona';
import Arara from '@/components/home/Arara';
import QuemFaz from '@/components/home/QuemFaz';
import WhatsAppFlutuante from '@/components/site/WhatsAppFlutuante';
import RastrearCliques from '@/components/site/RastrearCliques';

import { comerciais } from '@/lib/comercial';
import {
  VISUAL_DOS_TEMPLATES,
  type TemplateDoProvador,
} from '@/utils/provador';
import {
  NOVIDADES,
  slugDoTemplate,
  templatesDaVitrine,
  thumbDoTemplate,
} from '@/utils/vitrineTemplates';

/** Família nova antes do `yarn thumbs:templates`: card com a imagem genérica,
 *  e não uma imagem quebrada. O estágio `2-vitrine` reprova esse estado. */
const SEM_THUMB = '/images/home/spot/default-template-image.png';

/** O provador vem antes da 01 (sem nome nem desenho) e da ordem do catálogo:
 *  abre com o Luxo, que veste o site mais diferente do resto. */
const ORDEM_DO_LEQUE = ['15', '17', '16', '14', '13', '12', '11', '10', '9'];

/**
 * Os templates completos (utils/vitrineTemplates.ts), já como o provador os
 * usa. Roda no build — a home é estática —, por isso pode olhar o `public/`.
 */
function templatesDaHome(): TemplateDoProvador[] {
  return templatesDaVitrine().map(t => {
    const slug = slugDoTemplate(t);
    const thumb = thumbDoTemplate(slug);
    const temThumb = fs.existsSync(path.join(process.cwd(), 'public', thumb));
    const f = t.tema?.fonts;
    return {
      slug,
      titulo: t.nome,
      fontes: f
        ? [...new Set([f.fontPrimary, f.fontSecondary])].join(' e ')
        : '',
      pecas: t.itens.length,
      imagem: temThumb ? thumb : SEM_THUMB,
      link: `/templates/${slug}/home`,
      visual: VISUAL_DOS_TEMPLATES[t.template] ?? null,
    };
  });
}

export default function Home() {
  const templates = templatesDaHome();
  const provaveis = ORDEM_DO_LEQUE.map(id =>
    templates.find(t => Number(t.slug) === Number(id))
  ).filter((t): t is Provado => Boolean(t?.visual));
  const whatsapp = comerciais().length > 0;

  const pecas = templates.map(t => t.pecas);
  const fatos = [
    'Uma empresa P4C Group',
    `${templates.length} templates completos`,
    Math.min(...pecas) === Math.max(...pecas)
      ? `${pecas[0]} peças em cada`
      : `de ${Math.min(...pecas)} a ${Math.max(...pecas)} peças em cada`,
    'VTEX FastStore, Wake e Tray',
  ];

  return (
    <Provador provaveis={provaveis}>
      <Intro />
      <Header />
      <main>
        <Hero novos={templates.slice(0, NOVIDADES)} whatsapp={whatsapp} />
        <ComoFunciona />
        <Arara templates={templates} />
        <QuemFaz fatos={fatos} />
      </main>
      <Footer />
      <WhatsAppFlutuante whatsapp={whatsapp} />
      <RastrearCliques />
    </Provador>
  );
}
