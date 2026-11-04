import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PREVIEW_PAGES, slugToPagina } from '@/utils/previewRender';
import {
  lojaDoTemplate,
  slugDoTemplate,
  templateDoSlug,
  templatesDaVitrine,
} from '@/utils/vitrineTemplates';
import FrameClient from './FrameClient';

/** Todo template × página sai pronto do build: a loja é derivada do catálogo. */
export function generateStaticParams() {
  return templatesDaVitrine().flatMap(t =>
    PREVIEW_PAGES.map(p => ({ familia: slugDoTemplate(t), pagina: p.slug }))
  );
}

/**
 * Fora da lista acima é 404 antes de renderizar (família incompleta, página
 * inválida). Não dá para deixar o `notFound()` decidir: ele roda dentro do
 * `<Suspense>` abaixo, onde o status já pode ter saído.
 */
export const dynamicParams = false;

/**
 * O documento da loja que a barra da vitrine embute. Aberto sozinho é a loja
 * inteira, sem barra — e é o que o `yarn thumbs:templates` fotografa.
 *
 * A página é síncrona e a parte assíncrona (o `await params`) mora DENTRO de um
 * `<Suspense>`, e isso segura a hidratação. Componente assíncrono vira um chunk
 * à parte do RSC (`$L…`), e o Next o põe num array (`[página, assets,
 * OutletBoundary]`, e no dev ainda o `[nó, children]` do SegmentViewNode). No
 * dev, com o HTML chegando devagar, o navegador começa a hidratar antes desse
 * chunk; quando ele chega, o React cria a fibra sem a marca de filho de array,
 * e os ids de `useId` da loja inteira (FAQ, acordeões, rótulos da PDP) saem com
 * 2 bits a menos que os do servidor: "A tree hydrated but some attributes…",
 * em ~4 de 24 frames abertos juntos. Como filho único do `<Suspense>` o chunk
 * não está em array nenhum, e a espera dele é a de um boundary comum.
 */
export default function TemplateFramePage({
  params,
}: {
  params: Promise<{ familia: string; pagina: string }>;
}) {
  return (
    <Suspense>
      <LojaDoFrame params={params} />
    </Suspense>
  );
}

async function LojaDoFrame({
  params,
}: {
  params: Promise<{ familia: string; pagina: string }>;
}) {
  const { familia, pagina } = await params;
  const t = templateDoSlug(familia);
  const interna = slugToPagina(pagina);
  if (!t || !interna) notFound();

  return <FrameClient {...lojaDoTemplate(t)} pagina={interna} />;
}
