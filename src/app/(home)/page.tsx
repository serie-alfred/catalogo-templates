import React from 'react';
import fs from 'node:fs';
import path from 'node:path';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import BannerMain from '@/components/home/BannerMain';
import ThemeReleases from '@/components/home/ThemeReleases';
import CatalogSpots from '@/components/home/Catalog';

import type { CatalogItem } from '@/types/catalog';
import {
  NOVIDADES,
  resumoDoTemplate,
  slugDoTemplate,
  templatesDaVitrine,
  thumbDoTemplate,
} from '@/utils/vitrineTemplates';

import styles from './page.module.css';

/** Família nova antes do `yarn thumbs:templates`: card com a imagem genérica,
 *  e não uma imagem quebrada. O estágio `2-vitrine` reprova esse estado. */
const SEM_THUMB = '/images/home/spot/default-template-image.png';

/**
 * Os templates completos (utils/vitrineTemplates.ts), já como cards. Roda no
 * build — a home é estática —, por isso pode olhar o `public/` em disco.
 */
function cardsDosTemplates(): CatalogItem[] {
  return templatesDaVitrine().map(t => {
    const slug = slugDoTemplate(t);
    const thumb = thumbDoTemplate(slug);
    const temThumb = fs.existsSync(path.join(process.cwd(), 'public', thumb));
    return {
      id: Number(t.template),
      title: t.nome,
      subtitle: resumoDoTemplate(t),
      image: temThumb ? thumb : SEM_THUMB,
      link: `/templates/${slug}/home`,
    };
  });
}

export default function Home() {
  const templates = cardsDosTemplates();
  return (
    <>
      <Header />
      <main className={styles.page}>
        <BannerMain />
        <ThemeReleases items={templates.slice(0, NOVIDADES)} />
        <CatalogSpots items={templates} />
      </main>
      <Footer />
    </>
  );
}
