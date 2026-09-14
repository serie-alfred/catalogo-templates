export async function sendLayoutConfigEmail(configJson: unknown) {
  const res = await fetch('/gerador/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Layout Config',
      message: 'Olá, JSON do layout gerado!',
      json: configJson,
    }),
  });

  // `fetch` só rejeita em erro de rede: um 500 da rota resolvia normalmente e o
  // `catch` de quem chama nunca rodava. Como em produção o e-mail é o ÚNICO
  // caminho de entrega do config, uma falha silenciosa aqui perde o trabalho do
  // usuário sem nenhum sinal na tela.
  if (!res.ok) {
    throw new Error(`Envio do config falhou: HTTP ${res.status}`);
  }

  return res;
}
