export async function sendLayoutConfigEmail(configJson: unknown) {
  return fetch('/gerador/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Layout Config',
      message: 'Olá, JSON do layout gerado!',
      json: configJson,
    }),
  });
}
