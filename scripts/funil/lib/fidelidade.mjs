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
 * quantidade, e as propriedades de CSS que o nó possui batem. Antes de medir, o
 * estágio põe na origem o texto que o clone mostra (`igualarLivres`), para o
 * texto diferente não empurrar os vizinhos (coluna `auto`, irmão `flex: 1`).
 */
/**
 * `paletaDeUmLado`: chaves da leitura de paleta que só existem de um lado e
 * pintam com o tema, e que JÁ são conhecidas — `{ chave: motivo }`. Toda outra
 * reprova (ver `lib/fidelidade-paleta.mjs`), e a dispensa que nenhuma tela usa
 * reprova também: conserto na réplica tem de levar a linha junto. Não é para
 * esconder divergência, é para o portão ficar verde enquanto o conserto está
 * agendado — as de 24/09 foram achadas pela primeira rodada desta regra.
 *
 * `semPaleta`: o componente não tem nada que pinte com o tema (banner só de
 * imagem). Sem isto, tela com 0 asserções de paleta reprova; com isto, reprova a
 * tela que tiver alguma.
 */
export const PARES = [
  // Família 10 (Varejo). A marca em texto da origem é "SERIE//A" aqui (ver
  // `textoLivre` acima); o rodapé 10 não tem marca. O contador anda, como na 09.
  { starter: 'Header10', id: '10', layoutKey: 'header', pagina: 'common', textoLivre: ['hd-logo'] },
  { starter: 'Footer10', id: '10', layoutKey: 'footer', pagina: 'common' },
  { starter: 'BannerMain10', id: '10', layoutKey: 'banner', pagina: 'home' },
  { starter: 'BenefitsStrip10', id: '10', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'Categories10', id: '10', layoutKey: 'categories', pagina: 'home' },
  { starter: 'ProductShelfCustom10', id: '10', layoutKey: 'showcase', pagina: 'home' },
  { starter: 'BannerGrid10', id: '10', layoutKey: 'grid', pagina: 'home' },
  { starter: 'Countdown10', id: '10', layoutKey: 'countdown', pagina: 'home', textoLivre: ['cd-timer'] },
  { starter: 'ProductShelfBanner10', id: '10', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'Editorial10', id: '10', layoutKey: 'editorial', pagina: 'home' },
  { starter: 'ClientReview10', id: '10', layoutKey: 'review', pagina: 'home' },
  { starter: 'Brands10', id: '10', layoutKey: 'brand', pagina: 'home' },
  { starter: 'Newsletter10', id: '10', layoutKey: 'newsletter', pagina: 'home' },
  { starter: 'CategoryTitle10', id: '10', layoutKey: 'categoryTitle', pagina: 'category' },
  { starter: 'MainCategory10', id: '10', layoutKey: 'categoryMain', pagina: 'category' },
  { starter: 'CategorySeoFaq10', id: '10', layoutKey: 'categoryDescription', pagina: 'category' },
  { starter: 'ProductDetails10', id: '10', layoutKey: 'productInfo', pagina: 'product' },
  { starter: 'ProductDescription10', id: '10', layoutKey: 'productDescription', pagina: 'product' },
  { starter: 'ProductReviews10', id: '10', layoutKey: 'productReviews', pagina: 'product' },
  // Família 09 (Editorial). A marca em texto da origem ("Sua Marca") é "SERIE//A"
  // aqui (ver `textoLivre` acima); o contador anda, como na 08.
  { starter: 'Header09', id: '09', layoutKey: 'header', pagina: 'common', textoLivre: ['hd-logo'] },
  { starter: 'Footer09', id: '09', layoutKey: 'footer', pagina: 'common', textoLivre: ['ft-brand'] },
  { starter: 'BannerMain09', id: '09', layoutKey: 'banner', pagina: 'home' },
  { starter: 'BenefitsStrip09', id: '09', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'Categories09', id: '09', layoutKey: 'categories', pagina: 'home' },
  { starter: 'ProductShelfCustom09', id: '09', layoutKey: 'showcase', pagina: 'home' },
  { starter: 'BannerGrid09', id: '09', layoutKey: 'grid', pagina: 'home' },
  { starter: 'Countdown09', id: '09', layoutKey: 'countdown', pagina: 'home', textoLivre: ['cd-timer'] },
  { starter: 'ProductShelfBanner09', id: '09', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'Editorial09', id: '09', layoutKey: 'editorial', pagina: 'home' },
  { starter: 'ClientReview09', id: '09', layoutKey: 'review', pagina: 'home' },
  { starter: 'Brands09', id: '09', layoutKey: 'brand', pagina: 'home' },
  { starter: 'Newsletter09', id: '09', layoutKey: 'newsletter', pagina: 'home' },
  { starter: 'CategoryTitle09', id: '09', layoutKey: 'categoryTitle', pagina: 'category' },
  { starter: 'MainCategory09', id: '09', layoutKey: 'categoryMain', pagina: 'category' },
  { starter: 'CategorySeoFaq09', id: '09', layoutKey: 'categoryDescription', pagina: 'category' },
  { starter: 'ProductDetails09', id: '09', layoutKey: 'productInfo', pagina: 'product' },
  { starter: 'ProductDescription09', id: '09', layoutKey: 'productDescription', pagina: 'product' },
  { starter: 'ProductReviews09', id: '09', layoutKey: 'productReviews', pagina: 'product' },
  // Família 08 (o antigo BlackFriday01, dividido): seções de miolo que valem na
  // home e no modo LP. Medidas na home.
  { starter: 'BannerMain08', id: '08', layoutKey: 'banner', pagina: 'home' },
  {
    starter: 'Countdown08',
    id: '08',
    layoutKey: 'countdown',
    pagina: 'home',
    // O contador anda: os dois lados montam em instantes diferentes e o segundo
    // muda. O papel continua comparado em estilo, só o texto fica livre.
    textoLivre: ['cd-unit'],
  },
  { starter: 'Categories08', id: '08', layoutKey: 'categories', pagina: 'home' },
  { starter: 'ProductShelfCustom08', id: '08', layoutKey: 'showcase', pagina: 'home' },
  { starter: 'ProductShelfBanner08', id: '08', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'Editorial08', id: '08', layoutKey: 'editorial', pagina: 'home' },
  { starter: 'BenefitsStrip08', id: '08', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'Newsletter08', id: '08', layoutKey: 'newsletter', pagina: 'home' },
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
  {
    starter: 'ProductDescriptionBanner01',
    id: '01',
    layoutKey: 'productBanner',
    pagina: 'product',
    semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte',
  },
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
  {
    starter: 'ProductDetails06',
    id: '06',
    layoutKey: 'productInfo',
    pagina: 'product',
    paletaDeUmLado: {
      '.srOnly':
        'o rótulo sr-only do CEP: `.srOnly` no ShippingSimulator06 da origem, `.shipSrOnly` na réplica, que inlina os dois componentes num CSS module',
      '.shipSrOnly': 'o mesmo rótulo, do lado da réplica (ver .srOnly)',
    },
  },
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
  {
    starter: 'Footer06',
    id: '06',
    layoutKey: 'footer',
    pagina: 'common',
    // O copyright da origem tem razão social e CNPJ do cliente; o da réplica é
    // genérico, com os mesmos 60 caracteres (ver o `copyright` dela): a barra de
    // baixo divide a sobra entre selos e logos, e no mobile o texto quebra em duas
    // linhas. Os selos da origem são do CDN da loja e aqui são placehold.co, mas
    // na mesma proporção — imagem não tem texto próprio, então não entra aqui.
    textoLivre: ['copyright'],
  },
  {
    starter: 'Header08',
    id: '08',
    layoutKey: 'header',
    pagina: 'common',
    // O contador da sacola: na origem é o carrinho de exemplo (`mockCart`, 1
    // item); na réplica, o "99" do Figma. Mesmo selo, número diferente.
    textoLivre: ['hd-badge'],
  },
  { starter: 'Footer08', id: '08', layoutKey: 'footer', pagina: 'common' },
  // Portes de 13/10 ("portar todas as famílias"): seções que só existiam na Tray/Wake
  // ganharam o lado VTEX no starter, com o markup e os data-role da réplica.
  { starter: 'Header02', id: '02', layoutKey: 'header', pagina: 'common', textoLivre: ['hd-cart-count'] },
  { starter: 'Footer02', id: '02', layoutKey: 'footer', pagina: 'common' },
  { starter: 'BannerFull02', id: '02', layoutKey: 'bannerFull', pagina: 'home', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'BannerFullCategory02', id: '04', layoutKey: 'bannerFull', pagina: 'category', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'Ruler02', id: '02', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'BannerDuplo02', id: '02', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'BannerSide02', id: '03', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'ProductShelfCustom02', id: '02', layoutKey: 'showcase', pagina: 'home', textoLivre: ['spot-rating-count'] },
  { starter: 'MainCategory02', id: '02', layoutKey: 'categoryMain', pagina: 'category', textoLivre: ['spot-rating-count'] },
  { starter: 'ProductInfo02', id: '02', layoutKey: 'productInfo', pagina: 'product' },
  { starter: 'MultiCategories04', id: '04', layoutKey: 'categories', pagina: 'home' },
  { starter: 'Ruler04', id: '04', layoutKey: 'ruler', pagina: 'home', semPaleta: 'régua de selos em imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'BannerSolo04', id: '01', layoutKey: 'bannerSolo', pagina: 'home' },
  { starter: 'SpecialOffers04', id: '01', layoutKey: 'specialOffers', pagina: 'home' },
  { starter: 'HomeCombined04', id: '01', layoutKey: 'homeCombined', pagina: 'home' },
  { starter: 'BannerFull05', id: '05', layoutKey: 'bannerFull', pagina: 'home', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'Ruler05', id: '05', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'BannerTriple05', id: '01', layoutKey: 'bannerTriple', pagina: 'home', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'BannerTripleSwiper05', id: '02', layoutKey: 'bannerTriple', pagina: 'home', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'BannerSoloLeft05', id: '01', layoutKey: 'bannerSideLeft', pagina: 'home' },
  { starter: 'HomeCarousel06', id: '06', layoutKey: 'categories', pagina: 'home', semPaleta: 'fileira de fotos com nome: o texto herda da página nos dois lados, nenhum nó pinta cor ou fonte de tema' },
  { starter: 'BannerTriple06', id: '03', layoutKey: 'bannerTriple', pagina: 'home', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'CategoryTriple06', id: '04', layoutKey: 'bannerTriple', pagina: 'home', semPaleta: 'artes de categoria só de imagem: nenhum nó pinta cor ou fonte' },
  { starter: 'ClientReview06', id: '01', layoutKey: 'review', pagina: 'home', semPaleta: 'a réplica não pinta texto (herda da página) e os fundos são hex estruturais sem token de tema: nenhum nó pinta com o tema' },
  { starter: 'BannerTop01', id: '01', layoutKey: 'bannerProduct', pagina: 'product', semPaleta: 'banner só de imagem: nenhum nó pinta cor ou fonte' },
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
