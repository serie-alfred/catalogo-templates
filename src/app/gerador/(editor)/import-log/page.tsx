// Ferramenta de DEV: lê ~/Downloads/log.txt e reidrata o tema no localStorage.
// Vive dentro do route group (editor) porque toda página precisa de um root layout —
// solta em gerador/ ela quebrava `next build` inteiro.
// force-dynamic: lê o filesystem a cada request, então nunca pode ser pré-renderizada.
export const dynamic = 'force-dynamic';

import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Só existe em desenvolvimento, e por construção: ela lê o `~/Downloads` do
 * SERVIDOR. Na sua máquina isso é a sua pasta; publicada, é a home de quem roda o
 * Next — nunca a de quem visita. Antes ela também estourava um 500 não tratado em
 * toda visita sem o arquivo, o que em produção seria uma rota pública quebrada.
 */
export default function ImportLogPage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <p>Esta rota só existe em desenvolvimento.</p>
      </div>
    );
  }

  const logPath = path.join(os.homedir(), 'Downloads', 'log.txt');

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  } catch (err) {
    const motivo =
      (err as NodeJS.ErrnoException)?.code === 'ENOENT'
        ? 'o arquivo não existe'
        : `não deu para ler/parsear: ${(err as Error).message}`;
    return (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <p>
          Nada para importar — {motivo}.
          <br />
          Exporte o tema pelo botão “Baixar” do gerador e salve o JSON em{' '}
          <code>{logPath}</code>.
        </p>
      </div>
    );
  }

  const { platform, selections, colors, fonts, logo, favicon } = data as {
    platform?: string;
    selections?: unknown;
    colors?: unknown;
    fonts?: unknown;
    logo?: string;
    favicon?: string;
  };

  const script = `
    try {
      localStorage.setItem('layoutSelections', ${JSON.stringify(JSON.stringify(selections || []))});
      ${platform ? `localStorage.setItem('layoutPlatform', ${JSON.stringify(platform)});` : ''}
      ${colors ? `localStorage.setItem('colors', ${JSON.stringify(JSON.stringify(colors))});` : ''}
      ${fonts ? `localStorage.setItem('fonts', ${JSON.stringify(JSON.stringify(fonts))});` : ''}
      ${logo ? `localStorage.setItem('logo', ${JSON.stringify(logo)});` : `localStorage.removeItem('logo');`}
      ${favicon ? `localStorage.setItem('favicon', ${JSON.stringify(favicon)});` : `localStorage.removeItem('favicon');`}
      window.location.href = '/gerador';
    } catch (e) {
      document.body.innerText = 'Erro ao importar: ' + e;
    }
  `;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <p>Importando tema salvo de log.txt...</p>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}
