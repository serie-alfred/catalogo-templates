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
  beneficios: LayoutSection;
  grid: LayoutSection;
  vitrine: LayoutSection;
  breadcrumb: LayoutSection;
  newsletter: LayoutSection;
  footer: LayoutSection;
};

export const LAYOUTS: Layouts = {
  header: {
    name: "Header",
    items: [
      { id: "01",selection: "header", key:"hdr01a2b3c4d", image: "header/desktop/header_01.png", mobile: "header/mobile/header_01_m.png", title: "Header Moderno", description: "Menu de navegação com busca e carrinho", template: "1", pagina: ["common"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "header", key:"hdr02e5f6g7h", image: "header/desktop/header_02.png", mobile: "header/mobile/header_02_m.png", title: "Header com Mega Menu", description: "Navegação multinível com promoções", template: "1", pagina: ["common"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "header", key:"hdr03i8j9k0l", image: "header/desktop/header_03.png", mobile: "header/mobile/header_03_m.png", title: "Header preto", description: "Navegação multinível com promoções", template: "3", pagina: ["common"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01",selection: "banner-main",key:"bnr01m1n2o3p", image: "banner/desktop/banner_01.png", mobile: "banner/mobile/banner_01_m.png", title: "Banner Colorido", description: "Banner com destaque visual e chamada", template: "1", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "banner-main",key:"bnr02q4r5s6t", image: "banner/desktop/banner_02.png", mobile: "banner/mobile/banner_02_m.png", title: "Banner com fundo claro", description: "Layout promocional mais clean", template: "2", pagina: ["product"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "banner-main",key:"bnr03u7v8w9x", image: "banner/desktop/banner_02.png", mobile: "banner/mobile/banner_02_m.png", title: "Banner preto", description: "Layout promocional mais clean", template: "3", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  beneficios: {
    name: "Benefícios",
    items: [
      { id: "01",selection: "regua", key:"bnf01y0z1a2b", image: "benefitsBar/desktop/benefitsBar_01.png", mobile: "benefitsBar/mobile/benefitsBar_01_m.png", title: "Barra de benefícios", description: "Benefícios", template: "1", pagina: ["category"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "regua", key:"bnf02c3d4e5f", image: "benefitsBar/desktop/benefitsBar_02.png", mobile: "benefitsBar/mobile/benefitsBar_02_m.png", title: "Barra de benefícios", description: "Benefícios", template: "2", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01",selection: "banner-grid", key:"grd01g6h7i8j", image: "gridBanner/desktop/gridBanner_01.png", mobile: "gridBanner/mobile/gridBanner_01_m.png", title: "Grid de banners", description: "Seção de banners", template: "1", pagina: ["product"], platforms: ['Tray', 'Shopify', 'Wake', 'VTEX'] },
      { id: "02",selection: "banner-grid", key:"grd02k9l0m1n", image: "gridBanner/desktop/gridBanner_02.png", mobile: "gridBanner/mobile/gridBanner_02_m.png", title: "Grid de banners", description: "Seção de banners", template: "2", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "banner-grid", key:"grd03o2p3q4r", image: "gridBanner/desktop/gridBanner_03.png", mobile: "gridBanner/mobile/gridBanner_03_m.png", title: "Grid de banners", description: "Seção de banners", template: "3", pagina: ["category"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  vitrine: {
    name: "Vitrines",
    items: [
      { id: "01",selection: "showcase", key:"vtr01s5t6u7v", image: "vitrines/desktop/shelf_01.png", mobile: "vitrines/mobile/shelf_01_m.png", title: "Vitrine moda", description: "Seção com produtos de moda", template: "2", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "showcase", key:"vtr02w8x9y0z", image: "vitrines/desktop/shelf_02.png", mobile: "vitrines/mobile/shelf_02_m.png", title: "Vitrine ferramentas", description: "Produtos de casa e construção", template: "2", pagina: ["product"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "03",selection: "showcase", key:"vtr03a1b2c3d", image: "vitrines/desktop/shelf_03.png", mobile: "vitrines/mobile/shelf_03_m.png", title: "Vitrine esmalte", description: "Produtos de casa e construção", template: "1", pagina: ["category"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "04",selection: "showcase", key:"vtr04e4f5g6h", image: "vitrines/desktop/shelf_04.png", mobile: "vitrines/mobile/shelf_04.png", title: "Vitrine 4", description: "Produtos de casa e construção", template: "4", pagina: ["home"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  newsletter: {
    name: "Newsletter",
    items: [
      { id: "01",selection: "newsletter", key:"nws01i7j8k9l", image: "newsletter/desktop/newsletter_01.png", mobile: "newsletter/mobile/newsletter_01_m.png", title: "Newsletter clean", description: "Seção com produtos de moda", template: "1", pagina: ["common"], platforms: ['Tray', 'Shopify', 'Wake'] },
      { id: "02",selection: "newsletter", key:"nws02m0n1o2p", image: "newsletter/desktop/newsletter_02.png", mobile: "newsletter/mobile/newsletter_02.png", title: "Newsletter colorida", description: "Produtos de casa e construção", template: "1", pagina: ["common"], platforms: ['Tray', 'Shopify', 'Wake'] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01",selection: "breadcrumb", key:"bred01q3r4s5t", image: "breadcrumb/desktop/breadcrumb_01.png", mobile: "breadcrumb/mobile/breadcrumb_01_m.png", title: "breadcrumb clean", description: "Variedades de links", template: "1", pagina: ["common"], platforms: ['Tray', 'Wake'] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01",selection: "footer", key:"ftr01q3r4s5t", image: "footer/desktop/footer_02.png", mobile: "footer/mobile/footer_02_m.png", title: "Footer clean", description: "Variedades de links", template: "1", pagina: ["common"], platforms: ['Tray', 'Wake'] },
    ],
  },
} as const;
  
export type LayoutKey = keyof typeof LAYOUTS;  
