export async function sendLayoutConfigEmail(configJson: any) {
  return fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Layout Config',
      message: 'Olá, JSON do layout gerado!',
      json: configJson,
    }),
  });
}
