import FrameClient from './FrameClient';

/**
 * Rota interna consumida pelo <iframe> da visão mobile do /gerador. Não é
 * navegável de forma útil sozinha: sem o postMessage do editor ela não recebe
 * tema nem seleções e renderiza vazia (o que é o teste de isolamento do
 * layout).
 */
export default function FrameMobilePage() {
  return <FrameClient />;
}
