// Ferramenta de DEV: lê ~/Downloads/log.txt e reidrata o tema no localStorage.
// Vive dentro do route group (editor) porque toda página precisa de um root layout —
// solta em gerador/ ela quebrava `next build` inteiro.
// force-dynamic: lê o filesystem a cada request, então nunca pode ser pré-renderizada.
export const dynamic = 'force-dynamic';

import fs from 'fs';
import os from 'os';
import path from 'path';

export default function ImportLogPage() {
  const logPath = path.join(os.homedir(), 'Downloads', 'log.txt');
  const raw = fs.readFileSync(logPath, 'utf-8');
  const data = JSON.parse(raw);

  const { platform, selections, colors, fonts, logo, favicon } = data;

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
