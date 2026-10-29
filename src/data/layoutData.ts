import type { Platform } from "@/types/platform";

/**
 * Não existe página "landing": uma LP é montada no MODO LP do editor, com as
 * mesmas seções de miolo (`home`) da loja — ver src/utils/lp.ts.
 */
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
 * @property previewNote - por que mexer nesta variável não muda nada NO PREVIEW,
 *                     embora mude no tema entregue. O preview é um mock: ele não
 *                     replica modal de tamanho, simulador de frete, zoom de
 *                     imagem, widget de terceiro nem o CSS do @faststore/ui, e
 *                     não abre drawer nem mega-menu sozinho. Sem esta nota o
 *                     usuário escolhe a cor, não vê efeito e conclui que está
 *                     quebrado — foi o que o QA reportou no mini-carrinho.
 *                     NÃO use para variável que não funciona em lugar nenhum:
 *                     essa se remove do schema.
 * @property optional - a variável NÃO herda nada: sem valor próprio ela fica
 *                     desligada (`default` costuma ser "transparent"). Só muda o
 *                     que o painel escreve no estado vazio — em vez de "Usando
 *                     variável da …", que seria mentira, ele diz que não há cor
 *                     definida. Para efeito que o design oferece mas não impõe,
 *                     como o fundo da Vitrine 5.
 */
export type ComponentVariable = {
  cssVar: string;
  label: string;
  type: ComponentVariableType;
  default: string;
  group?: string;
  inheritsLabel?: string;
  optional?: boolean;
  previewNote?: string;
};

/**
 * Represents an item in the layout catalog.
 *
 * @property id - Unique identifier for the layout item.
 * @property key - A 12-character string key, preferably starting with a template identifier.
 * @property image - URL or path to the item's image.
 * @property mobile - URL or path to the mobile version of the image.
 *                   Nao e lido por nenhum componente hoje: os mockups do designer
 *                   ja trazem desktop e mobile no mesmo quadro.
 * @property imageSource - 'design' (arte do designer) ou 'auto' (screenshot gerado).
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
  /**
   * Origem da thumb que o card do seletor mostra.
   * `design`  — mockup entregue pelo designer (Banners E-temas). Intocável.
   * `auto`    — screenshot do componente real gerado por `yarn thumbs`.
   *             Vale como **pendência**: é o que ainda não veio do design.
   * ausente   — NÃO é estado aceito: o estágio 1 do funil reprova item sem thumb em
   *              disco. Rode `yarn thumbs:auto` para gerar o screenshot do componente.
   * `scripts/thumbs/auto.mjs` NUNCA sobrescreve um item marcado `design`.
   */
  imageSource?: "design" | "auto";
  /**
   * Quando um mesmo mockup mostra mais de um componente nítido, os outros
   * `component` que dividem o arquivo. Existe para achar e trocar esses casos
   * quando o designer entregar a arte isolada — some junto com a troca.
   */
  imageSharedWith?: string[];
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
  productReviews: LayoutSection;
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
  popupNews: LayoutSection;
  productLines: LayoutSection;
  productBanner: LayoutSection;
  categoryTabs: LayoutSection;
  categoryTitle: LayoutSection;
  countdown: LayoutSection;
  editorial: LayoutSection;
};

