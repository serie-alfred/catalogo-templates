// app/api/fonts/route.ts

export async function GET() {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

  if (!API_KEY) {
    console.error('❌ GOOGLE_FONTS_API_KEY não encontrada');
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
  }

  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`;

  try {
    const res = await fetch(url);
    const text = await res.text(); // <-- capturando como texto bruto
    console.log('🔍 Google Fonts Response:', text.slice(0, 300)); // Mostra só o início

    const data = JSON.parse(text);
    interface Font {
      family: string;
    }

    const fonts = data.items.map((font: Font) => ({ family: font.family }));

    return new Response(JSON.stringify(fonts), {
      headers: { 'Content-Type': 'application/json' },
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
