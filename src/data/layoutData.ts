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
  bannerTriple: LayoutSection;
  bannerSolo: LayoutSection;
  bannerSideLeft: LayoutSection;
  specialOffers: LayoutSection;
  homeCombined: LayoutSection;
  review: LayoutSection;
  rooms: LayoutSection;
  newsletter: LayoutSection;
  buySize: LayoutSection;
  helpFloat: LayoutSection;
  productLines: LayoutSection;
  productBanner: LayoutSection;
  categoryTitle: LayoutSection;
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
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "header", key: "hdr02h8l2gty", image: "", mobile: "", title: "Header Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Header02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "secondary", "tertiary"] },
      { id: "03", selection: "header", key: "hdr03a2b3c4d", image: "", mobile: "", title: "Header Template 3", description: "Header com topbar animada e menu de navegação", template: "3", pagina: ["common"], component: "Header03", path: "organisms/Header03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#000000", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#000000", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (hover, underline)", type: "color", default: "#e73888", group: "Header", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "header", key: "hdr04mnu7zk2", image: "", mobile: "", title: "Header Template 4", description: "Header escuro premium (MANU) com barra de avisos, navegação e tira de benefícios", template: "4", pagina: ["common"], component: "Header04", path: "organisms/Header04", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#0a0a0a", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto/ícones da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#0a0a0a", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (badge, hover, menu)", type: "color", default: "#0a0a0a", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-accent-text", label: "Texto sobre o destaque", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-strip-bg", label: "Fundo da faixa de benefícios", type: "color", default: "#f5f5f5", group: "Faixa de benefícios", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-strip-text", label: "Texto da faixa de benefícios", type: "color", default: "#6b6b6b", group: "Faixa de benefícios", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--header-title-font", label: "Fonte do logo", type: "font", default: "Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "05", selection: "header", key: "hdr05mnu6xj1", image: "", mobile: "", title: "Header Template 5", description: "Header claro (SÉRIE//A) com barra de serviço, busca, wordmark e navegação por categorias", template: "5", pagina: ["common"], component: "Header05", path: "organisms/Header05", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-service-bg", label: "Fundo da barra de serviço", type: "color", default: "#1a1f2b", group: "Header", inheritsLabel: "cor de texto do header" },
        { cssVar: "--header-service-text", label: "Texto da barra de serviço", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "fundo do header" },
        { cssVar: "--header-text", label: "Texto/ícones", type: "color", default: "#1a1f2b", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (ofertas, hover, foco)", type: "color", default: "#2f9e57", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-danger", label: "Cor de alerta/oferta", type: "color", default: "#d6432a", group: "Destaque" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-title-font", label: "Fonte do logo", type: "font", default: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "header", key: "hdr06frc1a2b", image: "", mobile: "", title: "Header Template 6", description: "Top-bar em slider, mega-menu por hover, busca e ícones (favoritos, lojas, conta, sacola)", template: "6", pagina: ["common"], component: "Header06", path: "organisms/Header06", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#4f4f4f", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-topbar-font", label: "Fonte da barra superior", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#212721", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-mega-panel", label: "Fundo do banner do mega-menu", type: "color", default: "#21464f", group: "Mega-menu" },
        { cssVar: "--header-rule", label: "Borda do autocomplete", type: "color", default: "#e3e4e6", group: "Busca" },
        { cssVar: "--header-muted", label: "Texto das sugestões de busca", type: "color", default: "#727273", group: "Busca" },
        { cssVar: "--header-login-bg", label: "Fundo do botão Entrar (menu mobile)", type: "color", default: "#212721", group: "Menu mobile", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-login-text", label: "Texto do botão Entrar (menu mobile)", type: "color", default: "#ffffff", group: "Menu mobile", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#212721", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "header", key: "hdr07bru1k2m", image: "", mobile: "", title: "Header Template 7", description: "Barra superior rotativa, busca central, ícones de conta/sacola e menu de categorias", template: "7", pagina: ["common"], component: "Header07", path: "organisms/Header07", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#2c2420", group: "Barra superior", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#f5f0e8", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#fff", group: "Header" },
        { cssVar: "--header-text", label: "Texto do header", type: "color", default: "#2c2420", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-nav-text", label: "Texto do menu", type: "color", default: "#4a3f38", group: "Menu", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-sale", label: "Cor de \'Saldos\' e destaques", type: "color", default: "#c07a5a", group: "Menu" },
        { cssVar: "--header-rule", label: "Linhas divisórias", type: "color", default: "#ede4d8", group: "Header" },
        { cssVar: "--header-muted", label: "Texto secundário", type: "color", default: "#8c7d74", group: "Header" },
        { cssVar: "--header-surface", label: "Fundo dos painéis", type: "color", default: "#fff", group: "Menu" },
        { cssVar: "--header-field-bg", label: "Fundo do campo de busca", type: "color", default: "#faf8f4", group: "Busca" },
        { cssVar: "--header-field-border", label: "Borda do campo de busca", type: "color", default: "#e8dfd5", group: "Busca" },
        { cssVar: "--header-mega-quote", label: "Citação sobre a arte do megamenu", type: "color", default: "#faf8f4", group: "Menu" },
        { cssVar: "--header-font", label: "Fonte da marca", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-body-font", label: "Fonte do menu e do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
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
      { id: "03", selection: "spot", key: "crdprd03h291", image: "", mobile: "", title: "Card de Produto Template 3", description: "Card de produto com seletor de tamanhos", template: "3", pagina: ["common"], component: "Spot03", path: "molecules/ProductCard03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#000000", group: "Etiquetas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-btn-bg", label: "Fundo do seletor de tamanho (hover)", type: "color", default: "#000000", group: "Seletor de tamanho", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do seletor de tamanho (hover)", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "spot", key: "crdprd04f1a2", image: "", mobile: "", title: "Card de Produto Template 4", description: "Card de produto com botão de adicionar", template: "4", pagina: ["common"], component: "Spot04", path: "molecules/ProductCard04", platforms: ['VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#219653", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão adicionar", type: "color", default: "#e40101", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão adicionar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "05", selection: "spot", key: "crdprd05b3c4", image: "", mobile: "", title: "Card de Produto Template 5", description: "Card de produto com avaliação e desejos", template: "5", pagina: ["common"], component: "Spot05", path: "molecules/ProductCard05", platforms: ['VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#219653", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-price-color", label: "Cor do preço principal", type: "color", default: "#0096fe", group: "Preço", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "06", selection: "spot", key: "crdprd06f6g7", image: "", mobile: "", title: "Card de Produto Template 6", description: "Card com etiqueta de oferta e botão comprar", template: "6", pagina: ["common"], component: "Spot06", path: "molecules/ProductCard06", platforms: ['VTEX'], backgroundVars: ["tertiary"] },
      { id: "07", selection: "spot", key: "crdprd07h8j9", image: "", mobile: "", title: "Card de Produto Template 7", description: "Card minimalista, sem botão de compra", template: "7", pagina: ["common"], component: "Spot07", path: "molecules/ProductCard07", platforms: ['VTEX'], backgroundVars: ["secondary"] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01", selection: "breadcrumb", key: "bred01q3r4s5", image: "", mobile: "", title: "Breadcrumb Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Breadcrumb01", path: "overrides/Breadcrumb01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Cor do texto e links", type: "color", default: "#292929", group: "Breadcrumb", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "breadcrumb", key: "bred02q7l4k5", image: "", mobile: "", title: "Breadcrumb Template 2", description: "Breadcrumb com separador em chevron", template: "2", pagina: ["common"], component: "Breadcrumb02", platforms: ['Wake'], backgroundVars: [] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01", selection: "footer", key: "ftr01r39ws5p", image: "", mobile: "", title: "Footer Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Footer01",path: "organisms/Footer01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1A051C", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#3D3D3D", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "footer", key: "ftr02qmrhs43", image: "", mobile: "", title: "Footer Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Footer02", platforms: ['Tray', 'Wake'], backgroundVars: ["footer", "primary", "tertiary"] },
      { id: "03", selection: "footer", key: "ftr03q3r4s5t", image: "", mobile: "", title: "Footer Template 3", description: "Footer com benefícios, newsletter e links", template: "3", pagina: ["common"], component: "Footer03", path: "organisms/Footer03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#000000", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover, links)", type: "color", default: "#e60f73", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-legal-bg", label: "Fundo da barra legal", type: "color", default: "#000000", group: "Barra legal", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-legal-text", label: "Texto da barra legal", type: "color", default: "#ffffff", group: "Barra legal", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão newsletter", type: "color", default: "#000000", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "footer", key: "ftr04m4nu9x2", image: "", mobile: "", title: "Footer Template 4", description: "Rodapé escuro premium (MANU) com marca, colunas em accordion no mobile, newsletter e barra inferior", template: "4", pagina: ["common"], component: "Footer04", path: "organisms/Footer04", platforms: ['VTEX'], backgroundVars: ["footer", "primary", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#0a0a0a", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover do botão)", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#0a0a0a", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte do logo/títulos", type: "font", default: "'Roboto', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "05", selection: "footer", key: "ftr05mnu8wq4", image: "", mobile: "", title: "Footer Template 5", description: "Rodapé claro (SÉRIE//A) com newsletter, colunas, contato e barra de pagamentos", template: "5", pagina: ["common"], component: "Footer05", path: "organisms/Footer05", platforms: ['VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#fff", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#000", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (botão, links, hover)", type: "color", default: "#e60f73", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-newsletter-bg", label: "Fundo da seção newsletter", type: "color", default: "#f4f4f4", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-newsletter-text", label: "Texto da seção newsletter", type: "color", default: "#000000", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão newsletter", type: "color", default: "#e60f73", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão newsletter", type: "color", default: "#fff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte do logo/títulos", type: "font", default: "'Roboto', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "footer", key: "ftr06frc3c4d", image: "", mobile: "", title: "Footer Template 6", description: "Newsletter (nome + e-mail), redes sociais, 3 colunas e barra inferior com copyright", template: "6", pagina: ["common"], component: "Footer06", path: "organisms/Footer06", platforms: ['VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#f6f6f6", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#212721", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover, links)", type: "color", default: "#c0121c", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-newsletter-bg", label: "Fundo da faixa da newsletter", type: "color", default: "#ffffff", group: "Newsletter" },
        { cssVar: "--footer-newsletter-text", label: "Texto da faixa da newsletter", type: "color", default: "#212721", group: "Newsletter" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão newsletter", type: "color", default: "#212721", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "footer", key: "ftr07bru3n4p", image: "", mobile: "", title: "Footer Template 7", description: "Rodapé escuro: newsletter, colunas institucionais e barra inferior", template: "7", pagina: ["common"], component: "Footer07", path: "organisms/Footer07", platforms: ['VTEX'], backgroundVars: ["secondary", "tertiary", "footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1e1612", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#f5f0e8", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Rodapé", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#b8976a", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-input-bg", label: "Fundo do campo de e-mail", type: "color", default: "rgba(255, 255, 255, 0.07)", group: "Newsletter" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  // HOME
  bannerFull: {
    name: "Banner largura máxima",
    items: [
      { id: "01", selection: "banner-full", key: "banful01hwt4", image: "", mobile: "", title: "Banner largura máxima Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerFull01", path: "atoms/BannerFull01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-full", key: "bnfull02x7k9", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerFull02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      { id: "04", selection: "category-banner", key: "BanFul02op74", image: "", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "BannerFullCategory02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      { id: "05", selection: "banner-full", key: "bnfull05k3m7", image: "", mobile: "", title: "Banner largura máxima Template 5", description: "Banner único ocupando a largura total da página", template: "5", pagina: ["home"], component: "BannerFull05", platforms: ['Tray'], backgroundVars: [] },
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
      { id: "01", selection: "text-area", key: "txt01a2b3c4d", image: "", mobile: "", title: "Área de Texto Template 1", description: "Bloco de conteúdo HTML livre, preenchido no CMS", template: "1", pagina: ["home"], override: true, path: "molecules/TextArea", component: "TextArea", platforms: ['VTEX'], backgroundVars: [] },
    ],
  },
  categories: {
    name: "Carrossel de Categorias",
    items: [
      { id: "01", selection: "categories", key: "cat01lk3ndkl", image: "", mobile: "", title: "Carrossel de Categorias Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Categories01", path: "molecules/Categories01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Cor do título e nomes", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "04", selection: "multi-categories", key: "mulcat04n8p2", image: "", mobile: "", title: "Carrossel de Categorias Template 4", description: "Grade de categorias com imagem e rótulo", template: "4", pagina: ["home"], component: "MultiCategories04", platforms: ['Tray'], backgroundVars: [] },
      { id: "06", selection: "home-carousel", key: "homcar06q4r9", image: "", mobile: "", title: "Carrossel de Categorias Template 6", description: "Carrossel de categorias", template: "6", pagina: ["home"], component: "HomeCarousel06", platforms: ['Tray'], backgroundVars: [] },
      { id: "07", selection: "categories", key: "cat07bru4d5e", image: "", mobile: "", title: "Carrossel de Categorias Template 7", description: "Grid de curadoria: 6 cards no desktop e 4 no mobile, com título e link \'Ver todos\'", template: "7", pagina: ["home"], component: "Categories07", path: "molecules/Categories07", platforms: ['VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Cor do título e dos rótulos", type: "color", default: "#2c2420", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Cor do link e do hover", type: "color", default: "#b8976a", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-font", label: "Fonte do título e dos rótulos", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-body-font", label: "Fonte do link", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01", selection: "banner-main", key: "ban01m1k3nq2", image: "", mobile: "", title: "Banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerMain01", path: "organisms/BannerMain01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-accent", label: "Cor do bullet ativo", type: "color", default: "#682A77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "06", selection: "banner-main", key: "ban06a1b2c3d", image: "", mobile: "", title: "Banners Template 6", description: "Banner clicável de largura total, com arte separada para desktop e mobile", template: "6", pagina: ["home"], component: "BannerMain06", path: "organisms/BannerMain06", platforms: ['Tray', 'VTEX'], backgroundVars: [] },
      { id: "07", selection: "banner-main", key: "ban07bru6h7j", image: "", mobile: "", title: "Banners Template 7", description: "Hero com rótulo, título, subtítulo e CTAs sobre a arte; conteúdo e altura próprios no mobile", template: "7", pagina: ["home"], component: "BannerMain07", path: "organisms/BannerMain07", platforms: ['VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--banner-main-title-color", label: "Cor do título", type: "color", default: "#faf8f4", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-text", label: "Cor do rótulo e do subtítulo", type: "color", default: "#f5f0e8", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-cta-bg", label: "Fundo do botão principal", type: "color", default: "#faf8f4", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-cta-text", label: "Texto do botão principal", type: "color", default: "#2c2420", group: "Hero", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-main-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  ruler: {
    name: "Regua de benefícios",
    items: [
      { id: "01", selection: "ruler", key: "bnf01lm3a894", image: "", mobile: "", title: "Regua de benefícios Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Ruler01", path: "molecules/Ruler01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#122161", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--ruler-text", label: "Texto e ícones da régua", type: "color", default: "#ffffff", group: "Régua", inheritsLabel: "cor de texto secundária" },
      ] },
      { id: "03", selection: "ruler", key: "bnf03q2w3e4r", image: "", mobile: "", title: "Regua de benefícios Template 3", description: "Faixa escura de benefícios: ícone + título + subtítulo, 4 colunas no desktop e 2 no mobile", template: "3", pagina: ["home"], component: "Ruler03", path: "molecules/BenefitsStrip07", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--benefits-bg", label: "Fundo da faixa", type: "color", default: "#2c2420", group: "Régua", inheritsLabel: "cor primária da marca" },
        { cssVar: "--benefits-accent", label: "Ícones da régua", type: "color", default: "#b8976a", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--benefits-title", label: "Texto da régua", type: "color", default: "#f5f0e8", group: "Régua", inheritsLabel: "cor de texto base" },
        { cssVar: "--benefits-font", label: "Fonte da régua", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "ruler", key: "bnf0213jan45", image: "", mobile: "", title: "Regua de benefícios Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Ruler02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary"] },
      { id: "04", selection: "ruler", key: "bnf04t5u6v7w", image: "", mobile: "", title: "Regua de benefícios Template 4", description: "Régua de benefícios em linha de ícones", template: "4", pagina: ["home"], component: "Ruler04", platforms: ['Tray'], backgroundVars: [] },
      { id: "05", selection: "ruler", key: "bnf05x8y9z0a", image: "", mobile: "", title: "Regua de benefícios Template 5", description: "Régua de benefícios em carrossel", template: "5", pagina: ["home"], component: "Ruler05", platforms: ['Tray'], backgroundVars: [] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01", selection: "banner-grid", key: "grd01qw09er8", image: "", mobile: "", title: "Grid de banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerGrid01", path: "molecules/BannerGrid01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "banner-grid", key: "grd06frc9j1k", image: "", mobile: "", title: "Grid de banners Template 6", description: "Título centrado e slider de banner-cards de categoria: 3 por página no desktop, 1 com dots e setas no mobile", template: "6", pagina: ["home"], component: "BannerGrid06", path: "molecules/BannerGrid06", platforms: ['VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Grid de banners", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-card-title-color", label: "Cor do título do card", type: "color", default: "#ffffff", group: "Grid de banners", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-grid-font", label: "Fonte do título", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-card-font", label: "Fonte do título do card", type: "font", default: "'League Spartan', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },
  bannerSide: {
    name: "Banner Side",
    items: [
      { id: "01", selection: "banner-side", key: "bansd014mh45", image: "", mobile: "", title: "Banner Side Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerSide01", path: "molecules/BannerSide01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-duplo", key: "bansdhg028e3", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerDuplo02", platforms: ['Tray', 'Wake'], backgroundVars: [] },
      { id: "03", selection: "banner-side", key: "bansd0334nb7", image: "", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerSide02", platforms: ['Tray', 'Wake'], backgroundVars: ["tertiary"] },
      { id: "06", selection: "banner-side", key: "bansd06f7g8h", image: "", mobile: "", title: "Banner Side Template 6", description: "Par de banner-cards lado a lado: arte clicável, parágrafo e link \'Veja mais\'", template: "6", pagina: ["home"], component: "BannerSide06", path: "molecules/BannerSide06", platforms: ['VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-side-text", label: "Cor do texto e do sublinhado", type: "color", default: "#212721", group: "Banner Side", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-side-font", label: "Fonte do texto", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  showcase: {
    name: "Vitrines",
    items: [
      { id: "01", selection: "showcase", key: "vtr01cm487ha", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Showcase01", path: "organisms/ProductShelfCustom01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#682a77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "02", selection: "showcase", key: "vtr02mq91m48", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Showcase02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary"] },
      { id: "03", selection: "showcase", key: "vtr03s5t6u7v", image: "", mobile: "", title: "Vitrine Template 3", description: "Vitrine de produtos com carrossel e seletor de tamanhos", template: "3", pagina: ["home"], component: "Showcase03", path: "organisms/ProductShelfCustom03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#000000", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "04", selection: "showcase", key: "vtr04w8x9y0z", image: "", mobile: "", title: "Vitrine Template 4", description: "Vitrine com setas laterais e dots na barra inferior", template: "4", pagina: ["home"], component: "Showcase04", path: "organisms/ProductShelfCustom04", platforms: ['VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#e40101", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "05", selection: "showcase", key: "vtr05a1b2c3d", image: "", mobile: "", title: "Vitrine Template 5", description: "Vitrine com fundo cinza, setas laterais e avaliação", template: "5", pagina: ["home"], component: "Showcase05", path: "organisms/ProductShelfCustom05", platforms: ['VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#0096fe", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "06", selection: "showcase", key: "vtr06frc4d5e", image: "", mobile: "", title: "Vitrine Template 6", description: "Vitrine com título, subtítulo e carrossel", template: "6", pagina: ["home"], component: "Showcase06", path: "organisms/ProductShelfCustom06", platforms: ['Tray', 'VTEX'], backgroundVars: [] },
      { id: "07", selection: "showcase", key: "vtr07bru5q6r", image: "", mobile: "", title: "Vitrine Template 7", description: "Vitrine com título e link para a listagem completa", template: "7", pagina: ["home"], component: "Showcase07", path: "organisms/ProductShelfCustom07", platforms: ['VTEX'], backgroundVars: ["primary"] },
    ],
  },
  bannerTriple: {
    name: "Banner Triplo",
    items: [
      { id: "01", selection: "banner-triple", key: "bntrp05f4g5h", image: "", mobile: "", title: "Banner Triplo Template 5", description: "Três banners lado a lado, estáticos", template: "5", pagina: ["home"], component: "BannerTriple05", platforms: ['Tray'], backgroundVars: [] },
      { id: "02", selection: "banner-triple-swiper", key: "bntsw05j6k7l", image: "", mobile: "", title: "Banner Triplo Template 5 (carrossel)", description: "Três banners em carrossel", template: "5", pagina: ["home"], component: "BannerTripleSwiper05", platforms: ['Tray'], backgroundVars: [] },
      { id: "03", selection: "banner-triple", key: "bntrp06m8n9p", image: "", mobile: "", title: "Banner Triplo Template 6", description: "Três banners lado a lado", template: "6", pagina: ["home"], component: "BannerTriple06", platforms: ['Tray'], backgroundVars: [] },
      { id: "04", selection: "category-triple", key: "cattrp06q1r2", image: "", mobile: "", title: "Banner Triplo de Categorias Template 6", description: "Três categorias em carrossel", template: "6", pagina: ["home"], component: "CategoryTriple06", platforms: ['Tray'], backgroundVars: [] },
    ],
  },
  bannerSolo: {
    name: "Banner Solo",
    items: [
      { id: "01", selection: "banner-solo", key: "bnsolo04s3t4", image: "", mobile: "", title: "Banner Solo Template 4", description: "Banner único com título fixo e botão de ação", template: "4", pagina: ["home"], component: "BannerSolo04", platforms: ['Tray'], backgroundVars: [] },
    ],
  },
  bannerSideLeft: {
    name: "Banner com texto",
    items: [
      { id: "01", selection: "banner-solo-left", key: "bnslft05w7x8", image: "", mobile: "", title: "Banner com texto Template 5", description: "Banner com bloco de texto alinhado à esquerda", template: "5", pagina: ["home"], component: "BannerSoloLeft05", platforms: ['Tray'], backgroundVars: [] },
      { id: "07", selection: "banner-solo-left", key: "bnslft07b2c3", image: "", mobile: "", title: "Banner com texto Template 7", description: "Banner editorial em 2 colunas: imagem com citação e coluna de texto com link", template: "7", pagina: ["home"], component: "BannerSoloLeft07", path: "molecules/EditorialBanner07", platforms: ['VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-title-color", label: "Cor do título e do link", type: "color", default: "#2c2420", group: "Banner com texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-body-color", label: "Cor do parágrafo", type: "color", default: "#6a5e58", group: "Banner com texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Cor do rótulo e do hover", type: "color", default: "#b8976a", group: "Banner com texto", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-quote-color", label: "Cor da citação sobre a imagem", type: "color", default: "#faf8f4", group: "Banner com texto", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--editorial-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  specialOffers: {
    name: "Ofertas Especiais",
    items: [
      { id: "01", selection: "special-offers", key: "spcofr04u5v6", image: "", mobile: "", title: "Ofertas Especiais Template 4", description: "Bloco de ofertas com cartões de desconto", template: "4", pagina: ["home"], component: "SpecialOffers04", platforms: ['Tray'], backgroundVars: [] },
    ],
  },
  homeCombined: {
    name: "Combinações",
    items: [
      { id: "01", selection: "combined-categ", key: "homcmb04y9z0", image: "", mobile: "", title: "Combinações Template 4", description: "Bloco combinado de categorias, chamada e desconto", template: "4", pagina: ["home"], component: "HomeCombined04", platforms: ['Tray'], backgroundVars: [] },
    ],
  },
  categoryTitle: {
    name: "Título da categoria",
    items: [
      { id: "06", selection: "category-title", key: "cattit06frc7", image: "", mobile: "", title: "Título da categoria Template 6", description: "Linha com o nome da categoria e a contagem de produtos encontrados", template: "6", pagina: ["category"], component: "CategoryTitle06", path: "organisms/CategoryTitle06", platforms: ['VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--plp-text", label: "Cor do título e da contagem", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-title-font", label: "Fonte do título", type: "font", default: "'League Spartan', sans-serif", group: "Tipografia" },
        { cssVar: "--plp-font", label: "Fonte da contagem", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  productBanner: {
    name: "Banner do produto",
    items: [
      { id: "01", selection: "product-banner", key: "pdb01vtx4k5l", image: "", mobile: "", title: "Banner do produto Template 1", description: "Banner livre do produto, cadastrado no campo descriptionBanner da VTEX; arte separada para desktop e mobile", template: "1", pagina: ["product"], component: "ProductBanner01", path: "molecules/ProductDescriptionBanner01", platforms: ['VTEX'], backgroundVars: [] },
    ],
  },

  productLines: {
    name: "Outras linhas",
    items: [
      { id: "06", selection: "product-lines", key: "lin06frc2m3n", image: "", mobile: "", title: "Outras linhas Template 6", description: "Título à esquerda e carrossel de cards de linha com CTA sobreposto: 4 por página no desktop, 1 no mobile", template: "6", pagina: ["home"], component: "BannerCarousel06", path: "molecules/BannerCarousel06", platforms: ['VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-carousel-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Outras linhas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-carousel-cta-color", label: "Cor do CTA sobre a arte", type: "color", default: "#ffffff", group: "Outras linhas", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-carousel-font", label: "Fonte do título", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-carousel-cta-font", label: "Fonte do CTA", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  helpFloat: {
    name: "Ajuda flutuante",
    items: [
      { id: "06", selection: "help-float", key: "hlp06frc7g8h", image: "", mobile: "", title: "Ajuda flutuante Template 6", description: "Barra fixa na borda direita com WhatsApp, trocas, rastreio e horário; recolhida mostra só os ícones", template: "6", pagina: ["home"], component: "HelpFloat06", path: "organisms/HelpFloatButton06", platforms: ['VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo da barra", type: "color", default: "#37343b", group: "Ajuda flutuante", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--help-text", label: "Texto e ícones", type: "color", default: "#ffffff", group: "Ajuda flutuante", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--help-header-bg", label: "Fundo do cabeçalho", type: "color", default: "#ffffff", group: "Ajuda flutuante" },
        { cssVar: "--help-header-text", label: "Texto do cabeçalho", type: "color", default: "#212721", group: "Ajuda flutuante", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-divider", label: "Divisória entre itens", type: "color", default: "#828282", group: "Ajuda flutuante" },
        { cssVar: "--help-font", label: "Fonte", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  buySize: {
    name: "Compre por tamanho",
    items: [
      { id: "06", selection: "buy-size", key: "bsz06frc5e6f", image: "", mobile: "", title: "Compre por tamanho Template 6", description: "Título centrado, fileira de chips de tamanho e link para a lista completa", template: "6", pagina: ["home"], component: "BuySize06", path: "molecules/Categories06", platforms: ['VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#f6f6f6", group: "Compre por tamanho", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--categories-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Compre por tamanho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto dos chips e do link", type: "color", default: "#212721", group: "Compre por tamanho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-font", label: "Fonte do título e dos chips", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },

  newsletter: {
    name: "Newsletter",
    items: [
      { id: "07", selection: "newsletter", key: "nlt07bru3c4d", image: "", mobile: "", title: "Newsletter Template 7", description: "Captura de e-mail em 2 colunas no desktop e empilhada no mobile, com conteúdos próprios por breakpoint", template: "7", pagina: ["home"], component: "Newsletter07", path: "organisms/Newsletter07", platforms: ['VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--newsletter-title-color", label: "Cor do título", type: "color", default: "#2c2420", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-accent", label: "Cor do rótulo", type: "color", default: "#b8976a", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-desc-color", label: "Cor do parágrafo", type: "color", default: "#6a5e58", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-note-color", label: "Cor do aviso", type: "color", default: "#8c7d74", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Formulário", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Formulário", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-input-bg", label: "Fundo do campo", type: "color", default: "#fff", group: "Formulário" },
        { cssVar: "--newsletter-input-text", label: "Texto do campo", type: "color", default: "#4a3f38", group: "Formulário", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-input-border", label: "Borda do campo", type: "color", default: "#d8c9b8", group: "Formulário" },
        { cssVar: "--newsletter-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  rooms: {
    name: "Ambientes",
    items: [
      { id: "07", selection: "rooms", key: "room07bru1a2", image: "", mobile: "", title: "Ambientes Template 7", description: "Escolha por ambiente: rótulo, título e pills de navegação com um ativo", template: "7", pagina: ["home"], component: "ShopByRoom07", path: "organisms/ShopByRoom07", platforms: ['VTEX'], backgroundVars: ["tertiary", "primary"], variablesSchema: [
        { cssVar: "--room-bg", label: "Fundo da seção", type: "color", default: "#f2ede4", group: "Ambientes", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--room-accent", label: "Cor do rótulo", type: "color", default: "#b8976a", group: "Ambientes", inheritsLabel: "cor primária da marca" },
        { cssVar: "--room-title-color", label: "Cor do título", type: "color", default: "#2c2420", group: "Ambientes", inheritsLabel: "cor de texto primária" },
        { cssVar: "--room-pill-active-bg", label: "Fundo da pill ativa", type: "color", default: "#2c2420", group: "Pills", inheritsLabel: "cor primária da marca" },
        { cssVar: "--room-pill-active-text", label: "Texto da pill ativa", type: "color", default: "#f5f0e8", group: "Pills", inheritsLabel: "cor de texto base" },
        { cssVar: "--room-pill-text", label: "Texto da pill", type: "color", default: "#4a3f38", group: "Pills", inheritsLabel: "cor de texto primária" },
        { cssVar: "--room-pill-border", label: "Borda da pill", type: "color", default: "#c8baa8", group: "Pills" },
        { cssVar: "--room-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--room-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  review: {
    name: "Depoimentos",
    items: [
      { id: "01", selection: "client-review", key: "rev06b1c2d3e", image: "", mobile: "", title: "Depoimentos Template 6", description: "Carrossel de depoimentos de clientes", template: "6", pagina: ["home"], component: "ClientReview06", platforms: ['Tray'], backgroundVars: [] },
      { id: "07", selection: "client-review", key: "rev07bru9s8t", image: "", mobile: "", title: "Depoimentos Template 7", description: "Prova social centralizada: número em destaque, subtítulo, estrelas e nota", template: "7", pagina: ["home"], component: "ClientReview07", path: "molecules/SocialProof07", platforms: ['VTEX'], backgroundVars: ["tertiary", "primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#f2ede4", group: "Depoimentos", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--socialproof-number-color", label: "Cor do número", type: "color", default: "#2c2420", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-muted", label: "Cor do subtítulo e da nota", type: "color", default: "#8c7d74", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Cor das estrelas", type: "color", default: "#b8976a", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte do número", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  // CATEGORY
  categoryMain: {
    name: "Grade de produtos",
    items: [
      { id: "01", selection: "category-main", key: "catmn01ll098", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryMain01", path: "organisms/MainCategory01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Cor do texto", type: "color", default: "#141414", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-btn-bg", label: "Cor do botão de filtro", type: "color", default: "#122161", group: "Botões", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cat-main-btn-text", label: "Texto do botão de filtro", type: "color", default: "#ffffff", group: "Botões", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cat-main-accent", label: "Cor de destaque (paginação)", type: "color", default: "#682a77", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-main-page-text", label: "Texto da paginação ativa", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--cat-main-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "category-main", key: "catmn0254hg3", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "CategoryMain02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "tertiary"] },
      { id: "07", selection: "category-main", key: "catmn07bru8p", image: "", mobile: "", title: "Grade de produtos Template 7", description: "PLP completa: trilha, título, subcategorias, sidebar de filtros com faixa de preço, barra de ordenação e grade de cards", template: "7", pagina: ["category"], component: "CategoryMain07", path: "organisms/MainCategory07", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--plp-title-color", label: "Cor do título e dos textos", type: "color", default: "#2c2420", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Listagem", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--plp-cta-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--plp-cta-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Listagem", inheritsLabel: "cor de texto base" },
        { cssVar: "--plp-font-title", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--plp-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
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
        { cssVar: "--prod-desc-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },
  productInfo: {
    name: "Informações do produto",
    items: [
      { id: "01", selection: "product-info", key: "info01x0y1z2a", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductInfo01", path: "organisms/ProductDetails01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--prod-info-btn-bg", label: "Cor do botão comprar", type: "color", default: "#682A77", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-info-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--prod-info-tag-bg", label: "Cor da etiqueta 'Novo'", type: "color", default: "#f5a623", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--prod-info-tag-text", label: "Texto da etiqueta 'Novo'", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto terciária" },
        { cssVar: "--prod-info-secondary-bg", label: "Cor do botão secundário", type: "color", default: "#122161", group: "Botão secundário", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--prod-info-secondary-text", label: "Texto do botão secundário", type: "color", default: "#ffffff", group: "Botão secundário", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--prod-info-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "product-info", key: "info02b3c4d5e", image: "", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["product"], component: "ProductInfo02", platforms: ['Tray', 'Wake'], backgroundVars: ["primary", "secondary", "tertiary"] },
      { id: "03", selection: "product-info", key: "info03c4d5e6f", image: "", mobile: "", title: "Detalhes do Produto Template 3", description: "PDP FastStore (SérieA): galeria com scroll, título, avaliação, variações de cor/tamanho, selos de confiança e accordion", template: "3", pagina: ["product"], component: "ProductInfo03", path: "organisms/ProductDetails02", platforms: ['VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-info-title", label: "Cor do título do produto", type: "color", default: "#000", group: "Título e avaliação" },
        { cssVar: "--prod-info-rating", label: "Cor das estrelas de avaliação", type: "color", default: "#121212", group: "Título e avaliação" },
        { cssVar: "--prod-info-price", label: "Cor do preço", type: "color", default: "#121212", group: "Preço" },
        { cssVar: "--prod-info-text", label: "Cor dos textos (estoque, specs, selos)", type: "color", default: "#121212", group: "Textos" },
        { cssVar: "--prod-info-content", label: "Cor do texto da descrição (accordion)", type: "color", default: "rgba(18, 18, 18, 0.75)", group: "Textos" },
        { cssVar: "--prod-info-divider", label: "Cor das divisórias (accordion)", type: "color", default: "rgba(18, 18, 18, 0.12)", group: "Textos" },
        { cssVar: "--prod-info-variant-border", label: "Variação (tamanho): borda", type: "color", default: "#121212", group: "Variações" },
        { cssVar: "--prod-info-variant-active-bg", label: "Variação selecionada: fundo", type: "color", default: "#121212", group: "Variações" },
        { cssVar: "--prod-info-variant-active-text", label: "Variação selecionada: texto", type: "color", default: "#ffffff", group: "Variações" },
        { cssVar: "--prod-info-btn-bg", label: "Botão 'Adicionar ao carrinho': fundo", type: "color", default: "#121212", group: "Botão principal" },
        { cssVar: "--prod-info-btn-text", label: "Botão 'Adicionar ao carrinho': texto", type: "color", default: "#ffffff", group: "Botão principal" },
        { cssVar: "--prod-info-btn2-bg", label: "Botão 'Comprar agora': fundo", type: "color", default: "#000", group: "Botão secundário" },
        { cssVar: "--prod-info-btn2-text", label: "Botão 'Comprar agora': texto", type: "color", default: "#ffffff", group: "Botão secundário" },
        { cssVar: "--prod-gallery-badge-bg", label: "Selo: cor de fundo", type: "color", default: "#121212", group: "Galeria / Selos" },
        { cssVar: "--prod-gallery-badge-text", label: "Selo: cor do texto", type: "color", default: "#ffffff", group: "Galeria / Selos" },
        { cssVar: "--prod-gallery-dot-active", label: "Galeria: indicador ativo (mobile)", type: "color", default: "#121212", group: "Galeria / Selos" },
        { cssVar: "--prod-info-font", label: "Fonte (informações)", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
        { cssVar: "--prod-gallery-font", label: "Fonte (selos da galeria)", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
      ] },
      { id: "04", selection: "product-info", key: "info04pdp7br", image: "", mobile: "", title: "Detalhes do Produto Template 4", description: "PDP editorial: galeria com miniaturas, coluna de compra fixa com preço/Pix/variações, descrição com especificações e dúvidas, e prateleira de relacionados", template: "4", pagina: ["product"], component: "ProductInfo04", path: "organisms/ProductDetails07", platforms: ['VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--pdp-title-color", label: "Cor do título e dos textos", type: "color", default: "#2c2420", group: "Textos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--pdp-cta-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-cta-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-font-title", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  productRelated: {
    name: "Produtos Relacionados",
    items: [
      { id: "01", selection: "product-related", key: "rel01f6g7h8i", image: "", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductRelated01", path: "organisms/ProductShowcase01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },
} as const;

export type LayoutKey = keyof typeof LAYOUTS;