export const LAYOUTS: Layouts = {
  // common
  header: {
    name: "Header",
    items: [
      { id: "01", selection: "header", key: "hdr01a2b3c4d", image: "header/Header01.webp", imageSource: "design", mobile: "", title: "Header Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Header01", path: "organisms/Header01", platforms: ['Tray','Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#122161", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto/ícones da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header (meio)", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#122161", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-nav-bg", label: "Fundo da barra de menu", type: "color", default: "#122161", group: "Menu", inheritsLabel: "cor secundária da marca", previewNote: "Só na visão Desktop: no mobile a navegação vira menu hambúrguer." },
        { cssVar: "--header-nav-text", label: "Texto do menu principal", type: "color", default: "#ffffff", group: "Menu", inheritsLabel: "cor de texto secundária", previewNote: "Só na visão Desktop: no mobile a navegação vira menu hambúrguer." },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "header", key: "hdr02h8l2gty", image: "header/Header02.webp", imageSource: "design", mobile: "", title: "Header Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Header02", path: "organisms/Header02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Roboto', Arial, Helvetica, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-body-font", label: "Fonte da busca", type: "font", default: "'Poppins', Arial, Helvetica, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "03", selection: "header", key: "hdr03a2b3c4d", image: "header/Header03.webp", imageSource: "design", mobile: "", title: "Header Template 3", description: "Header com topbar animada e menu de navegação", template: "3", pagina: ["common"], component: "Header03", path: "organisms/Header03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#000000", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#000000", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (hover, underline)", type: "color", default: "#e73888", group: "Header", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "header", key: "hdr04mnu7zk2", image: "header/Header04.webp", imageSource: "auto", mobile: "", title: "Header Template 4", description: "Header escuro premium (MANU) com barra de avisos, navegação e tira de benefícios", template: "4", pagina: ["common"], component: "Header04", path: "organisms/Header04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#0a0a0a", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto/ícones da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#0a0a0a", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (badge, hover, menu)", type: "color", default: "#0a0a0a", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-accent-text", label: "Texto sobre o destaque", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-strip-bg", label: "Fundo da faixa de benefícios", type: "color", default: "#f5f5f5", group: "Faixa de benefícios", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--header-strip-text", label: "Texto da faixa de benefícios", type: "color", default: "#6b6b6b", group: "Faixa de benefícios", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--header-title-font", label: "Fonte do logo", type: "font", default: "Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "05", selection: "header", key: "hdr05mnu6xj1", image: "header/Header05.webp", imageSource: "design", mobile: "", title: "Header Template 5", description: "Header claro (SÉRIE//A) com barra de serviço, busca, wordmark e navegação por categorias", template: "5", pagina: ["common"], component: "Header05", path: "organisms/Header05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-service-bg", label: "Fundo da barra de serviço", type: "color", default: "#1a1f2b", group: "Header", inheritsLabel: "cor de texto do header" },
        { cssVar: "--header-service-text", label: "Texto da barra de serviço", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "fundo do header" },
        { cssVar: "--header-text", label: "Texto/ícones", type: "color", default: "#1a1f2b", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque (ofertas, hover, foco)", type: "color", default: "#2f9e57", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-danger", label: "Cor de alerta/oferta", type: "color", default: "#d6432a", group: "Destaque", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-title-font", label: "Fonte do logo", type: "font", default: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "header", key: "hdr06frc1a2b", image: "header/Header06.webp", imageSource: "auto", mobile: "", title: "Header Template 6", description: "Top-bar em slider, mega-menu por hover, busca e ícones (favoritos, lojas, conta, sacola)", template: "6", pagina: ["common"], component: "Header06", path: "organisms/Header06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#ffffff", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#4f4f4f", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-topbar-font", label: "Fonte da barra superior", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto/ícones do header", type: "color", default: "#212721", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-mega-panel", label: "Fundo do banner do mega-menu", type: "color", default: "#21464f", group: "Mega-menu", previewNote: "Aparece no mega-menu, ao passar o mouse na navegação." },
        { cssVar: "--header-rule", label: "Borda do autocomplete", type: "color", default: "#e3e4e6", group: "Busca", previewNote: "Aparece no dropdown da busca, com o campo focado." },
        { cssVar: "--header-muted", label: "Texto das sugestões de busca", type: "color", default: "#727273", group: "Busca", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--header-login-bg", label: "Fundo do botão Entrar (menu mobile)", type: "color", default: "#212721", group: "Menu mobile", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Mobile: o botão de login é do menu mobile." },
        { cssVar: "--header-login-text", label: "Texto do botão Entrar (menu mobile)", type: "color", default: "#ffffff", group: "Menu mobile", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#212721", group: "Mini-carrinho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cart-button-bg", label: "Fundo do botão 'Finalizar Compra'", type: "color", default: "#212721", group: "Mini-carrinho", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cart-button-text", label: "Texto do botão 'Finalizar Compra'", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "header", key: "hdr07bru1k2m", image: "header/Header07.webp", imageSource: "auto", mobile: "", title: "Header Template 7", description: "Barra superior rotativa, busca central, ícones de conta/sacola e menu de categorias", template: "7", pagina: ["common"], component: "Header07", path: "organisms/Header07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da barra superior", type: "color", default: "#2c2420", group: "Barra superior", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da barra superior", type: "color", default: "#f5f0e8", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#fff", group: "Header" },
        { cssVar: "--header-text", label: "Texto do header", type: "color", default: "#2c2420", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-nav-text", label: "Texto do menu", type: "color", default: "#4a3f38", group: "Menu", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-sale", label: "Cor de \'Saldos\' e destaques", type: "color", default: "#c07a5a", group: "Menu", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--header-rule", label: "Linhas divisórias", type: "color", default: "#ede4d8", group: "Header" },
        { cssVar: "--header-muted", label: "Texto secundário", type: "color", default: "#8c7d74", group: "Header", previewNote: "Aparece no overlay de busca, aberto." },
        { cssVar: "--header-surface", label: "Fundo dos painéis", type: "color", default: "#fff", group: "Menu", previewNote: "Aparece no overlay de busca, aberto." },
        { cssVar: "--header-field-bg", label: "Fundo do campo de busca", type: "color", default: "#faf8f4", group: "Busca", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--header-field-border", label: "Borda do campo de busca", type: "color", default: "#e8dfd5", group: "Busca", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--header-mega-quote", label: "Citação sobre a arte do megamenu", type: "color", default: "#faf8f4", group: "Menu", previewNote: "Aparece no mega-menu, ao passar o mouse." },
        { cssVar: "--header-font", label: "Fonte da marca", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        // Faltava: o Header07 renderiza mini-carrinho (CartSidebar07 no tema real, CartSidebar01 no mock) e era o único do catálogo sem controle de cor dele. O CartSidebar07 era 100% hex cravado; virou temável na mesma auditoria.
        // `default` segue o nível 3 do MOCK (_shared/CartSidebar01, #171a1c), que é o que
        // o preview mostra e o que o portão 1-variaveis compara. O CartSidebar07 do
        // tema real cai em #2c2420 — divergência mock↔real ANTERIOR a esta variável,
        // registrada em ACHADOS-EM-ABERTO. Não afeta o export: `pickChangedVariables`
        // só escreve quando o usuário muda o valor.
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#171a1c", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-body-font", label: "Fonte do menu e do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "header", key: "hdr08sra5t9w", image: "header/Header08.webp", imageSource: "auto", mobile: "", title: "Header Template 8", description: "Menu à esquerda, logo central, busca sublinhada e ícones de atendimento, conta e sacola", template: "8", pagina: ["common"], component: "Header08", path: "organisms/Header08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do Figma, sem Nível 2: com o tema padrão do /gerador
        // (primário #000) o header sairia preto, e o 1:1 com o design é requisito.
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header" },
        { cssVar: "--header-text", label: "Texto e ícones", type: "color", default: "#000000", group: "Header" },
        { cssVar: "--header-rule", label: "Linha inferior", type: "color", default: "#efeff0", group: "Header" },
        { cssVar: "--header-field-border", label: "Linha do campo de busca", type: "color", default: "#dfdfea", group: "Busca", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--header-accent", label: "Fundo do contador da sacola", type: "color", default: "#000000", group: "Sacola" },
        { cssVar: "--header-accent-text", label: "Número do contador da sacola", type: "color", default: "#ffffff", group: "Sacola" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Manrope', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "header", key: "hdr09edt7q2m", image: "header/Header09.webp", imageSource: "auto", mobile: "", title: "Header Template 9", description: "Régua de mensagens escura; busca à esquerda, marca ao centro, conta, favoritos e sacola à direita e a navegação de categorias centralizada. No mobile, menu, busca, marca e sacola", template: "9", pagina: ["common"], component: "Header09", path: "organisms/Header09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-topbar-bg", label: "Fundo da régua de mensagens", type: "color", default: "#1d1b18", group: "Barra superior", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da régua de mensagens", type: "color", default: "#f7f4ef", group: "Barra superior", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#f7f4ef", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto e ícones", type: "color", default: "#1d1b18", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Destaque (contador da sacola)", type: "color", default: "#9c4a2f", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#1d1b18", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#1d1b18", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#f7f4ef", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "header", key: "hdr10vrj3k8p", image: "header/Header10.webp", imageSource: "auto", mobile: "", title: "Header Template 10", description: "Régua escura com a mensagem e os links de serviço; marca, busca larga com botão de destaque, conta, favoritos e carrinho com contador; faixa de departamentos com \"Todos os departamentos\" e selo por item. No mobile, menu, marca, conta e carrinho, com a busca embaixo", template: "10", pagina: ["common"], component: "Header10", path: "organisms/Header10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto e ícones", type: "color", default: "#101828", group: "Header", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-nav-bg", label: "Fundo da faixa de departamentos", type: "color", default: "#1340d8", group: "Departamentos", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-nav-text", label: "Texto da faixa de departamentos", type: "color", default: "#ffffff", group: "Departamentos", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--header-accent", label: "Destaque (botão da busca, contador e selos)", type: "color", default: "#ffcf24", group: "Destaque", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--header-accent-text", label: "Texto sobre o destaque", type: "color", default: "#101828", group: "Destaque", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#101828", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#1340d8", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "header", key: "hdr11grd4k7p", image: "header/Header11.webp", imageSource: "auto", mobile: "", title: "Header Template 11", description: "Régua de mensagens em mono caixa-alta e uma linha em grade de filetes: marca, menu numerado (01, 02…), busca, \"Entrar\", \"Favoritos\" e o carrinho no preenchimento de destaque com o contador \"[N]\". No mobile, menu, marca e carrinho; o menu abre a tela com a busca e a lista numerada", template: "11", pagina: ["common"], component: "Header11", path: "organisms/Header11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo do header", type: "color", default: "#ffffff", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto, ícones e filetes", type: "color", default: "#0a0a0a", group: "Header", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-topbar-bg", label: "Fundo da régua de mensagens", type: "color", default: "#ffffff", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-accent", label: "Destaque (célula do carrinho)", type: "color", default: "#ff4f00", group: "Destaque", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--header-accent-text", label: "Texto sobre o destaque", type: "color", default: "#0a0a0a", group: "Destaque", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#0a0a0a", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#0a0a0a", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte do header", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte dos números e da barra superior", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "header", key: "hdr12suv3k8p", image: "header/Header12.webp", imageSource: "auto", mobile: "", title: "Header Template 12", description: "Régua rosada com o presente, a mensagem e \"Ver regras\"; embaixo, a barra branca em pílula sobre o creme: marca em serifa, menu em pílulas (a atual pintada de rosado e o destaque na cor de acento), busca em pílula, conta e favoritos em círculos e a sacola no círculo vinho com o contador. No mobile, menu, marca, busca e sacola; o menu abre o painel arredondado com a busca e a lista", template: "12", pagina: ["common"], component: "Header12", path: "organisms/Header12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo da faixa, da busca e dos círculos", type: "color", default: "#fbf6f3", group: "Header" },
        { cssVar: "--header-text", label: "Texto e ícones", type: "color", default: "#3b1f33", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-topbar-bg", label: "Fundo da régua e da pílula ativa", type: "color", default: "#f4dcd6", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-accent", label: "Destaque (sacola e item em destaque)", type: "color", default: "#7a2e5f", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-accent-text", label: "Ícone sobre o destaque", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#3b1f33", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#7a2e5f", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte do header", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "header", key: "hdr13ntr4k2p", image: "header/Header13.webp", imageSource: "auto", mobile: "", title: "Header Template 13", description: "Fita verde com as mensagens em condensada maiúscula separadas por asteriscos; embaixo, a barra preta com a marca (a barra em verde), o menu em condensada (o item com marcador ganha o sublinhado verde e o destaque sai em verde), busca, favoritos, conta e a \"Bag (N)\" no bloco verde. No mobile, menu, marca, busca e \"(N)\"; o menu abre a tela inteira com a lista grande e, no pé, conta, favoritos e ajuda", template: "13", pagina: ["common"], component: "Header13", path: "organisms/Header13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo da barra", type: "color", default: "#0d0d0d", group: "Header" },
        { cssVar: "--header-text", label: "Texto e ícones", type: "color", default: "#f4f4f0", group: "Header" },
        { cssVar: "--header-accent", label: "Destaque (bag, marcador e item em destaque)", type: "color", default: "#c8ff2e", group: "Destaque" },
        { cssVar: "--header-topbar-bg", label: "Fundo da fita", type: "color", default: "#c8ff2e", group: "Fita" },
        { cssVar: "--header-topbar-text", label: "Texto da fita", type: "color", default: "#0d0d0d", group: "Fita" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#f4f4f0", group: "Mini-carrinho", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#c8ff2e", group: "Mini-carrinho", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#0d0d0d", group: "Mini-carrinho", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca, do menu e da sacola", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte do texto e dos submenus", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "header", key: "hdr14esp7k2q", image: "header/Header14.webp", imageSource: "auto", mobile: "", title: "Header Template 14", description: "Faixa marinho no topo com as mensagens em Saira itálica correndo de lado, separadas por raios; embaixo, a barra branca com a marca e o traço vermelho inclinado, o menu em Saira itálica (o item com marcador ganha o sublinhado grosso vermelho e \"Ofertas\" sai em vermelho), a busca em paralelogramo cinza, favoritos, conta e a \"Sacola\" no paralelogramo vermelho com o contador. No mobile, menu, marca, busca e sacola; o menu abre a tela inteira com a busca, a lista grande e, no pé, a conta e os links de ajuda", template: "14", pagina: ["common"], component: "Header14", path: "organisms/Header14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo da barra", type: "color", default: "#ffffff", group: "Header" },
        { cssVar: "--header-text", label: "Texto, ícones e contador", type: "color", default: "#0b1b33", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Destaque (sacola, traço da marca, marcador e \"Ofertas\")", type: "color", default: "#e4002b", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-accent-text", label: "Texto da sacola", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-topbar-bg", label: "Fundo da faixa", type: "color", default: "#0b1b33", group: "Faixa", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da faixa", type: "color", default: "#ffffff", group: "Faixa", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#0b1b33", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra e do contador", type: "color", default: "#e4002b", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da faixa, da marca, do menu e da sacola", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte da busca e dos links", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "header", key: "hdr15lux4k2p", image: "header/Header15.webp", imageSource: "auto", mobile: "", title: "Header Template 15", description: "Faixa escura com a mensagem e o presente; embaixo, a busca em fio à esquerda, a marca em serifa espaçada no centro entre fios dourados e conta, favoritos e a sacola com o contador no quadrado dourado à direita; o menu em versalete entre dois fios, o item marcado com o fio dourado embaixo e o destaque em dourado. No mobile, menu, marca, busca e sacola; o menu abre a lista em serifa grande com o destaque em itálico dourado e o bloco \"Sua conta\"", template: "15", pagina: ["common"], component: "Header15", path: "organisms/Header15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo da barra", type: "color", default: "#faf8f4", group: "Header", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-text", label: "Texto, ícones e fios", type: "color", default: "#1a1714", group: "Header", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-accent", label: "Destaque (contador, fio do item marcado e item em destaque)", type: "color", default: "#7a5f1c", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--header-topbar-bg", label: "Fundo da faixa", type: "color", default: "#1a1714", group: "Faixa", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da faixa", type: "color", default: "#faf8f4", group: "Faixa", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#1a1714", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#1a1714", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#faf8f4", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca e do menu mobile", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte do texto e do menu", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "header", key: "hdr16inf3k8p", image: "header/Header16.webp", imageSource: "auto", mobile: "", title: "Header Template 16", description: "Régua amarela com as vantagens separadas por bolinhas; a barra creme com a marca arredondada e a bolinha coral, a busca em pílula com a lupa num círculo roxo, conta e favoritos em círculos e a \"Sacola\" em pílula roxa com sombra chapada e o contador coral; embaixo de um filete tracejado, o menu em pílulas com a marcada em roxo. No mobile, menu, marca e sacola, a busca embaixo e o menu aberto em tela cheia com as categorias em cartões coloridos", template: "16", pagina: ["common"], component: "Header16", path: "organisms/Header16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--header-bg", label: "Fundo da barra", type: "color", default: "#fffbf2", group: "Header" },
        { cssVar: "--header-text", label: "Texto, ícones e bordas", type: "color", default: "#2a2350", group: "Header", inheritsLabel: "cor de texto primária" },
        { cssVar: "--header-accent", label: "Destaque (lupa, sacola e item marcado)", type: "color", default: "#5b4bdb", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--header-badge-bg", label: "Fundo do contador da sacola", type: "color", default: "#ff6f61", group: "Destaque", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--header-topbar-bg", label: "Fundo da régua", type: "color", default: "#ffc93c", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--header-topbar-text", label: "Texto da régua", type: "color", default: "#2a2350", group: "Régua", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cart-text", label: "Texto do mini-carrinho", type: "color", default: "#2a2350", group: "Mini-carrinho", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-bg", label: "Fundo do botão Finalizar compra", type: "color", default: "#5b4bdb", group: "Mini-carrinho", inheritsLabel: "cor primária da marca", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--cart-button-text", label: "Texto do botão Finalizar compra", type: "color", default: "#ffffff", group: "Mini-carrinho", inheritsLabel: "cor de texto base", previewNote: "Aparece com o mini-carrinho aberto." },
        { cssVar: "--header-title-font", label: "Fonte da marca, do menu e da sacola", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--header-font", label: "Fonte da régua, da busca e dos rótulos", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  spot: {
    name: "Card de Produto",
    items: [
      { id: "01", selection: "spot", key: "crdprd017839", image: "spot/Spot01.webp", imageSource: "design", mobile: "", title: "Card de Produto Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Spot01", path: "molecules/ProductCard01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-btn-bg", label: "Cor do botão comprar", type: "color", default: "#122161", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "spot", key: "cardprd02g96", image: "spot/Spot02.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Spot02", path: "molecules/ProductCard02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "03", selection: "spot", key: "crdprd03h291", image: "spot/Spot03.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 3", description: "Card de produto com seletor de tamanhos", template: "3", pagina: ["common"], component: "Spot03", path: "molecules/ProductCard03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#000000", group: "Etiquetas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-btn-bg", label: "Fundo do seletor de tamanho (hover)", type: "color", default: "#000000", group: "Seletor de tamanho", inheritsLabel: "cor secundária da marca", previewNote: "Aparece ao passar o mouse no card." },
        { cssVar: "--spot-btn-text", label: "Texto do seletor de tamanho (hover)", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto secundária", previewNote: "Aparece ao passar o mouse no card." },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "spot", key: "crdprd04f1a2", image: "spot/Spot04.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 4", description: "Card de produto com botão de adicionar", template: "4", pagina: ["common"], component: "Spot04", path: "molecules/ProductCard04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#219653", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão adicionar", type: "color", default: "#e40101", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão adicionar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "05", selection: "spot", key: "crdprd05b3c4", image: "spot/Spot05.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 5", description: "Card de produto com avaliação e desejos", template: "5", pagina: ["common"], component: "Spot05", path: "molecules/ProductCard05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--spot-tag-bg", label: "Fundo da etiqueta de desconto", type: "color", default: "#219653", group: "Etiquetas", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto da etiqueta de desconto", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--spot-price-color", label: "Cor do preço principal", type: "color", default: "#0096fe", group: "Preço", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "06", selection: "spot", key: "crdprd06f6g7", image: "spot/Spot06.webp", imageSource: "design", mobile: "", title: "Card de Produto Template 6", description: "Card com etiqueta de oferta e botão comprar", template: "6", pagina: ["common"], component: "Spot06", path: "molecules/ProductCard06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--shelf-font", label: "Fonte do card de produto", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "07", selection: "spot", key: "crdprd07h8j9", image: "spot/Spot07.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 7", description: "Card da vitrine/PLP: selo de desconto, coração da lista de desejos, marca, título em 2 linhas, preço de/por, parcela, Pix e botão Comprar colado na base", template: "7", pagina: ["common"], component: "Spot07", path: "molecules/ProductCard07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--shelf-title-color", label: "Cor do título e do preço", type: "color", default: "#2c2420", group: "Textos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--shelf-accent", label: "Cor de destaque (hover e selo)", type: "color", default: "#b8976a", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--wish-active-color", label: "Cor do coração favoritado", type: "color", default: "#b8976a", group: "Destaque", inheritsLabel: "cor de destaque do card" },
        { cssVar: "--shelf-buy-bg", label: "Fundo do botão Comprar", type: "color", default: "#2c2420", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--shelf-buy-text", label: "Texto do botão Comprar", type: "color", default: "#faf8f4", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--font-primary", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--font-secundary", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "spot", key: "crdprd09ed4k", image: "spot/Spot09.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 9", description: "Foto 3:4 com coração e selo de desconto, \"Adicionar à sacola\" sobre a foto, nome, preço de/por e parcela; esgotado com véu e \"Avise-me\"", template: "9", pagina: ["common"], component: "Spot09", path: "molecules/ProductCard09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#1d1b18", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-price-color", label: "Preço", type: "color", default: "#1d1b18", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-text", label: "Selo de desconto", type: "color", default: "#9c4a2f", group: "Card", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Adicionar", type: "color", default: "#1d1b18", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Adicionar", type: "color", default: "#f7f4ef", group: "Botão", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "spot", key: "crdprd10vr7m", image: "spot/Spot10.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 10", description: "Cartão branco com foto, selo de desconto e coração; estrelas, nome, preço de/por, Pix e parcela e o botão \"Comprar\" largo, que vira \"Adicionar ao carrinho\" no hover; esgotado com \"Avise-me\" em contorno", template: "10", pagina: ["common"], component: "Spot10", path: "molecules/ProductCard10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#101828", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#d92d20", group: "Card", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto do selo de desconto", type: "color", default: "#ffffff", group: "Card", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Comprar", type: "color", default: "#1340d8", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Comprar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "spot", key: "crdprd11gd3m", image: "spot/Spot11.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 11", description: "Card em grade de filetes: a referência \"N°\" e o coração em cima, a foto 1:1 que troca no hover, nome e preço na mesma linha e a parcela em mono; \"Adicionar\" no destaque sobe sobre a foto no hover (fixo no pé no mobile); esgotado com selo, \"Indisponível\" e \"Avise-me\"", template: "11", pagina: ["common"], component: "Spot11", path: "molecules/ProductCard11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto e filetes do card", type: "color", default: "#0a0a0a", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-price-color", label: "Preço", type: "color", default: "#0a0a0a", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-bg", label: "Fundo do selo Esgotado", type: "color", default: "#0a0a0a", group: "Card", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Adicionar", type: "color", default: "#ff4f00", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Adicionar", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-title-font", label: "Fonte do card de produto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--spot-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "spot", key: "crdprd12sv5n", image: "spot/Spot12.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 12", description: "Card branco arredondado com filete suave: foto 1:1 arredondada com o selo de desconto e o coração em círculo, estrelas com nota e contagem, nome, preço \"de\" riscado, \"por\" e parcela, e o \"+\" redondo; no hover a borda pinta e o \"+\" vira a pílula \"+ Adicionar\". Esgotado com a pílula no centro da foto e \"Avise-me\"", template: "12", pagina: ["common"], component: "Spot12", path: "molecules/ProductCard12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#3b1f33", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#dce6da", group: "Selo", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto do selo de desconto", type: "color", default: "#3b1f33", group: "Selo", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Adicionar (e estrelas)", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Adicionar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-font", label: "Fonte do card de produto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "spot", key: "crdprd13nt6w", image: "spot/Spot13.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 13", description: "Sem caixa: a foto 4:5 em grafite com o rótulo verde da vitrine e o coração solto no canto; o nome em condensada maiúscula, o preço grande e a parcela apagada. No hover a foto clareia, ganha o contorno verde e a barra \"Comprar\" sobe no pé dela. Esgotado com o carimbo entre filetes no centro da foto e \"Me avise\" com borda; no mobile, \"Comprar\" vira o botão largo abaixo do preço", template: "13", pagina: ["common"], component: "Spot13", path: "molecules/ProductCard13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#f4f4f0", group: "Card" },
        { cssVar: "--spot-tag-bg", label: "Fundo do rótulo", type: "color", default: "#c8ff2e", group: "Rótulo" },
        { cssVar: "--spot-tag-text", label: "Texto do rótulo", type: "color", default: "#0d0d0d", group: "Rótulo" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Comprar", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Comprar", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--spot-title-font", label: "Fonte do nome, do preço e do botão", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--spot-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "spot", key: "crdprd14es3m", image: "spot/Spot14.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 14", description: "Card na superfície cinza-azulada: foto quadrada com o rótulo lima e o \"-N%\" vermelho empilhados em paralelogramos no canto e o coração solto no outro; embaixo a marca em versalete, o nome, as estrelas com a contagem, o \"de\" riscado, o preço grande em Saira itálica, a parcela e o Pix. No hover o card sobe com sombra e o \"Comprar\" vermelho aparece no pé da foto. Esgotado com a faixa marinho atravessando a foto e \"Avise-me\" com borda; no mobile, \"Comprar\" vira o botão largo abaixo da parcela", template: "14", pagina: ["common"], component: "Spot14", path: "molecules/ProductCard14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#0b1b33", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-price-color", label: "Preço", type: "color", default: "#0b1b33", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-bg", label: "Fundo do rótulo", type: "color", default: "#d9f99d", group: "Rótulo", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto do rótulo", type: "color", default: "#0b1b33", group: "Rótulo", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Comprar e do \"-N%\"", type: "color", default: "#e4002b", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Comprar e do \"-N%\"", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-title-font", label: "Fonte do preço, dos selos e dos botões", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--spot-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "spot", key: "crdprd15lx6w", image: "spot/Spot15.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 15", description: "Sem caixa: a foto 4:5 em areia com o rótulo dourado no canto e o coração solto; embaixo, centralizados, a marca em versalete dourado, o nome em serifa, o preço e a parcela. No hover a foto escurece, ganha o fio dourado por dentro e a barra \"Comprar\" no pé. Esgotado com o carimbo entre fios dourados no centro da foto e \"Avise-me\" com borda; no mobile, texto à esquerda e \"Comprar\" largo sempre visível", template: "15", pagina: ["common"], component: "Spot15", path: "molecules/ProductCard15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto do card", type: "color", default: "#1a1714", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-tag-bg", label: "Fundo do rótulo", type: "color", default: "#7a5f1c", group: "Rótulo", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto do rótulo", type: "color", default: "#faf8f4", group: "Rótulo", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Comprar", type: "color", default: "#1a1714", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Comprar", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-title-font", label: "Fonte do nome", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--spot-font", label: "Fonte do texto e do preço", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "spot", key: "crdprd16if5w", image: "spot/Spot16.webp", imageSource: "auto", mobile: "", title: "Card de Produto Template 16", description: "Card branco arredondado com filete grosso; a foto quadrada arredondada com o rótulo numa bolha amarela inclinada e o coração num círculo branco com borda; o nome arredondado, o preço em roxo com a parcela e o botão \"Comprar\" em pílula roxa com sombra chapada. No hover, a segunda foto e o card sobe; esgotado com a foto apagada, o selo \"Esgotou!\" e \"Avise-me\" com borda", template: "16", pagina: ["common"], component: "Spot16", path: "molecules/ProductCard16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--spot-text", label: "Texto e bordas do card", type: "color", default: "#2a2350", group: "Card", inheritsLabel: "cor de texto primária" },
        { cssVar: "--spot-price-color", label: "Preço", type: "color", default: "#5b4bdb", group: "Card", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-tag-bg", label: "Fundo do rótulo", type: "color", default: "#ffc93c", group: "Rótulo", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--spot-tag-text", label: "Texto do rótulo", type: "color", default: "#2a2350", group: "Rótulo", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--spot-btn-bg", label: "Fundo do botão Comprar", type: "color", default: "#5b4bdb", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--spot-btn-text", label: "Texto do botão Comprar", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--spot-title-font", label: "Fonte do nome e do botão", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--spot-font", label: "Fonte do texto e do preço", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  breadcrumb: {
    name: "Breadcrumb",
    items: [
      { id: "01", selection: "breadcrumb", key: "bred01q3r4s5", image: "breadcrumb/Breadcrumb01.webp", imageSource: "design", mobile: "", title: "Breadcrumb Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Breadcrumb01", path: "overrides/Breadcrumb01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Cor do texto e links", type: "color", default: "#292929", group: "Breadcrumb", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "breadcrumb", key: "bred02q7l4k5", image: "breadcrumb/Breadcrumb02.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 2", description: "Breadcrumb com separador em chevron", template: "2", pagina: ["common"], component: "Breadcrumb02", path: "overrides/Breadcrumb02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-font", label: "Fonte do breadcrumb", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "09", selection: "breadcrumb", key: "bred09edt3n6", image: "breadcrumb/Breadcrumb09.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 9", description: "Trilha em caixa-alta espaçada com barras: níveis anteriores apagados e o atual em destaque", template: "9", pagina: ["common"], component: "Breadcrumb09", path: "overrides/Breadcrumb09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-bg", label: "Fundo da trilha", type: "color", default: "#f7f4ef", group: "Trilha" },
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#1d1b18", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte do breadcrumb", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "breadcrumb", key: "bred10vrj5c2", image: "breadcrumb/Breadcrumb10.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 10", description: "Cápsula branca com a casinha no início, os níveis como links na cor de destaque separados por chevron e o nível atual em pílula", template: "10", pagina: ["common"], component: "Breadcrumb10", path: "overrides/Breadcrumb10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#101828", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-link", label: "Links da trilha", type: "color", default: "#1340d8", group: "Trilha", inheritsLabel: "cor primária da marca" },
        { cssVar: "--breadcrumb-font", label: "Fonte do breadcrumb", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "breadcrumb", key: "bred11grd6c2", image: "breadcrumb/Breadcrumb11.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 11", description: "Trilha em mono caixa-alta entre filetes, os níveis separados por barra e o nível atual em destaque", template: "11", pagina: ["common"], component: "Breadcrumb11", path: "overrides/Breadcrumb11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Texto e filetes da trilha", type: "color", default: "#0a0a0a", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "breadcrumb", key: "bred12suv7d4", image: "breadcrumb/Breadcrumb12.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 12", description: "Pílula branca com filete: \"Início\" com a casinha, os níveis separados por pontos rosados e o nível atual numa pílula rosada; à direita, \"Voltar\". No mobile, só a casinha, a trilha numa linha e sem o \"Voltar\"", template: "12", pagina: ["common"], component: "Breadcrumb12", path: "overrides/Breadcrumb12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#3b1f33", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-accent", label: "Pontos e pílula do nível atual", type: "color", default: "#f4dcd6", group: "Trilha", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--breadcrumb-font", label: "Fonte do breadcrumb", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "breadcrumb", key: "bred13ntr8c5", image: "breadcrumb/Breadcrumb13.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 13", description: "Faixa preta com filete embaixo e a trilha em condensada maiúscula: \"Início\" e os níveis apagados, separados pela \"/\" verde, e o nível atual em texto cheio sublinhado de verde; no mobile, uma linha só que rola de lado", template: "13", pagina: ["common"], component: "Breadcrumb13", path: "overrides/Breadcrumb13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-bg", label: "Fundo da trilha", type: "color", default: "#0d0d0d", group: "Trilha" },
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#f4f4f0", group: "Trilha" },
        { cssVar: "--breadcrumb-accent", label: "Separadores", type: "color", default: "#c8ff2e", group: "Trilha" },
        { cssVar: "--breadcrumb-title-font", label: "Fonte do breadcrumb", type: "font", default: "'Barlow Condensed', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "14", selection: "breadcrumb", key: "bred14esp5c1", image: "breadcrumb/Breadcrumb14.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 14", description: "Faixa branca com a trilha em versalete: \"Início\" e os níveis apagados, separados pelo traço vermelho inclinado, e o nível atual em texto cheio; quebra linha se não couber", template: "14", pagina: ["common"], component: "Breadcrumb14", path: "overrides/Breadcrumb14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--breadcrumb-bg", label: "Fundo da trilha", type: "color", default: "#ffffff", group: "Trilha" },
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#0b1b33", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-accent", label: "Separadores", type: "color", default: "#e4002b", group: "Trilha", inheritsLabel: "cor primária da marca" },
        { cssVar: "--breadcrumb-font", label: "Fonte da trilha", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "breadcrumb", key: "bred15lux8c5", image: "breadcrumb/Breadcrumb15.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 15", description: "Trilha em versalete espaçado sobre o creme: \"Início\" e os níveis anteriores apagados, um fio dourado curto entre eles e o nível atual em peso cheio; no mobile, uma linha só que rola de lado", template: "15", pagina: ["common"], component: "Breadcrumb15", path: "overrides/Breadcrumb15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--breadcrumb-bg", label: "Fundo da trilha", type: "color", default: "#faf8f4", group: "Trilha" },
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#1a1714", group: "Trilha", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-accent", label: "Fios entre os níveis", type: "color", default: "#7a5f1c", group: "Trilha", inheritsLabel: "cor primária da marca" },
        { cssVar: "--breadcrumb-font", label: "Fonte da trilha", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "breadcrumb", key: "bred16inf2c7", image: "breadcrumb/Breadcrumb16.webp", imageSource: "auto", mobile: "", title: "Breadcrumb Template 16", description: "Faixa creme com \"Início\" e a casinha, os níveis anteriores apagados separados por setinhas e o nível atual numa pílula roxa; no mobile, só o nível anterior com a seta de voltar", template: "16", pagina: ["common"], component: "Breadcrumb16", path: "overrides/Breadcrumb16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--breadcrumb-bg", label: "Fundo da trilha", type: "color", default: "#fffbf2", group: "Breadcrumb" },
        { cssVar: "--breadcrumb-text", label: "Texto da trilha", type: "color", default: "#2a2350", group: "Breadcrumb", inheritsLabel: "cor de texto primária" },
        { cssVar: "--breadcrumb-accent", label: "Destaque (nível atual)", type: "color", default: "#5b4bdb", group: "Breadcrumb", inheritsLabel: "cor primária da marca" },
        { cssVar: "--breadcrumb-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--breadcrumb-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  footer: {
    name: "Footer",
    items: [
      { id: "01", selection: "footer", key: "ftr01r39ws5p", image: "footer/Footer01.webp", imageSource: "design", mobile: "", title: "Footer Template 1", description: "Descrição Template 1", template: "1", pagina: ["common"], component: "Footer01",path: "organisms/Footer01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1A051C", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#3D3D3D", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "footer", key: "ftr02qmrhs43", image: "footer/Footer02.webp", imageSource: "design", mobile: "", title: "Footer Template 2", description: "Descrição Template 2", template: "2", pagina: ["common"], component: "Footer02", path: "organisms/Footer02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "primary", "tertiary"], variablesSchema: [
        { cssVar: "--footer-title-font", label: "Fonte dos títulos e links", type: "font", default: "'Roboto', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Noto Sans', sans-serif", group: "Tipografia" },
      ] },
      { id: "03", selection: "footer", key: "ftr03q3r4s5t", image: "footer/Footer03.webp", imageSource: "design", mobile: "", title: "Footer Template 3", description: "Footer com benefícios, newsletter e links", template: "3", pagina: ["common"], component: "Footer03", path: "organisms/Footer03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#000000", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover, links)", type: "color", default: "#e60f73", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-legal-bg", label: "Fundo da barra legal", type: "color", default: "#000000", group: "Barra legal", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-legal-text", label: "Texto da barra legal", type: "color", default: "#ffffff", group: "Barra legal", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão newsletter", type: "color", default: "#000000", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "footer", key: "ftr04m4nu9x2", image: "footer/Footer04.webp", imageSource: "auto", mobile: "", title: "Footer Template 4", description: "Rodapé escuro premium (MANU) com marca, colunas em accordion no mobile, newsletter e barra inferior", template: "4", pagina: ["common"], component: "Footer04", path: "organisms/Footer04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "primary", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#0a0a0a", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque (hover do botão)", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor secundária da marca", previewNote: "Aparece ao passar o mouse nos botões." },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#0a0a0a", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte do logo/títulos", type: "font", default: "'Roboto', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "05", selection: "footer", key: "ftr05mnu8wq4", image: "footer/Footer05.webp", imageSource: "design", mobile: "", title: "Footer Template 5", description: "Rodapé claro (SÉRIE//A) com newsletter, colunas, contato e barra de pagamentos", template: "5", pagina: ["common"], component: "Footer05", path: "organisms/Footer05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
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
      { id: "06", selection: "footer", key: "ftr06frc3c4d", image: "footer/Footer06.webp", imageSource: "auto", mobile: "", title: "Footer Template 6", description: "Newsletter (nome + e-mail), redes sociais, 3 colunas e barra inferior com copyright", template: "6", pagina: ["common"], component: "Footer06", path: "organisms/Footer06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#f6f6f6", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#212721", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-newsletter-bg", label: "Fundo da faixa da newsletter", type: "color", default: "#ffffff", group: "Newsletter" },
        { cssVar: "--footer-newsletter-text", label: "Texto da faixa da newsletter", type: "color", default: "#212721", group: "Newsletter" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão newsletter", type: "color", default: "#212721", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "footer", key: "ftr07bru3n4p", image: "footer/Footer07.webp", imageSource: "auto", mobile: "", title: "Footer Template 7", description: "Rodapé escuro: newsletter, colunas institucionais e barra inferior", template: "7", pagina: ["common"], component: "Footer07", path: "organisms/Footer07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary", "footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1e1612", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#f5f0e8", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Rodapé", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#b8976a", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-input-bg", label: "Fundo do campo de e-mail", type: "color", default: "rgba(255, 255, 255, 0.07)", group: "Newsletter" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "footer", key: "ftr08sra2m6x", image: "footer/Footer08.webp", imageSource: "auto", mobile: "", title: "Footer Template 8", description: "Rodapé escuro: marca e texto, redes sociais, duas colunas, pagamentos, selos e linha legal", template: "8", pagina: ["common"], component: "Footer08", path: "organisms/Footer08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do Figma (ver Header08). Os cinzas — títulos, divisórias —
        // derivam do texto por color-mix, então seguem a cor escolhida aqui.
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#000000", group: "Rodapé" },
        { cssVar: "--footer-text", label: "Texto, ícones e linhas", type: "color", default: "#ffffff", group: "Rodapé" },
        { cssVar: "--footer-font", label: "Fonte do rodapé", type: "font", default: "'Manrope', sans-serif", group: "Tipografia" },
        { cssVar: "--footer-legal-font", label: "Fonte da linha legal", type: "font", default: "'Red Hat Display', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "footer", key: "ftr09edt5w8r", image: "footer/Footer09.webp", imageSource: "auto", mobile: "", title: "Footer Template 9", description: "Colunas de links e atendimento, a marca gigante em serifa itálica, formas de pagamento em etiquetas de texto e a linha legal; colunas em acordeão no mobile", template: "9", pagina: ["common"], component: "Footer09", path: "organisms/Footer09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#f7f4ef", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#1d1b18", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Destaque (marca e títulos)", type: "color", default: "#9c4a2f", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-title-font", label: "Fonte da marca", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "footer", key: "ftr10vrj8n4w", image: "footer/Footer10.webp", imageSource: "auto", mobile: "", title: "Footer Template 10", description: "Faixa de atendimento em cartões, colunas de links com \"Baixe o app\" e as redes, formas de pagamento e selos de segurança em etiquetas e a faixa legal; no mobile, cartões 2 × 2 e colunas em acordeão", template: "10", pagina: ["common"], component: "Footer10", path: "organisms/Footer10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "secondary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#101828", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Destaque (ícones e títulos)", type: "color", default: "#1340d8", group: "Rodapé", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-legal-bg", label: "Fundo da faixa legal", type: "color", default: "#f2f4f7", group: "Faixa legal" },
        { cssVar: "--footer-legal-text", label: "Texto da faixa legal", type: "color", default: "#475467", group: "Faixa legal", inheritsLabel: "cor de texto primária" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "footer", key: "ftr11grd8n5w", image: "footer/Footer11.webp", imageSource: "auto", mobile: "", title: "Footer Template 11", description: "Grade de filetes: a marca grande, as redes em células quadradas e o selo; colunas de links numeradas ([01] Loja…), o contato e a newsletter com nome e e-mail; a faixa legal em mono com copyright, pagamentos e \"Voltar ao topo\". No mobile, colunas em acordeão", template: "11", pagina: ["common"], component: "Footer11", path: "organisms/Footer11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "primary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto e filetes do rodapé", type: "color", default: "#0a0a0a", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão da newsletter", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão da newsletter", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "footer", key: "ftr12suv2m9q", image: "footer/Footer12.webp", imageSource: "auto", mobile: "", title: "Footer Template 12", description: "Painel rosado com os cantos de cima arredondados: a marca em serifa, o texto da loja e as redes em círculos brancos; três colunas de links, o atendimento com o WhatsApp em pílula vinho, as formas de pagamento em pílulas brancas, os selos e a linha legal. No mobile, colunas em acordeão numa caixa branca e o WhatsApp largo", template: "12", pagina: ["common"], component: "Footer12", path: "organisms/Footer12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer", "primary"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#f4dcd6", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#3b1f33", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-button-bg", label: "Fundo do botão WhatsApp", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--footer-button-text", label: "Texto do botão WhatsApp", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--footer-title-font", label: "Fonte da marca e dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "footer", key: "ftr13ntr3q7m", image: "footer/Footer13.webp", imageSource: "auto", mobile: "", title: "Footer Template 13", description: "No topo, as redes em letras gigantes de condensada com a seta em verde, uma por coluna entre filetes; abaixo, a marca com o texto da loja, as colunas de links com título em verde e o atendimento; no pé, as formas de pagamento em etiquetas com filete e o copyright. No mobile, as redes em grade 2 × 2 e as colunas em acordeão", template: "13", pagina: ["common"], component: "Footer13", path: "organisms/Footer13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#0d0d0d", group: "Rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#f4f4f0", group: "Rodapé" },
        { cssVar: "--footer-accent", label: "Destaque (setas e títulos)", type: "color", default: "#c8ff2e", group: "Rodapé" },
        { cssVar: "--footer-title-font", label: "Fonte da marca, dos títulos e dos selos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "footer", key: "ftr14esp9q4n", image: "footer/Footer14.webp", imageSource: "auto", mobile: "", title: "Footer Template 14", description: "Fundo marinho com a faixa lima no topo: a marca com o traço lima, o texto da loja e as redes em paralelogramos lima; três colunas de links com título em Saira itálica e o atendimento com o e-mail sublinhado; no pé, entre filetes, as formas de pagamento em etiquetas e o copyright. No mobile, as colunas em acordeão e o pé empilhado", template: "14", pagina: ["common"], component: "Footer14", path: "organisms/Footer14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#0b1b33", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#ffffff", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Destaque (faixa, traço e redes)", type: "color", default: "#d9f99d", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-title-font", label: "Fonte da marca e dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "footer", key: "ftr15lux3q7m", image: "footer/Footer15.webp", imageSource: "auto", mobile: "", title: "Footer Template 15", description: "Fundo escuro: a marca em serifa espaçada, o ornamento dourado (fio, diamante, fio) e a frase em itálico; entre fios, três colunas de links em versalete e o contato com telefones, horário, e-mail e as redes em quadrados dourados; no pé, as formas de pagamento em etiquetas e a linha legal. No mobile, as colunas em acordeão com a primeira aberta", template: "15", pagina: ["common"], component: "Footer15", path: "organisms/Footer15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#1a1714", group: "Rodapé", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#faf8f4", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Destaque dourado (ornamento e redes)", type: "color", default: "#c9a961", group: "Rodapé", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-title-font", label: "Fonte da marca e dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "footer", key: "ftr16inf6q2m", image: "footer/Footer16.webp", imageSource: "auto", mobile: "", title: "Footer Template 16", description: "Painel escuro com a onda creme no topo; a marca arredondada com a bolinha amarela, o texto sobre a loja e as redes em círculos; as colunas Loja, Ajuda e Sobre com o título em amarelo, e o atendimento; embaixo de um filete tracejado, as formas de pagamento em pílulas e a linha legal. No mobile, as colunas viram acordeão com \"+\" e \"−\"", template: "16", pagina: ["common"], component: "Footer16", path: "organisms/Footer16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["footer"], variablesSchema: [
        { cssVar: "--footer-bg", label: "Fundo do rodapé", type: "color", default: "#2a2350", group: "Footer", inheritsLabel: "cor de fundo do rodapé" },
        { cssVar: "--footer-text", label: "Texto do rodapé", type: "color", default: "#fffbf2", group: "Footer", inheritsLabel: "cor de texto do rodapé" },
        { cssVar: "--footer-accent", label: "Destaque (títulos e bolinha da marca)", type: "color", default: "#ffc93c", group: "Footer", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--footer-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--footer-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  // HOME
  bannerFull: {
    name: "Banner largura máxima",
    items: [
      { id: "01", selection: "banner-full", key: "banful01hwt4", image: "bannerFull/BannerFull01.webp", imageSource: "design", mobile: "", title: "Banner largura máxima Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerFull01", path: "atoms/BannerFull01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-full", key: "bnfull02x7k9", image: "bannerFull/BannerFull02.webp", imageSource: "design", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerFull02", path: "atoms/BannerFull02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "04", selection: "category-banner", key: "BanFul02op74", image: "bannerFull/BannerFullCategory02.webp", imageSource: "design", mobile: "", title: "Banner largura máxima Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "BannerFullCategory02", path: "atoms/BannerFullCategory02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "05", selection: "banner-full", key: "bnfull05k3m7", image: "bannerFull/BannerFull05.webp", imageSource: "design", mobile: "", title: "Banner largura máxima Template 5", description: "Banner único ocupando a largura total da página", template: "5", pagina: ["home"], component: "BannerFull05", path: "organisms/BannerFull05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },
  brand: {
    name: "Marcas",
    items: [
      { id: "01", selection: "brands", key: "mar01b3k7h2b", image: "brand/Brand01.webp", imageSource: "design", mobile: "", title: "Marcas Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Brand01", path: "molecules/Brands01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "09", selection: "brands", key: "mar09edt2g6y", image: "brand/Brand09.webp", imageSource: "auto", mobile: "", title: "Marcas Template 9", description: "Chamada com filete e \"Ver todas\"; as marcas numa grade entre filetes, em logo ou em texto num dos seis estilos tipográficos; duas colunas no mobile", template: "9", pagina: ["home"], component: "Brand09", path: "molecules/Brands09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#f7f4ef", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto das marcas", type: "color", default: "#1d1b18", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-title-font", label: "Fonte dos nomes das marcas", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "brands", key: "mar10vrj6k2v", image: "brand/Brand10.webp", imageSource: "auto", mobile: "", title: "Marcas Template 10", description: "\"Marcas parceiras\" com \"Ver todas\"; as marcas em cartões brancos, em logo ou em texto, numa grade de oito no desktop e rolando de lado no mobile", template: "10", pagina: ["home"], component: "Brand10", path: "molecules/Brands10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#f2f4f7", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto das marcas", type: "color", default: "#101828", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-accent", label: "Destaque (\"Ver todas\")", type: "color", default: "#1340d8", group: "Marcas", inheritsLabel: "cor primária da marca" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "brands", key: "mar11grd6k2v", image: "brand/Brand11.webp", imageSource: "auto", mobile: "", title: "Marcas Template 11", description: "\"Designers\" com cabeça de filetes e \"Ver todos\"; as marcas em células da grade, em nome ou logo, com a seta no pé; seis por linha no desktop e duas no mobile", template: "11", pagina: ["home"], component: "Brand11", path: "molecules/Brands11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto e filetes das marcas", type: "color", default: "#0a0a0a", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "brands", key: "mar12suv6g9p", image: "brand/Brand12.webp", imageSource: "auto", mobile: "", title: "Marcas Template 12", description: "Título em serifa e as marcas em pílulas brancas com filete, em logo ou no nome em grafias diferentes; no mobile, pílulas rolando de lado", template: "12", pagina: ["home"], component: "Brand12", path: "molecules/Brands12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#fbf6f3", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto das marcas", type: "color", default: "#3b1f33", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos e das marcas", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "brands", key: "mar13ntr9a5c", image: "brand/Brand13.webp", imageSource: "auto", mobile: "", title: "Marcas Template 13", description: "Cabeça em linha com o título em condensada e \"Ver todas\" sublinhado em verde; as marcas numa grade de células com filete, o nome em condensada maiúscula ou o logo, seis por linha (duas no mobile); no hover a célula enche de verde", template: "13", pagina: ["home"], component: "Brand13", path: "molecules/Brands13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto das marcas", type: "color", default: "#f4f4f0", group: "Marcas" },
        { cssVar: "--brands-accent", label: "Destaque (link e hover)", type: "color", default: "#c8ff2e", group: "Marcas" },
        { cssVar: "--brands-title-font", label: "Fonte das marcas", type: "font", default: "'Barlow Condensed', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "14", selection: "brands", key: "mar14esp9a5c", image: "brand/Brand14.webp", imageSource: "auto", mobile: "", title: "Marcas Template 14", description: "Título em Saira itálica e \"Ver todas\"; as marcas em células cinza-azuladas com o nome em Saira itálica apagado ou o logo, seis por linha (três no mobile); no hover o nome vai à cor plena", template: "14", pagina: ["home"], component: "Brand14", path: "molecules/Brands14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto das marcas", type: "color", default: "#0b1b33", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-accent", label: "Destaque (link)", type: "color", default: "#e4002b", group: "Marcas", inheritsLabel: "cor primária da marca" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "brands", key: "brd15lux9w2e", image: "brand/Brand15.webp", imageSource: "auto", mobile: "", title: "Marcas Template 15", description: "Cabeça centralizada e a faixa de marcas entre fios dourados, separadas por fios finos, com os nomes em serifa alternando itálico e versalete (ou o logo); \"Ver todas as marcas\" sobre o fio. No mobile, duas colunas", template: "15", pagina: ["home"], component: "Brand15", path: "molecules/Brands15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-accent", label: "Destaque (fios e link)", type: "color", default: "#7a5f1c", group: "Marcas", inheritsLabel: "cor primária da marca" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos e das marcas", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "brands", key: "brd16inf9w7e", image: "brand/Brand16.webp", imageSource: "auto", mobile: "", title: "Marcas Template 16", description: "Título arredondado e \"Ver todas as marcas\"; pílulas brancas com filete suave e o nome da marca, seis por linha; no hover, o filete escuro e a sombra chapada. No mobile, duas por linha e \"Ver todas\" no pé", template: "16", pagina: ["home"], component: "Brand16", path: "molecules/Brands16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--brands-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Marcas" },
        { cssVar: "--brands-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Marcas", inheritsLabel: "cor de texto primária" },
        { cssVar: "--brands-accent", label: "Destaque (\"Ver todas\")", type: "color", default: "#5b4bdb", group: "Marcas", inheritsLabel: "cor primária da marca" },
        { cssVar: "--brands-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--brands-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  textArea: {
    name: "Área de Texto",
    items: [
      { id: "01", selection: "text-area", key: "txt01a2b3c4d", image: "textArea/TextArea.webp", imageSource: "auto", mobile: "", title: "Área de Texto Template 1", description: "Bloco de conteúdo HTML livre, preenchido no CMS", template: "1", pagina: ["home"], override: true, path: "molecules/TextArea", component: "TextArea", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--text-area-font", label: "Fonte do texto", type: "font", default: "inherit", group: "Tipografia" },
      ] },
    ],
  },
  categories: {
    name: "Carrossel de Categorias",
    items: [
      { id: "01", selection: "categories", key: "cat01lk3ndkl", image: "categories/Categories01.webp", imageSource: "design", mobile: "", title: "Carrossel de Categorias Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Categories01", path: "molecules/Categories01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Cor do título e nomes", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "04", selection: "multi-categories", key: "mulcat04n8p2", image: "categories/MultiCategories04.webp", imageSource: "design", mobile: "", title: "Carrossel de Categorias Template 4", description: "Grade de categorias com imagem e rótulo", template: "4", pagina: ["home"], component: "MultiCategories04", path: "organisms/MultiCategories04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
      { id: "06", selection: "home-carousel", key: "homcar06q4r9", image: "categories/HomeCarousel06.webp", imageSource: "design", mobile: "", title: "Carrossel de Categorias Template 6", description: "Carrossel de categorias", template: "6", pagina: ["home"], component: "HomeCarousel06", path: "molecules/HomeCarousel06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--home-carousel-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
      { id: "07", selection: "categories", key: "cat07bru4d5e", image: "categories/Categories07.webp", imageSource: "auto", mobile: "", title: "Carrossel de Categorias Template 7", description: "Curadoria com título e link Ver todos: até 5 categorias saem em grid; de 6 em diante vira carrossel com setas. 4 cards no mobile", template: "7", pagina: ["home"], component: "Categories07", path: "molecules/Categories07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Cor do título e dos rótulos", type: "color", default: "#2c2420", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Cor do link e do hover", type: "color", default: "#b8976a", group: "Categorias", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--categories-font", label: "Fonte do título e dos rótulos", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-body-font", label: "Fonte do link", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
      ] },
      { id: "08", selection: "categories", key: "cat08sra3m8q", image: "categories/Categories08.webp", imageSource: "auto", mobile: "", title: "Categorias Template 8", description: "Quatro cards de categoria com imagem, título, texto e botão", template: "8", pagina: ["home"], component: "Categories08", path: "molecules/Categories08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--categories-bg", label: "Fundo da faixa", type: "color", default: "#cccccc", group: "Categorias" },
        { cssVar: "--categories-text", label: "Texto dos cards", type: "color", default: "#ffffff", group: "Categorias" },
        { cssVar: "--categories-button-bg", label: "Fundo do botão", type: "color", default: "#ffffff", group: "Botão" },
        { cssVar: "--categories-button-text", label: "Texto do botão", type: "color", default: "#141414", group: "Botão" },
        { cssVar: "--categories-font", label: "Fonte dos títulos", type: "font", default: "\'Open Sans\', sans-serif", group: "Tipografia" },
        { cssVar: "--categories-body-font", label: "Fonte do texto", type: "font", default: "'Open Sans', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "categories", key: "cat09edt4s9b", image: "categories/Categories09.webp", imageSource: "auto", mobile: "", title: "Categorias Template 9", description: "Título com trecho em itálico, \"Ver todas\" e setas; cinco categorias por vez em foto 4:5 com o nome em itálico; no mobile, a lista rola de lado", template: "9", pagina: ["home"], component: "Categories09", path: "molecules/Categories09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#1d1b18", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto dos cards", type: "color", default: "#1d1b18", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "categories", key: "cat10vrj9b3f", image: "categories/Categories10.webp", imageSource: "auto", mobile: "", title: "Categorias Template 10", description: "\"Departamentos\" com \"Ver todos\" e setas; oito cartões brancos por vez com foto 1:1 e o nome; no mobile, cartões menores rolando de lado", template: "10", pagina: ["home"], component: "Categories10", path: "molecules/Categories10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#101828", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto dos cards", type: "color", default: "#101828", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Destaque (setas e \"Ver todos\")", type: "color", default: "#1340d8", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "categories", key: "cat11grd9b3f", image: "categories/Categories11.webp", imageSource: "auto", mobile: "", title: "Categorias Template 11", description: "Cabeça de filetes com \"[01]\", título e \"Ver tudo\"; as categorias em linhas grandes numeradas à esquerda e a arte da categoria em foco à direita, com a linha em foco invertida; no mobile, linhas com miniatura quadrada", template: "11", pagina: ["home"], component: "Categories11", path: "molecules/Categories11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Categorias" },
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#0a0a0a", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto e filetes das linhas", type: "color", default: "#0a0a0a", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "categories", key: "cat12suv1b7g", image: "categories/Categories12.webp", imageSource: "auto", mobile: "", title: "Categorias Template 12", description: "Título em serifa e texto centrados; as categorias em círculos com anel (foto ou o pastel da posição) e o nome, a categoria com selo de anel vinho e pílula; no mobile, círculos menores rolando de lado", template: "12", pagina: ["home"], component: "Categories12", path: "molecules/Categories12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#3b1f33", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Nomes das categorias", type: "color", default: "#3b1f33", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Destaque (anel e selo)", type: "color", default: "#7a2e5f", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "categories", key: "cat13ntr5n3j", image: "categories/Categories13.webp", imageSource: "auto", mobile: "", title: "Categorias Template 13", description: "Cabeça em linha com o título em condensada e \"Ver tudo\" sublinhado em verde; as categorias em blocos grafite altos com o nome gigante no canto e o quadrado verde com a seta; quatro por linha e, no mobile, os blocos rolando de lado", template: "13", pagina: ["home"], component: "Categories13", path: "molecules/Categories13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Categorias" },
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#f4f4f0", group: "Categorias" },
        { cssVar: "--categories-text", label: "Nomes das categorias", type: "color", default: "#f4f4f0", group: "Categorias" },
        { cssVar: "--categories-accent", label: "Destaque (link e seta)", type: "color", default: "#c8ff2e", group: "Categorias" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "categories", key: "cat14esp5n3j", image: "categories/Categories14.webp", imageSource: "auto", mobile: "", title: "Categorias Template 14", description: "Cabeça em linha com o título em Saira itálica e \"Ver todas\" sublinhado em vermelho; seis blocos altos com a foto, o número da posição apagado, o nome numa etiqueta marinho em paralelogramo e o quadrado vermelho com a seta; no mobile, os blocos rolando de lado", template: "14", pagina: ["home"], component: "Categories14", path: "molecules/Categories14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Categorias" },
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#0b1b33", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Etiquetas e números", type: "color", default: "#0b1b33", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Destaque (link e seta)", type: "color", default: "#e4002b", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "categories", key: "cat15lux5n3j", image: "categories/Categories15.webp", imageSource: "auto", mobile: "", title: "Categorias Template 15", description: "Cabeça centralizada com a chamada dourada, o título em serifa com o trecho em itálico e o fio dourado; as categorias em fotos 3:4 com o nome em serifa e \"Ver\" dourado sobre o fio; no mobile, duas colunas com a seta no lugar do \"Ver\"", template: "15", pagina: ["home"], component: "Categories15", path: "molecules/Categories15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Categorias" },
        { cssVar: "--categories-title-color", label: "Título da seção", type: "color", default: "#1a1714", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Nomes das categorias", type: "color", default: "#1a1714", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Destaque (chamada, fio e \"Ver\")", type: "color", default: "#7a5f1c", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "categories", key: "cat16inf5n8j", image: "categories/Categories16.webp", imageSource: "auto", mobile: "", title: "Categorias Template 16", description: "Título arredondado e \"Ver todas as categorias\" sublinhado em roxo; círculos com filete, cada um num tom pastel, e o nome numa pílula branca. No mobile, grade de três e \"Ver todas\" vira botão no pé", template: "16", pagina: ["home"], component: "Categories16", path: "molecules/Categories16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Categorias" },
        { cssVar: "--categories-title-color", label: "Título", type: "color", default: "#2a2350", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto", type: "color", default: "#2a2350", group: "Categorias", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-accent", label: "Destaque (\"Ver todas\")", type: "color", default: "#5b4bdb", group: "Categorias", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categories-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categories-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  banner: {
    name: "Banners",
    items: [
      { id: "01", selection: "banner-main", key: "ban01m1k3nq2", image: "banner/BannerMain01.webp", imageSource: "design", mobile: "", title: "Banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerMain01", path: "organisms/BannerMain01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-accent", label: "Cor do bullet ativo", type: "color", default: "#682A77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "06", selection: "banner-main", key: "ban06a1b2c3d", image: "banner/BannerMain06.webp", imageSource: "design", mobile: "", title: "Banners Template 6", description: "Banner clicável de largura total, com arte separada para desktop e mobile", template: "6", pagina: ["home"], component: "BannerMain06", path: "organisms/BannerMain06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "07", selection: "banner-main", key: "ban07bru6h7j", image: "banner/BannerMain07.webp", imageSource: "auto", mobile: "", title: "Banners Template 7", description: "Hero com rótulo, título, subtítulo e CTAs sobre a arte; conteúdo e altura próprios no mobile", template: "7", pagina: ["home"], component: "BannerMain07", path: "organisms/BannerMain07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--banner-main-title-color", label: "Cor do título", type: "color", default: "#faf8f4", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-text", label: "Cor do rótulo e do subtítulo", type: "color", default: "#f5f0e8", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-cta-bg", label: "Fundo do botão principal", type: "color", default: "#faf8f4", group: "Hero", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-cta-text", label: "Texto do botão principal", type: "color", default: "#2c2420", group: "Hero", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-main-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "banner-main", key: "ban08sra7k2p", image: "banner/BannerMain08.webp", imageSource: "auto", mobile: "", title: "Banner Template 8", description: "Banner de campanha com chamada, título e texto sobre a arte", template: "8", pagina: ["home"], component: "BannerMain08", path: "organisms/BannerMain08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--banner-main-text", label: "Texto sobre a arte", type: "color", default: "#ffffff", group: "Banner" },
        { cssVar: "--banner-main-title-font", label: "Fonte do título", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "\'Inter\', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "banner-main", key: "ban09edt8h3k", image: "banner/BannerMain09.webp", imageSource: "auto", mobile: "", title: "Banner Template 9", description: "Texto à esquerda (chamada, título com trecho em itálico, texto e dois links) e a arte à direita, com contador 01 / 03, filetes de progresso e setas; no mobile, arte no topo", template: "9", pagina: ["home"], component: "BannerMain09", path: "organisms/BannerMain09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#f7f4ef", group: "Banner" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#1d1b18", group: "Banner", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "banner-main", key: "ban10vrj4q7x", image: "banner/BannerMain10.webp", imageSource: "auto", mobile: "", title: "Banner Template 10", description: "Carrossel grande com selo, título com trecho em destaque, texto, CTA, arte à direita, setas e pontos, e dois cartões de promoção empilhados ao lado; no mobile, arte no topo e os cartões rolando de lado", template: "10", pagina: ["home"], component: "BannerMain10", path: "organisms/BannerMain10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#1340d8", group: "Banner", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#ffffff", group: "Banner", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão", type: "color", default: "#ffcf24", group: "Botão", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão", type: "color", default: "#101828", group: "Botão", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "banner-main", key: "ban11grd4q7x", image: "banner/BannerMain11.webp", imageSource: "auto", mobile: "", title: "Banner Template 11", description: "A arte à esquerda com o contador \"01 / 03\" e, numa célula de filetes à direita, chamada, título, texto, CTA e nota; embaixo, a régua de abas numeradas (a ativa com o traço de destaque) e as setas. No mobile, arte no topo, CTA largo e abas só com o número", template: "11", pagina: ["home"], component: "BannerMain11", path: "organisms/BannerMain11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#ffffff", group: "Banner" },
        { cssVar: "--banner-main-text", label: "Texto e filetes do banner", type: "color", default: "#0a0a0a", group: "Banner", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-main-accent", label: "Destaque (aba ativa)", type: "color", default: "#ff4f00", group: "Banner", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "banner-main", key: "ban12suv6t2h", image: "banner/BannerMain12.webp", imageSource: "auto", mobile: "", title: "Banner Template 12", description: "Cartão rosado arredondado com selo branco, título em serifa, texto, CTA vinho e link sublinhado; à direita a arte num arco com o cartão branco de produto sobreposto; pontos embaixo, o atual em pílula. No mobile, a arte no topo do cartão e o CTA largo", template: "12", pagina: ["home"], component: "BannerMain12", path: "organisms/BannerMain12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do cartão", type: "color", default: "#f4dcd6", group: "Banner", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#3b1f33", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "banner-main", key: "ban13ntr9p4s", image: "banner/BannerMain13.webp", imageSource: "auto", mobile: "", title: "Banner Template 13", description: "A arte ocupa a direita sobre o preto; à esquerda o selo verde, o título gigante em condensada com a palavra de destaque em verde, o texto, o CTA verde com seta e o botão com filete; no pé, o contador \"1/3\", a régua de segmentos e as setas. No mobile, a arte no topo com o selo, os dois botões largos e o contador com a régua", template: "13", pagina: ["home"], component: "BannerMain13", path: "organisms/BannerMain13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#0d0d0d", group: "Banner" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#f4f4f0", group: "Banner" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão (e destaque)", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "banner-main", key: "ban14esp4p9s", image: "banner/BannerMain14.webp", imageSource: "auto", mobile: "", title: "Banner Template 14", description: "A arte cobre a seção e, por cima, o painel marinho em diagonal com a faixa vermelha inclinada; no painel o selo lima, o título enorme em Saira itálica com a palavra de destaque num paralelogramo vermelho, o texto, os números de destaque, o CTA vermelho e o link sublinhado em lima; no canto, \"01 / 03\", as barras inclinadas e as setas. No mobile, a arte em cima com o pé em diagonal, o CTA largo e o contador com as barras", template: "14", pagina: ["home"], component: "BannerMain14", path: "organisms/BannerMain14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do painel", type: "color", default: "#0b1b33", group: "Banner", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#ffffff", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-accent", label: "Destaque (selo, link e barra atual)", type: "color", default: "#d9f99d", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão (e destaque do título)", type: "color", default: "#e4002b", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "banner-main", key: "ban15lux9p4s", image: "banner/BannerMain15.webp", imageSource: "auto", mobile: "", title: "Banner Template 15", description: "Faixa escura: à esquerda o fio dourado com a chamada, o título grande em serifa com o trecho em itálico, o texto apagado, o botão claro cheio e o botão com fio; à direita a arte 4:3 emoldurada pelo fio dourado; no pé, \"01 / 03\" em itálico, os fios de posição e as setas. No mobile, a arte no topo, os botões empilhados e os fios centralizados", template: "15", pagina: ["home"], component: "BannerMain15", path: "organisms/BannerMain15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#1a1714", group: "Banner", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#faf8f4", group: "Banner", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-accent", label: "Destaque dourado (fios, moldura e chamada)", type: "color", default: "#c9a961", group: "Banner" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão cheio", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão cheio", type: "color", default: "#1a1714", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "banner-main", key: "ban16inf9p1s", image: "banner/BannerMain16.webp", imageSource: "auto", mobile: "", title: "Banner principal Template 16", description: "Faixa amarela com o selo em pílula branca, o título grande arredondado, o texto, o botão roxo e o botão branco em pílula com sombra chapada; à direita a arte arredondada com filete e o selo coral redondo e inclinado; os pontos com o atual em pílula, as setas redondas e a onda creme fechando a faixa. No mobile, a arte no topo e o botão largo", template: "16", pagina: ["home"], component: "BannerMain16", path: "organisms/BannerMain16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-main-bg", label: "Fundo do banner", type: "color", default: "#ffc93c", group: "Banner", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-main-text", label: "Texto do banner", type: "color", default: "#2a2350", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-main-accent", label: "Destaque (selo da arte)", type: "color", default: "#ff6f61", group: "Banner", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--banner-main-button-bg", label: "Fundo do botão principal", type: "color", default: "#5b4bdb", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-main-button-text", label: "Texto do botão principal", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-main-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  ruler: {
    name: "Regua de benefícios",
    items: [
      { id: "01", selection: "ruler", key: "bnf01lm3a894", image: "ruler/Ruler01.webp", imageSource: "design", mobile: "", title: "Regua de benefícios Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Ruler01", path: "molecules/Ruler01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#122161", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--ruler-text", label: "Texto e ícones da régua", type: "color", default: "#ffffff", group: "Régua", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--ruler-font", label: "Fonte da régua de benefícios", type: "font", default: "Arial, sans-serif", group: "Tipografia" },
      ] },
      { id: "07", selection: "ruler", key: "bnf07q2w3e4r", image: "ruler/Ruler07.webp", imageSource: "design", mobile: "", title: "Regua de benefícios Template 7", description: "Faixa de benefícios: ícone + título + subtítulo, 4 colunas no desktop e 2 no mobile; linha incompleta fica centrada", template: "7", pagina: ["home"], component: "Ruler07", path: "molecules/BenefitsStrip07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--benefits-bg", label: "Fundo da faixa", type: "color", default: "#2c2420", group: "Régua", inheritsLabel: "cor primária da marca" },
        { cssVar: "--benefits-accent", label: "Ícones da régua", type: "color", default: "#b8976a", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--benefits-title", label: "Texto da régua", type: "color", default: "#f5f0e8", group: "Régua", inheritsLabel: "cor de texto base" },
        { cssVar: "--benefits-font", label: "Fonte da régua", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "ruler", key: "bnf0213jan45", image: "ruler/Ruler02.webp", imageSource: "design", mobile: "", title: "Regua de benefícios Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Ruler02", path: "molecules/Ruler02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--ruler-font", label: "Fonte da régua de benefícios", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "04", selection: "ruler", key: "bnf04t5u6v7w", image: "ruler/Ruler04.webp", imageSource: "design", mobile: "", title: "Regua de benefícios Template 4", description: "Régua de benefícios em linha de ícones", template: "4", pagina: ["home"], component: "Ruler04", path: "organisms/Ruler04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "05", selection: "ruler", key: "bnf05x8y9z0a", image: "ruler/Ruler05.webp", imageSource: "design", mobile: "", title: "Regua de benefícios Template 5", description: "Régua de benefícios em carrossel", template: "5", pagina: ["home"], component: "Ruler05", path: "organisms/Ruler05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-font", label: "Fonte da régua de benefícios", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "ruler", key: "bnf08sra9d5e", image: "ruler/Ruler08.webp", imageSource: "auto", mobile: "", title: "Régua Template 8", description: "Régua de benefícios em quatro colunas; no mobile, um por vez com setas", template: "8", pagina: ["home"], component: "Ruler08", path: "molecules/BenefitsStrip08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--benefits-bg", label: "Fundo da régua", type: "color", default: "#ffffff", group: "Régua" },
        { cssVar: "--benefits-title", label: "Título dos benefícios", type: "color", default: "#141414", group: "Régua" },
        { cssVar: "--benefits-text", label: "Texto dos benefícios", type: "color", default: "#605e70", group: "Régua" },
        { cssVar: "--benefits-font", label: "Fonte da régua", type: "font", default: "'Manrope', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "ruler", key: "bnf09edt2v7p", image: "ruler/Ruler09.webp", imageSource: "auto", mobile: "", title: "Régua Template 9", description: "Quatro benefícios entre dois filetes, cada um com ícone de traço fino, título em caixa-alta e uma linha apagada; no mobile, a lista rola de lado", template: "9", pagina: ["home"], component: "Ruler09", path: "molecules/BenefitsStrip09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#f7f4ef", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto e ícones da régua", type: "color", default: "#1d1b18", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-font", label: "Fonte da régua de benefícios", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "ruler", key: "bnf10vrj6h1z", image: "ruler/Ruler10.webp", imageSource: "auto", mobile: "", title: "Régua Template 10", description: "Quatro cartões brancos em grade, cada um com o ícone num círculo tingido, título e linha de apoio; no mobile, os cartões rolam de lado com pontos embaixo", template: "10", pagina: ["home"], component: "Ruler10", path: "molecules/BenefitsStrip10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#f2f4f7", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto da régua", type: "color", default: "#101828", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Ícones", type: "color", default: "#1340d8", group: "Régua", inheritsLabel: "cor primária da marca" },
        { cssVar: "--ruler-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--ruler-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "ruler", key: "bnf11grd6h1z", image: "ruler/Ruler11.webp", imageSource: "auto", mobile: "", title: "Régua Template 11", description: "Quatro células numa grade de filetes, cada uma com o número \"[01]\" em mono, título, linha de apoio e o ícone à direita; no mobile, as células rolam de lado", template: "11", pagina: ["home"], component: "Ruler11", path: "molecules/BenefitsStrip11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#ffffff", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto e filetes da régua", type: "color", default: "#0a0a0a", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Ícones", type: "color", default: "#0a0a0a", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--ruler-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "ruler", key: "bnf12suv9j5x", image: "ruler/Ruler12.webp", imageSource: "auto", mobile: "", title: "Régua Template 12", description: "Pílulas brancas centradas, cada uma com o ícone num círculo pastel, o título e a linha de apoio; no mobile, as pílulas rolam de lado", template: "12", pagina: ["home"], component: "Ruler12", path: "molecules/BenefitsStrip12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#fbf6f3", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto da régua", type: "color", default: "#3b1f33", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Ícones", type: "color", default: "#3b1f33", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-font", label: "Fonte da régua de benefícios", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "ruler", key: "bnf13ntr1h8z", image: "ruler/Ruler13.webp", imageSource: "auto", mobile: "", title: "Régua Template 13", description: "Faixa preta entre filetes com os benefícios em condensada maiúscula, cada um com o ícone de traço, separados pelo asterisco verde; no mobile, uma linha só que rola de lado", template: "13", pagina: ["home"], component: "Ruler13", path: "molecules/BenefitsStrip13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#0d0d0d", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto da régua", type: "color", default: "#f4f4f0", group: "Régua" },
        { cssVar: "--ruler-icon", label: "Ícones e asteriscos", type: "color", default: "#c8ff2e", group: "Régua" },
        { cssVar: "--ruler-title-font", label: "Fonte da régua de benefícios", type: "font", default: "'Barlow Condensed', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "14", selection: "ruler", key: "bnf14esp1h8z", image: "ruler/Ruler14.webp", imageSource: "auto", mobile: "", title: "Régua Template 14", description: "Faixa lima que corre de lado com os benefícios em Saira itálica maiúscula, cada um com o ícone vermelho de traço, separados pelo traço marinho inclinado; para com a redução de movimento", template: "14", pagina: ["home"], component: "Ruler14", path: "molecules/BenefitsStrip14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#d9f99d", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto e traços", type: "color", default: "#0b1b33", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Ícones", type: "color", default: "#e4002b", group: "Régua", inheritsLabel: "cor primária da marca" },
        { cssVar: "--ruler-title-font", label: "Fonte dos benefícios", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--ruler-font", label: "Fonte da régua", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "ruler", key: "bnf15lux1h8z", image: "ruler/Ruler15.webp", imageSource: "auto", mobile: "", title: "Régua Template 15", description: "Faixa areia com os benefícios em grade, cada um entre fios dourados verticais: o ícone de traço dourado, o título em versalete e uma linha apagada; no mobile, grade 2 × 2 só com os títulos", template: "15", pagina: ["home"], component: "Ruler15", path: "molecules/BenefitsStrip15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#efe8db", group: "Régua" },
        { cssVar: "--ruler-text", label: "Texto da régua", type: "color", default: "#1a1714", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Ícones e fios", type: "color", default: "#7a5f1c", group: "Régua", inheritsLabel: "cor primária da marca" },
        { cssVar: "--ruler-font", label: "Fonte da régua", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "ruler", key: "bnf16inf1h5z", image: "ruler/Ruler16.webp", imageSource: "auto", mobile: "", title: "Régua de benefícios Template 16", description: "Faixa verde-água com quatro benefícios: o ícone num círculo creme com filete, o título arredondado e a linha de apoio. No mobile, uma linha que rola de lado", template: "16", pagina: ["home"], component: "Ruler16", path: "molecules/BenefitsStrip16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--ruler-bg", label: "Fundo da régua", type: "color", default: "#22b8a7", group: "Régua", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--ruler-text", label: "Texto da régua", type: "color", default: "#2a2350", group: "Régua", inheritsLabel: "cor de texto primária" },
        { cssVar: "--ruler-icon", label: "Fundo dos ícones", type: "color", default: "#fffbf2", group: "Régua" },
        { cssVar: "--ruler-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--ruler-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  grid: {
    name: "Grid de banners",
    items: [
      { id: "01", selection: "banner-grid", key: "grd01qw09er8", image: "grid/BannerGrid01.webp", imageSource: "design", mobile: "", title: "Grid de banners Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerGrid01", path: "molecules/BannerGrid01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "banner-grid", key: "grd06frc9j1k", image: "grid/BannerGrid06.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 6", description: "Título centrado e slider de banner-cards de categoria: 3 por página no desktop, 1 com dots e setas no mobile", template: "6", pagina: ["home"], component: "BannerGrid06", path: "molecules/BannerGrid06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Grid de banners", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-card-title-color", label: "Cor do título do card", type: "color", default: "#ffffff", group: "Grid de banners", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-grid-font", label: "Fonte do título", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-card-font", label: "Fonte do título do card", type: "font", default: "'League Spartan', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "09", selection: "banner-grid", key: "grd09edt7m2x", image: "grid/BannerGrid09.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 9", description: "Chamada com filete e nota à direita; um banner grande à esquerda e dois empilhados à direita, cada um com título e \"Ver mais\"; os três em coluna no mobile", template: "9", pagina: ["home"], component: "BannerGrid09", path: "molecules/BannerGrid09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Título da seção", type: "color", default: "#1d1b18", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto dos banners", type: "color", default: "#1d1b18", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "banner-grid", key: "grd10vrj7w2c", image: "grid/BannerGrid10.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 10", description: "Banner grande no acento (chamada, título, selo de preço, CTA e arte no canto) e quatro banners menores em grade 2 × 2, cada um num tom; no mobile, o grande com a arte no topo e os menores em duas colunas", template: "10", pagina: ["home"], component: "BannerGrid10", path: "molecules/BannerGrid10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Título da seção", type: "color", default: "#101828", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto dos banners", type: "color", default: "#101828", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-accent", label: "Fundo do banner grande", type: "color", default: "#1340d8", group: "Grid", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-grid-highlight", label: "Destaque (selo de preço)", type: "color", default: "#ffcf24", group: "Grid", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "banner-grid", key: "grd11grd7w2c", image: "grid/BannerGrid11.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 11", description: "\"Ambientes\" com cabeça de filetes e três células: um banner de ambiente, o bloco manifesto no destaque (chamada, frase, link, título e legenda) e mais um banner, cada banner com arte, título, legenda em mono e seta; no mobile, as células empilham", template: "11", pagina: ["home"], component: "BannerGrid11", path: "molecules/BannerGrid11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-grid-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Grid" },
        { cssVar: "--banner-grid-title-color", label: "Título da seção", type: "color", default: "#0a0a0a", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto e filetes", type: "color", default: "#0a0a0a", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-accent", label: "Fundo do bloco manifesto", type: "color", default: "#ff4f00", group: "Manifesto", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-grid-accent-text", label: "Texto do bloco manifesto", type: "color", default: "#0a0a0a", group: "Manifesto", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "banner-grid", key: "grd12suv8c4m", image: "grid/BannerGrid12.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 12", description: "Três cartões pastel lado a lado (o do meio mais alto), cada um com chamada em caixa alta, título em serifa, texto, CTA em pílula branca e a arte num arco no pé; no mobile, os cartões empilham", template: "12", pagina: ["home"], component: "BannerGrid12", path: "molecules/BannerGrid12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-title-color", label: "Títulos", type: "color", default: "#3b1f33", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto dos cartões", type: "color", default: "#3b1f33", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "banner-grid", key: "grd13ntr2x6f", image: "grid/BannerGrid13.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 13", description: "Três banners altos em grafite lado a lado, o do meio deslocado para baixo, cada um com o número em verde, o título gigante em condensada e \"Comprar →\" no pé; no mobile, os três empilhados", template: "13", pagina: ["home"], component: "BannerGrid13", path: "molecules/BannerGrid13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Grid" },
        { cssVar: "--banner-grid-title-color", label: "Títulos", type: "color", default: "#f4f4f0", group: "Grid" },
        { cssVar: "--banner-grid-text", label: "Texto dos banners", type: "color", default: "#f4f4f0", group: "Grid" },
        { cssVar: "--banner-grid-accent", label: "Destaque (números)", type: "color", default: "#c8ff2e", group: "Grid" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "banner-grid", key: "grd14esp2x6f", image: "grid/BannerGrid14.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 14", description: "Três banners: o primeiro, grande, ocupa as duas linhas e os outros dois empilham à direita; sobre a arte, no pé, a placa marinho em paralelogramo com a chamada, o título em Saira itálica e o CTA vermelho; no mobile, os três empilhados", template: "14", pagina: ["home"], component: "BannerGrid14", path: "molecules/BannerGrid14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-grid-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Grid" },
        { cssVar: "--banner-grid-highlight", label: "Fundo das placas", type: "color", default: "#0b1b33", group: "Grid", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-grid-text", label: "Texto das placas", type: "color", default: "#ffffff", group: "Grid", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--banner-grid-accent", label: "Fundo do botão", type: "color", default: "#e4002b", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-grid-accent-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "banner-grid", key: "grd15lux2x6f", image: "grid/BannerGrid15.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 15", description: "Cabeça centralizada; o primeiro banner quadrado e grande à esquerda e os outros 16:9 empilhados à direita, cada um com a chamada dourada, o título em serifa e \"Explorar\" sobre o fio dourado; no mobile, os banners empilhados", template: "15", pagina: ["home"], component: "BannerGrid15", path: "molecules/BannerGrid15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-grid-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Grid" },
        { cssVar: "--banner-grid-title-color", label: "Títulos", type: "color", default: "#1a1714", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto dos banners", type: "color", default: "#1a1714", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-accent", label: "Destaque (chamadas e fios)", type: "color", default: "#7a5f1c", group: "Grid", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "banner-grid", key: "grd16inf2x9f", image: "grid/BannerGrid16.webp", imageSource: "auto", mobile: "", title: "Grid de banners Template 16", description: "Três banners altos com filete; a bolha inclinada da idade no canto e, no pé, o cartão branco com o título arredondado, o texto e \"Comprar agora\" com seta. No mobile, empilhados e sem o texto", template: "16", pagina: ["home"], component: "BannerGrid16", path: "molecules/BannerGrid16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-grid-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Grid" },
        { cssVar: "--banner-grid-title-color", label: "Títulos", type: "color", default: "#2a2350", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-text", label: "Texto dos banners", type: "color", default: "#2a2350", group: "Grid", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-grid-accent", label: "Destaque (\"Comprar agora\")", type: "color", default: "#5b4bdb", group: "Grid", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-grid-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-grid-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  bannerSide: {
    name: "Banner Side",
    items: [
      { id: "01", selection: "banner-side", key: "bansd014mh45", image: "bannerSide/BannerSide01.webp", imageSource: "design", mobile: "", title: "Banner Side Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "BannerSide01", path: "molecules/BannerSide01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-duplo", key: "bansdhg028e3", image: "bannerSide/BannerDuplo02.webp", imageSource: "design", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerDuplo02", path: "molecules/BannerDuplo02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-duplo-title-font", label: "Fonte do título", type: "font", default: "'Roboto', Arial, Helvetica, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "03", selection: "banner-side", key: "bansd0234nb7", image: "bannerSide/BannerSide02.webp", imageSource: "design", mobile: "", title: "Banner Side Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "BannerSide02", path: "molecules/BannerSide02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--banner-side-title-font", label: "Fonte do título", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--banner-side-font", label: "Fonte do texto", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "06", selection: "banner-side", key: "bansd06f7g8h", image: "bannerSide/BannerSide06.webp", imageSource: "design", mobile: "", title: "Banner Side Template 6", description: "Par de banner-cards lado a lado: arte clicável, parágrafo e link \'Veja mais\'", template: "6", pagina: ["home"], component: "BannerSide06", path: "molecules/BannerSide06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-side-text", label: "Cor do texto e do sublinhado", type: "color", default: "#212721", group: "Banner Side", inheritsLabel: "cor de texto primária" },
        { cssVar: "--banner-side-font", label: "Fonte do texto", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "banner-side", key: "bsd08sra6v3c", image: "bannerSide/ShelfBanner08.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 8", description: "Banner lateral ao lado de uma vitrine de produtos", template: "8", pagina: ["home"], component: "ShelfBanner08", path: "organisms/ProductShelfBanner08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título e selo de desconto", type: "color", default: "#000000", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Subtítulo, Ver todos e Pix", type: "color", default: "#525252", group: "Vitrine" },
        { cssVar: "--showcase-card-text", label: "Nome e preço do produto", type: "color", default: "#292929", group: "Card" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo (Novidade)", type: "color", default: "#292929", group: "Card" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo (Novidade)", type: "color", default: "#ffffff", group: "Card" },
        { cssVar: "--showcase-title-font", label: "Fonte do título", type: "font", default: "\'Open Sans\', sans-serif", group: "Tipografia" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Open Sans', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "banner-side", key: "bsd09edt5r1n", image: "bannerSide/ShelfBanner09.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 9", description: "Arte à esquerda com o cartão \"Compre o look\" e, à direita, o título com setas e três cards por vez; no mobile, arte em cima e cards rolando de lado", template: "9", pagina: ["home"], component: "ShelfBanner09", path: "organisms/ProductShelfBanner09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#f7f4ef", group: "Banner" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#1d1b18", group: "Banner", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#f7f4ef", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#1d1b18", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-tag-text", label: "Selo de desconto", type: "color", default: "#9c4a2f", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "banner-side", key: "bsd10vrj8g4n", image: "bannerSide/ShelfBanner10.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 10", description: "Banner azul à esquerda (selo, título, texto, CTA e a arte no pé) e, à direita, título, \"Ver todos\", setas e quatro cards por vez; no mobile, banner em cima e cards rolando de lado", template: "10", pagina: ["home"], component: "ShelfBanner10", path: "organisms/ProductShelfBanner10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#1340d8", group: "Banner", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#ffffff", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#f2f4f7", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título da vitrine", type: "color", default: "#101828", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (setas e \"Ver todos\")", type: "color", default: "#1340d8", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#d92d20", group: "Vitrine", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#ffffff", group: "Vitrine", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "banner-side", key: "bsd11grd8g4n", image: "bannerSide/ShelfBanner11.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 11", description: "Cabeça de filetes sem setas; o banner (arte, frase e CTA) ocupa 2 × 2 células da grade e quatro cards preenchem o resto; no mobile, banner antes e cards rolando de lado", template: "11", pagina: ["home"], component: "ShelfBanner11", path: "organisms/ProductShelfBanner11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#ffffff", group: "Banner" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#0a0a0a", group: "Banner", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto e filetes da vitrine", type: "color", default: "#0a0a0a", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título da vitrine", type: "color", default: "#0a0a0a", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "banner-side", key: "bsd12suv7h1t", image: "bannerSide/ShelfBanner12.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 12", description: "Cabeça em linha com o título e \"Ver todos\" em pílula branca; três cards e, na quarta coluna, o banner verde do kit com selo, título em serifa, texto, arte em arco e CTA vinho; no mobile, o banner em cima e os cards rolando de lado", template: "12", pagina: ["home"], component: "ShelfBanner12", path: "organisms/ProductShelfBanner12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#dce6da", group: "Banner" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#3b1f33", group: "Banner", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#fbf6f3", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#3b1f33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (botão do card, estrelas)", type: "color", default: "#7a2e5f", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#dce6da", group: "Vitrine", inheritsLabel: "cor terciária da marca", previewNote: "Aparece em produto com desconto; os três cards de exemplo ao lado do banner não têm." },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#3b1f33", group: "Vitrine", inheritsLabel: "cor terciária de contraste da marca", previewNote: "Aparece em produto com desconto; os três cards de exemplo ao lado do banner não têm." },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "banner-side", key: "bsd13ntr8m3t", image: "bannerSide/ShelfBanner13.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 13", description: "O título e as setas em cima; uma faixa que sangra até a borda direita com o banner grafite (selo verde, título gigante, texto e CTA sobre a arte) e os cards depois dele; régua de posição embaixo. No mobile, o banner sozinho em cima e os cards rolando de lado", template: "13", pagina: ["home"], component: "ShelfBanner13", path: "organisms/ProductShelfBanner13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#f4f4f0", group: "Banner" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#0d0d0d", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#f4f4f0", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#f4f4f0", group: "Vitrine" },
        { cssVar: "--showcase-accent", label: "Destaque (link, régua e seta)", type: "color", default: "#c8ff2e", group: "Vitrine" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#c8ff2e", group: "Vitrine", previewNote: "Aparece quando a vitrine tem rótulo nos cards; os cards de exemplo ao lado do banner não têm." },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "banner-side", key: "bsd14esp8m3t", image: "bannerSide/ShelfBanner14.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 14", description: "O título e as setas em cima; o banner marinho com a arte cortada em diagonal, o selo vermelho, o título em Saira itálica, o texto e o link com seta, e os cards ao lado na faixa que rola. No mobile, o banner sozinho em cima e os cards rolando de lado", template: "14", pagina: ["home"], component: "ShelfBanner14", path: "organisms/ProductShelfBanner14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#0b1b33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#0b1b33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (selo do banner e \"-N%\")", type: "color", default: "#e4002b", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#0b1b33", group: "Banner", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#ffffff", group: "Banner", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "banner-side", key: "bsd15lux4m9t", image: "bannerSide/ShelfBanner15.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 15", description: "Chamada, título e setas no topo; o banner escuro com o fio dourado por dentro, a chamada, o título em serifa com o trecho em itálico, o texto e \"Ver a linha\" sobre o fio, e três cards por vez ao lado; o fio de posição embaixo. No mobile, o banner vem em cima e os cards rolam de lado", template: "15", pagina: ["home"], component: "ShelfBanner15", path: "organisms/ProductShelfBanner15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#faf8f4", group: "Banner", inheritsLabel: "cor de texto base" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#faf8f4", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#1a1714", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#1a1714", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (chamada, \"Ver todos\" e fio de posição)", type: "color", default: "#7a5f1c", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#7a5f1c", group: "Vitrine", previewNote: "Aparece quando a vitrine tem rótulo nos cards; os cards de exemplo ao lado do banner não têm." },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "banner-side", key: "bsd16inf4m2t", image: "bannerSide/ShelfBanner16.webp", imageSource: "auto", mobile: "", title: "Vitrine com banner Template 16", description: "Título e setas em cima; o banner coral com filete, a arte arredondada no topo, o título arredondado, o texto e o botão branco com sombra chapada na primeira coluna, e os cards rolando nas outras três. No mobile, o banner sozinho em cima e os cards rolando de lado", template: "16", pagina: ["home"], component: "ShelfBanner16", path: "organisms/ProductShelfBanner16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--banner-side-bg", label: "Fundo do banner", type: "color", default: "#ff6f61", group: "Banner", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--banner-side-text", label: "Texto do banner", type: "color", default: "#2a2350", group: "Banner", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#fffbf2", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#2a2350", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#2a2350", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (\"Ver todos\" e seta \"próximo\")", type: "color", default: "#5b4bdb", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#ffc93c", group: "Vitrine", inheritsLabel: "cor terciária da marca", previewNote: "Aparece quando a vitrine tem rótulo nos cards; os cards de exemplo ao lado do banner não têm." },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  showcase: {
    name: "Vitrines",
    items: [
      { id: "01", selection: "showcase", key: "vtr01cm487ha", image: "showcase/Showcase01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["home"], component: "Showcase01", path: "organisms/ProductShelfCustom01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#122161", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#682a77", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "02", selection: "showcase", key: "vtr02mq91m48", image: "showcase/Showcase02.webp", imageSource: "design", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["home"], component: "Showcase02", path: "organisms/ProductShelfCustom02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "03", selection: "showcase", key: "vtr03s5t6u7v", image: "showcase/Showcase03.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 3", description: "Vitrine de produtos com carrossel e seletor de tamanhos", template: "3", pagina: ["home"], component: "Showcase03", path: "organisms/ProductShelfCustom03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#000000", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "04", selection: "showcase", key: "vtr04w8x9y0z", image: "showcase/Showcase04.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 4", description: "Vitrine com setas laterais e dots na barra inferior", template: "4", pagina: ["home"], component: "Showcase04", path: "organisms/ProductShelfCustom04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#e40101", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "05", selection: "showcase", key: "vtr05a1b2c3d", image: "showcase/Showcase05.webp", imageSource: "design", mobile: "", title: "Vitrine Template 5", description: "Vitrine com setas laterais e avaliação; fundo opcional", template: "5", pagina: ["home"], component: "Showcase05", path: "organisms/ProductShelfCustom05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        // Sem valor a vitrine fica TRANSPARENTE. Era #f5f5f5 cravado no SCSS — hex
        // fixo numa cor temável, o que o contrato do starter proíbe. Virou efeito
        // que o usuário liga se quiser; `optional` só troca a frase do estado vazio.
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "transparent", group: "Fundo", optional: true },
        { cssVar: "--showcase-title-color", label: "Cor do título", type: "color", default: "#292929", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-font", label: "Fonte do título", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--showcase-accent", label: "Cor do bullet ativo", type: "color", default: "#0096fe", group: "Carrossel", inheritsLabel: "cor primária da marca" },
      ] },
      { id: "06", selection: "showcase", key: "vtr06frc4d5e", image: "showcase/Showcase06.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 6", description: "Vitrine com título, subtítulo e carrossel", template: "6", pagina: ["home"], component: "Showcase06", path: "organisms/ProductShelfCustom06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--shelf-title-font", label: "Fonte do título", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "showcase", key: "vtr07bru5q6r", image: "showcase/Showcase07.webp", imageSource: "design", mobile: "", title: "Vitrine Template 7", description: "Vitrine com título e link para a listagem completa", template: "7", pagina: ["home"], component: "Showcase07", path: "organisms/ProductShelfCustom07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--shelf-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--shelf-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "showcase", key: "vtr08sra4n1x", image: "showcase/Showcase08.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 8", description: "Vitrine de produtos em carrossel com selo, desconto, Pix e parcelas", template: "8", pagina: ["home"], component: "Showcase08", path: "organisms/ProductShelfCustom08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título e selo de desconto", type: "color", default: "#000000", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Subtítulo, Ver todos e Pix", type: "color", default: "#525252", group: "Vitrine" },
        { cssVar: "--showcase-card-text", label: "Nome e preço do produto", type: "color", default: "#292929", group: "Card" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo (Novidade)", type: "color", default: "#292929", group: "Card" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo (Novidade)", type: "color", default: "#ffffff", group: "Card" },
        { cssVar: "--showcase-title-font", label: "Fonte do título", type: "font", default: "\'Open Sans\', sans-serif", group: "Tipografia" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Open Sans', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "showcase", key: "vtr09edt1k5d", image: "showcase/Showcase09.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 9", description: "Título com trecho em itálico, subtítulo, \"Ver tudo\" e setas; quatro cards por vez no desktop e carrossel com filete de progresso no mobile", template: "9", pagina: ["home"], component: "Showcase09", path: "organisms/ProductShelfCustom09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#f7f4ef", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título da vitrine", type: "color", default: "#1d1b18", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#1d1b18", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-tag-text", label: "Selo de desconto", type: "color", default: "#9c4a2f", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "showcase", key: "vtr10vrj1m6k", image: "showcase/Showcase10.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 10", description: "Título, \"Ver todas\" e setas; cinco cards por vez no desktop e carrossel com barra de progresso no mobile", template: "10", pagina: ["home"], component: "Showcase10", path: "organisms/ProductShelfCustom10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#f2f4f7", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título da vitrine", type: "color", default: "#101828", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (setas e \"Ver todos\")", type: "color", default: "#1340d8", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#d92d20", group: "Vitrine", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#ffffff", group: "Vitrine", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "showcase", key: "vtr11grd1m6k", image: "showcase/Showcase11.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 11", description: "Cabeça de filetes com \"[02]\", título, subtítulo, \"Ver todos\" e setas; quatro cards em grade de filetes por vez no desktop e cards rolando de lado no mobile", template: "11", pagina: ["home"], component: "Showcase11", path: "organisms/ProductShelfCustom11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto e filetes da vitrine", type: "color", default: "#0a0a0a", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título da vitrine", type: "color", default: "#0a0a0a", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "showcase", key: "vtr12suv5f3k", image: "showcase/Showcase12.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 12", description: "Cabeça centrada com título em serifa, subtítulo e \"Ver todos\" sublinhado; quatro cards por vez com as setas brancas redondas sobre as bordas; no mobile, cards rolando de lado e a barra de posição", template: "12", pagina: ["home"], component: "Showcase12", path: "organisms/ProductShelfCustom12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#fbf6f3", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#3b1f33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (botão do card, estrelas)", type: "color", default: "#7a2e5f", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#dce6da", group: "Vitrine", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#3b1f33", group: "Vitrine", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "showcase", key: "vtr13ntr7g2b", image: "showcase/Showcase13.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 13", description: "Cabeça em linha com o título gigante em condensada, \"Ver todos\" sublinhado em verde e as setas quadradas; quatro cards por vez com o rótulo fixo verde; no mobile, os cards rolam de lado com a régua de posição embaixo", template: "13", pagina: ["home"], component: "Showcase13", path: "organisms/ProductShelfCustom13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#0d0d0d", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#f4f4f0", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#f4f4f0", group: "Vitrine" },
        { cssVar: "--showcase-accent", label: "Destaque (link, régua e seta)", type: "color", default: "#c8ff2e", group: "Vitrine" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#c8ff2e", group: "Vitrine" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "showcase", key: "vtr14esp7g2b", image: "showcase/Showcase14.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 14", description: "Cabeça em linha com o título em Saira itálica, \"Ver todos\" sublinhado em vermelho e as setas em paralelogramo; quatro cards por vez com o rótulo fixo lima e a régua de posição embaixo; no mobile, os cards rolam de lado", template: "14", pagina: ["home"], component: "Showcase14", path: "organisms/ProductShelfCustom14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#ffffff", group: "Vitrine" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#0b1b33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#0b1b33", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (link, régua e \"-N%\")", type: "color", default: "#e4002b", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#d9f99d", group: "Rótulo", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do rótulo dos cards", type: "color", default: "#0b1b33", group: "Rótulo", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "showcase", key: "vtr15lux7g2b", image: "showcase/Showcase15.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 15", description: "Chamada dourada e título em serifa com o trecho em itálico à esquerda; \"Ver todos\" sobre o fio dourado e as setas com fio à direita; três cards por vez com o rótulo dourado e o fio de posição centralizado embaixo. No mobile, a cabeça centralizada, os cards rolando de lado e \"Ver todos\" no pé", template: "15", pagina: ["home"], component: "Showcase15", path: "organisms/ProductShelfCustom15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#faf8f4", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#1a1714", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#1a1714", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (chamada, \"Ver todos\" e fio de posição)", type: "color", default: "#7a5f1c", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#7a5f1c", group: "Vitrine" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "showcase", key: "vtr16inf7g4b", image: "showcase/Showcase16.webp", imageSource: "auto", mobile: "", title: "Vitrine Template 16", description: "Título arredondado com a linha de apoio; \"Ver todos\" sublinhado e as setas redondas com sombra chapada, a \"próximo\" cheia em roxo; quatro cards por vez com o rótulo \"Mais amado\" na bolha amarela. No mobile, os cards rolam de lado e \"Ver todos\" vai para o pé", template: "16", pagina: ["home"], component: "Showcase16", path: "organisms/ProductShelfCustom16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da vitrine", type: "color", default: "#fffbf2", group: "Vitrine" },
        { cssVar: "--showcase-text", label: "Texto da vitrine", type: "color", default: "#2a2350", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#2a2350", group: "Vitrine", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (\"Ver todos\" e seta \"próximo\")", type: "color", default: "#5b4bdb", group: "Vitrine", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do rótulo dos cards", type: "color", default: "#ffc93c", group: "Vitrine", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  bannerTriple: {
    name: "Banner Triplo",
    items: [
      { id: "01", selection: "banner-triple", key: "bntrp05f4g5h", image: "bannerTriple/BannerTriple05.webp", imageSource: "design", mobile: "", title: "Banner Triplo Template 5", description: "Três banners lado a lado, estáticos", template: "5", pagina: ["home"], component: "BannerTriple05", path: "organisms/BannerTriple05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "02", selection: "banner-triple-swiper", key: "bntsw05j6k7l", image: "bannerTriple/BannerTripleSwiper05.webp", imageSource: "design", mobile: "", title: "Banner Triplo Template 5 (carrossel)", description: "Três banners em carrossel", template: "5", pagina: ["home"], component: "BannerTripleSwiper05", path: "organisms/BannerTripleSwiper05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "03", selection: "banner-triple", key: "bntrp06m8n9p", image: "bannerTriple/BannerTriple06.webp", imageSource: "design", mobile: "", title: "Banner Triplo Template 6", description: "Três banners lado a lado", template: "6", pagina: ["home"], component: "BannerTriple06", path: "molecules/BannerTriple06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "04", selection: "category-triple", key: "cattrp06q1r2", image: "bannerTriple/CategoryTriple06.webp", imageSource: "auto", mobile: "", title: "Banner Triplo de Categorias Template 6", description: "Três categorias em carrossel", template: "6", pagina: ["home"], component: "CategoryTriple06", path: "molecules/CategoryTriple06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },
  bannerSolo: {
    name: "Banner Solo",
    items: [
      { id: "01", selection: "banner-solo", key: "bnsolo04s3t4", image: "bannerSolo/BannerSolo04.webp", imageSource: "design", mobile: "", title: "Banner Solo Template 4", description: "Banner único com título fixo e botão de ação", template: "4", pagina: ["home"], component: "BannerSolo04", path: "organisms/BannerSolo04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-solo-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
    ],
  },
  bannerSideLeft: {
    name: "Banner com texto",
    items: [
      { id: "01", selection: "banner-solo-left", key: "bnslft05w7x8", image: "bannerSideLeft/BannerSoloLeft05.webp", imageSource: "design", mobile: "", title: "Banner com texto Template 5", description: "Banner com bloco de texto alinhado à esquerda", template: "5", pagina: ["home"], component: "BannerSoloLeft05", path: "organisms/BannerSoloLeft05", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--banner-side-font", label: "Fonte da seção", type: "font", default: "'Roboto', Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "07", selection: "banner-solo-left", key: "bnslft07b2c3", image: "bannerSideLeft/BannerSoloLeft07.webp", imageSource: "auto", mobile: "", title: "Banner com texto Template 7", description: "Banner editorial em 2 colunas: imagem com citação e coluna de texto com link", template: "7", pagina: ["home"], component: "BannerSoloLeft07", path: "molecules/EditorialBanner07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
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
      { id: "01", selection: "special-offers", key: "spcofr04u5v6", image: "specialOffers/SpecialOffers04.webp", imageSource: "design", mobile: "", title: "Ofertas Especiais Template 4", description: "Bloco de ofertas com cartões de desconto", template: "4", pagina: ["home"], component: "SpecialOffers04", path: "organisms/SpecialOffers04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--special-offers-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
    ],
  },
  homeCombined: {
    name: "Combinações",
    items: [
      { id: "01", selection: "combined-categ", key: "homcmb04y9z0", image: "homeCombined/HomeCombined04.webp", imageSource: "design", mobile: "", title: "Combinações Template 4", description: "Bloco combinado de categorias, chamada e desconto", template: "4", pagina: ["home"], component: "HomeCombined04", path: "organisms/HomeCombined04", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--home-combined-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
    ],
  },
  categoryTabs: {
    name: "Abas de categoria",
    items: [
      { id: "06", selection: "category-tabs", key: "cattab06frc5", image: "categoryTabs/CategoryTabs06.webp", imageSource: "auto", mobile: "", title: "Abas de categoria Template 6", description: "Título, abas de categoria e carrossel de cards de modelo, com a segunda foto aparecendo no hover", template: "6", pagina: ["home"], component: "CategoryTabs06", path: "molecules/CategoryTabs06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--categorytabs-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categorytabs-title-font", label: "Fonte do título", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categorytabs-tab-color", label: "Cor da aba", type: "color", default: "#212721", group: "Botões", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categorytabs-tab-active-color", label: "Cor da aba ativa", type: "color", default: "#212721", group: "Botões", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categorytabs-tab-font", label: "Fonte das abas", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--categorytabs-button-bg", label: "Fundo do botão do card", type: "color", default: "#212721", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--categorytabs-button-text", label: "Texto do botão do card", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--categorytabs-dot-active-color", label: "Cor do ponto ativo", type: "color", default: "#212721", group: "Carrossel", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categorytabs-font", label: "Fonte do texto", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  categoryTitle: {
    name: "Título da categoria",
    items: [
      { id: "06", selection: "category-title", key: "cattit06frc7", image: "categoryTitle/CategoryTitle06.webp", imageSource: "design", mobile: "", title: "Título da categoria Template 6", description: "Linha com o nome da categoria e a contagem de produtos encontrados", template: "6", pagina: ["category"], component: "CategoryTitle06", path: "organisms/CategoryTitle06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--plp-text", label: "Cor do título e da contagem", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-title-font", label: "Fonte do título", type: "font", default: "'League Spartan', sans-serif", group: "Tipografia" },
        { cssVar: "--plp-font", label: "Fonte da contagem", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "category-title", key: "cattit09ed5h", image: "categoryTitle/CategoryTitle09.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 9", description: "Nome da categoria em serifa, a contagem de produtos e os chips de subcategoria em texto", template: "9", pagina: ["category"], component: "CategoryTitle09", path: "organisms/CategoryTitle09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo do título", type: "color", default: "#f7f4ef", group: "Título" },
        { cssVar: "--cat-title-text", label: "Texto do título", type: "color", default: "#1d1b18", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "category-title", key: "cattit10vr8j", image: "categoryTitle/CategoryTitle10.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 10", description: "Cartão na cor da marca com o nome da categoria, a contagem em pílula e os chips de subcategoria com a quantidade", template: "10", pagina: ["category"], component: "CategoryTitle10", path: "organisms/CategoryTitle10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo do título", type: "color", default: "#1340d8", group: "Título", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-title-text", label: "Texto do título", type: "color", default: "#ffffff", group: "Título", inheritsLabel: "cor de texto base" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "category-title", key: "cattit11gd8j", image: "categoryTitle/CategoryTitle11.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 11", description: "O nome da categoria em corpo grande com a contagem \"[48]\" e os chips de subcategoria em células de filetes, cada um com a quantidade", template: "11", pagina: ["category"], component: "CategoryTitle11", path: "organisms/CategoryTitle11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-title-text", label: "Texto e filetes do título", type: "color", default: "#0a0a0a", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "category-title", key: "cattit12sv2k", image: "categoryTitle/CategoryTitle12.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 12", description: "O nome da categoria centralizado em serifa grande, a contagem de produtos e os chips de subcategoria em pílulas: \"Todos\" cheio em vinho e cada subcategoria branca com a quantidade; no mobile, chips numa linha que rola de lado", template: "12", pagina: ["category"], component: "CategoryTitle12", path: "organisms/CategoryTitle12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-title-text", label: "Texto do título e dos chips", type: "color", default: "#3b1f33", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-title-accent", label: "Chip ativo", type: "color", default: "#7a2e5f", group: "Título", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "category-title", key: "cattit13nt4u", image: "categoryTitle/CategoryTitle13.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 13", description: "O nome da categoria enorme em condensada maiúscula, a contagem em verde ao pé dele e os chips de subcategoria com borda, cada um com a quantidade apagada; no mobile, os chips numa linha que rola de lado", template: "13", pagina: ["category"], component: "CategoryTitle13", path: "organisms/CategoryTitle13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo do título", type: "color", default: "#0d0d0d", group: "Título" },
        { cssVar: "--cat-title-text", label: "Texto do título e dos chips", type: "color", default: "#f4f4f0", group: "Título" },
        { cssVar: "--cat-title-accent", label: "Destaque (contagem)", type: "color", default: "#c8ff2e", group: "Título" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "category-title", key: "cattit14es4u", image: "categoryTitle/CategoryTitle14.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 14", description: "Faixa marinho com o nome da categoria enorme em Saira itálica, a contagem num paralelogramo lima e os chips de subcategoria em paralelogramo com a quantidade; ao fundo, o nome repetido em contorno vazado e um traço lima inclinado. No mobile, os chips numa linha que rola de lado", template: "14", pagina: ["category"], component: "CategoryTitle14", path: "organisms/CategoryTitle14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo da faixa", type: "color", default: "#0b1b33", group: "Título", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cat-title-text", label: "Texto do título e dos chips", type: "color", default: "#ffffff", group: "Título", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--cat-title-accent", label: "Destaque (contagem, traço e chip ativo)", type: "color", default: "#d9f99d", group: "Título", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--cat-title-title-font", label: "Fonte do nome, da contagem e dos chips", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte das quantidades", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "category-title", key: "ctt15lux1v6n", image: "categoryTitle/CategoryTitle15.webp", imageSource: "auto", mobile: "", title: "Título de categoria Template 15", description: "Cabeça centralizada da listagem: a categoria-mãe em versalete dourado, o nome grande em serifa, a contagem entre dois fios dourados e as subcategorias em chips com fio e a quantidade apagada; no mobile, os chips numa linha que rola de lado", template: "15", pagina: ["category"], component: "CategoryTitle15", path: "organisms/CategoryTitle15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo da cabeça", type: "color", default: "#faf8f4", group: "Título" },
        { cssVar: "--cat-title-text", label: "Texto da cabeça", type: "color", default: "#1a1714", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-title-accent", label: "Destaque (categoria-mãe e fios)", type: "color", default: "#7a5f1c", group: "Título", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "category-title", key: "ctt16inf1v3n", image: "categoryTitle/CategoryTitle16.webp", imageSource: "auto", mobile: "", title: "Título da categoria Template 16", description: "Faixa amarela com o nome da categoria grande e arredondado, a contagem num selo roxo inclinado, as subcategorias em pílulas brancas com filete e a quantidade apagada, e a onda creme no pé. No mobile, as pílulas rolam de lado", template: "16", pagina: ["category"], component: "CategoryTitle16", path: "organisms/CategoryTitle16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-title-bg", label: "Fundo da faixa", type: "color", default: "#ffc93c", group: "Título", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cat-title-text", label: "Texto da faixa", type: "color", default: "#2a2350", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-title-accent", label: "Destaque (selo da contagem)", type: "color", default: "#5b4bdb", group: "Título", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-title-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-title-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  productBanner: {
    name: "Banner do produto",
    items: [
      { id: "01", selection: "product-banner", key: "pdb01vtx4k5l", image: "productBanner/ProductBanner01.webp", imageSource: "design", mobile: "", title: "Banner do produto Template 1", description: "Banner livre do produto, cadastrado no campo descriptionBanner da VTEX; arte separada para desktop e mobile", template: "1", pagina: ["product"], component: "ProductBanner01", path: "molecules/ProductDescriptionBanner01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },

  productLines: {
    name: "Outras linhas",
    items: [
      { id: "06", selection: "product-lines", key: "lin06frc2m3n", image: "productLines/BannerCarousel06.webp", imageSource: "design", mobile: "", title: "Outras linhas Template 6", description: "Título à esquerda e carrossel de cards de linha com CTA sobreposto: 4 por página no desktop, 1 no mobile", template: "6", pagina: ["home"], component: "BannerCarousel06", path: "molecules/BannerCarousel06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
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
      { id: "06", selection: "help-float", key: "hlp06frc7g8h", image: "helpFloat/HelpFloat06.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 6", description: "Barra fixa na borda direita com WhatsApp, trocas, rastreio e horário; recolhida mostra só os ícones", template: "6", pagina: ["home"], component: "HelpFloat06", path: "organisms/HelpFloatButton06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo da barra", type: "color", default: "#37343b", group: "Ajuda flutuante", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--help-text", label: "Texto e ícones", type: "color", default: "#ffffff", group: "Ajuda flutuante", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--help-header-bg", label: "Fundo do cabeçalho", type: "color", default: "#ffffff", group: "Ajuda flutuante" },
        { cssVar: "--help-header-text", label: "Texto do cabeçalho", type: "color", default: "#212721", group: "Ajuda flutuante", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-divider", label: "Divisória entre itens", type: "color", default: "#828282", group: "Ajuda flutuante" },
        { cssVar: "--help-font", label: "Fonte", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "help-float", key: "hlp09edt6c1v", image: "helpFloat/HelpFloat09.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 9", description: "Botão \"Ajuda\" fixo no canto inferior direito que abre um painel com atalhos em link ou texto e a linha de horário", template: "9", pagina: ["home"], component: "HelpFloat09", path: "organisms/HelpFloatButton09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel de ajuda aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#1d1b18", group: "Painel", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-header-bg", label: "Fundo do botão e do topo do painel", type: "color", default: "#1d1b18", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e do topo do painel", type: "color", default: "#f7f4ef", group: "Botão", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel de ajuda aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "help-float", key: "hlp10vrj2d9s", image: "helpFloat/HelpFloat10.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 10", description: "Botão redondo fixo no canto inferior direito com o balão \"Precisa de ajuda?\"; abre o painel \"Atendimento\" com atalhos em link ou texto e o horário", template: "10", pagina: ["home"], component: "HelpFloat10", path: "organisms/HelpFloatButton10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#101828", group: "Painel", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-header-bg", label: "Fundo do botão e do topo do painel", type: "color", default: "#1340d8", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e do topo do painel", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "help-float", key: "hlp11grd2d9s", image: "helpFloat/HelpFloat11.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 11", description: "Botão retangular fixo no canto inferior direito (\"Ajuda [?]\"); abre o painel com a cabeça escura e o fechar quadrado, o horário em mono e os atalhos numerados ([01]…) entre filetes, com detalhe e seta", template: "11", pagina: ["home"], component: "HelpFloat11", path: "organisms/HelpFloatButton11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto e filetes do painel", type: "color", default: "#0a0a0a", group: "Painel", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-header-bg", label: "Fundo do botão e da cabeça do painel", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e da cabeça do painel", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--help-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "help-float", key: "hlp12suv4w6c", image: "helpFloat/HelpFloat12.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 12", description: "Pílula vinho fixa no canto inferior direito com o \"?\" e \"Ajuda\"; aberta, vira o círculo com o X e sobe o painel branco arredondado com a cabeça vinho (título em serifa e horário) e os atalhos com chevron entre filetes, o destaque em negrito na cor de acento", template: "12", pagina: ["home"], component: "HelpFloat12", path: "organisms/HelpFloatButton12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#3b1f33", group: "Painel", inheritsLabel: "cor de texto primária" },
        { cssVar: "--help-header-bg", label: "Fundo do botão e da cabeça do painel", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e da cabeça do painel", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "help-float", key: "hlp13ntr6y1d", image: "helpFloat/HelpFloat13.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 13", description: "Quadrado verde fixo no canto inferior direito com o \"?\"; aberto, sobe o painel grafite com filete, o título em condensada, o horário e o fechar quadrado, e os atalhos em condensada maiúscula com ícone e seta, o destaque no bloco verde. No mobile, o painel ocupa a largura e a página escurece por trás", template: "13", pagina: ["home"], component: "HelpFloat13", path: "organisms/HelpFloatButton13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#171717", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#f4f4f0", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-header-bg", label: "Fundo do botão e do destaque", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--help-header-text", label: "Texto do botão e do destaque", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "help-float", key: "hlp14esp2y6d", image: "helpFloat/HelpFloat14.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 14", description: "Paralelogramo marinho fixo no canto inferior direito com o balão; aberto, sobe o painel branco com sombra: cabeça marinho com o título em Saira itálica e o horário, e os atalhos em linhas com o ícone numa caixa cinza, o rótulo, a linha de apoio e a seta. No mobile, a página escurece e o painel ocupa a largura preso ao pé", template: "14", pagina: ["home"], component: "HelpFloat14", path: "organisms/HelpFloatButton14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#0b1b33", group: "Painel", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-header-bg", label: "Fundo do botão e da cabeça", type: "color", default: "#0b1b33", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e da cabeça", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-title-font", label: "Fonte do título", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "help-float", key: "hlp15lux6y1d", image: "helpFloat/HelpFloat15.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 15", description: "Quadrado escuro fixo no canto com o balão; aberto, sobe o painel \"Concierge\" com o cabeçalho escuro (título em serifa, horário e fechar) e os atalhos com ícone, rótulo e seta entre fios. No mobile, folha presa ao pé sobre o véu", template: "15", pagina: ["home"], component: "HelpFloat15", path: "organisms/HelpFloatButton15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#faf8f4", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#1a1714", group: "Painel", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-header-bg", label: "Fundo do botão e do cabeçalho", type: "color", default: "#1a1714", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e do cabeçalho", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "help-float", key: "hlp16inf7y4d", image: "helpFloat/HelpFloat16.webp", imageSource: "auto", mobile: "", title: "Ajuda flutuante Template 16", description: "Botão redondo roxo com o balão \"?\", borda e sombra chapada no canto; aberto, o painel branco arredondado com filete, a cabeça roxa com o título, o horário e o fechar redondo, e os atalhos em cartões com ícone e seta. No mobile, o painel quase na largura toda sobre o véu", template: "16", pagina: ["home"], component: "HelpFloat16", path: "organisms/HelpFloatButton16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--help-header-bg", label: "Fundo do botão e da cabeça", type: "color", default: "#5b4bdb", group: "Ajuda", inheritsLabel: "cor primária da marca" },
        { cssVar: "--help-header-text", label: "Texto do botão e da cabeça", type: "color", default: "#ffffff", group: "Ajuda", inheritsLabel: "cor de texto base" },
        { cssVar: "--help-bg", label: "Fundo do painel", type: "color", default: "#ffffff", group: "Painel", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-text", label: "Texto do painel", type: "color", default: "#2a2350", group: "Painel", inheritsLabel: "cor de texto primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece com o painel aberto." },
        { cssVar: "--help-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  popupNews: {
    name: "Pop-up de newsletter",
    items: [
      { id: "06", selection: "popup-news", key: "popnew06frc1", image: "popupNews/PopupNews06.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 6", description: "Modal de captura de lead com arte à esquerda, título com trecho destacado, quatro campos e rodapé legal; aparece só no desktop", template: "6", pagina: ["home"], component: "PopupNews06", path: "organisms/PopupNews06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#ffffff", group: "Formulário", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-title-font", label: "Fonte do título", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-text-color", label: "Cor do texto", type: "color", default: "#212721", group: "Formulário", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#000000", group: "Botão", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
        { cssVar: "--popup-error-color", label: "Cor do aviso de erro", type: "color", default: "#b00020", group: "Formulário", previewNote: "Pinta a mensagem de erro do formulário; o preview não dispara esse estado." },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária", previewNote: "Só na visão Desktop: o popup não abre abaixo de 1024px (no tema real também não)." },
      ] },
      { id: "09", selection: "popup-news", key: "popnew09ed2x", image: "popupNews/PopupNews09.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 9", description: "Modal com a arte à esquerda, chamada, título com trecho em itálico, nome e e-mail e o botão cheio; no mobile, folha presa ao pé da tela com a arte no topo", template: "9", pagina: ["home"], component: "PopupNews09", path: "organisms/PopupNews09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#f7f4ef", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#1d1b18", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#1d1b18", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#f7f4ef", group: "Botão", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "popup-news", key: "popnew10vr6t", image: "popupNews/PopupNews10.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 10", description: "Modal com a faixa de destaque (chamada, título grande e subtítulo), o cupom em caixa tracejada, nome e e-mail com rótulo, o botão, a política e \"Agora não\"; no mobile, folha presa ao pé da tela", template: "10", pagina: ["home"], component: "PopupNews10", path: "organisms/PopupNews10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#ffffff", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#101828", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-accent", label: "Fundo da faixa de destaque", type: "color", default: "#ffcf24", group: "Pop-up", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#1340d8", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "popup-news", key: "popnew11gd7t", image: "popupNews/PopupNews11.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 11", description: "Modal em duas células de filetes: a arte à esquerda e, à direita, a régua \"[Journal]\" com o fechar quadrado, o título, o texto, nome e e-mail com rótulo em mono, \"Inscrever\", a política e \"Agora não\"; no mobile, folha presa ao pé da tela", template: "11", pagina: ["home"], component: "PopupNews11", path: "organisms/PopupNews11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#ffffff", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto e filetes do pop-up", type: "color", default: "#0a0a0a", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "popup-news", key: "popnew12sv8r", image: "popupNews/PopupNews12.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 12", description: "Modal arredondado em duas colunas: a arte num arco sobre o rosado e, à direita, o selo \"Primeira compra\", o título em serifa, o texto, nome e e-mail em pílulas com rótulo, \"Quero meu cupom\", \"Agora não\" e a política; fechar redondo no canto. No mobile, folha presa ao pé com a alça", template: "12", pagina: ["home"], component: "PopupNews12", path: "organisms/PopupNews12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#ffffff", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#3b1f33", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "popup-news", key: "popnew13nt2v", image: "popupNews/PopupNews13.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 13", description: "Modal preto com filete: a arte numa coluna à esquerda e, à direita, o selo verde, o título gigante em condensada, o texto, nome e e-mail em caixas de filete claro, \"Quero entrar\" no verde, a política e \"Agora não\". No mobile, folha presa ao pé com o filete verde em cima", template: "13", pagina: ["home"], component: "PopupNews13", path: "organisms/PopupNews13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#0d0d0d", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#f4f4f0", group: "Pop-up" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--popup-title-font", label: "Fonte do título e do botão", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "popup-news", key: "popnew14es8v", image: "popupNews/PopupNews14.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 14", description: "Modal branco sobre o véu marinho: a arte numa coluna cortada em diagonal e, ao lado, o selo lima, o título em Saira itálica com o destaque num paralelogramo vermelho, o texto, nome e e-mail em caixas cinza com filete grosso embaixo, \"Quero meu cupom\" no paralelogramo vermelho com a seta, a política e \"Agora não\". No mobile, folha presa ao pé com a arte numa faixa cortada em diagonal", template: "14", pagina: ["home"], component: "PopupNews14", path: "organisms/PopupNews14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#ffffff", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#0b1b33", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-accent", label: "Fundo do selo", type: "color", default: "#d9f99d", group: "Pop-up", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão e do destaque", type: "color", default: "#e4002b", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão e do destaque", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte do selo, do título e do botão", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "popup-news", key: "popnew15lx2v", image: "popupNews/PopupNews15.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 15", description: "Modal creme com a arte numa coluna à esquerda e o fio dourado por dentro do painel: a chamada em versalete dourado, o título em serifa com o trecho em itálico, o texto, nome e e-mail com rótulo e linha fina, o botão dourado, a política e \"Agora não\". No mobile, folha presa ao pé com a arte no topo e o fechar sobre ela", template: "15", pagina: ["home"], component: "PopupNews15", path: "organisms/PopupNews15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#faf8f4", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto do pop-up", type: "color", default: "#1a1714", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão (e fio dourado)", type: "color", default: "#7a5f1c", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "popup-news", key: "popnew16if3v", image: "popupNews/PopupNews16.webp", imageSource: "auto", mobile: "", title: "Pop-up de newsletter Template 16", description: "Modal creme arredondado com filete e sombra chapada; à esquerda a arte com o selo coral redondo e inclinado (\"10% off\"); à direita o fechar redondo, o título arredondado, o texto, Nome e E-mail em pílulas brancas com rótulo, \"Quero meu cupom\" em roxo, a política e \"Agora não\". No mobile, a folha sobe do pé", template: "16", pagina: ["home"], component: "PopupNews16", path: "organisms/PopupNews16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--popup-bg", label: "Fundo do pop-up", type: "color", default: "#fffbf2", group: "Pop-up" },
        { cssVar: "--popup-text", label: "Texto e bordas", type: "color", default: "#2a2350", group: "Pop-up", inheritsLabel: "cor de texto primária" },
        { cssVar: "--popup-accent", label: "Destaque (selo do desconto)", type: "color", default: "#ff6f61", group: "Pop-up", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--popup-button-bg", label: "Fundo do botão", type: "color", default: "#5b4bdb", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--popup-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--popup-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--popup-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  buySize: {
    name: "Compre por tamanho",
    items: [
      { id: "06", selection: "buy-size", key: "bsz06frc5e6f", image: "buySize/BuySize06.webp", imageSource: "auto", mobile: "", title: "Compre por tamanho Template 6", description: "Título centrado, fileira de chips de tamanho e link para a lista completa", template: "6", pagina: ["home"], component: "BuySize06", path: "molecules/Categories06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--categories-bg", label: "Fundo da seção", type: "color", default: "#f6f6f6", group: "Compre por tamanho", optional: true },
        { cssVar: "--categories-title-color", label: "Cor do título", type: "color", default: "#212721", group: "Compre por tamanho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-text", label: "Texto dos chips e do link", type: "color", default: "#212721", group: "Compre por tamanho", inheritsLabel: "cor de texto primária" },
        { cssVar: "--categories-font", label: "Fonte do título e dos chips", type: "font", default: "'Fabriga', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
    ],
  },

  newsletter: {
    name: "Newsletter",
    items: [
      { id: "07", selection: "newsletter", key: "nlt07bru3c4d", image: "newsletter/Newsletter07.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 7", description: "Captura de e-mail em 2 colunas no desktop e empilhada no mobile, com conteúdos próprios por breakpoint", template: "7", pagina: ["home"], component: "Newsletter07", path: "organisms/Newsletter07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--newsletter-title-color", label: "Cor do título", type: "color", default: "#2c2420", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-accent", label: "Cor do rótulo", type: "color", default: "#b8976a", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-desc-color", label: "Cor do parágrafo", type: "color", default: "#6a5e58", group: "Newsletter", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--newsletter-note-color", label: "Cor do aviso", type: "color", default: "#8c7d74", group: "Newsletter", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Formulário", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Formulário", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-input-bg", label: "Fundo do campo", type: "color", default: "#fff", group: "Formulário" },
        { cssVar: "--newsletter-input-text", label: "Texto do campo", type: "color", default: "#4a3f38", group: "Formulário", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-input-border", label: "Borda do campo", type: "color", default: "#d8c9b8", group: "Formulário" },
        { cssVar: "--newsletter-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "08", selection: "newsletter", key: "nlt08sra2h7k", image: "newsletter/Newsletter08.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 8", description: "Painel de texto e formulário de nome e e-mail lado a lado", template: "8", pagina: ["home"], component: "Newsletter08", path: "organisms/Newsletter08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--newsletter-bg", label: "Fundo do formulário", type: "color", default: "#ffffff", group: "Newsletter" },
        { cssVar: "--newsletter-panel-bg", label: "Fundo do painel de texto", type: "color", default: "#f6f6fa", group: "Newsletter" },
        { cssVar: "--newsletter-title-color", label: "Títulos e campos", type: "color", default: "#0f0f0f", group: "Newsletter" },
        { cssVar: "--newsletter-desc-color", label: "Texto do painel", type: "color", default: "#525252", group: "Newsletter" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#000000", group: "Formulário" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Formulário" },
        { cssVar: "--newsletter-font", label: "Fonte da newsletter", type: "font", default: "'Manrope', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "newsletter", key: "nlt09edt4d9f", image: "newsletter/Newsletter09.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 9", description: "Chamada, título com trecho em itálico, texto, nome e e-mail sublinhados e \"Assinar\" (link sublinhado no desktop, botão cheio no mobile), com a linha da política de privacidade", template: "9", pagina: ["home"], component: "Newsletter09", path: "organisms/Newsletter09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da newsletter", type: "color", default: "#f7f4ef", group: "Newsletter" },
        { cssVar: "--newsletter-title-color", label: "Título", type: "color", default: "#1d1b18", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-desc-color", label: "Texto de apoio", type: "color", default: "#5e574f", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "newsletter", key: "nlt10vrj4c7d", image: "newsletter/Newsletter10.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 10", description: "Faixa azul com o ícone de envelope, título com o cupom em destaque, texto, nome e e-mail com rótulo, o botão no acento e a linha da política de privacidade; no mobile, tudo empilhado com botão largo", template: "10", pagina: ["home"], component: "Newsletter10", path: "organisms/Newsletter10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "tertiary"], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da newsletter", type: "color", default: "#1340d8", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--newsletter-title-color", label: "Título", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--newsletter-desc-color", label: "Texto de apoio", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#ffcf24", group: "Botão", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#101828", group: "Botão", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "newsletter", key: "nlt11grd4c7d", image: "newsletter/Newsletter11.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 11", description: "Caixa de filetes com chamada, título grande e nota à esquerda; à direita, o texto, nome e e-mail lado a lado com rótulo em mono, \"Inscrever\" e a política de privacidade; no mobile, campos empilhados", template: "11", pagina: ["home"], component: "Newsletter11", path: "organisms/Newsletter11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da newsletter", type: "color", default: "#ffffff", group: "Newsletter" },
        { cssVar: "--newsletter-title-color", label: "Título", type: "color", default: "#0a0a0a", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-desc-color", label: "Texto de apoio e filetes", type: "color", default: "#0a0a0a", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "newsletter", key: "nlt12suv1s5f", image: "newsletter/Newsletter12.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 12", description: "Painel rosado arredondado com a arte num arco e o formulário: título em serifa, texto, nome e e-mail em pílulas brancas com rótulo, \"Quero meu cupom\" e a política na mesma linha; no mobile, uma coluna com a arte centrada e o botão largo", template: "12", pagina: ["home"], component: "Newsletter12", path: "organisms/Newsletter12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--newsletter-panel-bg", label: "Fundo do painel", type: "color", default: "#f4dcd6", group: "Newsletter", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--newsletter-title-color", label: "Título e texto", type: "color", default: "#3b1f33", group: "Newsletter", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "newsletter", key: "nlt13ntr1e7q", image: "newsletter/Newsletter13.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 13", description: "Faixa verde em toda a largura: à esquerda o título gigante em condensada e o texto; à direita nome e e-mail com rótulo e caixa de borda preta, o botão preto \"Entrar\" com o texto verde e a política; no mobile, tudo numa coluna", template: "13", pagina: ["home"], component: "Newsletter13", path: "organisms/Newsletter13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da faixa", type: "color", default: "#c8ff2e", group: "Newsletter" },
        { cssVar: "--newsletter-title-color", label: "Título", type: "color", default: "#0d0d0d", group: "Newsletter" },
        { cssVar: "--newsletter-desc-color", label: "Texto e rótulos", type: "color", default: "#0d0d0d", group: "Newsletter" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--newsletter-title-font", label: "Fonte do título, do campo e do botão", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "newsletter", key: "nlt14esp1e7q", image: "newsletter/Newsletter14.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 14", description: "Faixa vermelha com a faixa marinho inclinada à direita: à esquerda o título em Saira itálica e o texto; à direita nome e e-mail com rótulo em caixas brancas e o botão marinho em paralelogramo na mesma linha, com a política embaixo; no mobile, tudo numa coluna", template: "14", pagina: ["home"], component: "Newsletter14", path: "organisms/Newsletter14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da faixa", type: "color", default: "#e4002b", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-title-color", label: "Título e caixas", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-desc-color", label: "Texto e rótulos", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão e da faixa inclinada", type: "color", default: "#0b1b33", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "newsletter", key: "nws15lux5j7a", image: "newsletter/Newsletter15.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 15", description: "Faixa areia centralizada: a chamada entre fios, o título em serifa com o trecho em itálico e o texto; nome e e-mail com rótulo em versalete e linha, \"Assinar\" cheio e a política. No mobile, os campos empilhados", template: "15", pagina: ["home"], component: "Newsletter15", path: "organisms/Newsletter15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da seção", type: "color", default: "#efe8db", group: "Newsletter" },
        { cssVar: "--newsletter-title-color", label: "Título e campos", type: "color", default: "#1a1714", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-desc-color", label: "Texto de apoio", type: "color", default: "#4a433c", group: "Newsletter", inheritsLabel: "cor de texto primária" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão", type: "color", default: "#1a1714", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "newsletter", key: "nws16inf5j1a", image: "newsletter/Newsletter16.webp", imageSource: "auto", mobile: "", title: "Newsletter Template 16", description: "Faixa roxa entre ondas creme: o selo amarelo redondo e girado, o título \"Entre para o clubinho\" e o texto; à direita Nome e E-mail em pílulas brancas com rótulo, o botão amarelo com sombra chapada e a política. No mobile, uma coluna", template: "16", pagina: ["home"], component: "Newsletter16", path: "organisms/Newsletter16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--newsletter-bg", label: "Fundo da faixa", type: "color", default: "#5b4bdb", group: "Newsletter", inheritsLabel: "cor primária da marca" },
        { cssVar: "--newsletter-title-color", label: "Título", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-desc-color", label: "Texto", type: "color", default: "#ffffff", group: "Newsletter", inheritsLabel: "cor de texto base" },
        { cssVar: "--newsletter-button-bg", label: "Fundo do botão e do selo", type: "color", default: "#ffc93c", group: "Botão", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--newsletter-button-text", label: "Texto do botão e do selo", type: "color", default: "#2a2350", group: "Botão", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--newsletter-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--newsletter-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  rooms: {
    name: "Ambientes",
    items: [
      { id: "07", selection: "rooms", key: "room07bru1a2", image: "rooms/ShopByRoom07.webp", imageSource: "auto", mobile: "", title: "Ambientes Template 7", description: "Escolha por ambiente: rótulo, título e botões de navegação com um ativo", template: "7", pagina: ["home"], component: "ShopByRoom07", path: "organisms/ShopByRoom07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary", "primary"], variablesSchema: [
        { cssVar: "--room-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Ambientes", optional: true },
        { cssVar: "--room-accent", label: "Cor do rótulo", type: "color", default: "#b8976a", group: "Ambientes", inheritsLabel: "cor primária da marca" },
        { cssVar: "--room-title-color", label: "Cor do título", type: "color", default: "#2c2420", group: "Ambientes", inheritsLabel: "cor de texto primária" },
        { cssVar: "--room-pill-active-bg", label: "Fundo do botão ativo", type: "color", default: "#2c2420", group: "Botões", inheritsLabel: "cor primária da marca" },
        { cssVar: "--room-pill-active-text", label: "Texto do botão ativo", type: "color", default: "#f5f0e8", group: "Botões", inheritsLabel: "cor de texto base" },
        { cssVar: "--room-pill-text", label: "Texto do botão", type: "color", default: "#4a3f38", group: "Botões", inheritsLabel: "cor de texto primária" },
        { cssVar: "--room-pill-border", label: "Borda do botão", type: "color", default: "#c8baa8", group: "Botões" },
        { cssVar: "--room-title-font", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--room-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  review: {
    name: "Depoimentos",
    items: [
      { id: "01", selection: "client-review", key: "rev06b1c2d3e", image: "review/ClientReview06.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 6", description: "Carrossel de depoimentos de clientes", template: "6", pagina: ["home"], component: "ClientReview06", path: "organisms/ClientReview06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--review-font", label: "Fonte da seção", type: "font", default: "inherit", group: "Tipografia" },
      ] },
      { id: "07", selection: "client-review", key: "rev07bru9s8t", image: "review/ClientReview07.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 7", description: "Prova social centralizada: número em destaque, subtítulo, estrelas e nota", template: "7", pagina: ["home"], component: "ClientReview07", path: "molecules/SocialProof07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary", "primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Depoimentos", optional: true },
        { cssVar: "--socialproof-number-color", label: "Cor do número", type: "color", default: "#2c2420", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-muted", label: "Cor do subtítulo e da nota", type: "color", default: "#8c7d74", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Cor das estrelas", type: "color", default: "#b8976a", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte do número", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "client-review", key: "rev09edt8t3c", image: "review/ClientReview09.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 9", description: "Um depoimento por vez em serifa itálica, com estrelas, nome · cidade e a peça comprada; setas e o contador 02 / 05 trocam o depoimento", template: "9", pagina: ["home"], component: "ClientReview09", path: "organisms/ClientReview09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#f7f4ef", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto dos depoimentos", type: "color", default: "#1d1b18", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "client-review", key: "rev10vrj2t9h", image: "review/ClientReview10.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 10", description: "Título, subtítulo e setas; três cartões por vez com estrelas, título, depoimento e, no pé, a miniatura e o nome do produto com nome · cidade; no mobile, cartões rolando de lado e pontos", template: "10", pagina: ["home"], component: "ClientReview10", path: "organisms/ClientReview10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#f2f4f7", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto dos depoimentos", type: "color", default: "#101828", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Estrelas", type: "color", default: "#b54708", group: "Depoimentos" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "client-review", key: "rev11grd2t9h", image: "review/ClientReview11.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 11", description: "Cabeça de filetes com título e setas; três depoimentos por vez em células da grade, com estrelas e nota, o texto e, no pé, nome · cidade e a peça (miniatura, referência \"N°\" e nome); no mobile, as células rolam de lado", template: "11", pagina: ["home"], component: "ClientReview11", path: "organisms/ClientReview11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto e filetes dos depoimentos", type: "color", default: "#0a0a0a", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Estrelas", type: "color", default: "#0a0a0a", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "client-review", key: "rev12suv3x7d", image: "review/ClientReview12.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 12", description: "Título e subtítulo à esquerda e as setas à direita; três cartões por vez com as iniciais num círculo pastel, nome, cidade, estrelas, selo, o texto e a pílula do produto citado; no mobile, cartões rolando de lado com pontos", template: "12", pagina: ["home"], component: "ClientReview12", path: "organisms/ClientReview12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#fbf6f3", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto dos depoimentos", type: "color", default: "#3b1f33", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Destaque (estrelas e seta)", type: "color", default: "#7a2e5f", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "client-review", key: "rev13ntr3d8h", image: "review/ClientReview13.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 13", description: "Cabeça em linha com o título gigante e as setas quadradas com filete; três depoimentos por vez em cartões grafite com filete: estrelas verdes, o texto e, depois de um filete, a foto quadrada, o perfil com a cidade e o produto citado. No mobile, os cartões rolam de lado com a régua de traços", template: "13", pagina: ["home"], component: "ClientReview13", path: "organisms/ClientReview13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto dos depoimentos", type: "color", default: "#f4f4f0", group: "Depoimentos" },
        { cssVar: "--socialproof-accent", label: "Destaque (estrelas e régua)", type: "color", default: "#c8ff2e", group: "Depoimentos" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "client-review", key: "rev14esp3d8h", image: "review/ClientReview14.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 14", description: "Título em Saira itálica e as setas em paralelogramo; três depoimentos por vez em cartões cinza-azulados com o selo vermelho das aspas, as estrelas vermelhas, o texto e, depois de um filete, o nome com a cidade e o produto citado. No mobile, os cartões rolam de lado com as barras inclinadas embaixo", template: "14", pagina: ["home"], component: "ClientReview14", path: "organisms/ClientReview14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto dos depoimentos", type: "color", default: "#0b1b33", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Destaque (aspas, estrelas e barra atual)", type: "color", default: "#e4002b", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "client-review", key: "rev15lux3t8k", image: "review/ClientReview15.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 15", description: "Faixa areia com a cabeça centralizada e três depoimentos por vez em colunas com fio à esquerda: as estrelas douradas, a citação em serifa itálica entre aspas, o fio dourado, o nome e a cidade em versalete e o produto citado; as setas embaixo. No mobile, um por vez com \"1 / 3\"", template: "15", pagina: ["home"], component: "ClientReview15", path: "organisms/ClientReview15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#efe8db", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Destaque (estrelas e fios)", type: "color", default: "#7a5f1c", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos e das citações", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "client-review", key: "rev16inf3t5k", image: "review/ClientReview16.webp", imageSource: "auto", mobile: "", title: "Depoimentos Template 16", description: "Título e as setas redondas; três cartões brancos por vez com filete, sombra chapada e um leve giro: estrelas, o texto e, depois do tracejado, a foto redonda, o nome com a cidade e o produto citado. No mobile, os cartões rolam de lado com os pontos embaixo", template: "16", pagina: ["home"], component: "ClientReview16", path: "organisms/ClientReview16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--socialproof-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Depoimentos" },
        { cssVar: "--socialproof-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Depoimentos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--socialproof-accent", label: "Destaque (estrelas e setas)", type: "color", default: "#5b4bdb", group: "Depoimentos", inheritsLabel: "cor primária da marca" },
        { cssVar: "--socialproof-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--socialproof-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },

  // CATEGORY
  categoryMain: {
    name: "Grade de produtos",
    items: [
      { id: "01", selection: "category-main", key: "catmn01ll098", image: "categoryMain/CategoryMain01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryMain01", path: "organisms/MainCategory01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Cor do texto", type: "color", default: "#141414", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-btn-bg", label: "Cor do botão de filtro", type: "color", default: "#122161", group: "Botões", inheritsLabel: "cor secundária da marca", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--cat-main-btn-text", label: "Texto do botão de filtro", type: "color", default: "#ffffff", group: "Botões", inheritsLabel: "cor de texto secundária", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--cat-main-accent", label: "Cor de destaque (paginação)", type: "color", default: "#682a77", group: "Destaque", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-main-page-text", label: "Texto da paginação ativa", type: "color", default: "#ffffff", group: "Destaque", inheritsLabel: "cor de texto base" },
        { cssVar: "--cat-main-font", label: "Fonte", type: "font", default: "'Poppins', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "02", selection: "category-main", key: "catmn0254hg3", image: "categoryMain/CategoryMain02.webp", imageSource: "auto", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["category"], component: "CategoryMain02", path: "organisms/MainCategory02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--cat-main-font", label: "Fonte da listagem", type: "font", default: "Roboto, Arial, Helvetica, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "06", selection: "category-main", key: "catmn06frc9d", image: "categoryMain/CategoryMain06.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 6", description: "PLP com trilha e contagem, título da categoria, barra com seletor de densidade e botão de filtros, e grade de cards com carrossel de fotos, selo, seletor de tamanho no hover e lista de desejos", template: "6", pagina: ["category"], component: "CategoryMain06", path: "organisms/MainCategory06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--plp-text", label: "Cor do título e da contagem", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-title-font", label: "Fonte do título", type: "font", default: "'League Spartan', sans-serif", group: "Tipografia" },
        { cssVar: "--plp-font", label: "Fonte da listagem", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--plp-btn-bg", label: "Fundo do botão de filtros", type: "color", default: "#212721", group: "Botões", inheritsLabel: "cor primária da marca" },
        { cssVar: "--plp-btn-text", label: "Texto do botão de filtros", type: "color", default: "#ffffff", group: "Botões", inheritsLabel: "cor de texto base" },
        { cssVar: "--plp-toggle-idle", label: "Seletor de colunas — inativo", type: "color", default: "#c6c6c6", group: "Botões" },
        { cssVar: "--plp-toggle-active", label: "Seletor de colunas — ativo", type: "color", default: "#000000", group: "Botões" },
        { cssVar: "--shelf-text-color", label: "Cor dos textos do card", type: "color", default: "#212721", group: "Textos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--shelf-font", label: "Fonte do card", type: "font", default: "'Jost', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
        { cssVar: "--shelf-text", label: "Traço ativo das fotos", type: "color", default: "#212721", group: "Carrossel", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--shelf-flag-color", label: "Texto do selo", type: "color", default: "#212721", group: "Etiquetas", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--shelf-flag-bg", label: "Fundo do selo no mobile", type: "color", default: "#000000", group: "Etiquetas", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--shelf-flag-text", label: "Texto do selo no mobile", type: "color", default: "#ffffff", group: "Etiquetas", inheritsLabel: "cor de texto base", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--shelf-wishlist-color", label: "Cor do coração", type: "color", default: "#212721", group: "Botões", inheritsLabel: "cor de texto primária" },
        { cssVar: "--shelf-icon-bg", label: "Fundo do botão de carrinho", type: "color", default: "#ffffff", group: "Botões", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--shelf-btn-bg", label: "Fundo do botão da folha de tamanho", type: "color", default: "#212721", group: "Seletor de tamanho", inheritsLabel: "cor primária da marca", previewNote: "Do modal de tamanho do card, que o preview não abre." },
        { cssVar: "--shelf-btn-text", label: "Texto do botão da folha de tamanho", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto base", previewNote: "Do modal de tamanho do card, que o preview não abre." },
        { cssVar: "--shelf-btn-disabled-text", label: "Texto do botão desabilitado", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto secundária", previewNote: "Do modal de tamanho do card, que o preview não abre." },
        { cssVar: "--shelf-chip-text", label: "Texto do tamanho selecionado", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto secundária", previewNote: "Do modal de tamanho do card, que o preview não abre." },
      ] },
      { id: "07", selection: "category-main", key: "catmn07bru8p", image: "categoryMain/CategoryMain07.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 7", description: "PLP completa: trilha, título, subcategorias, sidebar de filtros com faixa de preço, barra de ordenação e grade de cards", template: "7", pagina: ["category"], component: "CategoryMain07", path: "organisms/MainCategory07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--plp-title-color", label: "Cor do título e dos textos", type: "color", default: "#2c2420", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Listagem", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--plp-cta-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--plp-cta-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Listagem", inheritsLabel: "cor de texto base" },
        { cssVar: "--plp-font-title", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--plp-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "category-main", key: "catmn09edt7k", image: "categoryMain/CategoryMain09.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 9", description: "PLP com filtros na lateral (categoria, marca, tamanho, cor, preço), chips ativos, ordenação e grade de cards; no mobile, painel de filtros; inclui o estado vazio da busca", template: "9", pagina: ["category"], component: "CategoryMain09", path: "organisms/MainCategory09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#1d1b18", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros ativos)", type: "color", default: "#9c4a2f", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo do painel de filtros", type: "color", default: "#ffffff", group: "Filtros", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--filter-text", label: "Texto do painel de filtros", type: "color", default: "#1d1b18", group: "Filtros", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos do painel de filtros", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "category-main", key: "catmn10vrj3q", image: "categoryMain/CategoryMain10.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 10", description: "PLP com barra de contagem, ordenação, itens por página e grade/lista, chips ativos, filtros na lateral (categoria, marca, tamanho, cor, preço), grade de cards e paginação; no mobile, painel de filtros; inclui o estado vazio da busca", template: "10", pagina: ["category"], component: "CategoryMain10", path: "organisms/MainCategory10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#101828", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros ativos e paginação)", type: "color", default: "#1340d8", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo do painel de filtros", type: "color", default: "#ffffff", group: "Filtros", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--filter-text", label: "Texto do painel de filtros", type: "color", default: "#101828", group: "Filtros", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--filter-accent", label: "Destaque do painel de filtros", type: "color", default: "#1340d8", group: "Filtros", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "category-main", key: "catmn11grd3q", image: "categoryMain/CategoryMain11.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 11", description: "PLP com barra de filetes (\"Filtros (n)\", \"Ordenar\", densidade 2 | 4 colunas e a contagem), chips ativos, a grade de cards em filetes e \"Carregar mais\" com a barra de progresso; filtros em gaveta (tela cheia no mobile); inclui o estado vazio da busca", template: "11", pagina: ["category"], component: "CategoryMain11", path: "organisms/MainCategory11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Texto e filetes da listagem", type: "color", default: "#0a0a0a", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros ativos)", type: "color", default: "#ff4f00", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo do painel de filtros", type: "color", default: "#ffffff", group: "Filtros", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--filter-text", label: "Texto do painel de filtros", type: "color", default: "#0a0a0a", group: "Filtros", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--filter-accent", label: "Destaque do painel de filtros", type: "color", default: "#0a0a0a", group: "Filtros", inheritsLabel: "cor primária da marca", previewNote: "Só na visão Mobile, com o painel de filtros aberto." },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "category-main", key: "catmn12suv8w", image: "categoryMain/CategoryMain12.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 12", description: "PLP com a contagem, os chips ativos e \"Ordenar\" em pílula; a coluna branca de filtros com as facetas abertas (checkbox, pílulas e faixa de preço), a grade de cards e \"Carregar mais\" com a barra de progresso. No mobile, \"Filtrar\" abre a folha de baixo em acordeão; inclui o estado vazio da busca", template: "12", pagina: ["category"], component: "CategoryMain12", path: "organisms/MainCategory12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#3b1f33", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (barra e botões)", type: "color", default: "#7a2e5f", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo do painel de filtros", type: "color", default: "#ffffff", group: "Filtros" },
        { cssVar: "--filter-text", label: "Texto do painel de filtros", type: "color", default: "#3b1f33", group: "Filtros", inheritsLabel: "cor de texto primária" },
        { cssVar: "--filter-accent", label: "Destaque do painel de filtros", type: "color", default: "#7a2e5f", group: "Filtros", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "category-main", key: "catmn13ntr2y", image: "categoryMain/CategoryMain13.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 13", description: "PLP no escuro com \"Ocultar filtros\", a contagem, \"Ordenar\" e a densidade; os chips ativos e \"Limpar tudo\"; a coluna de filtros entre filetes com as facetas abertas, a grade de cards com preço \"de\" e \"-N%\", e \"Ver mais\" com a barra. No mobile, \"Filtrar\" e \"Ordenar\" em duas metades e o painel de filtros de tela cheia em acordeão; inclui o estado vazio da busca", template: "13", pagina: ["category"], component: "CategoryMain13", path: "organisms/MainCategory13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-main-bg", label: "Fundo da listagem", type: "color", default: "#0d0d0d", group: "Listagem" },
        { cssVar: "--cat-main-text", label: "Texto da listagem e dos filtros", type: "color", default: "#f4f4f0", group: "Listagem" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros marcados, barra e botões)", type: "color", default: "#c8ff2e", group: "Listagem" },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos, filtros e botões", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "category-main", key: "catmn14esp2y", image: "categoryMain/CategoryMain14.webp", imageSource: "auto", mobile: "", title: "Grade de produtos Template 14", description: "PLP com a fileira de chips grandes em paralelogramo da modalidade, a barra com a contagem, os chips ativos, \"Limpar tudo\" e \"Ordenar por\"; a coluna de filtros cinza-azulada com tamanho em grade, cor, preço e marca, a grade de três cards e a paginação em paralelogramos. No mobile, \"Filtrar\" e \"Ordenar\" lado a lado, duas colunas e o painel de filtros de tela cheia em acordeão; inclui o estado vazio da busca", template: "14", pagina: ["category"], component: "CategoryMain14", path: "organisms/MainCategory14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-main-bg", label: "Fundo da listagem", type: "color", default: "#ffffff", group: "Listagem" },
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#0b1b33", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros marcados, próxima página e botões)", type: "color", default: "#e4002b", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo da coluna de filtros", type: "color", default: "#f1f4f8", group: "Filtros" },
        { cssVar: "--filter-text", label: "Texto da coluna de filtros", type: "color", default: "#0b1b33", group: "Filtros", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "category-main", key: "ctm15lux7d4h", image: "categoryMain/CategoryMain15.webp", imageSource: "auto", mobile: "", title: "Listagem Template 15", description: "Sem coluna lateral: a barra de filtros entre dois fios, com \"Filtrar por\" dourado, um botão por faceta que abre o painel logo abaixo e \"Ordenar\" à direita; os filtros ativos em chips com borda dourada, a grade com três cards por linha e \"Carregar mais\" sob o fio de progresso dourado. No mobile, \"Filtrar\" e \"Ordenar\", duas colunas e o painel de filtros em tela cheia com acordeão. A busca sem resultado mostra o estado vazio com sugestões", template: "15", pagina: ["category"], component: "CategoryMain15", path: "organisms/MainCategory15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-bg", label: "Fundo da listagem", type: "color", default: "#faf8f4", group: "Listagem" },
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#1a1714", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtro aberto, chips e progresso)", type: "color", default: "#7a5f1c", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo dos painéis de filtro", type: "color", default: "#ffffff", group: "Filtros", previewNote: "Aparece com um painel de filtro aberto." },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária", previewNote: "Aparece no painel de filtros do mobile e na busca sem resultado." },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "category-main", key: "ctm16inf7d2h", image: "categoryMain/CategoryMain16.webp", imageSource: "auto", mobile: "", title: "Listagem Template 16", description: "\"Compre por idade\" com as bolhas coloridas; a coluna de filtros em cartões brancos arredondados com as opções em pílulas e a cor em bolinhas; a barra com a contagem, os filtros ativos em chips e \"Ordenar\"; a grade de cards e a paginação em círculos. No mobile, \"Filtrar\" e \"Ordenar\", duas colunas e a tela de filtros. A busca sem resultado mostra o estado vazio com sugestões", template: "16", pagina: ["category"], component: "CategoryMain16", path: "organisms/MainCategory16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-main-bg", label: "Fundo da listagem", type: "color", default: "#fffbf2", group: "Listagem" },
        { cssVar: "--cat-main-text", label: "Texto da listagem", type: "color", default: "#2a2350", group: "Listagem", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-main-accent", label: "Destaque (filtros marcados, chips e página atual)", type: "color", default: "#5b4bdb", group: "Listagem", inheritsLabel: "cor primária da marca" },
        { cssVar: "--filter-bg", label: "Fundo dos cartões de filtro", type: "color", default: "#ffffff", group: "Filtros" },
        { cssVar: "--cat-main-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-main-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  categoryDescription: {
    name: "Descrição de categoria",
    items: [
      { id: "01", selection: "category-description", key: "catdes01hp82", image: "categoryDescription/CategoryDescription01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["category"], component: "CategoryDescription01", path: "organisms/DescriptionCategory01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-desc-text", label: "Cor do texto", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "06", selection: "category-description", key: "catdes06frc3", image: "categoryDescription/CategoryDescription06.webp", imageSource: "design", mobile: "", title: "Descrição de categoria Template 6", description: "Texto editorial da categoria com corte \"saiba mais\" e acordeão de dúvidas frequentes", template: "6", pagina: ["category"], component: "CategoryDescription06", path: "organisms/CategorySeoFaq06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--plp-text", label: "Cor do texto", type: "color", default: "#212721", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--plp-font", label: "Fonte", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "category-description", key: "catdes09ed3m", image: "categoryDescription/CategoryDescription09.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 9", description: "\"Sobre a categoria\" com o texto editorial ao lado e as perguntas frequentes em acordeão", template: "9", pagina: ["category"], component: "CategoryDescription09", path: "organisms/CategorySeoFaq09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo da seção", type: "color", default: "#f7f4ef", group: "Descrição" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#1d1b18", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "category-description", key: "catdes10vr5n", image: "categoryDescription/CategoryDescription10.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 10", description: "Perguntas frequentes em cartões de acordeão, em duas colunas no desktop, e abaixo o cartão com o texto da categoria e \"Ver mais\"", template: "10", pagina: ["category"], component: "CategoryDescription10", path: "organisms/CategorySeoFaq10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#101828", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque", type: "color", default: "#1340d8", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "category-description", key: "catdes11gd5n", image: "categoryDescription/CategoryDescription11.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 11", description: "\"Sobre a categoria\" com o texto recolhido e \"Ler mais\" ao lado das perguntas frequentes numeradas em acordeão entre filetes", template: "11", pagina: ["category"], component: "CategoryDescription11", path: "organisms/CategorySeoFaq11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-desc-text", label: "Texto e filetes da seção", type: "color", default: "#0a0a0a", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque", type: "color", default: "#0a0a0a", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "category-description", key: "catdes12sv6r", image: "categoryDescription/CategoryDescription12.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 12", description: "Duas colunas: o cartão rosado do guia (selo, título em serifa, texto e \"Ler o guia completo\") e as perguntas frequentes em cartões brancos com acordeão, a aberta com o círculo vinho; no mobile, empilha e o guia ganha \"Ler mais\"", template: "12", pagina: ["category"], component: "CategoryDescription12", path: "organisms/CategorySeoFaq12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["secondary", "primary"], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo do cartão do guia", type: "color", default: "#f4dcd6", group: "Descrição", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#3b1f33", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque (pergunta aberta)", type: "color", default: "#7a2e5f", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "category-description", key: "catdes13nt9o", image: "categoryDescription/CategoryDescription13.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 13", description: "Duas colunas no escuro: o texto da categoria com o título grande em condensada e \"Ler mais\" sublinhado em verde, e as perguntas frequentes em acordeão entre filetes; no mobile, empilha", template: "13", pagina: ["category"], component: "CategoryDescription13", path: "organisms/CategorySeoFaq13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Descrição" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#f4f4f0", group: "Descrição" },
        { cssVar: "--cat-desc-accent", label: "Destaque (link e pergunta aberta)", type: "color", default: "#c8ff2e", group: "Descrição" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "category-description", key: "catdes14es9o", image: "categoryDescription/CategoryDescription14.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 14", description: "Duas colunas na superfície cinza-azulada: o selo com o traço vermelho, o título em Saira itálica, o texto e \"Ler mais\" com sublinhado grosso vermelho; ao lado, as perguntas frequentes em acordeão entre filetes com o \"+\" num paralelogramo marinho e o \"−\" em vermelho; no mobile, uma coluna", template: "14", pagina: ["category"], component: "CategoryDescription14", path: "organisms/CategorySeoFaq14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo da seção", type: "color", default: "#f1f4f8", group: "Descrição" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#0b1b33", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque (traço, link e pergunta aberta)", type: "color", default: "#e4002b", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "category-description", key: "ctd15lux2s8y", image: "categoryDescription/CategoryDescription15.webp", imageSource: "auto", mobile: "", title: "Descrição de categoria Template 15", description: "Faixa areia em duas colunas: a chamada dourada, o título em serifa com o trecho em itálico, o texto e \"Ler mais\" sobre o fio dourado; à direita, \"Perguntas frequentes\" e o acordeão em serifa entre fios. No mobile, empilhado", template: "15", pagina: ["category"], component: "CategoryDescription15", path: "organisms/CategorySeoFaq15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo da seção", type: "color", default: "#efe8db", group: "Descrição" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque (chamada e fios)", type: "color", default: "#7a5f1c", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "category-description", key: "ctd16inf2s6y", image: "categoryDescription/CategoryDescription16.webp", imageSource: "auto", mobile: "", title: "Descrição da categoria Template 16", description: "Duas colunas: à esquerda o título arredondado, os parágrafos e \"Ler mais\" sublinhado em roxo; à direita \"Perguntas frequentes\" em cartões brancos arredondados com acordeão, a aberta com filete escuro e o círculo roxo. No mobile, empilhado", template: "16", pagina: ["category"], component: "CategoryDescription16", path: "organisms/CategorySeoFaq16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--cat-desc-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Descrição" },
        { cssVar: "--cat-desc-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--cat-desc-accent", label: "Destaque (\"Ler mais\" e pergunta aberta)", type: "color", default: "#5b4bdb", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--cat-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--cat-desc-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  // PRODUCT
  bannerProduct: {
    name: "Banner",
    items: [
      { id: "01", selection: "banner-top", key: "ban01p4q5r6s", image: "bannerProduct/BannerTop01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "BannerTop01", path: "molecules/BannerTop01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
    ],
  },
  productDescription: {
    name: "descrição",
    items: [
      { id: "01", selection: "product-description", key: "desc01t7u8v9w", image: "productDescription/ProductDescription01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductDescription01", path: "molecules/ProductDescription01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["tertiary"], variablesSchema: [
        { cssVar: "--prod-desc-text", label: "Cor do texto", type: "color", default: "#122161", group: "Texto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "09", selection: "product-description", key: "desc09edt6w1", image: "productDescription/ProductDescription09.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 9", description: "\"Sobre a peça\" com o texto da descrição e a ficha de especificações ao lado", template: "9", pagina: ["product"], component: "ProductDescription09", path: "molecules/ProductDescription09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-desc-bg", label: "Fundo da seção", type: "color", default: "#f7f4ef", group: "Descrição" },
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#1d1b18", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "product-description", key: "desc10vrj2x6", image: "productDescription/ProductDescription10.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 10", description: "Cartão com abas (Descrição, Especificações técnicas e uma aba de texto) e, ao lado, \"O que vem na caixa\" e um quadro de aviso", template: "10", pagina: ["product"], component: "ProductDescription10", path: "molecules/ProductDescription10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#101828", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-accent", label: "Destaque (aba ativa)", type: "color", default: "#1340d8", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "product-description", key: "desc11grd2x6", image: "productDescription/ProductDescription11.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 11", description: "Caixa de filetes com a cabeça \"[N°] Descrição e ficha técnica\": a descrição e o desenho técnico à esquerda, a ficha em grade de duas colunas e a lista numerada de materiais à direita; no mobile, tudo empilhado", template: "11", pagina: ["product"], component: "ProductDescription11", path: "molecules/ProductDescription11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-desc-text", label: "Texto e filetes da seção", type: "color", default: "#0a0a0a", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "product-description", key: "desc12suv9b4", image: "productDescription/ProductDescription12.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 12", description: "\"Sobre o produto\" em serifa com a descrição ao lado; os ativos em três cartões pastel e dois cartões brancos: \"Como usar\" com os passos no círculo vinho e \"Resultados\" com os números em serifa; no mobile, tudo empilhado", template: "12", pagina: ["product"], component: "ProductDescription12", path: "molecules/ProductDescription12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#3b1f33", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-accent", label: "Destaque (passos)", type: "color", default: "#7a2e5f", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "product-description", key: "desc13ntr7k1", image: "productDescription/ProductDescription13.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 13", description: "O título enorme em condensada com a descrição ao lado; as tecnologias em cartões numerados com o número em verde; a ficha técnica em linhas entre filetes e a imagem da descrição ao lado; no mobile, tudo empilhado", template: "13", pagina: ["product"], component: "ProductDescription13", path: "molecules/ProductDescription13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-desc-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Descrição" },
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#f4f4f0", group: "Descrição" },
        { cssVar: "--prod-desc-accent", label: "Destaque (números)", type: "color", default: "#c8ff2e", group: "Descrição" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "product-description", key: "desc14esp7k1", image: "productDescription/ProductDescription14.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 14", description: "Na superfície cinza-azulada: o título em Saira itálica com a descrição embaixo; as tecnologias em três colunas com o filete grosso, o número vermelho, o título e o texto; as especificações em linhas entre filetes e a imagem da descrição ao lado; no mobile, tudo empilhado", template: "14", pagina: ["product"], component: "ProductDescription14", path: "molecules/ProductDescription14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-desc-bg", label: "Fundo da seção", type: "color", default: "#f1f4f8", group: "Descrição" },
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#0b1b33", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-accent", label: "Destaque (números)", type: "color", default: "#e4002b", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "product-description", key: "pdd15lux4e9i", image: "productDescription/ProductDescription15.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 15", description: "Centralizados, a chamada dourada, o título em serifa com o trecho em itálico e a descrição; três destaques entre fios com o numeral romano em itálico dourado, o título e o texto; embaixo, a ficha técnica em linhas com fio e a imagem ao lado. No mobile, tudo empilhado", template: "15", pagina: ["product"], component: "ProductDescription15", path: "molecules/ProductDescription15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-desc-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Descrição" },
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-accent", label: "Destaque (chamada, numerais e fios)", type: "color", default: "#7a5f1c", group: "Descrição", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "product-description", key: "pdd16inf4e2i", image: "productDescription/ProductDescription16.webp", imageSource: "auto", mobile: "", title: "Descrição do produto Template 16", description: "O título arredondado e a descrição; três cartões brancos com filete, cada um com a bolinha verde-água numerada e inclinada, o título e o texto; embaixo, a ficha técnica num cartão creme com linhas tracejadas e a imagem ao lado. No mobile, tudo empilhado", template: "16", pagina: ["product"], component: "ProductDescription16", path: "molecules/ProductDescription16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-desc-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Descrição" },
        { cssVar: "--prod-desc-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Descrição", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-desc-accent", label: "Destaque (bolinhas numeradas)", type: "color", default: "#22b8a7", group: "Descrição", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--prod-desc-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-desc-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  productInfo: {
    name: "Informações do produto",
    items: [
      { id: "01", selection: "product-info", key: "info01x0y1z2a", image: "productInfo/ProductInfo01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductInfo01", path: "organisms/ProductDetails01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--prod-info-btn-bg", label: "Cor do botão comprar", type: "color", default: "#682A77", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-info-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--prod-info-variant-active-bg", label: "Variação selecionada: fundo", type: "color", default: "#682A77", group: "Variações" },
        { cssVar: "--prod-info-variant-active-text", label: "Variação selecionada: texto", type: "color", default: "#ffffff", group: "Variações" },
        { cssVar: "--prod-info-secondary-bg", label: "Cor do botão secundário", type: "color", default: "#122161", group: "Botão secundário", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--prod-info-secondary-text", label: "Texto do botão secundário", type: "color", default: "#ffffff", group: "Botão secundário", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--prod-info-font", label: "Fonte", type: "font", default: "'Manrope', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
      ] },
      { id: "02", selection: "product-info", key: "info02b3c4d5e", image: "productInfo/ProductInfo02.webp", imageSource: "design", mobile: "", title: "Título Template 2", description: "Descrição Template 2", template: "2", pagina: ["product"], component: "ProductInfo02", path: "organisms/ProductInfo02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary", "tertiary"], variablesSchema: [
        { cssVar: "--prod-info-font", label: "Fonte das informações do produto", type: "font", default: "sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "03", selection: "product-info", key: "info03c4d5e6f", image: "productInfo/ProductInfo03.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 3", description: "PDP FastStore (SérieA): galeria com scroll, título, avaliação, variações de cor/tamanho, selos de confiança e accordion", template: "3", pagina: ["product"], component: "ProductInfo03", path: "organisms/ProductDetails02", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
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
        { cssVar: "--prod-gallery-dot-active", label: "Galeria: indicador ativo (mobile)", type: "color", default: "#121212", group: "Galeria / Selos", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--prod-info-font", label: "Fonte (informações)", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
        { cssVar: "--prod-gallery-font", label: "Fonte (selos da galeria)", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
      ] },
      { id: "04", selection: "product-info", key: "info04pd03gx", image: "productInfo/ProductInfo04.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 4", description: "PDP com galeria em coluna rolável, SKU e avaliação, ficha curta, preço, variação de cor e tamanho, compra, selos de confiança e acordeão de especificações", template: "4", pagina: ["product"], component: "ProductInfo04", path: "organisms/ProductDetails03", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-info-title", label: "Cor do título", type: "color", default: "#000", group: "Título e avaliação" },
        { cssVar: "--prod-info-text", label: "Cor do texto", type: "color", default: "#121212", group: "Textos" },
        { cssVar: "--prod-info-content", label: "Cor do texto secundário", type: "color", default: "rgba(18, 18, 18, 0.75)", group: "Textos" },
        { cssVar: "--prod-info-divider", label: "Cor das divisórias", type: "color", default: "rgba(18, 18, 18, 0.12)", group: "Textos" },
        { cssVar: "--prod-info-rating", label: "Cor das estrelas", type: "color", default: "#121212", group: "Título e avaliação", previewNote: "Das estrelas de avaliação, desenhadas pelo CSS do @faststore/ui — que o preview não carrega." },
        { cssVar: "--prod-info-price", label: "Cor do preço", type: "color", default: "#121212", group: "Preço" },
        { cssVar: "--prod-info-btn-bg", label: "Fundo do botão comprar", type: "color", default: "#121212", group: "Botão principal" },
        { cssVar: "--prod-info-btn-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão principal" },
        { cssVar: "--prod-info-btn2-bg", label: "Fundo do botão secundário", type: "color", default: "#000", group: "Botão secundário" },
        { cssVar: "--prod-info-btn2-text", label: "Texto do botão secundário", type: "color", default: "#ffffff", group: "Botão secundário" },
        { cssVar: "--prod-info-variant-border", label: "Borda da variação", type: "color", default: "#121212", group: "Variações" },
        { cssVar: "--prod-info-variant-active-bg", label: "Fundo da variação escolhida", type: "color", default: "#121212", group: "Variações" },
        { cssVar: "--prod-info-variant-active-text", label: "Texto da variação escolhida", type: "color", default: "#ffffff", group: "Variações" },
        { cssVar: "--prod-gallery-badge-bg", label: "Fundo da etiqueta", type: "color", default: "#121212", group: "Etiquetas" },
        { cssVar: "--prod-gallery-badge-text", label: "Texto da etiqueta", type: "color", default: "#ffffff", group: "Etiquetas" },
        { cssVar: "--prod-gallery-dot-active", label: "Ponto ativo da galeria", type: "color", default: "#121212", group: "Galeria / Selos", previewNote: "Só na visão Mobile — alterne no topo do editor." },
        { cssVar: "--prod-info-font", label: "Fonte da informação", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
        { cssVar: "--prod-gallery-font", label: "Fonte da galeria", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
      ] },
      { id: "06", selection: "product-info", key: "info06pdp6fc", image: "productInfo/ProductInfo06.webp", imageSource: "design", mobile: "", title: "Detalhes do Produto Template 6", description: "PDP completa: barra de aviso, galeria com miniaturas verticais, trilha, avaliação, preço com centavos reduzidos, carrossel de cores, grade de tamanhos com esgotados, guia de medidas, aviso de forma, cálculo de frete, descrição e características", template: "6", pagina: ["product"], component: "ProductInfo06", path: "organisms/ProductDetails06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--prod-bar-bg", label: "Fundo da barra de aviso", type: "color", default: "#f2f2f2", group: "Barra superior", inheritsLabel: "cor de texto primária", previewNote: "Só na visão Desktop — alterne no topo do editor." },
        { cssVar: "--prod-bar-text", label: "Texto da barra de aviso", type: "color", default: "#1d1d1b", group: "Barra superior", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-info-text", label: "Cor do texto", type: "color", default: "#212721", group: "Textos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-value-color", label: "Cor do preço", type: "color", default: "#4c9d7c", group: "Preço", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-accent-color", label: "Cor de destaque", type: "color", default: "#4c9d7c", group: "Destaque", inheritsLabel: "cor primária da marca", previewNote: "Do simulador de frete e da mensagem de erro, ausentes do preview." },
        { cssVar: "--prod-pill-bg", label: "Fundo do selo de frete", type: "color", default: "#d3d4d3", group: "Destaque", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-buy-bg", label: "Fundo do botão comprar", type: "color", default: "#4c9d7c", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-buy-text", label: "Texto do botão comprar", type: "color", default: "#ffffff", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--prod-calc-bg", label: "Fundo do botão de frete", type: "color", default: "#212721", group: "Botão secundário", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--prod-calc-text", label: "Texto do botão de frete", type: "color", default: "#ffffff", group: "Botão secundário", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--prod-chip-text", label: "Texto do tamanho selecionado", type: "color", default: "#ffffff", group: "Seletor de tamanho", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--prod-zoom-bg", label: "Fundo do zoom da foto", type: "color", default: "#f6f6f6", group: "Galeria / Selos", previewNote: "Do zoom da imagem, que o preview não abre." },
        { cssVar: "--prod-font", label: "Fonte", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "07", selection: "product-info", key: "info07pdp7br", image: "productInfo/ProductInfo07.webp", imageSource: "design", mobile: "", title: "Detalhes do Produto Template 7", description: "PDP editorial: galeria com miniaturas, coluna de compra fixa com preço/Pix/variações, descrição com especificações e dúvidas, e prateleira de relacionados", template: "7", pagina: ["product"], component: "ProductInfo07", path: "organisms/ProductDetails07", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--pdp-title-color", label: "Cor do título e dos textos", type: "color", default: "#2c2420", group: "Textos", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Cor de destaque", type: "color", default: "#b8976a", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--pdp-cta-bg", label: "Fundo do botão", type: "color", default: "#2c2420", group: "Botão principal", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-cta-text", label: "Texto do botão", type: "color", default: "#faf8f4", group: "Botão principal", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-font-title", label: "Fonte do título", type: "font", default: "'Cormorant Garamond', serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'DM Sans', sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "09", selection: "product-info", key: "info09edt2b8", image: "productInfo/ProductInfo09.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 9", description: "Galeria em grade 2×2 (carrossel com filetes no mobile) e a coluna de compra: SKU, nota, preço, Pix e parcela, cor por miniatura, tamanho com esgotado riscado, quantidade, sacola, favoritar, frete por CEP e acordeões", template: "9", pagina: ["product"], component: "ProductInfo09", path: "organisms/ProductDetails09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--pdp-text", label: "Texto da PDP", type: "color", default: "#1d1b18", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque (desconto e seleção)", type: "color", default: "#9c4a2f", group: "PDP", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-price-color", label: "Preço", type: "color", default: "#1d1b18", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#1d1b18", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#f7f4ef", group: "Botão", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "product-info", key: "info10vrj7f4", image: "productInfo/ProductInfo10.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 10", description: "Miniaturas e foto no desktop (carrossel com pontos no mobile) e a coluna de compra: marca e código, nota, preço de/por, Pix, parcela e tabela de parcelamento, destaques, cor por miniatura, tamanho com esgotado riscado, quantidade, botão de compra, favoritar, frete por CEP e selos de confiança", template: "10", pagina: ["product"], component: "ProductInfo10", path: "organisms/ProductDetails10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--pdp-text", label: "Texto da PDP", type: "color", default: "#101828", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque (seleção e links)", type: "color", default: "#1340d8", group: "PDP", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-price-color", label: "Preço", type: "color", default: "#101828", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#1340d8", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte do nome e do preço", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "product-info", key: "info11grd7f4", image: "productInfo/ProductInfo11.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 11", description: "Caixa de filetes: volta à categoria e \"Ref. N°\"; a foto 1:1 com \"01 / 06\" e a régua de miniaturas; a coluna de compra com nome, preço, parcela e Pix, resumo, variações, quantidade e compra, favoritar, especificações e frete; selos de confiança embaixo. No mobile, foto rolando e compra presa ao rodapé", template: "11", pagina: ["product"], component: "ProductInfo11", path: "organisms/ProductDetails11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--pdp-text", label: "Texto e filetes da PDP", type: "color", default: "#0a0a0a", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-price-color", label: "Preço", type: "color", default: "#0a0a0a", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque", type: "color", default: "#ff4f00", group: "PDP", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#0a0a0a", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "product-info", key: "info12suv3p7", image: "productInfo/ProductInfo12.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 12", description: "Sobre o creme: a trilha, a foto 1:1 arredondada com o coração e as miniaturas redondas; à direita a marca, o nome em serifa, a nota, o preço e a parcela, o tamanho em pílulas, quantidade e \"Adicionar à sacola\", as vantagens, o frete e os acordeões brancos. No mobile, a foto rola de lado e a compra fica na barra presa ao rodapé", template: "12", pagina: ["product"], component: "ProductInfo12", path: "organisms/ProductDetails12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--pdp-text", label: "Texto da PDP", type: "color", default: "#3b1f33", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-price-color", label: "Preço", type: "color", default: "#3b1f33", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque (miniatura, estrelas)", type: "color", default: "#7a2e5f", group: "PDP", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#7a2e5f", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "product-info", key: "info13ntr5l8", image: "productInfo/ProductInfo13.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 13", description: "No escuro: a trilha, a foto 1:1 grafite com o contador e as setas quadradas, e as miniaturas (a atual com o contorno verde); à direita o rótulo, o nome enorme em condensada, a nota e o código, o preço e a parcela, a cor por miniatura, o tamanho em grade com o esgotado riscado, \"Adicionar à bag\" com o coração quadrado, o frete e as abas. No mobile, a foto ocupa a largura, as abas viram acordeões e a compra fica na barra presa ao rodapé", template: "13", pagina: ["product"], component: "ProductInfo13", path: "organisms/ProductDetails13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--pdp-bg", label: "Fundo da PDP", type: "color", default: "#0d0d0d", group: "PDP" },
        { cssVar: "--pdp-text", label: "Texto da PDP", type: "color", default: "#f4f4f0", group: "PDP" },
        { cssVar: "--pdp-accent", label: "Destaque (miniatura, estrelas e seta)", type: "color", default: "#c8ff2e", group: "PDP" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#c8ff2e", group: "Botão" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#0d0d0d", group: "Botão" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos, do preço e dos botões", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "product-info", key: "info14esp5l8", image: "productInfo/ProductInfo14.webp", imageSource: "auto", mobile: "", title: "Detalhes do Produto Template 14", description: "A trilha com o traço vermelho; a galeria em grade 2 × 2 com o \"-N%\", as caixas de destaque e os acordeões; à direita o nome enorme em Saira itálica, as estrelas, o preço, a cor em miniaturas, os tamanhos em quadrados (o escolhido marinho, o esgotado riscado) com a tabela de medidas, quantidade, \"Favoritar\", o botão vermelho de largura total e o frete. No mobile, a foto rola de lado com o contador e a régua, e a compra vem logo abaixo", template: "14", pagina: ["product"], component: "ProductInfo14", path: "organisms/ProductDetails14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--pdp-bg", label: "Fundo da PDP", type: "color", default: "#ffffff", group: "PDP" },
        { cssVar: "--pdp-text", label: "Texto da PDP", type: "color", default: "#0b1b33", group: "PDP", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque (traço, \"-N%\", estrelas e cor escolhida)", type: "color", default: "#e4002b", group: "PDP", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão de compra", type: "color", default: "#e4002b", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão de compra", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "product-info", key: "pdi15lux6b3u", image: "productInfo/ProductInfo15.webp", imageSource: "auto", mobile: "", title: "Produto Template 15", description: "A trilha com fios dourados; as miniaturas em coluna à esquerda da foto 4:5 em areia com o contador em itálico e as setas; à direita a marca em versalete dourado, o nome em serifa, as estrelas, o preço entre fios com parcela e Pix, a cor em miniaturas, o aro em grade com os esgotados riscados e o aviso, quantidade e coração, \"Adicionar à sacola\", o frete por CEP e os acordeões. No mobile, a foto larga com a régua de fios", template: "15", pagina: ["product"], component: "ProductInfo15", path: "organisms/ProductDetails15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--pdp-bg", label: "Fundo da página", type: "color", default: "#faf8f4", group: "Produto" },
        { cssVar: "--pdp-text", label: "Texto da página", type: "color", default: "#1a1714", group: "Produto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-accent", label: "Destaque (marca, fios e seleção)", type: "color", default: "#7a5f1c", group: "Produto", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão Adicionar à sacola", type: "color", default: "#1a1714", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão Adicionar à sacola", type: "color", default: "#faf8f4", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "product-info", key: "pdi16inf6b8u", image: "productInfo/ProductInfo16.webp", imageSource: "auto", mobile: "", title: "Produto Template 16", description: "Sobre o creme: a trilha; a foto quadrada arredondada com filete, o contador em pílula, as setas redondas e as miniaturas; à direita o selo, o nome arredondado, as estrelas, o preço em roxo com a parcela e o Pix, a cor em bolinhas, o tamanho em pílulas, quantidade, \"Adicionar à sacola\" em roxo com sombra chapada, o coração, o frete por CEP e os acordeões. No mobile, tudo empilhado", template: "16", pagina: ["product"], component: "ProductInfo16", path: "organisms/ProductDetails16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--pdp-bg", label: "Fundo da página", type: "color", default: "#fffbf2", group: "Produto" },
        { cssVar: "--pdp-text", label: "Texto da página", type: "color", default: "#2a2350", group: "Produto", inheritsLabel: "cor de texto primária" },
        { cssVar: "--pdp-price-color", label: "Preço", type: "color", default: "#5b4bdb", group: "Produto", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-accent", label: "Destaque (selo e Pix)", type: "color", default: "#ffc93c", group: "Produto", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--pdp-button-bg", label: "Fundo do botão Adicionar à sacola", type: "color", default: "#5b4bdb", group: "Botão", inheritsLabel: "cor primária da marca" },
        { cssVar: "--pdp-button-text", label: "Texto do botão Adicionar à sacola", type: "color", default: "#ffffff", group: "Botão", inheritsLabel: "cor de texto base" },
        { cssVar: "--pdp-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--pdp-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  productReviews: {
    name: "Avaliações do produto",
    items: [
      { id: "06", selection: "product-reviews", key: "prodrev06tvx", image: "productReviews/ProductReviews06.webp", imageSource: "design", mobile: "", title: "Avaliações do produto Template 6", description: "Acordeão de avaliações da página de produto: moldura, título e o espaço reservado ao widget de avaliações", template: "6", pagina: ["product"], component: "ProductReviews06", path: "organisms/TrustvoxReviews06", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-text", label: "Cor do título", type: "color", default: "#212721", group: "Título", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-card-bg", label: "Fundo do cartão", type: "color", default: "#ffffff", group: "Título" },
        { cssVar: "--prod-button-bg", label: "Cor do botão do widget", type: "color", default: "#212721", group: "Botão", inheritsLabel: "cor primária da marca", previewNote: "Do widget Trustvox, que só existe na loja publicada." },
        { cssVar: "--prod-title-font", label: "Fonte do título", type: "font", default: "'Inter', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-font", label: "Fonte", type: "font", default: "'Jost', -apple-system, Helvetica, Arial, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária", previewNote: "Do widget Trustvox, que só existe na loja publicada." },
      ] },
      { id: "09", selection: "product-reviews", key: "prodrev09edt", image: "productReviews/ProductReviews09.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 9", description: "Média em destaque com estrelas, distribuição de 1 a 5, \"Escrever avaliação\" e a lista de avaliações", template: "9", pagina: ["product"], component: "ProductReviews09", path: "organisms/ProductReviews09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-text", label: "Texto das avaliações", type: "color", default: "#1d1b18", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Estrelas e destaque", type: "color", default: "#9c4a2f", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "product-reviews", key: "prodrev10vrj", image: "productReviews/ProductReviews10.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 10", description: "Média em destaque com estrelas, distribuição de 1 a 5, \"Escrever avaliação\" e a lista de avaliações", template: "10", pagina: ["product"], component: "ProductReviews10", path: "organisms/ProductReviews10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-text", label: "Texto das avaliações", type: "color", default: "#101828", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque", type: "color", default: "#1340d8", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "product-reviews", key: "prodrev11grd", image: "productReviews/ProductReviews11.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 11", description: "Grade de filetes: a cabeça com a média, o total e \"Escrever avaliação\", a distribuição de 1 a 5 em células, a lista como tabela (data, cliente, nota, avaliação) e a paginação numerada", template: "11", pagina: ["product"], component: "ProductReviews11", path: "organisms/ProductReviews11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-text", label: "Texto e filetes das avaliações", type: "color", default: "#0a0a0a", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque", type: "color", default: "#0a0a0a", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "product-reviews", key: "prodrev12suv", image: "productReviews/ProductReviews12.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 12", description: "\"Avaliações\" em serifa e \"Escrever avaliação\" em pílula; o cartão do resumo com a média grande, as estrelas e as barras de 5 a 1; a lista em cartões brancos com o avatar pastel, nome, data, estrelas, título e texto, e \"Ver mais avaliações\"", template: "12", pagina: ["product"], component: "ProductReviews12", path: "organisms/ProductReviews12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-text", label: "Texto das avaliações", type: "color", default: "#3b1f33", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque (estrelas e barras)", type: "color", default: "#7a2e5f", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "product-reviews", key: "prodrev13ntr", image: "productReviews/ProductReviews13.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 13", description: "O título enorme em condensada; à esquerda a média gigante com as estrelas verdes e a contagem, as barras de 5 a 1 e \"Escrever avaliação\" com filete; à direita a lista entre filetes com estrelas, data, título em condensada, texto e autor, e a paginação em quadrados com a atual em verde; no mobile, tudo empilhado", template: "13", pagina: ["product"], component: "ProductReviews13", path: "organisms/ProductReviews13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-reviews-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Avaliações" },
        { cssVar: "--prod-reviews-text", label: "Texto das avaliações", type: "color", default: "#f4f4f0", group: "Avaliações" },
        { cssVar: "--prod-reviews-accent", label: "Destaque (estrelas, barras e página atual)", type: "color", default: "#c8ff2e", group: "Avaliações" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos, notas e botões", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "product-reviews", key: "prodrev14esp", image: "productReviews/ProductReviews14.webp", imageSource: "auto", mobile: "", title: "Avaliações do produto Template 14", description: "O título em Saira itálica; à esquerda a caixa clara com a média gigante, as estrelas vermelhas, as barras de 5 a 1 e \"Escrever avaliação\" no paralelogramo vermelho; à direita a lista entre filetes e a paginação com a atual num paralelogramo marinho; no mobile, tudo empilhado", template: "14", pagina: ["product"], component: "ProductReviews14", path: "organisms/ProductReviews14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--prod-reviews-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Avaliações" },
        { cssVar: "--prod-reviews-text", label: "Texto das avaliações", type: "color", default: "#0b1b33", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque (estrelas, barras e botão)", type: "color", default: "#e4002b", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "product-reviews", key: "pdr15lux8o2l", image: "productReviews/ProductReviews15.webp", imageSource: "auto", mobile: "", title: "Avaliações Template 15", description: "\"Opiniões\" em versalete dourado e \"Avaliações\" em serifa sobre o fio dourado; à esquerda a média grande em serifa com as estrelas, as barras finas de 5 a 1 e \"Escrever avaliação\"; à direita a lista entre fios com estrelas, data, título em serifa, texto e nome, e a paginação em quadrados. No mobile, tudo empilhado", template: "15", pagina: ["product"], component: "ProductReviews15", path: "organisms/ProductReviews15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Avaliações" },
        { cssVar: "--prod-reviews-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque (estrelas, barras e fios)", type: "color", default: "#7a5f1c", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "product-reviews", key: "pdr16inf8o5l", image: "productReviews/ProductReviews16.webp", imageSource: "auto", mobile: "", title: "Avaliações Template 16", description: "\"O que as famílias acharam\"; à esquerda o cartão branco com sombra chapada, a média grande, as estrelas roxas, as barras de 5 a 1 em pílula e \"Escrever avaliação\" em roxo; à direita a lista em cartões brancos com estrelas, data, título, texto e nome, e a paginação em círculos. No mobile, tudo empilhado", template: "16", pagina: ["product"], component: "ProductReviews16", path: "organisms/ProductReviews16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--prod-reviews-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Avaliações" },
        { cssVar: "--prod-reviews-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Avaliações", inheritsLabel: "cor de texto primária" },
        { cssVar: "--prod-reviews-accent", label: "Destaque (estrelas, barras e botão)", type: "color", default: "#5b4bdb", group: "Avaliações", inheritsLabel: "cor primária da marca" },
        { cssVar: "--prod-reviews-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--prod-reviews-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  productRelated: {
    name: "Produtos Relacionados",
    items: [
      { id: "01", selection: "product-related", key: "rel01f6g7h8i", image: "productRelated/ProductRelated01.webp", imageSource: "design", mobile: "", title: "Título Template 1", description: "Descrição Template 1", template: "1", pagina: ["product"], component: "ProductRelated01", path: "organisms/ProductShowcase01", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [] },
      { id: "09", selection: "product-related", key: "rel09edt4n7z", image: "productRelated/ProductRelated09.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 9", description: "\"Você também pode gostar\": título em serifa, setas na linha do título e quatro cards por vez; no mobile, cards rolando de lado com filete de progresso", template: "9", pagina: ["product"], override: true, component: "ProductRelated09", path: "overrides/CrossSellingShelf09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#f7f4ef", group: "Relacionados" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#1d1b18", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-text", label: "Texto", type: "color", default: "#1d1b18", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-tag-text", label: "Selo de desconto", type: "color", default: "#9c4a2f", group: "Relacionados", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "product-related", key: "rel10vrj9z3m", image: "productRelated/ProductRelated10.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 10", description: "\"Quem viu, também viu\": título com setas na mesma linha (anterior em contorno, próxima no acento) e cinco cards por vez; no mobile, cards rolando de lado com barra de progresso", template: "10", pagina: ["product"], override: true, component: "ProductRelated10", path: "overrides/CrossSellingShelf10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#f2f4f7", group: "Relacionados" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#101828", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (setas e \"Ver todos\")", type: "color", default: "#1340d8", group: "Relacionados", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#d92d20", group: "Relacionados", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#ffffff", group: "Relacionados", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "product-related", key: "rel11grd9z3m", image: "productRelated/ProductRelated11.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 11", description: "\"Quem viu também viu\" na cabeça de filetes com as setas nas células da direita e quatro cards em grade por vez; no mobile, cards rolando de lado com a posição \"01 / 04\" e a barra", template: "11", pagina: ["product"], override: true, component: "ProductRelated11", path: "overrides/CrossSellingShelf11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Relacionados" },
        { cssVar: "--showcase-text", label: "Texto e filetes", type: "color", default: "#0a0a0a", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#0a0a0a", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "product-related", key: "rel12suv5m2z", image: "productRelated/ProductRelated12.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 12", description: "\"Quem comprou, também levou\" em serifa à esquerda e as setas em círculo à direita (a próxima no vinho); quatro cards por vez e, no mobile, cards rolando de lado com a barra de posição", template: "12", pagina: ["product"], override: true, component: "ProductRelated12", path: "overrides/CrossSellingShelf12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "tertiary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#fbf6f3", group: "Relacionados" },
        { cssVar: "--showcase-text", label: "Texto da seção", type: "color", default: "#3b1f33", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (botão do card, estrelas)", type: "color", default: "#7a2e5f", group: "Relacionados", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-tag-bg", label: "Fundo do selo de desconto", type: "color", default: "#dce6da", group: "Relacionados", inheritsLabel: "cor terciária da marca" },
        { cssVar: "--showcase-tag-text", label: "Texto do selo de desconto", type: "color", default: "#3b1f33", group: "Relacionados", inheritsLabel: "cor terciária de contraste da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "product-related", key: "rel13ntr3w9v", image: "productRelated/ProductRelated13.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 13", description: "O título gigante em condensada e as duas setas quadradas à direita; quatro cards por vez e, no mobile, os cards rolando de lado com a régua verde de posição", template: "13", pagina: ["product"], override: true, component: "ProductRelated13", path: "overrides/CrossSellingShelf13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#0d0d0d", group: "Relacionados" },
        { cssVar: "--showcase-text", label: "Texto da seção", type: "color", default: "#f4f4f0", group: "Relacionados" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#f4f4f0", group: "Relacionados" },
        { cssVar: "--showcase-accent", label: "Destaque (régua e seta)", type: "color", default: "#c8ff2e", group: "Relacionados" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "product-related", key: "rel14esp3w9v", image: "productRelated/ProductRelated14.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 14", description: "O título em Saira itálica e as setas em paralelogramo à direita; quatro cards por vez e, no mobile, os cards rolando de lado", template: "14", pagina: ["product"], override: true, component: "ProductRelated14", path: "overrides/CrossSellingShelf14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#ffffff", group: "Relacionados" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#0b1b33", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-text", label: "Texto e setas", type: "color", default: "#0b1b33", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (\"-N%\")", type: "color", default: "#e4002b", group: "Relacionados", inheritsLabel: "cor primária da marca", previewNote: "Aparece nos cards com desconto." },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "product-related", key: "prl15lux1a5o", image: "productRelated/ProductRelated15.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 15", description: "O fio dourado em cima; \"Você também pode gostar\" em serifa com o trecho em itálico à esquerda e as setas quadradas à direita; três cards por vez, sem rótulo. No mobile, os cards rolam de lado com o fio de posição embaixo", template: "15", pagina: ["product"], override: true, component: "ProductRelated15", path: "overrides/CrossSellingShelf15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#faf8f4", group: "Relacionados" },
        { cssVar: "--showcase-text", label: "Texto da seção", type: "color", default: "#1a1714", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#1a1714", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (fio dourado e setas)", type: "color", default: "#7a5f1c", group: "Relacionados", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "product-related", key: "prl16inf1a9o", image: "productRelated/ProductRelated16.webp", imageSource: "auto", mobile: "", title: "Produtos relacionados Template 16", description: "\"Quem levou este, também levou\" com as setas redondas à direita, a anterior branca e a próxima roxa com sombra chapada; quatro cards por vez. No mobile, os cards rolam de lado", template: "16", pagina: ["product"], override: true, component: "ProductRelated16", path: "overrides/CrossSellingShelf16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--showcase-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Relacionados" },
        { cssVar: "--showcase-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-title-color", label: "Título", type: "color", default: "#2a2350", group: "Relacionados", inheritsLabel: "cor de texto primária" },
        { cssVar: "--showcase-accent", label: "Destaque (seta \"próximo\")", type: "color", default: "#5b4bdb", group: "Relacionados", inheritsLabel: "cor primária da marca" },
        { cssVar: "--showcase-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--showcase-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  // LANDING — a LP inteira é UM item; header e footer vêm dos `common` da loja.
  countdown: {
    name: "Contador de ofertas",
    items: [
      { id: "08", selection: "countdown", key: "cdn08sra5t2w", image: "countdown/Countdown08.webp", imageSource: "auto", mobile: "", title: "Contador Template 8", description: "Contagem regressiva até o fim da oferta, com chamada e texto de apoio", template: "8", pagina: ["home"], component: "Countdown08", path: "organisms/Countdown08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#141414", group: "Contador" },
        { cssVar: "--countdown-box-bg", label: "Fundo das caixas e divisória", type: "color", default: "#292929", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#ffffff", group: "Contador" },
        { cssVar: "--countdown-note", label: "Texto de apoio", type: "color", default: "#dfdfe0", group: "Contador" },
        { cssVar: "--countdown-accent", label: "Cor de destaque", type: "color", default: "#f2994a", group: "Contador" },
        { cssVar: "--countdown-title-font", label: "Fonte do título", type: "font", default: "'Inter', sans-serif", group: "Tipografia" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "\'Inter\', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "countdown", key: "cdn09edt3j8w", image: "countdown/Countdown09.webp", imageSource: "auto", mobile: "", title: "Contador Template 9", description: "Chamada no acento, título com trecho em itálico, texto, CTA e a contagem regressiva entre filetes, com a arte à direita; no mobile, arte no topo e contagem em grade de quatro", template: "9", pagina: ["home"], component: "Countdown09", path: "organisms/Countdown09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#f7f4ef", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#1d1b18", group: "Contador", inheritsLabel: "cor de texto primária" },
        { cssVar: "--countdown-accent", label: "Destaque (chamada)", type: "color", default: "#9c4a2f", group: "Contador", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-title-font", label: "Fonte do título e do contador", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "countdown", key: "cdn10vrj3s5r", image: "countdown/Countdown10.webp", imageSource: "auto", mobile: "", title: "Contador Template 10", description: "\"Oferta relâmpago\" numa faixa de destaque com o raio e o título, texto, a contagem em caixas escuras, o CTA e a arte à direita; no mobile, arte no topo e contagem em grade de quatro", template: "10", pagina: ["home"], component: "Countdown10", path: "organisms/Countdown10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary", "secondary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#ffcf24", group: "Contador", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#101828", group: "Contador", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--countdown-accent", label: "Destaque (botão)", type: "color", default: "#1340d8", group: "Contador", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-title-font", label: "Fonte do título e do contador", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "countdown", key: "cdn11grd3s5r", image: "countdown/Countdown11.webp", imageSource: "auto", mobile: "", title: "Contador Template 11", description: "\"Edição limitada\" numa faixa de filetes: chamada, frase e rótulo à esquerda, a contagem em quatro células mono (dias, horas, min, seg) e o CTA no destaque à direita; no mobile, tudo empilha e o CTA vira barra", template: "11", pagina: ["home"], component: "Countdown11", path: "organisms/Countdown11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#ffffff", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto e filetes do contador", type: "color", default: "#0a0a0a", group: "Contador", inheritsLabel: "cor de texto primária" },
        { cssVar: "--countdown-accent", label: "Fundo do CTA", type: "color", default: "#ff4f00", group: "CTA", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-accent-text", label: "Texto do CTA", type: "color", default: "#0a0a0a", group: "CTA", inheritsLabel: "cor de texto base" },
        { cssVar: "--countdown-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "countdown", key: "cdn12suv2q6w", image: "countdown/Countdown12.webp", imageSource: "auto", mobile: "", title: "Contador Template 12", description: "Cartão verde arredondado: selo, frase em serifa e a contagem em quatro pílulas brancas com o número em serifa vinho; à direita a arte num arco, o título do destaque, o texto e o CTA. No mobile, tudo numa coluna centrada e o CTA largo", template: "12", pagina: ["home"], component: "Countdown12", path: "organisms/Countdown12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#dce6da", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#3b1f33", group: "Contador", inheritsLabel: "cor de texto primária" },
        { cssVar: "--countdown-accent", label: "Destaque (números e CTA)", type: "color", default: "#7a2e5f", group: "Contador", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-title-font", label: "Fonte do título e do contador", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "countdown", key: "cdn13ntr4r9k", image: "countdown/Countdown13.webp", imageSource: "auto", mobile: "", title: "Contador Template 13", description: "Faixa entre filetes com a arte vertical à esquerda; no meio, a chamada em verde e a contagem em números gigantes de condensada separados por dois-pontos (os segundos em verde); à direita, o título do destaque, o texto e o CTA verde. No mobile, a arte no topo, a contagem em quatro caixas com filete e o CTA largo", template: "13", pagina: ["home"], component: "Countdown13", path: "organisms/Countdown13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#0d0d0d", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#f4f4f0", group: "Contador" },
        { cssVar: "--countdown-accent", label: "Destaque (chamada, segundos e CTA)", type: "color", default: "#c8ff2e", group: "Contador" },
        { cssVar: "--countdown-title-font", label: "Fonte do título, do contador e do botão", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "countdown", key: "cdn14esp4r9k", image: "countdown/Countdown14.webp", imageSource: "auto", mobile: "", title: "Contador Template 14", description: "Faixa marinho em duas colunas: a arte cortada em diagonal à esquerda; à direita a chamada, o título em Saira itálica, \"Termina em\", a contagem em quatro placas lima em paralelogramo com os dois-pontos, o texto e o CTA lima. No mobile, a arte em cima, as placas menores e o CTA largo", template: "14", pagina: ["home"], component: "Countdown14", path: "organisms/Countdown14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#0b1b33", group: "Contador", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#ffffff", group: "Contador", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--countdown-accent", label: "Destaque (placas e CTA)", type: "color", default: "#d9f99d", group: "Destaque", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--countdown-accent-text", label: "Texto sobre o destaque", type: "color", default: "#0b1b33", group: "Destaque", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--countdown-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "countdown", key: "cnt15lux8r3w", image: "countdown/Countdown15.webp", imageSource: "auto", mobile: "", title: "Contador Template 15", description: "Faixa areia com a arte quadrada à esquerda; à direita o fio dourado com a chamada, o título em serifa com o trecho em itálico, a contagem de dias, horas, minutos e segundos entre fios dourados (os segundos em itálico), o texto e o botão com fio. No mobile, a arte no topo e o botão largo", template: "15", pagina: ["home"], component: "Countdown15", path: "organisms/Countdown15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#efe8db", group: "Contador" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#1a1714", group: "Contador", inheritsLabel: "cor de texto primária" },
        { cssVar: "--countdown-accent", label: "Destaque (chamada e fios)", type: "color", default: "#7a5f1c", group: "Contador", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-title-font", label: "Fonte dos títulos e dos números", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "countdown", key: "cnt16inf8r6w", image: "countdown/Countdown16.webp", imageSource: "auto", mobile: "", title: "Contador Template 16", description: "Faixa roxa entre duas ondas creme: a arte arredondada e levemente girada, a chamada arredondada e a contagem em quatro caixas amarelas com sombra chapada (os segundos em branco); à direita o texto e o botão amarelo. No mobile, uma coluna com a contagem em quatro colunas e o botão largo", template: "16", pagina: ["home"], component: "Countdown16", path: "organisms/Countdown16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--countdown-bg", label: "Fundo do contador", type: "color", default: "#5b4bdb", group: "Contador", inheritsLabel: "cor primária da marca" },
        { cssVar: "--countdown-text", label: "Texto do contador", type: "color", default: "#ffffff", group: "Contador", inheritsLabel: "cor de texto base" },
        { cssVar: "--countdown-accent", label: "Destaque (caixas e botão)", type: "color", default: "#ffc93c", group: "Contador", inheritsLabel: "cor secundária da marca" },
        { cssVar: "--countdown-accent-text", label: "Texto sobre o destaque", type: "color", default: "#2a2350", group: "Contador", inheritsLabel: "cor de texto secundária" },
        { cssVar: "--countdown-title-font", label: "Fonte dos títulos e dos números", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--countdown-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
  editorial: {
    name: "Bloco editorial",
    items: [
      { id: "08", selection: "editorial", key: "edt08sra8b4m", image: "editorial/Editorial08.webp", imageSource: "auto", mobile: "", title: "Editorial Template 8", description: "Colagem de três imagens com chamada, título e texto, e dois banners abaixo", template: "8", pagina: ["home"], component: "Editorial08", path: "organisms/Editorial08", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        // Nível 1 direto ao valor do design (Figma "Templates - Serie A"), sem Nível 2.
        { cssVar: "--editorial-bg-start", label: "Fundo (topo)", type: "color", default: "#292929", group: "Editorial" },
        { cssVar: "--editorial-bg-end", label: "Fundo (base)", type: "color", default: "#141414", group: "Editorial" },
        { cssVar: "--editorial-title-color", label: "Chamada e título", type: "color", default: "#ffffff", group: "Editorial" },
        { cssVar: "--editorial-body-color", label: "Texto", type: "color", default: "#dfdfe0", group: "Editorial" },
        { cssVar: "--editorial-accent", label: "Cor de destaque", type: "color", default: "#f2994a", group: "Editorial" },
        { cssVar: "--editorial-title-font", label: "Fonte do título", type: "font", default: "\'Open Sans\', sans-serif", group: "Tipografia" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Open Sans', sans-serif", group: "Tipografia" },
      ] },
      { id: "09", selection: "editorial", key: "edt09edt6p4q", image: "editorial/Editorial09.webp", imageSource: "auto", mobile: "", title: "Editorial Template 9", description: "Matéria em destaque com arte, chamada, título com trecho em itálico, texto com capitular e \"Ler matéria\"; abaixo de um filete, três matérias relacionadas com miniatura", template: "9", pagina: ["home"], component: "Editorial09", path: "organisms/Editorial09", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#f7f4ef", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto do editorial", type: "color", default: "#1d1b18", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Fraunces', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Figtree', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "10", selection: "editorial", key: "edt10vrj5p8y", image: "editorial/Editorial10.webp", imageSource: "auto", mobile: "", title: "Editorial Template 10", description: "\"Guia de compras\" com subtítulo e \"Ver todos os guias\"; três cartões de matéria com arte, selo de editoria, título, resumo, tempo de leitura e \"Ler guia\"; no mobile, cartões rolando de lado", template: "10", pagina: ["home"], component: "Editorial10", path: "organisms/Editorial10", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#f2f4f7", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto do editorial", type: "color", default: "#101828", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (selos e links)", type: "color", default: "#1340d8", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Archivo', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "11", selection: "editorial", key: "edt11grd5p8y", image: "editorial/Editorial11.webp", imageSource: "auto", mobile: "", title: "Editorial Template 11", description: "\"Journal\" com cabeça de filetes e \"Todos os textos\": o texto em destaque (arte, data, editoria, título, resumo e \"Ler texto\") e a lista de textos em linhas com data, título, editoria e seta; no mobile, arte em cima e a lista embaixo", template: "11", pagina: ["home"], component: "Editorial11", path: "organisms/Editorial11", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#ffffff", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto e filetes do editorial", type: "color", default: "#0a0a0a", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (links)", type: "color", default: "#0a0a0a", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos e do texto", type: "font", default: "'Geist', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte dos números e rótulos", type: "font", default: "'Geist Mono', monospace", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "12", selection: "editorial", key: "edt12suv4n8y", image: "editorial/Editorial12.webp", imageSource: "auto", mobile: "", title: "Editorial Template 12", description: "Guia com chamada, título em serifa e texto centrados; os passos em cartões brancos com o número no círculo vinho, título, arte em arco, texto e o link em pílula com a seta; três por linha e, no mobile, rolando de lado com pontos", template: "12", pagina: ["home"], component: "Editorial12", path: "organisms/Editorial12", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#fbf6f3", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto do editorial", type: "color", default: "#3b1f33", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (número do passo)", type: "color", default: "#7a2e5f", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Young Serif', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Nunito Sans', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "13", selection: "editorial", key: "edt13ntr6s1w", image: "editorial/Editorial13.webp", imageSource: "auto", mobile: "", title: "Editorial Template 13", description: "Cabeça em linha com o título gigante e \"Ver todas as matérias\" sublinhado em verde; a matéria de destaque ocupa duas colunas com a chamada verde, o título e \"Ler matéria →\" sobre a arte, e as demais empilham na terceira coluna entre filetes. No mobile, o destaque com a arte em cima e as demais em linha com a miniatura quadrada", template: "13", pagina: ["home"], component: "Editorial13", path: "organisms/Editorial13", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#0d0d0d", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto do editorial", type: "color", default: "#f4f4f0", group: "Editorial" },
        { cssVar: "--editorial-accent", label: "Destaque (chamada e link)", type: "color", default: "#c8ff2e", group: "Editorial" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Barlow Condensed', sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Barlow', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "14", selection: "editorial", key: "edt14esp6s1w", image: "editorial/Editorial14.webp", imageSource: "auto", mobile: "", title: "Editorial Template 14", description: "Fundo cinza-azulado com o título em Saira itálica e \"Ver todos os guias\"; o guia de destaque com a arte larga, a placa marinho com o número, a chamada com o traço vermelho, o título, o texto e o link; os demais empilhados ao lado com o número vermelho da posição. No mobile, o destaque em cima e os demais em linha com a miniatura", template: "14", pagina: ["home"], component: "Editorial14", path: "organisms/Editorial14", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: [], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#f1f4f8", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto e placa", type: "color", default: "#0b1b33", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (traço, números e link)", type: "color", default: "#e4002b", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Saira', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Inter', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "15", selection: "editorial", key: "edt15lux6c1q", image: "editorial/Editorial15.webp", imageSource: "auto", mobile: "", title: "Editorial Template 15", description: "Journal: a cabeça com a chamada, o título em serifa com o trecho em itálico e \"Ver todas as histórias\", fechada pelo fio dourado; a história em destaque com a arte 4:3, o título e \"Ler a história\" sobre o fio à esquerda, e as demais com miniatura, chamada, título e texto entre fios à direita. No mobile, as demais em linhas com miniatura", template: "15", pagina: ["home"], component: "Editorial15", path: "organisms/Editorial15", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo do editorial", type: "color", default: "#faf8f4", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto do editorial", type: "color", default: "#1a1714", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (chamadas e fios)", type: "color", default: "#7a5f1c", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Cormorant Garamond', Georgia, serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Manrope', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
      { id: "16", selection: "editorial", key: "edt16inf6c3q", image: "editorial/Editorial16.webp", imageSource: "auto", mobile: "", title: "Editorial Template 16", description: "Título e \"Ver todas as dicas\" sublinhado; a primeira matéria em destaque em duas colunas, com a arte larga com filete, a chamada em pílula, o título e o texto; as outras empilhadas na terceira coluna. No mobile, o destaque em cima e as outras em linha com miniatura", template: "16", pagina: ["home"], component: "Editorial16", path: "organisms/Editorial16", platforms: ['Tray', 'Wake', 'VTEX'], backgroundVars: ["primary"], variablesSchema: [
        { cssVar: "--editorial-bg", label: "Fundo da seção", type: "color", default: "#fffbf2", group: "Editorial" },
        { cssVar: "--editorial-text", label: "Texto da seção", type: "color", default: "#2a2350", group: "Editorial", inheritsLabel: "cor de texto primária" },
        { cssVar: "--editorial-accent", label: "Destaque (chamadas e \"Ver todas\")", type: "color", default: "#5b4bdb", group: "Editorial", inheritsLabel: "cor primária da marca" },
        { cssVar: "--editorial-title-font", label: "Fonte dos títulos", type: "font", default: "'Fredoka', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte primária" },
        { cssVar: "--editorial-font", label: "Fonte do texto", type: "font", default: "'Nunito', system-ui, sans-serif", group: "Tipografia", inheritsLabel: "fonte secundária" },
      ] },
    ],
  },
} as const;

export type LayoutKey = keyof typeof LAYOUTS;
