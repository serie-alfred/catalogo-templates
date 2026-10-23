// Proxy do catálogo do Google Fonts (a chave fica no servidor).

/** Um dia: o catálogo do Google muda devagar. */
const UM_DIA = 60 * 60 * 24;

export async function GET() {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

  if (!API_KEY) {
    console.error('❌ GOOGLE_FONTS_API_KEY não encontrada');
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
    });
  }

  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`;

  try {
    // Cache do servidor: a resposta do Google vale por um dia, então a lista
    // inteira (~1.900 famílias) não é pedida de novo a cada seletor aberto.
    const res = await fetch(url, { next: { revalidate: UM_DIA } });
    if (!res.ok) throw new Error(`Google Fonts respondeu ${res.status}`);
    const data = (await res.json()) as { items?: { family: string }[] };

    const fonts = (data.items ?? []).map(font => ({ family: font.family }));

    return new Response(JSON.stringify(fonts), {
      headers: {
        'Content-Type': 'application/json',
        // `private`: a rota fica atrás do login (middleware), então a CDN não
        // guarda; o navegador sim, por um dia.
        'Cache-Control': `private, max-age=${UM_DIA}`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao buscar fontes:', error.message);
    } else {
      console.error('Erro ao buscar fontes:', error);
    }
    return new Response(JSON.stringify({ error: 'Erro ao buscar fontes' }), {
      status: 500,
    });
  }
}
