import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';

/*
 * As duas fontes do site, num módulo só delas: quem importa daqui (/p, login)
 * não declara as oito fontes dos templates de `fonts.ts`. Importar aquele
 * módulo põe no documento as faces de Saira 700 itálico, Fredoka 600 etc. com
 * o nome real da família, e o preview compartilhado (/p) passava a ter pesos
 * que o canvas do editor não tem (D4-06 da revisão das variáveis, 17/11/2026).
 */
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--f-display',
  display: 'swap',
});

export const texto = Instrument_Sans({
  subsets: ['latin'],
  variable: '--f-texto',
  display: 'swap',
});

/** Só as duas do site, para as superfícies fora da home (vitrine, /p, login). */
export const variaveisDaMarca = `${display.variable} ${texto.variable}`;
