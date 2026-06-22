import type { Platform } from "@/types/platform";

export type Pagina = "common" | "home" | "category" | "product";

/**
 * Variável de cor de fundo da marca utilizada pelo template.
 * - `primary`   → --background-primary-color   (Cor primária da marca)
 * - `secondary` → --background-secundary-color (Cor secundária da marca)
 * - `tertiary`  → --background-tertiary-color  (Cor terciária da marca)
 * - `footer`    → --background-footer          (Cor do rodapé)
 */
export type BackgroundVar = "primary" | "secondary" | "tertiary" | "footer";

export const BACKGROUND_VAR_LABELS: Record<BackgroundVar, string> = {
  primary: "Cor primária da marca",
  secondary: "Cor secundária da marca",
  tertiary: "Cor terciária da marca",
  footer: "Cor do rodapé",
};

/**
 * Tipo de variável individual que um componente expõe para personalização
 * por instância (editada no painel lateral e gravada no `variables` do config).
 */
export type ComponentVariableType = "color" | "font";

/**
 * Descreve UMA variável individual de um componente.
 *
 * @property cssVar  - nome literal da CSS custom property, ex: "--header-topbar-bg".
 *                     É a chave usada verbatim no objeto `variables` do config.json.
 * @property label   - rótulo exibido no painel de edição.
 * @property type    - "color" → ColorPicker, "font" → FontSelector.
 * @property default - valor padrão (igual ao fallback do `var()` no SCSS do componente).
 * @property group   - agrupamento visual opcional ("Barra superior", "Menu"...).
 * @property inheritsLabel - nome amigável da variável global herdada enquanto não
 *                     há override (ex.: "cor primária da marca"), exibido no painel.
 */
