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
  grid: LayoutSection;
  brand: LayoutSection;
  bannerSide: LayoutSection;
  bannerDuplo: LayoutSection;
  showcase: LayoutSection;
  breadcrumb: LayoutSection;
  newsletter: LayoutSection;
  footer: LayoutSection;
  categories: LayoutSection;
};

export const LAYOUTS: Layouts = {
  header: {
    name: "Header",
    items: [
      { id: "01",selection: "header", key:"hdr01a2b3c4d", image: "header/desktop/header_01.png", mobile: "header/mobile/header_01_m.png", title: "Header Moderno", description: "Menu de navegação com busca e carrinho", template: "1", pagina: ["common"], component: "Header01", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  bannerDuplo: {
    name: "BannerDuplo",
    items: [
      { id: "01",selection: "banner-duplo", key:"hdr01a2b3c4d", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Duplo 03", description: "", template: "3", pagina: ["home"], component: "BannerDuplo03", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  bannerFull: {
    name: "Banner largura máxima",
    items: [
      { id: "01",selection: "banner-full", key:"hdr01a2b3c4d", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Moderno 01", description: "Banner com largura máxima", template: "1", pagina: ["home"], component: "BannerFull01", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "banner-full", key:"hdr01a2b3c4d", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Moderno 02", description: "Banner com largura máxima", template: "2", pagina: ["home"], component: "BannerFull02", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "banner-full", key:"hdr01a2b3c4d", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Moderno 03", description: "Banner com largura máxima", template: "3", pagina: ["home"], component: "BannerFull03", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  brand: {
    name: "Marcas",
    items: [
      { id: "01",selection: "brands", key:"hdr01a2b3c4d", image: "brand/desktop/brand.png", mobile: "brand/mobile/brand_01_m.png", title: "Carrossel de marcas", description: "", template: "1", pagina: ["home"], component: "Brand01", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  categories: {
    name: "Carrossel de Categorias",
    items: [
      { id: "01",selection: "categories", key:"hdr01a2b3c4d", image: "brand/desktop/brand.png", mobile: "brand/mobile/brand_01_m.png", title: "Carrossel de categorias", description: "", template: "1", pagina: ["home"], component: "Categories01", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  spot: {
    name: "Card de Produto",
    items: [
      { id: "01",selection: "spot", key:"hdr01a2b3c4d", image: "card/card01.png", mobile: "card/card_01/card01.png", title: "Card Moderno", description: "Card do produto", template: "1", pagina: ["common"], component: "Spot01", platforms: ['Tray'] },
      { id: "02",selection: "spot", key:"hdr01a2b3c4d", image: "card/card01.png", mobile: "card/card_01/card01.png", title: "Card Moderno", description: "Card do produto", template: "2", pagina: ["common"], component: "Spot02", platforms: ['Tray'] },
      { id: "03",selection: "spot", key:"hdr01a2b3c4d", image: "card/card01.png", mobile: "card/card_01/card01.png", title: "Card Moderno 03", description: "Card do produto 03", template: "3", pagina: ["common"], component: "Spot03", platforms: ['Tray'] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01",selection: "banner-main",key:"bnr01m1n2o3p", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Colorido", description: "Banner com destaque visual e chamada", template: "1", pagina: ["home"], component: "BannerMain01", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  ruler: {
    name: "Regua de benefícios",
    items: [
      { id: "01",selection: "ruler", key:"bnf01y0z1a2b", image: "benefitsBar/desktop/benefitsBar_01.png", mobile: "benefitsBar/mobile/benefitsBar_01_m.png", title: "Barra de benefícios 01", description: "Benefícios 1", template: "1", pagina: ["home"], component: "Ruler01", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "ruler", key:"bnf01y0z1a2b", image: "benefitsBar/desktop/benefitsBar_01.png", mobile: "benefitsBar/mobile/benefitsBar_01_m.png", title: "Barra de benefícios 02", description: "Benefícios 2", template: "2", pagina: ["home"], component: "Ruler02", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "ruler", key:"bnf01y0z1a2b", image: "benefitsBar/desktop/benefitsBar_01.png", mobile: "benefitsBar/mobile/benefitsBar_01_m.png", title: "Barra de benefícios 03", description: "Benefícios 3", template: "3", pagina: ["home"], component: "Ruler03", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01",selection: "banner-grid", key:"grd01g6h7i8j", image: "gridBanner/desktop/gridBanner_01.png", mobile: "gridBanner/mobile/gridBanner_01_m.png", title: "Grid de banners", description: "Seção de banners", template: "1", pagina: ["home"], component: "BannerGrid01", platforms: ['Tray', 'Shopify', 'Wake', 'VTEX'] },
    ],
  },
  bannerSide: {
    name: "Banner Side",
    items: [
      { id: "01",selection: "banner-side", key:"grd01g6h7i8j", image: "gridBanner/desktop/gridBanner_01.png", mobile: "gridBanner/mobile/gridBanner_01_m.png", title: "Grid de banners", description: "Seção de banners", template: "1", pagina: ["home"], component: "BannerSide01", platforms: ['Tray', 'Shopify', 'Wake', 'VTEX'] },
      { id: "02",selection: "banner-side", key:"grd01g6h7i8j", image: "gridBanner/desktop/gridBanner_01.png", mobile: "gridBanner/mobile/gridBanner_01_m.png", title: "Grid de banners 02", description: "Seção de banners", template: "2", pagina: ["home"], component: "BannerSide02", platforms: ['Tray', 'Shopify', 'Wake', 'VTEX'] },
      { id: "03",selection: "banner-side", key:"grd01g6h7i8j", image: "gridBanner/desktop/gridBanner_01.png", mobile: "gridBanner/mobile/gridBanner_01_m.png", title: "Grid de banners 03", description: "Seção de banners", template: "3", pagina: ["home"], component: "BannerSide03", platforms: ['Tray', 'Shopify', 'Wake', 'VTEX'] },
    ],
  },
  showcase: {
    name: "Vitrines",
    items: [
      { id: "01",selection: "showcase", key:"vtr01s5t6u7v", image: "vitrines/desktop/shelf_01.png", mobile: "vitrines/mobile/shelf_01_m.png", title: "Vitrine moda", description: "Seção com produtos de moda", template: "1", pagina: ["home"], component: "Showcase01", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "showcase", key:"vtr01s5t6u7v", image: "vitrines/desktop/shelf_01.png", mobile: "vitrines/mobile/shelf_01_m.png", title: "Vitrine moda 2", description: "Seção com produtos de moda 2", template: "2", pagina: ["home"], component: "Showcase02", platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "showcase", key:"vtr01s5t6u7v", image: "vitrines/desktop/shelf_01.png", mobile: "vitrines/mobile/shelf_01_m.png", title: "Vitrine moda 3", description: "Seção com produtos de moda 3", template: "3", pagina: ["home"], component: "Showcase03", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  newsletter: {
    name: "Newsletter",
    items: [
      { id: "01",selection: "newsletter", key:"nws01i7j8k9l", image: "newsletter/desktop/newsletter_01.png", mobile: "newsletter/mobile/newsletter_01_m.png", title: "Newsletter clean", description: "Seção com produtos de moda", template: "1", pagina: ["common"], component: "", platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01",selection: "breadcrumb", key:"bred01q3r4s5t", image: "breadcrumb/desktop/breadcrumb_01.png", mobile: "breadcrumb/mobile/breadcrumb_01_m.png", title: "breadcrumb clean", description: "Variedades de links", template: "1", pagina: ["common"], component: "Breadcrumb01", platforms: ['Tray', 'Wake'] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01",selection: "footer", key:"ftr01q3r4s5t", image: "footer/desktop/footer_02.png", mobile: "footer/mobile/footer_02_m.png", title: "Footer clean", description: "Variedades de links", template: "1", pagina: ["common"], component: "Footer01", platforms: ['Tray', 'Wake'] },
    ],
  },
} as const;
  
export type LayoutKey = keyof typeof LAYOUTS;  
