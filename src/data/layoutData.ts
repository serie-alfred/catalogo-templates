import type { Platform } from "@/types/platform";

export type Pagina = "common" | "home" | "category" | "product";

/**
 * Represents an item in the layout catalog.
 *
 * @property id - Unique identifier for the layout item.
 * @property key - A 12-character string key, preferably starting with a template identifier.
 * @property image - URL or path to the item's image.
 * @property mobile - URL or path to the mobile version of the image.
 * @property title - Title of the layout item.
 * @property description - Description of the layout item.
 * @property template - Identifier or name of the template associated with this item.
 * @property pagina - Array of `Pagina` objects related to this layout item.
 */

export type LayoutItem = {
  id: string;
  selection: string;
  key: string;
  image: string;
  mobile: string;
  component: string;
  title: string;
  description: string;
  template: string;
  pagina: Pagina[];
  platforms: Platform[];
};

export type LayoutSection = {
  name: string;
  items: LayoutItem[];
};

export type Layouts = {
  header: LayoutSection;
  banner: LayoutSection;
  bannerFull: LayoutSection;
  spot: LayoutSection;
  ruler: LayoutSection;
  brand: LayoutSection;
  grid: LayoutSection;
  showcase: LayoutSection;
  footer: LayoutSection;
  categories: LayoutSection;
  bannerSide: LayoutSection;
  breadcrumb: LayoutSection;
  categoryMain: LayoutSection;
  categoryDescription: LayoutSection;
  bannerProduct: LayoutSection;
  productDescription: LayoutSection;
  productInfo: LayoutSection;
  productRelated: LayoutSection;
  textArea: LayoutSection;

  /*
    bannerDuplo: LayoutSection;
    bannerSolo: LayoutSection;
    SpecialOffers:LayoutSection;
    homeCombined:LayoutSection;
    BannerSideLeft:LayoutSection;
    bannerTriple:LayoutSection;
    review: LayoutSection;
    newsletter: LayoutSection;
  */
};

