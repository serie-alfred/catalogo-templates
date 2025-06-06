export const LAYOUTS = {
  header: {
    name: "Header",
    items: [
      { id: "01", image: "header_01.png", mobile: "header_01_m.png", title: "Header Moderno", description: "Menu de navegação com busca e carrinho", template: "1", pagina: ["home", "pdp", "plp"] },
      { id: "02", image: "header_02.png", mobile: "header_02_m.png", title: "Header com Mega Menu", description: "Navegação multinível com promoções", template: "1", pagina: ["home", "pdp", "plp"] },
      { id: "03", image: "header_03.png", mobile: "header_03_m.png", title: "Header preto", description: "Navegação multinível com promoções", template: "3", pagina: ["home", "plp"] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01", image: "banner_01.png", mobile: "banner_01_m.png", title: "Banner Colorido", description: "Banner com destaque visual e chamada", template: "1", pagina: ["home"] },
      { id: "02", image: "banner_02.png", mobile: "banner_02_m.png", title: "Banner com fundo claro", description: "Layout promocional mais clean", template: "2", pagina: ["pdp"] },
      { id: "03", image: "banner_02.png", mobile: "banner_02_m.png", title: "Banner preto", description: "Layout promocional mais clean", template: "3", pagina: ["home"] },
    ],
  },
  beneficios: {
    name: "Benefícios",
    items: [
      { id: "01", image: "benefitsBar_01.png", mobile: "benefitsBar_01_m.png", title: "Barra de benefícios", description: "Benefícios", template: "1", pagina: ["plp"] },
      { id: "02", image: "benefitsBar_02.png", mobile: "benefitsBar_02_m.png", title: "Barra de benefícios", description: "Benefícios", template: "2", pagina: ["home"] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01", image: "gridBanner_01.png", mobile: "gridBanner_01_m.png", title: "Grid de banners", description: "Seção de banners", template: "1", pagina: ["pdp"] },
      { id: "02", image: "gridBanner_02.png", mobile: "gridBanner_02_m.png", title: "Grid de banners", description: "Seção de banners", template: "2", pagina: ["home"] },
      { id: "03", image: "gridBanner_03.png", mobile: "gridBanner_03_m.png", title: "Grid de banners", description: "Seção de banners", template: "3", pagina: ["plp"] },
    ],
  },
  vitrine: {
    name: "Vitrines",
    items: [
      { id: "01", image: "shelf_01.png", mobile: "shelf_01_m.png", title: "Vitrine moda", description: "Seção com produtos de moda", template: "2", pagina: ["home"] },
      { id: "02", image: "shelf_02.png", mobile: "shelf_02_m.png", title: "Vitrine ferramentas", description: "Produtos de casa e construção", template: "2", pagina: ["pdp"] },
      { id: "03", image: "shelf_03.png", mobile: "shelf_03_m.png", title: "Vitrine esmalte", description: "Produtos de casa e construção", template: "1", pagina: ["plp"] },
      { id: "04", image: "shelf_04.png", mobile: "shelf_04.png", title: "Vitrine 4", description: "Produtos de casa e construção", template: "4", pagina: ["home"] },
    ],
  },
  newsletter: {
    name: "Newsletter",
    items: [
      { id: "01", image: "newsletter_01.png", mobile: "newsletter_01_m.png", title: "Newsletter clean", description: "Seção com produtos de moda", template: "1", pagina: ["home"] },
      { id: "02", image: "newsletter_02.png", mobile: "newsletter_02.png", title: "Newsletter colorida", description: "Produtos de casa e construção", template: "1", pagina: ["pdp"] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01", image: "footer_02.png", mobile: "footer_02_m.png", title: "Footer clean", description: "Variedades de links", template: "2", pagina: ["home"] },
    ],
  },
} as const;
  
  /** deriva os tipos pra poder usar onde precisar com tipagem forte:
   * nada de "any" por aqui safado!!
   */
  export type LayoutKey = keyof typeof LAYOUTS;  
  export type LayoutSection = typeof LAYOUTS[LayoutKey];  
  export type LayoutItem = LayoutSection["items"][number];
  