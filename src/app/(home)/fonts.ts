import {
  Archivo,
  Barlow_Condensed,
  Bricolage_Grotesque,
  Cormorant_Garamond,
  Fraunces,
  Fredoka,
  Geist,
  Instrument_Sans,
  Saira,
  Young_Serif,
} from 'next/font/google';

/*
 * As fontes do site: Bricolage Grotesque nos títulos, Instrument Sans no texto.
 * As outras oito são as dos templates, cada uma num peso só, usadas no nome
 * do template no leque, no título e na arara — sem preload, porque só uma
 * aparece de cara.
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

// O next/font só aceita objetos literais em cada chamada: nada de spread.
const luxo = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '500',
  style: 'italic',
  variable: '--f-luxo',
});
const infantil = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '600',
  variable: '--f-infantil',
});
const esportiva = Saira({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '700',
  style: 'italic',
  variable: '--f-esportiva',
});
const noturno = Barlow_Condensed({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '700',
  variable: '--f-noturno',
});
const suave = Young_Serif({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '400',
  variable: '--f-suave',
});
const grade = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '600',
  variable: '--f-grade',
});
const varejo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '800',
  variable: '--f-varejo',
});
const editorial = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: '600',
  variable: '--f-editorial',
});

export const variaveisDasFontes = [
  display,
  texto,
  luxo,
  infantil,
  esportiva,
  noturno,
  suave,
  grade,
  varejo,
  editorial,
]
  .map(f => f.variable)
  .join(' ');
