/**
 * Os pares do estágio `2-fidelidade` e a conferência deles contra o catálogo.
 *
 * Moram aqui, e não no estágio, porque dois arquivos os leem: o `2-fidelidade`
 * mede cada par, e o `1-catalogo` confere que cada um aponta para a réplica
 * certa. Importar do estágio não serve — ele sobe o Chrome no topo do módulo.
 */
import { itens } from './util.mjs';

/**
 * Os pares cobertos. Só entra aqui componente migrado com o contrato de
 * `data-role` espelhado dos dois lados — os migrados antes deste portão não têm
 * `data-role` no catálogo e ficam sem cobertura até serem revisitados.
 */
/**
 * `textoLivre`: papéis cujo TEXTO diverge POR CONTRATO entre os dois lados.
 *
 * O `/from-faststore` proíbe trazer o wordmark da marca de origem para o
 * catálogo — o preview é público e mostra o logo do usuário (`useLayout()`)
 * com fallback "SERIE//A". Então `brand-name` é o wordmark da marca na origem e
 * "SERIE//A" aqui, de propósito.
 *
 * A mesma regra vale para o NOME DA MARCA dentro do conteúdo: o mock da origem
 * diz "Clube VIP <marca>" e "curadoria <marca>" porque o starter é o repo
 * do componente daquele cliente; o catálogo é um produto público e não pode
 * exibir a marca de um cliente para outro.
 *
 * Esses nós são casados por papel + ordem (não por texto) e têm a GEOMETRIA
 * dispensada — largura de texto diferente é a consequência esperada de texto
 * diferente. O que continua valendo: eles existem nos dois lados, na mesma
 * quantidade, e as propriedades de CSS que o nó possui batem.
 */
export const PARES = [
  { starter: 'BenefitsStrip07', id: '07', layoutKey: 'ruler', pagina: 'home' },
  {
    starter: 'SocialProof07',
    id: '07',
    layoutKey: 'review',
    pagina: 'home',
    textoLivre: ['sp-subtitle'],
  },
  { starter: 'EditorialBanner07', id: '07', layoutKey: 'bannerSideLeft', pagina: 'home' },
  { starter: 'Categories07', id: '07', layoutKey: 'categories', pagina: 'home' },
  { starter: 'BannerSide06', id: '06', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'BannerMain07', id: '07', layoutKey: 'banner', pagina: 'home' },
  { starter: 'ShopByRoom07', id: '07', layoutKey: 'rooms', pagina: 'home' },
  {
    starter: 'Newsletter07',
    id: '07',
    layoutKey: 'newsletter',
    pagina: 'home',
    textoLivre: ['nl-eyebrow'],
  },
  { starter: 'Categories06', id: '06', layoutKey: 'buySize', pagina: 'home' },
  { starter: 'HelpFloatButton06', id: '06', layoutKey: 'helpFloat', pagina: 'home' },
  { starter: 'BannerGrid06', id: '06', layoutKey: 'grid', pagina: 'home' },
  { starter: 'BannerCarousel06', id: '06', layoutKey: 'productLines', pagina: 'home' },
  { starter: 'ProductDescriptionBanner01', id: '01', layoutKey: 'productBanner', pagina: 'product' },
  { starter: 'CategoryTitle06', id: '06', layoutKey: 'categoryTitle', pagina: 'category' },
  { starter: 'MainCategory06', id: '06', layoutKey: 'categoryMain', pagina: 'category' },
  { starter: 'CategorySeoFaq06', id: '06', layoutKey: 'categoryDescription', pagina: 'category' },
  { starter: 'TrustvoxReviews06', id: '06', layoutKey: 'productReviews', pagina: 'product' },
  { starter: 'CategoryTabs06', id: '06', layoutKey: 'categoryTabs', pagina: 'home' },
  // `soDesktop`: a origem tem um guarda `min-width: 1025px` e NÃO renderiza nada
  // abaixo disso — medir o mobile seria comparar vazio com vazio, e a espera por
  // conteúdo do clone estouraria os 90s. O portão diz na saída que esse par mede
  // um viewport só, para ninguém ler 1 componente como 2 viewports.
  { starter: 'PopupNews06', id: '06', layoutKey: 'popupNews', pagina: 'home', soDesktop: true },
  { starter: 'MainCategory07', id: '07', layoutKey: 'categoryMain', pagina: 'category' },
  { starter: 'ProductDetails07', id: '07', layoutKey: 'productInfo', pagina: 'product' },
  { starter: 'ProductDetails06', id: '06', layoutKey: 'productInfo', pagina: 'product' },
  { starter: 'ProductDetails03', id: '04', layoutKey: 'productInfo', pagina: 'product' },
  {
    starter: 'Header07',
    id: '07',
    layoutKey: 'header',
    pagina: 'common',
    // `m-topbar-msg` entra aqui não por marca, mas por RODÍZIO: a barra de
    // avisos troca de mensagem num timer, e os dois lados montam em instantes
    // diferentes — a origem mostrava "Frete grátis…" e o clone "Mais de 100
    // mil ambientes…". Passou verde por sorte até a espera de imagens deslocar
    // as fases. Por ordinal, o papel continua sendo comparado em estilo.
    textoLivre: ['brand-name', 'm-brand-name', 'm-topbar-msg'],
  },
  {
    starter: 'Footer07',
    id: '07',
    layoutKey: 'footer',
    pagina: 'common',
    textoLivre: ['brand-name', 'm-brand-name', 'copyright', 'm-copyright', 'nl-eyebrow'],
  },
];

/**
 * Todo par aponta para a réplica do componente que ele mede?
 *
 * O par endereça a réplica por `layoutKey/id`, e o id não é estável: o 63f0c6d
 * (22/09) renumerou quatro itens — ruler 03→07, productInfo 05→06 e 04↔07 — e
 * nada olhou para cá. Os dois estragos foram diferentes, e nenhum dizia a causa:
 *
 * - id que sumiu: o `sanitizeSelections` da hidratação descarta a seleção
 *   semeada, o canvas fica vazio, e o `2-fidelidade` morria no par nº 1 com
 *   "o canvas não pintou nenhum [data-role] em 90s";
 * - id que virou OUTRO item (a troca 04↔07): nada estourava, e cada
 *   ProductDetails era medido contra a réplica do outro.
 *
 * O `path` do item é o que prova o casamento: é o id do manifest do componente
 * real, e termina no nome que o par pede ao `/dev-fidelity`.
 */
export function conferirParesDeFidelidade(layouts, r) {
  const todos = itens(layouts);
  const falhas = PARES.flatMap(par => {
    const replica = i => !!i.path?.endsWith(`/${par.starter}`);
    const item = layouts[par.layoutKey]?.items.find(i => i.id === par.id);
    if (item && replica(item)) return [];
    const achado = item
      ? `é ${item.component} (${item.path ?? 'sem path'})`
      : 'não existe';
    // a falha já traz o conserto: o item cujo path termina no componente
    const certos = todos.filter(replica).map(i => `${i.layoutKey}/${i.id}`);
    const conserto = certos.length
      ? `a réplica é ${certos.join(' ou ')}`
      : `nenhum item tem path terminado em /${par.starter}`;
    return [
      `${par.starter}: ${par.layoutKey}/${par.id} ${achado} — ${conserto}`,
    ];
  });
  r.ok(
    `os ${PARES.length} pares do 2-fidelidade apontam para a réplica certa`,
    falhas.length === 0,
    falhas.join(' | ')
  );
  return falhas;
}