export const LAYOUTS: Layouts = {
  // common
  header: {
    name: "Header",
    items: [
      { id: "01", selection: "header", key: "hdr01a2b3c4d", image: "", mobile: "", title: "Header Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Header01", platforms: ['Tray','Wake'] },
      { id: "02", selection: "header", key: "hdr02h8l2gty", image: "", mobile: "", title: "Header Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Header02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "header", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Header Moderno 03", description: "Menu de navegação com busca e carrinho", template: "3", pagina: ["common"], component: "Header03", platforms: ['Tray'] },
      //{ id: "04",selection: "header", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Header Moderno 04", description: "Menu de navegação com busca e carrinho", template: "4", pagina: ["common"], component: "Header04", platforms: ['Tray'] },
    ],
  },
  spot: {
    name: "Card de Produto",
    items: [
      { id: "01", selection: "spot", key: "crdprd017839", image: "", mobile: "", title: "Card de Produto Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Spot01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "spot", key: "cardprd02g96", image: "", mobile: "", title: "Card de Produto Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Spot02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "spot", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Card Moderno 03", description: "Card do produto 03", template: "3", pagina: ["common"], component: "Spot03", platforms: ['Tray'] },
      //{ id: "06",selection: "spot", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Card Moderno 06", description: "Card do produto 06", template: "6", pagina: ["common"], component: "Spot06", platforms: ['Tray'] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01", selection: "breadcrumb", key: "bred01q3r4s5", image: "", mobile: "", title: "Breadcrumb Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Breadcrumb01", platforms: ['Tray', 'Wake'] },
     // { id: "02", selection: "breadcrumb", key: "bred02q7l4k55", image: "", mobile: "", title: "Breadcrumb Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Breadcrumb02", platforms: ['Tray', 'Wake'] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01", selection: "footer", key: "ftr01r39ws5p", image: "", mobile: "", title: "Footer Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Footer01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "footer", key: "ftr02qmrhs43", image: "", mobile: "", title: "Footer Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Footer02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "footer", key:"ftr01q3r4s5t", image: "", mobile: "", title: "Footer clean 04", description: "Variedades de links 04", template: "4", pagina: ["common"], component: "Footer04", platforms: ['Tray'] },
    ],
  },

  // HOME
  bannerFull: {
    name: "Banner largura máxima",
    items: [
      { id: "01", selection: "banner-full", key: "banful01hwt4", image: "", mobile: "", title: "Banner largura máxima Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerFull01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "banner-full", key: "hdr01a2b3c4d", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerFull02", platforms: ['Tray', 'Wake'] },
      { id: "04", selection: "category-banner", key: "BanFul02op74", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "BannerFullCategory02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "banner-full", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Moderno 03", description: "Banner com largura máxima", template: "3", pagina: ["home"], component: "BannerFull03", platforms: ['Tray'] },
      //{ id: "05",selection: "banner-full", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Moderno 05", description: "Banner com largura máxima", template: "5", pagina: ["home"], component: "BannerFull05", platforms: ['Tray'] },
    ],
  },
  brand: {
    name: "Marcas",
    items: [
      { id: "01", selection: "brands", key: "mar01b3k7h2b", image: "", mobile: "", title: "Marcas Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Brand01", platforms: ['Tray', 'Wake'] },
    ],
  },
  textArea: {
    name: "Área de Texto",
    items: [
      { id: "01", selection: "text-area", key: "txt01a2b3c4d", image: "", mobile: "", title: "Área de Texto Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "TextArea", platforms: ['VTEX'] },
    ],
  },
  categories: {
    name: "Carrossel de Categorias",
    items: [
      { id: "01", selection: "categories", key: "cat01lk3ndkl", image: "", mobile: "", title: "Carrossel de Categorias Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Categories01", platforms: ['Tray', 'Wake'] },
      //{ id: "02",selection: "multi-categories", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Carrossel de categorias", description: "", template: "4", pagina: ["home"], component: "MultiCategories04", platforms: ['Tray'] },
      //{ id: "03",selection: "home-carousel", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Carrossel de categorias 06", description: "", template: "6", pagina: ["home"], component: "HomeCarousel06", platforms: ['Tray'] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01", selection: "banner-main", key: "ban01m1k3nq2", image: "", mobile: "", title: "Banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerMain01", platforms: ['Tray', 'Wake'] },
      //{ id: "02",selection: "banner-main",key:"bnr01m1n2o3p", image: "", mobile: "", title: "Banner Colorido 06", description: "Banner com destaque visual e chamada 06", template: "6", pagina: ["home"], component: "BannerMain06", platforms: ['Tray'] },
    ],
  },
  ruler: {
    name: "Regua de benefícios",
    items: [
      
      { id: "01", selection: "ruler", key: "bnf01lm3a894", image: "", mobile: "", title: "Regua de benefícios Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Ruler01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "ruler", key: "bnf0213jan45", image: "", mobile: "", title: "Regua de benefícios Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Ruler02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 03", description: "Benefícios 3", template: "3", pagina: ["home"], component: "Ruler03", platforms: ['Tray'] },
      //{ id: "04",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 04", description: "Benefícios 4", template: "4", pagina: ["home"], component: "Ruler04", platforms: ['Tray'] },
      //{ id: "05",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 05", description: "Benefícios 5", template: "5", pagina: ["home"], component: "Ruler05", platforms: ['Tray'] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01", selection: "banner-grid", key: "grd01qw09er8", image: "", mobile: "", title: "Grid de banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerGrid01", platforms: ['Tray', 'Wake'] },
    ],
  },
  bannerSide: {
    name: "Banner Side",
    items: [
      { id: "01", selection: "banner-side", key: "bansd014mh45", image: "", mobile: "", title: "Banner Side Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerSide01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "banner-duplo", key: "bansdhg028e3", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerDuplo02", platforms: ['Tray', 'Wake'] },
      { id: "03", selection: "banner-side", key: "bansd0334nb7", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerSide02", platforms: ['Tray', 'Wake'] },
    ],
  },
  showcase: {
    name: "Vitrines",
    items: [
      { id: "01", selection: "showcase", key: "vtr01cm487ha", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Showcase01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "showcase", key: "vtr02mq91m48", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Showcase02", platforms: ['Tray', 'Wake'] },
      //{ id: "03",selection: "showcase", key:"vtr01s5t6u7v", image: "", mobile: "", title: "Vitrine moda 3", description: "Seção com produtos de moda 3", template: "3", pagina: ["home"], component: "Showcase03", platforms: ['Tray'] },
      //{ id: "05",selection: "showcase", key:"vtr01s5t6u7v", image: "", mobile: "", title: "Vitrine moda 6", description: "Seção com produtos de moda 6", template: "6", pagina: ["home"], component: "Showcase06", platforms: ['Tray'] },
    ],
  },

  // CATEGORY
  categoryMain: {
    name: "Grade de produtos",
    items: [
      { id: "01", selection: "category-main", key: "catmn01ll098", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryMain01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "category-main", key: "catmn0254hg3", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "CategoryMain02", platforms: ['Tray', 'Wake'] },
    ],
  },
  categoryDescription: {
    name: "Descrição de categoria",
    items: [
      { id: "01", selection: "category-description", key: "catdes01hp82", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryDescription01", platforms: ['Tray', 'Wake'] },
    ],
  },
  // PRODUCT
  bannerProduct: {
    name: "Banner",
    items: [
      { id: "01", selection: "banner-top", key: "ban01p4q5r6s", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "BannerTop01", platforms: ['Tray', 'Wake'] },
    ],
  },
  productDescription: {
    name: "descrição",
    items: [
      { id: "01", selection: "product-description", key: "desc01t7u8v9w", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductDescription01", platforms: ['Tray', 'Wake'] },
    ],
  },
  productInfo: {
    name: "Informações do produto",
    items: [
      { id: "01", selection: "product-info", key: "info01x0y1z2a", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductInfo01", platforms: ['Tray', 'Wake'] },
      { id: "02", selection: "product-info", key: "info02b3c4d5e", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["product"], component: "ProductInfo02", platforms: ['Tray', 'Wake'] },
    ],
  },
  productRelated: {
    name: "Produtos Relacionados",
    items: [
      { id: "01", selection: "product-related", key: "rel01f6g7h8i", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductRelated01", platforms: ['Tray', 'Wake'] },
    ],
  },


  /*
  review: {
    name: "Reviews",
    items: [
      { id: "01",selection: "client-review", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Reviews do Cliente", description: "", template: "6", pagina: ["home"], component: "ClientReview06", platforms: ['Tray'] },
    ],
  },
  bannerDuplo: {
    name: "Banner Duplo",
    items: [
     { id: "01",selection: "banner-duplo", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Duplo 03", description: "", template: "3", pagina: ["home"], component: "BannerDuplo03", platforms: ['Tray'] },
    ],
  },
  bannerTriple: {
    name: "Banner Triplo",
    items: [
      { id: "01",selection: "banner-triple", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Triplo 05", description: "", template: "5", pagina: ["home"], component: "BannerTriple05", platforms: ['Tray'] },
      { id: "02",selection: "banner-triple-swiper", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Triplo Swiper 05", description: "", template: "5", pagina: ["home"], component: "BannerTripleSwiper05", platforms: ['Tray'] },
      { id: "03",selection: "banner-triple", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Triplo Swiper 03", description: "", template: "3", pagina: ["home"], component: "BannerTriple06", platforms: ['Tray'] },
      { id: "04",selection: "category-triple", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Categoria Banner Triplo  Swiper 06", description: "", template: "6", pagina: ["home"], component: "CategoryTriple06", platforms: ['Tray'] },
    ],
  },
  bannerSolo: {
    name: "Banner Solo",
    items: [
      { id: "01",selection: "banner-solo", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Solo 04", description: "", template: "4", pagina: ["home"], component: "BannerSolo04", platforms: ['Tray'] },
    ],
  },
  SpecialOffers: {
    name: "Ofertas Especial",
    items: [
      { id: "01",selection: "special-offers", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Ofertas Especial", description: "", template: "4", pagina: ["home"], component: "SpecialOffers04", platforms: ['Tray'] },
    ],
  },
  BannerSideLeft:{
    name: "Banner com texto",
    items: [
      { id: "01",selection: "banner-solo-left", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner com texto 05", description: "Banner com texto", template: "5", pagina: ["home"], component: "BannerSoloLeft05", platforms: ['Tray'] },
    ],
  },
  homeCombined: {
    name: "Combinações",
    items: [
      { id: "01",selection: "combined-categ", key:"grd01g6h7i8j", image: "", mobile: "", title: "Combinações 04", description: "", template: "4", pagina: ["home"], component: "HomeCombined04", platforms: ['Tray'] },
    ],
  },
    newsletter: {
    name: "Newsletter",
    items: [
      { id: "01",selection: "newsletter", key:"nws01i7j8k9l", image: "newsletter/desktop/newsletter_01.png", mobile: "newsletter/mobile/newsletter_01_m.png", title: "Newsletter clean", description: "Seção com produtos de moda", template: "1", pagina: ["common"], component: "Newsletter01", platforms: ['Tray'] },
    ],
  },
  */
} as const;

export type LayoutKey = keyof typeof LAYOUTS;  
