/**
 * O que `design.mjs`, `auto.mjs` e `aplicar.mjs` precisam concordar.
 *
 * Mora aqui, e não em design.mjs, porque os dois outros scripts importam: design.mjs
 * executa o pipeline no topo do módulo, então importar dele dispararia a conversão
 * inteira como efeito colateral de um import.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(fileURLToPath(import.meta.url), '../../..');
export const DESTINO = path.join(RAIZ, 'public/images/gerador');
export const MAPA_JSON = path.join(RAIZ, 'scripts/thumbs/mapa.json');

/**
 * 744x401 = 2x o slot do card (334.667 x 180.333, ratio 1.856 — ver
 * SelectSectionItem/index.module.css). Não por acaso é o ratio exato dos mockups
 * 1920x1035 do designer: eles foram desenhados para este slot.
 */
export const LARGURA = 744;
export const ALTURA = 401;

/** Caminho da thumb relativo a /images/gerador/ — é o valor de `image` no catálogo.
 *  A chave é `component` porque é o único campo comprovadamente único nos 90 itens:
 *  `id` repete entre seções, `key` repete em alguns itens e `title` repete em 4. */
export const caminhoDe = it => `${it.layoutKey}/${it.component}.webp`;

export const lerMapa = () => JSON.parse(fs.readFileSync(MAPA_JSON, 'utf8'));
