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
  const canvas = await html2canvas(element, { backgroundColor: null });
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
