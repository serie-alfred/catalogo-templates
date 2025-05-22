import html2canvas from 'html2canvas';

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
