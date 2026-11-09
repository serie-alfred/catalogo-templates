// `html2canvas-pro` no lugar do `html2canvas`: fork mantido, mesma API.
//
// O html2canvas 1.4.1 só entende rgb/rgba/hsl/hsla. Os templates usam
// `color-mix(in srgb, …, transparent)` em todo neutro sobre fundo customizável
// (regra do CLAUDE.md), e o navegador serializa isso como `color(srgb r g b / a)`
// — função que o parser antigo não conhece. O export quebrava com
// "Attempting to parse an unsupported color function \"color\"".
//
// O fork suporta color(), lab, lch, oklab e oklch, então cobre também qualquer
// cor moderna que venha a entrar nos temas.
import html2canvas from 'html2canvas-pro';

export async function captureAndDownloadScreenshot(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // O clone é do documento INTEIRO, e no Chrome/Safari o html2canvas espera
  // toda <img> dele carregar, sem prazo. Uma imagem `loading="lazy"` fora da
  // tela (as miniaturas do painel "Por template" abaixo da dobra) nunca carrega
  // no clone: o "Baixar" ficava em "Gerando…" para sempre, sem PNG e sem
  // config. Imagem e iframe fora do elemento fotografado não entram no PNG.
  // Loja muito comprida (o mobile empilha tudo) passa do lado máximo do canvas
  // (~16 mil px no Safari, 32 mil no Chrome) e o `toDataURL` volta "data:,": o
  // PNG baixava com 0 kB, sem aviso. A escala encolhe só o que não cabe.
  const scale = Math.min(
    window.devicePixelRatio || 1,
    16000 / Math.max(element.scrollHeight, element.scrollWidth, 1)
  );
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale,
    ignoreElements: node =>
      (node.tagName === 'IMG' || node.tagName === 'IFRAME') &&
      !element.contains(node),
  });
  const dataUrl = canvas.toDataURL('image/png');
  if (dataUrl.length < 100) throw new Error(`screenshot vazio (${filename})`);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