export type ComponentVariable = {
  cssVar: string;
  label: string;
  type: ComponentVariableType;
  default: string;
  group?: string;
  inheritsLabel?: string;
};

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
 * @property backgroundVars - Cores de fundo da marca que o template utiliza (alimenta o aviso no SelectSectionItem).
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
  backgroundVars: BackgroundVar[];
  path?: string;
  override?: boolean;
  /**
   * Variáveis individuais (cor/fonte) que este componente expõe para
   * personalização por instância. O botão de edição ("lápis") só aparece
   * quando `variablesSchema` existe e tem ao menos um item.
   */
  variablesSchema?: ComponentVariable[];
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
      { id: "01", selection: "header", key: "hdr01a2b3c4d", image: "", mobile: "", title: "Header Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Header01", path: "organisms/Header01", platforms: ['Tray','Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#122161", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto/ícones da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header (meio)", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#122161", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-nav-bg", label: "Fundo da barra de menu", type: "color", default: "#122161", group: "Menu", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-nav-text", label: "Texto do menu principal", type: "color", default: "#ffffff", group: "Menu", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "header", key: "hdr02h8l2gty", image: "", mobile: "", title: "Header Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Header02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "secondary", "tertiary"] },
      { id: "03", selection: "header", key: "hdr03a2b3c4d", image: "", mobile: "", title: "Header Template 3", description: "Header com topbar animada e menu de navegação", template: "3", pagina: ["common"], component: "Header03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"] },
      //{ id: "04",selection: "header", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Header Moderno 04", description: "Menu de navegação com busca e carrinho", template: "4", pagina: ["common"], component: "Header04", platforms: ['Tray'] },
    ],
  },
  spot: {
    name: "Card de Produto",
    items: [
      { id: "01", selection: "spot", key: "crdprd017839", image: "", mobile: "", title: "Card de Produto Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Spot01", path: "molecules/ProductCard01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Cor da etiqueta 'Novo'", type: "color", default: "#f5a623", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-btn-bg", label: "Cor do botão comprar", type: "color", default: "#122161", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "spot", key: "cardprd02g96", image: "", mobile: "", title: "Card de Produto Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Spot02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "secondary"] },
      { id: "03", selection: "spot", key: "crdprd03h291", image: "", mobile: "", title: "Card de Produto Template 3", description: "Card de produto com seletor de tamanhos", template: "3", pagina: ["common"], component: "Spot03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"] },
      //{ id: "06",selection: "spot", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Card Moderno 06", description: "Card do produto 06", template: "6", pagina: ["common"], component: "Spot06", platforms: ['Tray'] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01", selection: "breadcrumb", key: "bred01q3r4s5", image: "", mobile: "", title: "Breadcrumb Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Breadcrumb01", path: "overrides/Breadcrumb01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Cor do texto e links", type: "color", default: "#292929", group: "Breadcrumb", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
     // { id: "02", selection: "breadcrumb", key: "bred02q7l4k55", image: "", mobile: "", title: "Breadcrumb Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Breadcrumb02", platforms: ['Tray', 'Wake'] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01", selection: "footer", key: "ftr01r39ws5p", image: "", mobile: "", title: "Footer Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Footer01",path: "organisms/Footer01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1A051C", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#3D3D3D", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-button-bg", label: "Cor do botão da newsletter", type: "color", default: "#682A77", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Cor do texto/ícone do botão", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
      ] },
      { id: "02", selection: "footer", key: "ftr02qmrhs43", image: "", mobile: "", title: "Footer Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Footer02", platforms: ['Tray', 'Wake'], backgroundVars: ["footer", "primary", "tertiary"] },
      { id: "03", selection: "footer", key: "ftr03q3r4s5t", image: "", mobile: "", title: "Footer Template 3", description: "Footer com benefícios, newsletter e links", template: "3", pagina: ["common"], component: "Footer03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"] },
      { id: "04", selection: "footer", key: "ftr04m4nu9x2", image: "", mobile: "", title: "Footer Template 4", description: "Rodapé escuro premium (MANU) com marca, colunas em accordion no mobile, newsletter e barra inferior", template: "4", pagina: ["common"], component: "Footer04", path: "organisms/Footer04", platforms: ['VTEX'], backgroundVars: ["footer", "primary", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#0a0a0a", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover do botão)", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#0a0a0a", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte do logo/títulos", type: "font", default: "'Roboto', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },

  // HOME
  bannerFull: {
    name: "Banner largura máxima",
    items: [
      { id: "01", selection: "banner-full", key: "banful01hwt4", image: "", mobile: "", title: "Banner largura máxima Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerFull01", path: "atoms/BannerFull01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-full", key: "hdr01a2b3c4d", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerFull02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      { id: "04", selection: "category-banner", key: "BanFul02op74", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "BannerFullCategory02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      //{ id: "03",selection: "banner-full", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Moderno 03", description: "Banner com largura máxima", template: "3", pagina: ["home"], component: "BannerFull03", platforms: ['Tray'] },
      //{ id: "05",selection: "banner-full", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Banner Moderno 05", description: "Banner com largura máxima", template: "5", pagina: ["home"], component: "BannerFull05", platforms: ['Tray'] },
    ],
  },
  brand: {
    name: "Marcas",
    items: [
      { id: "01", selection: "brands", key: "mar01b3k7h2b", image: "", mobile: "", title: "Marcas Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Brand01", path: "molecules/Brands01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },
  textArea: {
    name: "Área de Texto",
    items: [
      //{ id: "01", selection: "text-area", key: "txt01a2b3c4d", image: "", mobile: "", title: "Área de Texto Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], override: true, path: "molecules/TextArea", component: "TextArea", platforms: ['VTEX'], backgroundVars: [] },
    ],
  },
  categories: {
    name: "Carrossel de Categorias",
    items: [
      { id: "01", selection: "categories", key: "cat01lk3ndkl", image: "", mobile: "", title: "Carrossel de Categorias Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Categories01", path: "molecules/Categories01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Cor do título e nomes", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      //{ id: "02",selection: "multi-categories", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Carrossel de categorias", description: "", template: "4", pagina: ["home"], component: "MultiCategories04", platforms: ['Tray'] },
      //{ id: "03",selection: "home-carousel", key:"hdr01a2b3c4d", image: "", mobile: "", title: "Carrossel de categorias 06", description: "", template: "6", pagina: ["home"], component: "HomeCarousel06", platforms: ['Tray'] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01", selection: "banner-main", key: "ban01m1k3nq2", image: "", mobile: "", title: "Banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerMain01", path: "organisms/BannerMain01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-accent", label: "Cor do bullet ativo", type: "color", default: "#682A77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      //{ id: "02",selection: "banner-main",key:"bnr01m1n2o3p", image: "", mobile: "", title: "Banner Colorido 06", description: "Banner com destaque visual e chamada 06", template: "6", pagina: ["home"], component: "BannerMain06", platforms: ['Tray'] },
    ],
  },
  ruler: {
    name: "Regua de benefícios",
    items: [
      { id: "01", selection: "ruler", key: "bnf01lm3a894", image: "", mobile: "", title: "Regua de benefícios Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Ruler01", path: "molecules/Ruler01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#122161", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--ruler-text", label: "Texto e ícones da régua", type: "color", default: "#ffffff", group: "Régua", inheritsLabel: "cor de texto secundária" },
      ] },
      { id: "02", selection: "ruler", key: "bnf0213jan45", image: "", mobile: "", title: "Regua de benefícios Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Ruler02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary"] },
      //{ id: "03",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 03", description: "Benefícios 3", template: "3", pagina: ["home"], component: "Ruler03", platforms: ['Tray'] },
      //{ id: "04",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 04", description: "Benefícios 4", template: "4", pagina: ["home"], component: "Ruler04", platforms: ['Tray'] },
      //{ id: "05",selection: "ruler", key:"bnf01y0z1a2b", image: "", mobile: "", title: "Barra de benefícios 05", description: "Benefícios 5", template: "5", pagina: ["home"], component: "Ruler05", platforms: ['Tray'] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01", selection: "banner-grid", key: "grd01qw09er8", image: "", mobile: "", title: "Grid de banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerGrid01", path: "molecules/BannerGrid01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },
  bannerSide: {
    name: "Banner Side",
    items: [
      { id: "01", selection: "banner-side", key: "bansd014mh45", image: "", mobile: "", title: "Banner Side Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerSide01", path: "molecules/BannerSide01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-duplo", key: "bansdhg028e3", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerDuplo02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      { id: "03", selection: "banner-side", key: "bansd0334nb7", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerSide02", platforms: ['Tray', 'Wake'], backgroundVars: ["tertiary"] },
    ],
  },
  showcase: {
    name: "Vitrines",
    items: [
      { id: "01", selection: "showcase", key: "vtr01cm487ha", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Showcase01", path: "organisms/ProductShelfCustom01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#682A77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "02", selection: "showcase", key: "vtr02mq91m48", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Showcase02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary"] },
      { id: "03", selection: "showcase", key: "vtr03s5t6u7v", image: "", mobile: "", title: "Vitrine Template 3", description: "Vitrine de produtos com carrossel e seletor de tamanhos", template: "3", pagina: ["home"], component: "Showcase03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"] },
      //{ id: "05",selection: "showcase", key:"vtr01s5t6u7v", image: "", mobile: "", title: "Vitrine moda 6", description: "Seção com produtos de moda 6", template: "6", pagina: ["home"], component: "Showcase06", platforms: ['Tray'] },
    ],
  },

  // CATEGORY
  categoryMain: {
    name: "Grade de produtos",
    items: [
      { id: "01", selection: "category-main", key: "catmn01ll098", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryMain01", path: "organisms/MainCategory01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--cat-main-btn-bg", label: "Cor do botão de filtro", type: "color", default: "#122161", group: "Botões", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cat-main-btn-text", label: "Texto do botão de filtro", type: "color", default: "#ffffff", group: "Botões", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cat-main-accent", label: "Cor de destaque (paginação)", type: "color", default: "#682A77", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-main-page-text", label: "Texto da paginação ativa", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--cat-main-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "category-main", key: "catmn0254hg3", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "CategoryMain02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "tertiary"] },
    ],
  },
  categoryDescription: {
    name: "Descrição de categoria",
    items: [
      { id: "01", selection: "category-description", key: "catdes01hp82", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryDescription01", path: "organisms/DescriptionCategory01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-desc-text", label: "Cor do texto", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },
  // PRODUCT
  bannerProduct: {
    name: "Banner",
    items: [
      { id: "01", selection: "banner-top", key: "ban01p4q5r6s", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "BannerTop01", platforms: ['Tray', 'Wake'], backgroundVars: [] },
    ],
  },
  productDescription: {
    name: "descrição",
    items: [
      { id: "01", selection: "product-description", key: "desc01t7u8v9w", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductDescription01", path: "molecules/ProductDescription01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--prod-desc-text", label: "Cor do texto", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-table-bg", label: "Fundo das linhas pares da tabela", type: "color", default: "#f5f5f5", group: "Tabela", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--prod-desc-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },
  productInfo: {
    name: "Informações do produto",
    items: [
      { id: "01", selection: "product-info", key: "info01x0y1z2a", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductInfo01", path: "molecules/ProductInfo01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--prod-info-btn-bg", label: "Cor do botão comprar", type: "color", default: "#682A77", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-info-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--prod-info-tag-bg", label: "Cor da etiqueta 'Novo'", type: "color", default: "#f5a623", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--prod-info-tag-text", label: "Texto da etiqueta 'Novo'", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto terciária" },
        { cssVar: "--prod-info-secondary-bg", label: "Cor do botão secundário", type: "color", default: "#122161", group: "Botão secundário", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--prod-info-secondary-text", label: "Texto do botão secundário", type: "color", default: "#ffffff", group: "Botão secundário", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--prod-info-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "product-info", key: "info02b3c4d5e", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["product"], component: "ProductInfo02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "secondary", "tertiary"] },
    ],
  },
  productRelated: {
    name: "Produtos Relacionados",
    items: [
      { id: "01", selection: "product-related", key: "rel01f6g7h8i", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductRelated01", path: "organisms/ProductShowcase01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
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
