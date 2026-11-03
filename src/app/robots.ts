import type { MetadataRoute } from 'next';

/**
 * Só a home e a /privacidade entram na busca (layout de `(home)`). O resto do
 * app fica fora — e o bloqueio de verdade é o
 * `robots: { index: false, follow: false }` na metadata de CADA outro layout
 * raiz (gerador/(editor), gerador/(frame), templates, login e p). Não há pai
 * comum, então não existe um só lugar para declarar isso.
 *
 * Este arquivo LIBERA o rastreamento de propósito. Um `disallow: '/'` aqui
 * pareceria mais forte e seria mais fraco: o robô nunca baixaria a página, logo
 * nunca leria o `noindex` da meta, e a URL podia continuar aparecendo na busca
 * (sem título nem descrição) por causa de links externos. Para SAIR do índice, o
 * rastreamento precisa acontecer.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.e-temas.com.br/sitemap.xml',
  };
}
