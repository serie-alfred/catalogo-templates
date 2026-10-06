import { notFound } from 'next/navigation';
import { getPreview } from '@/lib/previewStore';
import {
  CHECKOUT_ETAPAS,
  snapshotTemCheckout,
  type CheckoutEtapa,
} from '@/utils/checkout';
import SharedCheckout from '@/components/preview/SharedCheckout';

interface PageProps {
  params: Promise<{ id: string; etapa: string }>;
}

/**
 * O checkout do preview compartilhável: `/p/{id}/checkout/{etapa}`.
 *
 * Segmento estático ao lado do `[page]`: `/p/{id}/checkout/carrinho` cai aqui,
 * e `/p/{id}/checkout` sozinho continua no `[page]`, que devolve 404 para um
 * slug que não é página. Só existe para snapshot VTEX com `checkout`: o POST
 * grava o que vier, e um snapshot Tray com o bloco dá 404 como o sem bloco. O
 * que o snapshot traz de cor e papel passa pelos filtros do CheckoutFrame
 * (`variaveisValidas`, `nivel2DoPreview`) antes de virar CSS.
 */
export default async function CheckoutPreviewPage({ params }: PageProps) {
  const { id, etapa } = await params;

  if (!CHECKOUT_ETAPAS.some(e => e.id === etapa)) notFound();

  const snapshot = await getPreview(id);
  if (!snapshot || !snapshotTemCheckout(snapshot)) notFound();

  return (
    <SharedCheckout
      snapshot={snapshot}
      etapa={etapa as CheckoutEtapa}
      id={id}
    />
  );
}
