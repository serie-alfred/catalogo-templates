import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type SetStateAction,
} from 'react';
import { PAGE_SINGLETON_SELECTIONS } from '@/utils/sectionRules';
import { arrayMove } from '@dnd-kit/sortable';
import { LAYOUTS, LayoutKey, LayoutItem } from '@/data/layoutData';
import { belongsToPage } from '@/utils/previewRender';
import { captureAndDownloadScreenshot } from '@/utils/screenshotExport';
import { sendLayoutConfigEmail } from '@/services/emailService';
import { isLocalDelivery } from '@/utils/configDelivery';
import type { Platform } from '@/types/platform';
import { useThemeHistory, type ThemeDoc } from './useThemeHistory';
import { buildThemeStyle, contrastOn, colorSafeOnWhite } from '@/utils/themeStyle';
import {
  modeForPlatform,
  partitionByPlatform,
  plataformaTemLp,
  sanitizeEditorMode,
  sanitizePlatform,
  sanitizeSelections,
} from '@/utils/platformCompat';
import { lpInicial, sanitizeLp, slugDaLp, type LpState } from '@/utils/lp';
import {
  ENTRADA_PADRAO,
  selecoesDoTemplate,
  templatePadrao,
  type TemplateCompleto,
} from '@/utils/templatesCompletos';
import {
  CHECKOUT_PADRAO,
  blocoDoConfig,
  carregarBase,
  comporParaExport,
  reduzirLogo,
  sanitizeCheckout,
  variaveisGlobais,
  type CheckoutEtapa,
  type CheckoutState,
} from '@/utils/checkout';
// type-only: não puxa o módulo server-only para o bundle do cliente.
import type { PreviewSnapshot } from '@/lib/previewStore';
import type { EstadoDoEditor } from '@/types/estadoEditor';
import { abaSemTrabalho, estadoDaAba } from '@/utils/editorStorage';
import { avisarPreviewAtualizado } from '@/utils/previewAoVivo';

/** Os destinos do rail de navegação do editor: os quatro do Figma e o
 *  "Por template" (escolher uma família inteira, utils/templatesCompletos.ts). */
export type RailTarget =
  | 'templates'
  | 'componentes'
  | 'variaveis'
  | 'tipografia'
  | 'identidade'
  | 'salvos';

/** O tema do histórico em que esta aba salva (ver PanelSavedThemes). */
export interface TemaAtual {
  id: string;
  nome: string;
}

/**
 * O que o canvas mostra: a loja (as páginas montadas com seções), o checkout
 * nativo da VTEX com o nosso visual, ou uma LP avulsa (`lp`, ver utils/lp.ts).
 * `checkout` só existe com `platform === 'VTEX'` e `lp` em Wake e VTEX — ver
 * `modeForPlatform` em platformCompat.ts.
 */
export type EditorMode = 'loja' | 'checkout' | 'lp';

/**
 * Zoom do canvas. `fit` é o padrão: encolhe o frame o quanto for preciso para
 * caber na coluna, sem NUNCA ampliar. Os fixos mostram o tema na fração real e
 * deixam panoramar quando não cabe.
 */
export const ZOOM_MODES = ['fit', '0.5', '0.75', '1'] as const;
export type ZoomMode = (typeof ZOOM_MODES)[number];

/** Largura lógica do frame em cada visão. O tema SEMPRE renderiza nestas
 *  larguras, independentemente do tamanho da janela — é o conserto do preview
 *  "Desktop" que renderizava em tier de tablet. */
export const LARGURA_LOGICA = { desktop: 1440, mobile: 375 } as const;

export interface LayoutSelection {
  uid: string;
  id: string;
  layoutKey: LayoutKey;
  pagina: string;
  /** Overrides de cor/fonte por instância: { [cssVar]: valor escolhido }. */
  variables?: Record<string, string>;
}

export const MAX_PER_PAGE = 101;

/** Teto por imagem: host lento ou fora do ar não pode prender o botão "Baixar". */
const IMAGE_WAIT_MS = 8000;

/** Resolve quando toda <img> da subárvore terminou de carregar (ou falhou). */
async function waitForImages(root: HTMLElement) {
  await Promise.all(
    Array.from(root.querySelectorAll('img')).map(img => {
      // O palco de captura fica em top/left -99999px. Uma <img loading="lazy">
      // ali NUNCA começa a carregar: o browser só busca imagem lazy perto da
      // viewport. Ela ficava `complete === false` para sempre, este await nunca
      // resolvia e o "Baixar" travava calado — sem PNG, sem config.json e sem
      // mensagem. Bastava um Footer01 no tema (os ícones de pagamento são lazy).
      // Trocar para `eager` dispara o carregamento na hora e é também o que faz
      // a imagem existir no PNG, então não é só destravar a espera.
      if (img.loading === 'lazy') img.loading = 'eager';
      if (img.complete) return null;
      return new Promise<void>(resolve => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        window.setTimeout(done, IMAGE_WAIT_MS);
      });
    })
  );
}

/**
 * Retorna apenas as variáveis cujo valor difere do default do `variablesSchema`
 * (mantém o config enxuto — chave omitida = usa o default do `var()` no SCSS).
 * Retorna `undefined` quando não há nenhuma alteração relevante.
 */
function pickChangedVariables(
  found: LayoutItem,
  selection: LayoutSelection
): Record<string, string> | undefined {
  const schema = found.variablesSchema;
  const overrides = selection.variables;
  if (!schema || !overrides) return undefined;

  // Antes comparava com `variable.default` e omitia o valor quando batia — a
  // premissa era que o SCSS caísse exatamente nesse default quando a chave
  // falta. Só que a cadeia real é individual → TOKEN GLOBAL → default: se o
  // usuário escolhe um valor igual ao default mas o token global do meio (ex.
  // `--text-color-base`) resolve para outra cor, omitir troca o valor
  // escolhido pelo token global sem avisar (ex.: texto branco escolhido some
  // porque `--cart-button-text` nunca chega a existir e o fallback do meio
  // vira preto). Sempre emitir o que o usuário de fato escolheu é a única
  // leitura segura.
  const changed: Record<string, string> = {};
  for (const variable of schema) {
    const value = overrides[variable.cssVar];
    if (value != null) {
      changed[variable.cssVar] = value;
    }
  }

  return Object.keys(changed).length > 0 ? changed : undefined;
}

export function useLayoutGenerator() {
  /** Estados principais */
  // dentro de useLayoutGenerator
  // Estado persistido inicia com o default de SSR; a leitura do localStorage
  // acontece num useEffect pós-mount (ver "Hidratação do estado persistido"),
  // para o 1º render do cliente bater com o servidor e evitar hydration mismatch.
  const [lojaSelections, setLojaSelections] = useState<LayoutSelection[]>([]);
  /** A LP do modo LP: documento à parte da loja (ver utils/lp.ts). */
  const [lp, setLp] = useState<LpState>(lpInicial);

  const [platform, setPlatform] = useState<Platform | null>(null);

  const [wakeCustomValue, setWakeCustomValue] = useState<string>('');
  const [showWakePopup, setShowWakePopup] = useState(false);
  const wakePopupRef = useRef<HTMLDivElement | null>(null);

  const [focusedKey, setFocusedKey] = useState<LayoutKey | null>(null);
  const [showPlatformError, setShowPlatformError] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  /**
   * Desfecho do último export, para o modal de confirmação.
   *
   * Fora do desenvolvimento o clique não baixa nada (ver configDelivery.ts), e
   * um clique sem retorno visual é indistinguível de um botão quebrado. Mora no
   * hook, e não no painel, porque quem conhece o desfecho é o `exportLayout`.
   */
  const [exportFeedback, setExportFeedback] = useState<
    'sent' | 'failed' | null
  >(null);
  const dismissExportFeedback = useCallback(() => setExportFeedback(null), []);

  /** Destino ativo do rail de navegação — decide o que o painel esquerdo
   *  mostra. Substitui o par `activeTab`/`isOpen` da antiga dock inferior: o
   *  painel agora está SEMPRE aberto, então não existe estado "fechado". */
  const [railTarget, setRailTarget] = useState<RailTarget>('componentes');

  /**
   * Vínculos da aba, persistidos com o trabalho dela (`editorStorage`):
   * - `temaAtual`: o tema do histórico em que "Salvar versão" grava;
   * - `previewAtual`: o id do preview que esta aba mantém atualizado. Nasce no
   *   "Pré-visualizar" ou no "Editar" do /p, e a partir daí cada edição regrava
   *   o MESMO id (ver o efeito "Preview ao vivo").
   */
  const [temaAtual, setTemaAtual] = useState<TemaAtual | null>(null);
  const [previewAtual, setPreviewAtual] = useState<string | null>(null);

  /**
   * Estado vazio do canvas: a aba nova abre sem layout e convida a escolher um
   * template ou a começar do zero. "Começar do zero" liga isto (transiente) e
   * o convite some até a aba recarregar vazia de novo.
   */
  const [inicioEscolhido, setInicioEscolhido] = useState(false);
  /** Carregando um tema de fora (o "Editar" do /p): o convite espera. */
  const [carregandoExterno, setCarregandoExterno] = useState(false);

  /**
   * Modo do editor e o estado do checkout. O modo é persistido (`editorMode`)
   * e o checkout tem chave própria (`checkout`): `{ model, variables, etapa }`,
   * em que `variables` é o NÍVEL 1 do contrato do checkout-vtex — o que vai em
   * `faststore.checkout.variables`. A etapa é navegação, como `selectedPage`:
   * persiste, mas não entra no histórico.
   */
  const [editorMode, setEditorModeState] = useState<EditorMode>('loja');
  const [checkout, setCheckout] = useState<CheckoutState>(CHECKOUT_PADRAO);

  /**
   * As seções ATIVAS: as da loja, ou as da LP no modo LP. Todo o resto do hook
   * (adicionar, mover, duplicar, remover, variáveis, histórico do canvas) opera
   * sobre este par, então o modo LP reusa o editor inteiro sem um ramo por ação.
   * O setter lê o modo de um ref: callbacks antigos (useCallback com deps vazias)
   * continuam escrevendo na lista do modo em que o usuário ESTÁ.
   */
  const emLp = editorMode === 'lp';
  const selections = emLp ? lp.selections : lojaSelections;
  const modoRef = useRef<EditorMode>(editorMode);
  modoRef.current = editorMode;
  const setSelections = useCallback(
    (update: SetStateAction<LayoutSelection[]>) => {
      if (modoRef.current === 'lp') {
        setLp(prev => ({
          ...prev,
          selections:
            typeof update === 'function' ? update(prev.selections) : update,
        }));
      } else {
        setLojaSelections(update);
      }
    },
    []
  );
  /**
   * O logo como ele entra no header do checkout (≤ 280×64 em raster), com o
   * logo de onde saiu: a redução é assíncrona, e até ela voltar o header ainda
   * mostra o anterior (`logoCheckoutPendente`).
   */
  const [logoReduzido, setLogoReduzido] = useState({ de: '', valor: '' });

  /** Painéis recolhidos. Existem para devolver largura ao canvas: as colunas
   *  fixas comem 840px, e num monitor de 1440 sobram 536 — abaixo da trava de
   *  1200px de `.component__container`, o que faria o preview "Desktop"
   *  renderizar no tier de tablet. */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  /**
   * Zoom do canvas. `fit` encolhe o frame para caber na coluna; os fixos
   * mostram o tema em fração real e deixam panoramar.
   *
   * Existe porque o preview "Desktop" não era desktop: o frame tinha a largura
   * que sobrasse da coluna — 576px numa tela de 1440, 1016px numa de 1920 — e
   * 60 dos 69 CSS de template têm media query abaixo de 1200. O cliente
   * escolhia "Desktop" e via o tema em layout de celular. Agora a largura
   * lógica é fixa e o que muda é a escala.
   */
  const [zoomMode, setZoomMode] = useState<ZoomMode>('fit');

  /** Página aberta no canvas: "home" | "category" | "product". Vive aqui (e
   *  não na page) porque o canvas, o painel de seções, o iframe mobile e o
   *  palco de export todos precisam dela. */
  const [paginaDaLoja, setSelectedPage] = useState<string>('home');
  /** No modo LP a "página" é sempre a de miolo: as seções da LP são de home. */
  const selectedPage = emLp ? 'home' : paginaDaLoja;

  /** Seção selecionada no canvas/painel. Transiente: não é persistida. */
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  /** Seção sob o cursor no canvas — usada só para destacar a linha do painel.
   *  O contorno NO CANVAS é imperativo (atributo `data-hovered`, ver
   *  useCanvasInteractions); este estado existe para o caminho inverso. */
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);

  /**
   * Linhas expandidas no painel de seções. Várias ao mesmo tempo, cada uma
   * alternando sozinha.
   *
   * Mora AQUI e não no `SectionRow` por três motivos medidos: o "recolher
   * todas" precisa alcançar todas de uma vez; `SectionRowView` é montado duas
   * vezes durante um arraste (o clone do `DragOverlay` nasceria fechado); e o
   * painel esquerdo é desmontado a cada troca de destino do rail, o que
   * apagaria o estado por instância.
   *
   * Transiente como o `selectedUid`: não persiste e não entra no histórico.
   */
  const [expandedUids, setExpandedUids] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const toggleExpanded = useCallback((uid: string) => {
    setExpandedUids(prev => {
      const next = new Set(prev);
      if (!next.delete(uid)) next.add(uid);
      return next;
    });
  }, []);

  const collapseAllSections = useCallback(() => setExpandedUids(new Set()), []);

  /**
   * Selecionar EXPANDE — mas como ESCRITA, não como derivação.
   *
   * É exatamente essa a diferença que conserta o bug relatado. Antes o
   * `SectionRow` fazia `expanded = open || selected`: enquanto a linha
   * estivesse selecionada, nenhum valor de `open` conseguia produzir `false`,
   * então o botão "−" não fechava nada e a linha só cedia quando OUTRA era
   * selecionada. Escrevendo no set, `expanded` passa a ler uma fonte só e o
   * toggle volta a mandar.
   */
  /* `uid: null` desseleciona (clique fora de qualquer seção no canvas). Nesse
     caso o conjunto de linhas abertas fica INTACTO: recolher o acordeão junto
     faria o usuário perder o contexto que ele abriu à mão só por ter clicado no
     fundo — e `expandedUids` é estado próprio, não derivado da seleção. */
  const selectSection = useCallback((uid: string | null) => {
    setSelectedUid(uid);
    if (!uid) return;
    setExpandedUids(prev => (prev.has(uid) ? prev : new Set(prev).add(uid)));
  }, []);

  /**
   * Canal imperativo para o iframe do canvas. O `PreviewFrame` registra aqui um
   * dispatcher; o `SectionsPanel` o chama para rolar até uma seção.
   *
   * É um ref, e não estado, porque a mesma seção pode ser clicada duas vezes
   * seguidas — um `setState` com o mesmo uid não dispararia efeito nenhum.
   * (O hover não precisa disso: `hoveredUid` é estado e o PreviewFrame reage a
   * ele com um `postMessage` de `highlight`.)
   */
  const scrollToSectionRef = useRef<((uid: string) => void) | null>(null);

  /** Define (imutavelmente) o valor de uma variável individual de um item. */
  const setItemVariable = (uid: string, cssVar: string, value: string) => {
    setSelections(prev =>
      prev.map(s =>
        s.uid === uid
          ? { ...s, variables: { ...(s.variables ?? {}), [cssVar]: value } }
          : s
      )
    );
  };

  /** Limpa todos os overrides de variáveis de um item. */
  const resetItemVariables = (uid: string) => {
    setSelections(prev =>
      prev.map(s => (s.uid === uid ? { ...s, variables: {} } : s))
    );
  };

  /** Papel do checkout (nível 1). Grava o que veio; o compose só lê o que é válido. */
  const setCheckoutVariable = useCallback((cssVar: string, value: string) => {
    setCheckout(prev => ({
      ...prev,
      variables: { ...prev.variables, [cssVar]: value },
    }));
  }, []);

  /** Volta todos os papéis a herdar (nível 2 da loja → nível 3 do Figma). */
  const resetCheckoutVariables = useCallback(() => {
    setCheckout(prev => ({ ...prev, variables: {} }));
  }, []);

  const setCheckoutEtapa = useCallback((etapa: CheckoutEtapa) => {
    setCheckout(prev => (prev.etapa === etapa ? prev : { ...prev, etapa }));
  }, []);

  /**
   * Reordena duas seções. O arrayMove roda sobre os índices do array COMPLETO
   * `selections` (não do filtrado/ordenado por página) — é dele que a ordem de
   * render deriva, via o `sort` estável de `selectionsForPage`.
   */
  const moveSection = (activeUid: string, overUid: string) => {
    if (activeUid === overUid) return;
    setSelections(prev => {
      const oldIndex = prev.findIndex(item => item.uid === activeUid);
      const newIndex = prev.findIndex(item => item.uid === overUid);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  /** Duplica uma seção, inserindo a cópia imediatamente abaixo do original. */
  const duplicateSection = (uid: string) => {
    setSelections(prev => {
      const index = prev.findIndex(i => i.uid === uid);
      if (index === -1) return prev;

      const duplicated = { ...prev[index], uid: crypto.randomUUID() };

      return [
        ...prev.slice(0, index + 1),
        duplicated,
        ...prev.slice(index + 1),
      ];
    });
  };

  /** Remove uma seção. */
  const removeSection = (uid: string) => {
    setSelections(prev => prev.filter(item => item.uid !== uid));
    setSelectedUid(prev => (prev === uid ? null : prev));
    // Sem podar, o uid de uma seção removida ficaria no set para sempre — e
    // um `crypto.randomUUID()` futuro nunca colide, então é vazamento puro.
    setExpandedUids(prev => {
      if (!prev.has(uid)) return prev;
      const next = new Set(prev);
      next.delete(uid);
      return next;
    });
  };

  const [fontPrimary, setFontPrimary] = useState('Roboto');
  const [fontSecondary, setFontSecondary] = useState('Poppins');
  const [fontTertiary, setFontTertiary] = useState('Open Sans');

  const [logo, setLogo] = useState<string>('');
  const logoCheckout = logoReduzido.valor;
  const logoCheckoutPendente = logoReduzido.de !== logo;
  const [favicon, setFavicon] = useState<string>('');
  /** Imagem de compartilhamento (og:image) do preview. Data URL, como as outras. */
  const [ogImage, setOgImage] = useState<string>('');

  /** false no SSR e no 1º render do cliente; vira true após hidratar do
   *  localStorage. Garante que o 1º render do cliente == servidor (sem
   *  hydration mismatch) e impede que os efeitos de save sobrescrevam o
   *  localStorage com os defaults antes do load rodar. */
  const [hydrated, setHydrated] = useState(false);
  const [colorPrimary, setColorPrimary] = useState('#1a1a1a');
  const [colorSecondary, setColorSecondary] = useState('#ffffff');
  const [colorTertiary, setColorTertiary] = useState('#fff');
  const [colorPrimaryBackground, setColorPrimaryBackground] = useState('#000');
  const [colorSecondaryBackground, setColorSecondaryBackground] =
    useState('#dd1838');
  const [colorTertiaryBackground, setColorTertiaryBackground] =
    useState('#000');
  const [colorFooter, setColorFooter] = useState('#1A051C');
  const [colorFooterText, setColorFooterText] = useState('#94A3B8');
  const [colorPrimaryText, setColorPrimaryText] = useState('#fff');
  const [colorSecondaryText, setColorSecondaryText] = useState('#51ff00');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wakePopupRef.current &&
        !wakePopupRef.current.contains(event.target as Node)
      ) {
        setShowWakePopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      estadoDaAba.set(
        'colors',
        JSON.stringify({
          colorPrimary,
          colorSecondary,
          colorTertiary,
          colorPrimaryBackground,
          colorSecondaryBackground,
          colorTertiaryBackground,
          colorFooter,
          colorFooterText,
          colorPrimaryText,
          colorSecondaryText,
        })
      );
    } catch (e) {
      console.error('Erro ao salvar cores:', e);
    }
  }, [
    hydrated,
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
  ]);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const storedColors = estadoDaAba.get('colors');
      if (storedColors) {
        const parsed = JSON.parse(storedColors);
        setColorPrimary(parsed.colorPrimary || '#1a1a1a');
        setColorSecondary(parsed.colorSecondary || '#ffffff');
        setColorTertiary(parsed.colorTertiary || '#fff');

        setColorPrimaryBackground(parsed.colorPrimaryBackground || '#000');
        setColorSecondaryBackground(
          parsed.colorSecondaryBackground || '#dd1838'
        );
        setColorTertiaryBackground(parsed.colorTertiaryBackground || '#000');

        setColorFooter(parsed.colorFooter || '#1A051C');
        setColorFooterText(parsed.colorFooterText || '#94A3B8');

        setColorPrimaryText(parsed.colorPrimaryText || '#fff');
        setColorSecondaryText(parsed.colorSecondaryText || '#51ff00');
      }
    } catch (e) {
      console.error('Erro ao carregar cores:', e);
    }
  }, []);

  /**
   * Põe uma família inteira na loja e a cara dela (paleta e fontes do desenho,
   * `t.tema`), sem perguntar nada: quem pergunta é o `aplicarTemplate`. Tudo no
   * mesmo render, para o histórico ver UMA mudança. As três cores derivadas são
   * recalculadas aqui mesmo (e não pelo efeito de contraste, que viria num
   * render seguinte e abriria outra entrada). `fundos` são os fundos de agora,
   * que ficam quando a família não define o seu.
   */
  const vestirTemplate = useCallback(
    (
      t: TemplateCompleto,
      fundos: { primary: string; secondary: string; tertiary: string }
    ) => {
      const cores = t.tema?.colors ?? {};
      const fontes = t.tema?.fonts;
      setLojaSelections(selecoesDoTemplate(t));
      if (cores.colorPrimary) setColorPrimary(cores.colorPrimary);
      if (cores.colorSecondary) setColorSecondary(cores.colorSecondary);
      if (cores.colorFooter) setColorFooter(cores.colorFooter);
      if (cores.colorFooterText) setColorFooterText(cores.colorFooterText);
      const bg1 = cores.colorPrimaryBackground ?? fundos.primary;
      const bg2 = cores.colorSecondaryBackground ?? fundos.secondary;
      const bg3 = cores.colorTertiaryBackground ?? fundos.tertiary;
      setColorPrimaryBackground(bg1);
      setColorSecondaryBackground(bg2);
      setColorTertiaryBackground(bg3);
      setColorPrimaryText(contrastOn(bg1));
      setColorSecondaryText(contrastOn(bg2));
      setColorTertiary(contrastOn(bg3));
      if (fontes) {
        setFontPrimary(fontes.fontPrimary);
        setFontSecondary(fontes.fontSecondary);
        setFontTertiary(fontes.fontTertiary);
      }
      setSelectedUid(null);
      setSelectedPage('home');
      setRailTarget('componentes');
    },
    []
  );

  /**
   * A entrada padrão (`ENTRADA_PADRAO`): plataforma + template completo, como o
   * "Por template" aplica, mas sem `confirm` (não há nada a perder). Só a aba
   * que começa sem nada chega aqui. Devolve false se o template padrão deixou
   * de ser completo — aí a aba fica vazia, com o convite do canvas.
   */
  const entrarComOPadrao = useCallback((): boolean => {
    const t = templatePadrao();
    if (!t) return false;
    setPlatform(ENTRADA_PADRAO.platform);
    // Os fundos iniciais dos `useState` acima: a aba ainda não tem outros.
    vestirTemplate(t, {
      primary: '#000',
      secondary: '#dd1838',
      tertiary: '#000',
    });
    return true;
  }, [vestirTemplate]);

  /** A aba começou sem trabalho nenhum (medido na hidratação, antes de gravar). */
  const abaNovaRef = useRef(false);

  // Hidratação do estado persistido (selections/platform/logo/favicon) — só
  // após o mount, para o 1º render do cliente bater com o SSR. `hydrated`
  // libera os efeitos de save abaixo (que senão gravariam os defaults vazios).
  //
  // Aba sem trabalho e sem tema chegando pela URL (o `?preview=` do "Editar")
  // entra com o template padrão AQUI, no mesmo render que liga `hydrated`: o
  // convite do canvas nunca chega a pintar, e o histórico de desfazer nasce
  // com o template como ponto de partida — não há "Voltar" para a tela vazia.
  useEffect(() => {
    abaNovaRef.current = abaSemTrabalho();
    const temaPelaUrl = new URLSearchParams(window.location.search).has(
      'preview'
    );
    try {
      // Validados: o localStorage pode ter sido escrito por uma versão antiga
      // do catálogo (ou pela rota /gerador/import-log, que grava valor cru).
      const storedSelections = estadoDaAba.get('layoutSelections');
      if (storedSelections) {
        setLojaSelections(sanitizeSelections(JSON.parse(storedSelections)));
      }
      const storedPlatform = sanitizePlatform(
        estadoDaAba.get('layoutPlatform')
      );
      setPlatform(storedPlatform);
      const storedMode = sanitizeEditorMode(
        estadoDaAba.get('editorMode'),
        storedPlatform
      );
      setEditorModeState(storedMode);
      // "Componentes" não existe no checkout (ver `setEditorMode`): sem isto o
      // reload no modo Checkout deixava o rail sem nenhum destino aceso.
      if (storedMode === 'checkout') setRailTarget('variaveis');
      // Try próprio: um `checkout` ilegível não pode abortar a hidratação do
      // logo/favicon abaixo — com `hydrated` ligado no finally, os saves
      // gravariam os defaults vazios por cima do que estava guardado.
      try {
        const storedLp = estadoDaAba.get('lp');
        if (storedLp) setLp(sanitizeLp(JSON.parse(storedLp)));
      } catch (e) {
        console.error('LP guardada ilegível, usando a inicial:', e);
      }
      try {
        const storedCheckout = estadoDaAba.get('checkout');
        if (storedCheckout)
          setCheckout(sanitizeCheckout(JSON.parse(storedCheckout)));
      } catch (e) {
        console.error('Checkout guardado ilegível, usando o padrão:', e);
      }
      setLogo(estadoDaAba.get('logo') || '');
      setFavicon(estadoDaAba.get('favicon') || '');
      setOgImage(estadoDaAba.get('ogImage') || '');
      setWakeCustomValue(estadoDaAba.get('wakeToken') || '');
      try {
        const tema = JSON.parse(estadoDaAba.get('temaAtual') ?? 'null');
        if (
          tema &&
          typeof tema.id === 'string' &&
          typeof tema.nome === 'string'
        )
          setTemaAtual({ id: tema.id, nome: tema.nome });
      } catch {
        /* vínculo ilegível: a aba só não sabe em que tema salva */
      }
      setPreviewAtual(estadoDaAba.get('previewAtual') || null);
      setLeftCollapsed(localStorage.getItem('panelLeftCollapsed') === '1');
      setRightCollapsed(localStorage.getItem('panelRightCollapsed') === '1');
      const zoom = localStorage.getItem('canvasZoom');
      if (zoom && (ZOOM_MODES as readonly string[]).includes(zoom))
        setZoomMode(zoom as ZoomMode);
      if (abaNovaRef.current && !temaPelaUrl) entrarComOPadrao();
    } catch (e) {
      console.error('Erro ao carregar estado do layout:', e);
    } finally {
      setHydrated(true);
    }
  }, [entrarComOPadrao]);

  useEffect(() => {
    setColorPrimaryText(contrastOn(colorPrimaryBackground));
    setColorSecondaryText(contrastOn(colorSecondaryBackground));
    setColorTertiary(contrastOn(colorTertiaryBackground));
  }, [
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
  ]);

  /**
   * Tokens do tema no `:root` do editor.
   *
   * A lista vem de `buildThemeStyle`, a MESMA que o iframe e o /p aplicam como
   * estilo inline. Antes o editor repetia o mapa à mão e as duas cópias já
   * tinham divergido: aqui faltava `--font-tertiary` e a fonte ia sem as aspas
   * e sem o fallback.
   */
  useEffect(() => {
    const vars = buildThemeStyle(
      {
        colorPrimary,
        colorSecondary,
        colorTertiary,
        colorPrimaryBackground,
        colorSecondaryBackground,
        colorTertiaryBackground,
        colorFooter,
        colorFooterText,
        colorPrimaryText,
        colorSecondaryText,
      },
      { fontPrimary, fontSecondary, fontTertiary }
    ) as Record<string, string>;

    for (const [name, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(name, value);
    }
  }, [
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
    fontPrimary,
    fontSecondary,
    fontTertiary,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      estadoDaAba.set(
        'fonts',
        JSON.stringify({
          fontPrimary,
          fontSecondary,
          fontTertiary,
        })
      );
    } catch (e) {
      console.error('Erro ao salvar fontes:', e);
    }
  }, [hydrated, fontPrimary, fontSecondary, fontTertiary]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (logo) {
        estadoDaAba.set('logo', logo);
      } else {
        estadoDaAba.remove('logo');
      }
    } catch (e) {
      console.error('Erro ao salvar logo:', e);
    }
  }, [logo, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (favicon) {
        estadoDaAba.set('favicon', favicon);
      } else {
        estadoDaAba.remove('favicon');
      }
    } catch (e) {
      console.error('Erro ao salvar favicon:', e);
    }
  }, [favicon, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      estadoDaAba.set('checkout', JSON.stringify(checkout));
      estadoDaAba.set('editorMode', editorMode);
      estadoDaAba.set('lp', JSON.stringify(lp));
    } catch (e) {
      console.error('Erro ao salvar o checkout/LP:', e);
    }
  }, [checkout, editorMode, lp, hydrated]);

  /* Qualquer caminho que tire a plataforma de VTEX tira o editor do checkout —
     não só o `changePlatform`: a hidratação e o import-log também escrevem
     `platform`. */
  useEffect(() => {
    // Antes da hidratação `platform` ainda é o null do SSR: filtrar ali tiraria
    // do checkout o modo que a hidratação acabou de ler (os dois updates caem na
    // mesma fila, e este vem depois).
    if (!hydrated) return;
    setEditorModeState(prev => modeForPlatform(prev, platform));
  }, [platform, hydrated]);

  /* O logo do header do checkout é o MESMO que vai no export: reduzido uma vez
     aqui, e não no CheckoutFrame, para o preview mostrar os bytes que saem. */
  useEffect(() => {
    let vivo = true;
    reduzirLogo(logo)
      .then(v => vivo && setLogoReduzido({ de: logo, valor: v }))
      .catch(() => vivo && setLogoReduzido({ de: logo, valor: '' }));
    return () => {
      vivo = false;
    };
  }, [logo]);

  /** Entra/sai do modo Checkout ou LP. Fora da plataforma certa o pedido de entrar é ignorado. */
  const setEditorMode = useCallback(
    (mode: EditorMode) => {
      const efetivo = modeForPlatform(mode, platform);
      setEditorModeState(efetivo);
      // A seleção é de UM documento: a seção selecionada na loja não existe na LP.
      setSelectedUid(null);
      // "Componentes" não existe no checkout: a estrutura é fixa. Na LP é o
      // destino natural — montar a página é escolher seções.
      if (efetivo === 'checkout')
        setRailTarget(prev => (prev === 'componentes' ? 'variaveis' : prev));
      if (efetivo === 'lp') setRailTarget('componentes');
    },
    [platform]
  );

  /** Nome da LP (o slug da URL deriva dele). */
  const setLpNome = useCallback((nome: string) => {
    setLp(prev => (prev.nome === nome ? prev : { ...prev, nome }));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // Preferência de tela: vale para todas as abas (localStorage).
      localStorage.setItem('panelLeftCollapsed', leftCollapsed ? '1' : '0');
      localStorage.setItem('panelRightCollapsed', rightCollapsed ? '1' : '0');
      localStorage.setItem('canvasZoom', zoomMode);
    } catch (e) {
      console.error('Erro ao salvar estado dos painéis:', e);
    }
  }, [leftCollapsed, rightCollapsed, zoomMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // Trabalho da aba: o token é da loja do cliente, não do navegador.
      estadoDaAba.set('wakeToken', wakeCustomValue);
      if (temaAtual) estadoDaAba.set('temaAtual', JSON.stringify(temaAtual));
      else estadoDaAba.remove('temaAtual');
      if (previewAtual) estadoDaAba.set('previewAtual', previewAtual);
      else estadoDaAba.remove('previewAtual');
    } catch (e) {
      console.error('Erro ao salvar os vínculos da aba:', e);
    }
  }, [wakeCustomValue, temaAtual, previewAtual, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (ogImage) {
        estadoDaAba.set('ogImage', ogImage);
      } else {
        estadoDaAba.remove('ogImage');
      }
    } catch (e) {
      console.error('Erro ao salvar imagem de compartilhamento:', e);
    }
  }, [ogImage, hydrated]);

  useEffect(() => {
    try {
      const storedFonts = estadoDaAba.get('fonts');
      if (storedFonts) {
        const parsed = JSON.parse(storedFonts);
        setFontPrimary(parsed.fontPrimary || 'Roboto');
        setFontSecondary(parsed.fontSecondary || 'Poppins');
        setFontTertiary(parsed.fontTertiary || 'Open Sans');
      }
    } catch (e) {
      console.error('Erro ao carregar fontes:', e);
    }
  }, []);

  /** Refs para captura de tela */
  const desktopPreviewRef = useRef<HTMLDivElement | null>(null);
  const mobilePreviewRef = useRef<HTMLDivElement | null>(null);

  /**
   * O palco off-screen do export (ExportStage) só é montado durante a captura.
   * Antes ele ficava montado o tempo todo, o que montava CADA template 3×
   * (3× Swiper com observer/loop, 3× effects) competindo com o canvas.
   */
  const [isCapturing, setIsCapturing] = useState(false);
  const captureResolveRef = useRef<(() => void) | null>(null);

  /** Monta o palco off-screen e resolve quando o DOM já pintou. */
  const mountExportStage = () =>
    new Promise<void>(resolve => {
      captureResolveRef.current = resolve;
      setIsCapturing(true);
    });

  useEffect(() => {
    if (!isCapturing) return;
    const resolve = captureResolveRef.current;
    captureResolveRef.current = null;
    if (!resolve) return;
    // Dois frames: o 1º garante que o layout foi calculado, o 2º que o paint
    // aconteceu — é o que o html2canvas precisa. flushSync não serviria: ele
    // garantiria só o commit do React, e é ilegal dentro de um handler async.
    const id = requestAnimationFrame(() => requestAnimationFrame(resolve));
    return () => cancelAnimationFrame(id);
  }, [isCapturing]);

  /** Limpa a seleção quando a seção não pertence mais à página aberta. */
  useEffect(() => {
    if (!selectedUid) return;
    const current = selections.find(s => s.uid === selectedUid);
    if (!current || !belongsToPage(current, selectedPage)) {
      setSelectedUid(null);
    }
  }, [selectedUid, selectedPage, selections]);

  /** Alterna visualização entre desktop/mobile */
  const toggleMobileView = () => {
    setIsMobileView(prev => !prev);
  };

  /**
   * Troca de plataforma preservando o que é compatível.
   *
   * Antes isto era `setSelections([])`: trocar de plataforma apagava TODAS as
   * seções de todas as páginas, com os overrides de variáveis junto, sem aviso
   * nem desfazer. Agora só sai o que a plataforma de destino não oferece, e o
   * usuário confirma antes.
   *
   * Quem sobrevive vem inteiro — mesmo `uid`, mesma `pagina`, mesmo objeto
   * `variables`. Cores, fontes e assets nunca foram afetados e continuam assim.
   */
  const changePlatform = (value: Platform) => {
    setShowPlatformError(false);

    const loja = partitionByPlatform(lojaSelections, value);
    // Plataforma sem modo LP (Tray) não toca na LP: ela fica guardada como está e
    // volta inteira quando o usuário voltar para Wake/VTEX — perguntar por ela
    // aqui seria um diálogo sobre algo que a Tray nem mostra.
    const daLp = plataformaTemLp(value)
      ? partitionByPlatform(lp.selections, value)
      : { kept: lp.selections, lostTitles: [] as string[] };
    const lostTitles = [
      ...loja.lostTitles,
      ...daLp.lostTitles.map(t => `${t} (na LP)`),
    ];

    if (
      lostTitles.length > 0 &&
      !window.confirm(
        `Estas seções não existem na plataforma ${value} e serão removidas:\n\n` +
          lostTitles.map(t => `• ${t}`).join('\n') +
          `\n\nO restante do tema é preservado. Continuar?`
      )
    ) {
      return;
    }

    setPlatform(value);
    // Checkout é só VTEX: sair de VTEX sai do modo (o efeito de `platform`
    // cobre também quem escreve a plataforma sem passar por aqui).
    setEditorModeState(prev => modeForPlatform(prev, value));
    if (
      loja.kept.length !== lojaSelections.length ||
      daLp.kept.length !== lp.selections.length
    ) {
      const survivors = new Set([...loja.kept, ...daLp.kept].map(s => s.uid));
      setLojaSelections(loja.kept);
      setLp(prev => ({ ...prev, selections: daLp.kept }));
      // Não deixa o contorno do canvas nem o painel direito presos numa seção
      // que acabou de deixar de existir.
      setSelectedUid(prev => (prev && survivors.has(prev) ? prev : null));
    }

    if (value === 'Wake') {
      setShowWakePopup(true);
    }
  };

  /**
   * "Por template": troca TODAS as seções da loja pela família inteira, em todas
   * as páginas, e aplica a cara dela — a paleta e as fontes globais do desenho
   * (`t.tema`, utils/templatesCompletos.ts), via `vestirTemplate`. Tudo no mesmo
   * render: o histórico vê UMA mudança estrutural, então um undo desfaz peças,
   * cores e fontes juntas. Com seções já escolhidas pede confirmação. Leva para "Componentes" na home.
   * Devolve false se o usuário cancelou.
   */
  const aplicarTemplate = (t: TemplateCompleto): boolean => {
    const cores = t.tema?.colors ?? {};
    const fontes = t.tema?.fonts;
    const oQueMuda =
      Object.keys(cores).length && fontes
        ? `A paleta e as fontes globais passam a ser as do template (${fontes.fontPrimary}` +
          `${fontes.fontSecondary !== fontes.fontPrimary ? ` + ${fontes.fontSecondary}` : ''}).`
        : fontes
          ? `As fontes globais passam a ser as do template (${fontes.fontPrimary}` +
            `${fontes.fontSecondary !== fontes.fontPrimary ? ` + ${fontes.fontSecondary}` : ''}); as cores não mudam.`
          : 'Cores e fontes não mudam.';
    const proprias = t.comCorPropria
      ? ` ${t.comCorPropria} seções ganham cor própria para ficar como o desenho ` +
        `(o painel da direita mostra e volta à cor global).`
      : '';
    if (
      lojaSelections.length > 0 &&
      !window.confirm(
        `Aplicar o template ${t.nome}?\n\nAs ${lojaSelections.length} seções ` +
          `escolhidas hoje serão substituídas pelas ${t.itens.length} peças do ` +
          `template, em todas as páginas. ${oQueMuda}${proprias}\n\nDá para desfazer com Voltar.`
      )
    ) {
      return false;
    }
    vestirTemplate(t, {
      primary: colorPrimaryBackground,
      secondary: colorSecondaryBackground,
      tertiary: colorTertiaryBackground,
    });
    return true;
  };

  const toggleSelection = (
    id: string,
    layoutKey: LayoutKey,
    pagina: string
  ) => {
    setSelections(prev => {
      const item = LAYOUTS[layoutKey].items.find(i => i.id === id);
      if (!item) return prev;

      // helper para saber se um selection é showcase
      const isShowcaseEntry = (s: LayoutSelection) => {
        const found = LAYOUTS[s.layoutKey].items.find(i => i.id === s.id);
        return found?.selection === 'showcase';
      };

      // 👉 Regras especiais para showcase
      if (item.selection === 'showcase') {
        const existingShowcases = prev.filter(isShowcaseEntry);

        // 1) Não existe nenhum showcase ainda → adicionar (respeita MAX_PER_PAGE da página alvo)
        if (existingShowcases.length === 0) {
          const countInPage = prev.filter(p => p.pagina === pagina).length;
          if (countInPage >= MAX_PER_PAGE) return prev;
          return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
        }

        // 2) Já existe o MESMO showcase → pode duplicar (respeita MAX_PER_PAGE da página alvo)
        const sameShowcaseExists = existingShowcases.some(
          s => s.id === id && s.layoutKey === layoutKey
        );
        if (sameShowcaseExists) {
          const countInPage = prev.filter(p => p.pagina === pagina).length;
          if (countInPage >= MAX_PER_PAGE) return prev;
          return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
        }

        // 3) Existe showcase DIFERENTE → substituir TODOS os showcases mantendo suas páginas
        // (não checa MAX_PER_PAGE, pois é substituição 1-para-1, a contagem por página não aumenta)
        const replaced = prev.map(s => {
          if (isShowcaseEntry(s)) {
            return {
              uid: crypto.randomUUID(),
              id,
              layoutKey,
              pagina: s.pagina, // mantemos a página de cada showcase existente
            };
          }
          return s;
        });
        return replaced;
      }

      // Singleton de página: só um por página, e escolher outro SUBSTITUI o que
      // está lá, na mesma posição e na mesma página.
      //
      // Isto eram SETE ramos `if` byte-idênticos, um por `selection`, dentro de uma
      // função de 299 linhas — e a lista deles era mantida à mão em paralelo com o
      // `NON_DUPLICABLE_SELECTIONS`. Duas listas do mesmo conjunto divergem: foi
      // assim que o botão de duplicar apareceu em slot que aqui já era singleton.
      // Agora as duas saem de `sectionRules`.
      if (PAGE_SINGLETON_SELECTIONS.has(item.selection)) {
        const ocupaOSlot = (s: LayoutSelection) =>
          LAYOUTS[s.layoutKey].items.find(i => i.id === s.id)?.selection ===
          item.selection;

        const ocupantes = prev.filter(ocupaOSlot);

        if (ocupantes.length > 0) {
          // Todos já são este item: nada a fazer (não regerar uid à toa).
          if (ocupantes.every(o => o.id === id && o.layoutKey === layoutKey))
            return prev;

          // Substitui TODAS as ocorrências, como o ramo do showcase já fazia.
          // Com `findIndex` só a primeira trocava, e um estado legado com dois
          // `banner-main` virava ["banner:06","banner:01"] — dois modelos
          // diferentes no mesmo slot, incoerência que a UI não sabe desfazer.
          // Trocar todas mantém a contagem (nada some em silêncio) e o estado
          // volta a ser coerente.
          return prev.map(s =>
            ocupaOSlot(s)
              ? {
                  uid: crypto.randomUUID(),
                  id,
                  layoutKey,
                  pagina: s.pagina, // mantém a página de quem estava lá
                }
              : s
          );
        }

        const countInPage = prev.filter(p => p.pagina === pagina).length;
        if (countInPage >= MAX_PER_PAGE) return prev;
        return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
      }

      // 👉 Itens não-showcase (mantém sua lógica original)

      // regra especial para "common"
      if (pagina === 'common') {
        const alreadySelectedIndex = prev.findIndex(
          s =>
            s.pagina === 'common' &&
            s.layoutKey === layoutKey &&
            LAYOUTS[s.layoutKey].items.find(i => i.id === s.id)?.selection ===
              item.selection
        );

        if (alreadySelectedIndex !== -1) {
          const newSelections = [...prev];
          newSelections[alreadySelectedIndex] = {
            uid: crypto.randomUUID(),
            id,
            layoutKey,
            pagina: 'common',
          };
          return newSelections;
        }

        const newSelections = item.pagina.map(p => ({
          uid: crypto.randomUUID(),
          id,
          layoutKey,
          pagina: p,
        }));

        return [...prev, ...newSelections];
      }

      // limite por página só para ADIÇÃO (não afeta substituições)
      const countInPage = prev.filter(p => p.pagina === pagina).length;
      if (countInPage >= MAX_PER_PAGE) return prev;

      return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
    });
  };

  /** As variáveis globais no formato Tray/Wake (loja e LP usam as mesmas). */
  const variaveisTrayWake = () => ({
    fontPrimary,
    fontSecondary,
    fontTertiary,
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
    colorPrimaryBackgroundSafe: colorSafeOnWhite(colorPrimaryBackground),
  });

  /** O nível 2 do VTEX (o mesmo do checkout e do tema da loja). */
  const variaveisVtex = () =>
    variaveisGlobais(
      {
        colorPrimary,
        colorSecondary,
        colorTertiary,
        colorPrimaryBackground,
        colorSecondaryBackground,
        colorTertiaryBackground,
        colorFooter,
        colorFooterText,
        colorPrimaryText,
        colorSecondaryText,
      },
      { fontPrimary, fontSecondary, fontTertiary }
    );

  /**
   * O config do modo LP: SÓ a LP (`tipo: "lp"`), sem tema de loja. As seções
   * saem na ordem da página e cada entrada tem o formato de uma entrada de
   * `home` — o generator as monta como monta a home. Contrato com o generator
   * em produtos-template-generator (LandingProcessor / BuildPipeline).
   */
  const buildLpConfigJson = async (): Promise<Record<
    string,
    unknown
  > | null> => {
    if (!platform) return null;
    const landingPage = { slug: slugDaLp(lp.nome), nome: lp.nome.trim() };
    const resolvidas = lp.selections
      .map(sel => ({
        sel,
        found: LAYOUTS[sel.layoutKey]?.items.find(
          i => i.id === sel.id && i.platforms.includes(platform)
        ),
      }))
      .filter(
        (r): r is { sel: LayoutSelection; found: LayoutItem } => !!r.found
      );

    if (platform === 'VTEX') {
      const config = {
        platform: 'faststore',
        tipo: 'lp',
        faststore: {
          landingPage,
          landing: resolvidas
            .filter(({ found }) => found.path && !found.override)
            .map(({ found, sel }) => {
              const variables = pickChangedVariables(found, sel);
              return {
                component: found.path as string,
                title: found.component,
                key: found.key,
                ...(variables ? { variables } : {}),
              };
            }),
          variables: variaveisVtex(),
          assets: { logo: await reduzirLogo(logo), favicon, ogImage },
        },
      };
      console.log(config);
      return config;
    }

    const plat = platform.toLowerCase();
    const config: Record<string, unknown> = {
      platform: plat,
      tipo: 'lp',
      [plat]: {
        landingPage,
        landing: resolvidas.map(({ found, sel }) => {
          const variables = pickChangedVariables(found, sel);
          return {
            template: found.template,
            selection: found.selection,
            title: found.title,
            key: found.key,
            pagina: found.pagina,
            ...(variables ? { variables } : {}),
          };
        }),
        variables: variaveisTrayWake(),
        assets: { logo, favicon, ogImage },
      },
    };
    if (plat === 'wake') config.wakeToken = wakeCustomValue;
    console.log(config);
    return config;
  };

  /** Monta JSON de configuração com dados globais e por página */
  const buildConfigJson = async (): Promise<Record<string, unknown> | null> => {
    if (!platform) return null;

    if (emLp) return buildLpConfigJson();

    if (platform === 'VTEX') {
      return buildFaststoreConfigJson();
    }

    const mapToConfig = (item: LayoutSelection) => {
      const section = LAYOUTS[item.layoutKey];
      const found: LayoutItem | undefined = section.items.find(
        i => i.id === item.id && i.platforms.includes(platform as Platform)
      );
      if (!found) return null;

      const variables = pickChangedVariables(found, item);

      return {
        template: found.template,
        selection: found.selection,
        title: found.title,
        key: found.key,
        pagina: found.pagina,
        ...(variables ? { variables } : {}),
      };
    };

    const globalItems = selections
      .filter(s => {
        const section = LAYOUTS[s.layoutKey];
        const found = section.items.find(i => i.id === s.id);
        return found?.pagina.includes('common');
      })
      .map(mapToConfig)
      .filter(Boolean);

    const pageItems = selections
      .filter(s => {
        const section = LAYOUTS[s.layoutKey];
        const found = section.items.find(i => i.id === s.id);
        return found && !found.pagina.includes('common');
      })
      .map(mapToConfig)
      .filter(Boolean)
      .reduce<Record<string, ReturnType<typeof mapToConfig>[]>>((acc, item) => {
        if (!item) return acc;
        const paginas = Array.isArray(item.pagina)
          ? item.pagina
          : [item.pagina];
        paginas.forEach(pg => {
          if (!acc[pg]) acc[pg] = [];
          acc[pg].push(item);
        });
        return acc;
      }, {});

    const config: Record<string, unknown> = {
      platform: platform.toLowerCase(),
      [platform.toLowerCase()]: {
        global: globalItems,
        variables: variaveisTrayWake(),
        assets: {
          logo,
          favicon,
          ogImage,
        },
        ...pageItems,
      },
    };

    if (platform.toLowerCase() === 'wake') {
      (config as Record<string, unknown>).wakeToken = wakeCustomValue;
    }

    console.log(config);
    return config;
  };

  /** Monta JSON de configuração no formato faststore para plataforma VTEX */
  const buildFaststoreConfigJson = async (): Promise<
    Record<string, unknown>
  > => {
    const mapToFaststoreItem = (item: LayoutSelection) => {
      const section = LAYOUTS[item.layoutKey];
      const found: LayoutItem | undefined = section.items.find(
        i => i.id === item.id && i.platforms.includes('VTEX')
      );
      if (!found || !found.path) return null;
      return { found, item };
    };

    const allMapped = selections.map(mapToFaststoreItem).filter(Boolean) as {
      found: LayoutItem;
      item: LayoutSelection;
    }[];

    type FaststoreEntry = {
      component: string;
      title: string;
      key: string;
      variables?: Record<string, string>;
    };

    const toEntry = ({
      found,
      item,
    }: {
      found: LayoutItem;
      item: LayoutSelection;
    }): FaststoreEntry => {
      const variables = pickChangedVariables(found, item);
      return {
        component: found.path as string,
        title: found.component,
        key: found.key,
        ...(variables ? { variables } : {}),
      };
    };

    const overrideItems = allMapped
      .filter(({ found }) => found.override === true)
      .map(toEntry);

    // Auto-inject CrossSellingShelf01 override whenever ProductShowcase01 is selected
    const hasProductShowcase = allMapped.some(
      ({ found }) => found.path === 'organisms/ProductShowcase01'
    );
    if (hasProductShowcase) {
      overrideItems.push({
        component: 'overrides/CrossSellingShelf01',
        title: 'CrossSellingShelf01',
        key: 'crosssel01auto',
      });
    }

    const globalItems = allMapped
      .filter(({ found }) => !found.override && found.pagina.includes('common'))
      .map(toEntry);

    const pageItems = allMapped
      .filter(
        ({ found }) => !found.override && !found.pagina.includes('common')
      )
      .reduce<Record<string, FaststoreEntry[]>>((acc, mapped) => {
        mapped.found.pagina.forEach(pg => {
          if (!acc[pg]) acc[pg] = [];
          acc[pg].push(toEntry(mapped));
        });
        return acc;
      }, {});

    // Nível 2 do checkout = as variáveis globais da loja. A MESMA função que o
    // preview do checkout usa, para as duas pontas não divergirem.
    const variables = variaveisVtex();

    // O logo do tema VTEX só é usado no header do checkout (o do Header é
    // conteúdo de CMS): sai reduzido a ≤ 280×64 em raster, o mesmo que o
    // preview mostra. O upload aceita 2 MB e o data URL vai inteiro no template
    // do Admin; acima de 100 KB o compose não o embute (aviso, gate0 #17): o
    // header sai com {{LOGO_SRC}} para o time trocar. URL https vai como veio.
    const logoDoTema = await reduzirLogo(logo);
    const blocoCheckout = blocoDoConfig(checkout);

    // O compose do checkout roda aqui também, como conferência: o que ele recusa
    // o generator recusa na VALIDATE, e é melhor o time saber agora. Não barra o
    // export — o config continua sendo o entregável. Só lança o que é exclusivo
    // do checkout (gate0 #14b); nível 2 inválido, a guarda de visibilidade e o
    // logo recusado (#14a, #17) voltam como avisos, que o generator também dá
    // sem abortar — ficam no console, e o painel do checkout já os mostra.
    try {
      const base = await carregarBase();
      const { avisos } = comporParaExport(base, {
        level2: variables,
        level1: blocoCheckout.variables,
        logo: logoDoTema || null,
        version: blocoCheckout.version,
      });
      const relevantes = avisos.filter(
        a => a.codigo !== 'placeholder-manual' && a.codigo !== 'logo-ausente'
      );
      if (relevantes.length)
        console.warn(
          'Avisos do checkout VTEX neste tema:',
          relevantes.map(a => `${a.codigo}: ${a.mensagem}`)
        );
    } catch (error) {
      console.error('O checkout não compõe com este tema:', error);
      window.alert(
        `O checkout VTEX não compõe com este tema: ${
          error instanceof Error ? error.message : String(error)
        }\n\nO config.json será entregue assim mesmo; o generator vai recusar o checkout.`
      );
    }

    const config: Record<string, unknown> = {
      platform: 'faststore',
      faststore: {
        global: globalItems,
        // Chave ADITIVA: até aqui o shape faststore não tinha `assets` nenhum e
        // logo, favicon e imagem de compartilhamento eram descartados em silêncio
        // em todo export VTEX. O template-generator ignora chaves que não
        // conhece, então incluir não quebra quem já consome o arquivo.
        assets: {
          logo: logoDoTema,
          favicon,
          ogImage,
        },
        variables,
        // Sempre presente em VTEX (checkout-vtex/docs/contrato.md): o checkout
        // sai em todo tema e herda as cores da loja; `variables` é o nível 1.
        checkout: blocoCheckout,
        home: pageItems['home'] ?? [],
        category: pageItems['category'] ?? [],
        product: pageItems['product'] ?? [],
        overrides: overrideItems,
      },
    };

    console.log(config);
    return config;
  };

  /** Exporta capturas de tela e envia JSON por e-mail */
  const exportLayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      setShowPlatformError(true);
      return;
    }
    setShowPlatformError(false);

    // O palco só existe durante a captura; espera o paint antes de fotografar.
    //
    // As capturas são melhor-esforço: se o html2canvas falhar, o usuário ainda
    // tem que receber o config.json — que é o entregável real. Antes um ref
    // nulo fazia a função voltar calada (sem PNG, sem JSON, sem aviso) e uma
    // captura rejeitada deixava `isCapturing` preso em true, com o palco
    // off-screen montado para sempre.
    await mountExportStage();
    try {
      const desktop = desktopPreviewRef.current;
      const mobile = mobilePreviewRef.current;
      if (!desktop || !mobile) throw new Error('Palco de exportação ausente');

      // Sem estes awaits os PNGs sairiam com imagens em branco e texto na
      // fonte fallback: montado sob demanda, o palco não teve o tempo que
      // antes tinha (ficava montado desde o load da página). É uma regressão
      // silenciosa — ninguém confere o PNG — então não remova.
      await Promise.all([
        waitForImages(desktop),
        waitForImages(mobile),
        document.fonts.ready,
      ]);

      const prefixo = emLp ? `lp-${slugDaLp(lp.nome)}` : 'layout';
      await captureAndDownloadScreenshot(desktop, `${prefixo}-desktop.png`);
      await captureAndDownloadScreenshot(mobile, `${prefixo}-mobile.png`);
    } catch (error) {
      console.error('Falha ao gerar as imagens do tema:', error);
      window.alert(
        'Não foi possível gerar as imagens do tema. O config.json será baixado assim mesmo.'
      );
    } finally {
      setIsCapturing(false);
    }

    const configJson = await buildConfigJson();
    if (configJson) {
      /** Entrega o config.json como download no navegador do usuário. */
      const downloadConfig = () => {
        const blob = new Blob([JSON.stringify(configJson, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = emLp
          ? `config-lp-${slugDaLp(lp.nome)}.json`
          : 'config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      // O config é um insumo da equipe de implantação, não um arquivo do usuário
      // final: fora do desenvolvimento ele vai por e-mail e NÃO é baixado. O
      // porquê do gate ser `localhost` está em configDelivery.ts, que o rótulo
      // do botão também consome — os dois não podem divergir.
      if (isLocalDelivery(window.location.hostname)) {
        downloadConfig();
        return;
      }

      try {
        await sendLayoutConfigEmail(configJson);
        // Sem download, o clique não deixa nenhum rastro na tela. A confirmação
        // é o único sinal de que algo aconteceu — foi a falta dela que fez este
        // fluxo ser trocado por download no passado.
        setExportFeedback('sent');
      } catch (error) {
        console.error('Falha ao enviar o config por e-mail:', error);
        // Resgate: o envio falhou, então o arquivo é entregue ao usuário para o
        // trabalho não se perder. É a exceção deliberada à regra acima.
        downloadConfig();
        setExportFeedback('failed');
      }
    }
  };

  /** Monta o snapshot serializável do tema atual (payload do preview). */
  /**
   * Documento versionável: seções + as 10 cores + as 3 fontes. Ver
   * useThemeHistory para o que fica de fora e por quê.
   */
  const themeDoc = useMemo<ThemeDoc>(
    () => ({
      selections: lojaSelections,
      lp,
      colors: {
        colorPrimary,
        colorSecondary,
        colorTertiary,
        colorPrimaryBackground,
        colorSecondaryBackground,
        colorTertiaryBackground,
        colorFooter,
        colorFooterText,
        colorPrimaryText,
        colorSecondaryText,
      },
      fonts: { fontPrimary, fontSecondary, fontTertiary },
      // Os papéis do checkout entram no histórico: desfazer uma cor do checkout
      // é o mesmo gesto que desfazer uma cor global.
      checkout: checkout.variables,
    }),
    [
      checkout.variables,
      lojaSelections,
      lp,
      colorPrimary,
      colorSecondary,
      colorTertiary,
      colorPrimaryBackground,
      colorSecondaryBackground,
      colorTertiaryBackground,
      colorFooter,
      colorFooterText,
      colorPrimaryText,
      colorSecondaryText,
      fontPrimary,
      fontSecondary,
      fontTertiary,
    ]
  );

  const applyThemeDoc = useCallback((doc: ThemeDoc) => {
    // O array vai inteiro e verbatim: a ordem é a que o arrayMove produziu.
    setLojaSelections(doc.selections);
    if (doc.lp) setLp(doc.lp);
    setColorPrimary(doc.colors.colorPrimary);
    setColorSecondary(doc.colors.colorSecondary);
    setColorTertiary(doc.colors.colorTertiary);
    setColorPrimaryBackground(doc.colors.colorPrimaryBackground);
    setColorSecondaryBackground(doc.colors.colorSecondaryBackground);
    setColorTertiaryBackground(doc.colors.colorTertiaryBackground);
    setColorFooter(doc.colors.colorFooter);
    setColorFooterText(doc.colors.colorFooterText);
    setColorPrimaryText(doc.colors.colorPrimaryText);
    setColorSecondaryText(doc.colors.colorSecondaryText);
    setFontPrimary(doc.fonts.fontPrimary);
    setFontSecondary(doc.fonts.fontSecondary);
    setFontTertiary(doc.fonts.fontTertiary);
    setCheckout(prev => ({ ...prev, variables: doc.checkout ?? {} }));
  }, []);

  const { undo, redo, canUndo, canRedo } = useThemeHistory(
    themeDoc,
    applyThemeDoc,
    hydrated
  );

  const buildPreviewSnapshot = (): PreviewSnapshot => ({
    platform,
    selections: lojaSelections,
    // A LP vai junto quando o usuário está nela: o link abre em /p/{id}/lp.
    ...(emLp
      ? {
          lp: {
            nome: lp.nome,
            slug: slugDaLp(lp.nome),
            selections: lp.selections,
          },
        }
      : {}),
    colors: {
      colorPrimary,
      colorSecondary,
      colorTertiary,
      colorPrimaryBackground,
      colorSecondaryBackground,
      colorTertiaryBackground,
      colorFooter,
      colorFooterText,
      colorPrimaryText,
      colorSecondaryText,
    },
    fonts: { fontPrimary, fontSecondary, fontTertiary },
    logo,
    favicon,
    ogImage,
    // Opcional no tipo: snapshots de antes do checkout continuam válidos.
    ...(platform === 'VTEX' ? { checkout: blocoDoConfig(checkout) } : {}),
  });

  /** A URL do preview `id` na vista que o editor mostra agora. */
  const urlDoPreview = (id: string) => {
    // No modo Checkout o link abre direto na etapa que está no canvas; no
    // modo LP, direto na LP.
    if (editorMode === 'checkout' && platform === 'VTEX') {
      return `${window.location.origin}/p/${id}/checkout/${checkout.etapa}`;
    }
    return emLp
      ? `${window.location.origin}/p/${id}/lp`
      : `${window.location.origin}/p/${id}/home`;
  };

  /** O último corpo que o preview ao vivo recebeu: evita regravar o mesmo. */
  const previewEnviado = useRef<string | null>(null);

  /**
   * Persiste o tema atual no servidor e retorna a URL compartilhável da home do
   * preview (`/p/{id}/home`). Retorna null em caso de falha.
   *
   * Se a aba já tem um preview (`previewAtual`), regrava o MESMO id: o link que
   * já foi mandado ao cliente continua valendo e mostra o tema de agora.
   */
  const createPreview = async (): Promise<string | null> => {
    try {
      const corpo = JSON.stringify(buildPreviewSnapshot());
      if (previewAtual) {
        const res = await fetch(`/gerador/api/preview/${previewAtual}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: corpo,
        });
        if (res.ok) {
          const { rev } = (await res.json()) as { rev: number };
          previewEnviado.current = corpo;
          avisarPreviewAtualizado(previewAtual, rev);
          return urlDoPreview(previewAtual);
        }
        // Falhou regravando: cai para um preview novo, que é o que o botão promete.
      }
      const res = await fetch('/gerador/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: corpo,
      });
      if (!res.ok) return null;
      const { id } = (await res.json()) as { id: string };
      previewEnviado.current = corpo;
      setPreviewAtual(id);
      return urlDoPreview(id);
    } catch (error) {
      console.error('Erro ao criar preview:', error);
      return null;
    }
  };

  /**
   * O tema inteiro da aba, no formato do histórico (`EstadoDoEditor`): o
   * snapshot do preview + a LP sempre + o modo + o token da Wake.
   */
  const estadoAtual = (): EstadoDoEditor => ({
    ...buildPreviewSnapshot(),
    lp: { nome: lp.nome, selections: lp.selections },
    editorMode,
    wakeToken: wakeCustomValue,
  });

  /**
   * Troca o tema da aba por um de fora: um snapshot de preview (o "Editar" do
   * /p) ou um tema salvo do histórico. Passa pelos MESMOS filtros da
   * hidratação, porque o catálogo pode ter mudado desde a gravação. Tudo no
   * mesmo render: é UM passo de desfazer.
   */
  const carregarEstado = useCallback(
    (
      doc: EstadoDoEditor,
      /** O histórico reabre sem fechar o painel dele (para ver outra versão). */
      opcoes: { manterPainel?: boolean } = {}
    ) => {
      const plat = sanitizePlatform(doc.platform ?? null);
      setPlatform(plat);
      setLojaSelections(sanitizeSelections(doc.selections));
      if (doc.lp) setLp(sanitizeLp(doc.lp));
      const c: Partial<PreviewSnapshot['colors']> = doc.colors ?? {};
      setColorPrimary(c.colorPrimary || '#1a1a1a');
      setColorSecondary(c.colorSecondary || '#ffffff');
      setColorPrimaryBackground(c.colorPrimaryBackground || '#000');
      setColorSecondaryBackground(c.colorSecondaryBackground || '#dd1838');
      setColorTertiaryBackground(c.colorTertiaryBackground || '#000');
      setColorFooter(c.colorFooter || '#1A051C');
      setColorFooterText(c.colorFooterText || '#94A3B8');
      // As três derivadas saem dos fundos, no mesmo render (como no "Por template").
      setColorPrimaryText(contrastOn(c.colorPrimaryBackground || '#000'));
      setColorSecondaryText(
        contrastOn(c.colorSecondaryBackground || '#dd1838')
      );
      setColorTertiary(contrastOn(c.colorTertiaryBackground || '#000'));
      const f: Partial<PreviewSnapshot['fonts']> = doc.fonts ?? {};
      setFontPrimary(f.fontPrimary || 'Roboto');
      setFontSecondary(f.fontSecondary || 'Poppins');
      setFontTertiary(f.fontTertiary || 'Open Sans');
      setLogo(typeof doc.logo === 'string' ? doc.logo : '');
      setFavicon(typeof doc.favicon === 'string' ? doc.favicon : '');
      setOgImage(typeof doc.ogImage === 'string' ? doc.ogImage : '');
      setCheckout(prev =>
        sanitizeCheckout({
          model: doc.checkout?.model ?? prev.model,
          variables: doc.checkout?.variables ?? {},
          etapa: prev.etapa,
        })
      );
      if (typeof doc.wakeToken === 'string') setWakeCustomValue(doc.wakeToken);
      // O snapshot do preview não diz o modo: ele só leva a LP quando nasceu nela.
      const modo = sanitizeEditorMode(
        doc.editorMode ?? (doc.lp ? 'lp' : 'loja'),
        plat
      );
      setEditorModeState(modo);
      if (!opcoes.manterPainel)
        setRailTarget(modo === 'checkout' ? 'variaveis' : 'componentes');
      setSelectedUid(null);
      setSelectedPage('home');
      setInicioEscolhido(true);
    },
    []
  );

  /**
   * "Editar" do /p: `/gerador?preview=<id>` abre o tema daquele preview nesta
   * aba e a vincula a ele — dali em diante as edições atualizam o mesmo link.
   * O parâmetro sai da URL depois, para um recarregar não reabrir por cima do
   * que foi editado.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('preview');
    if (!id) return;
    setCarregandoExterno(true);
    fetch(`/api/preview/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(res => (res.ok ? (res.json() as Promise<PreviewSnapshot>) : null))
      .then(snapshot => {
        if (!snapshot) {
          // Aba nova: não há "o que ela já tinha" — abre com o template padrão,
          // como abriria sem o link.
          const padrao = abaNovaRef.current && entrarComOPadrao();
          window.alert(
            `Este preview não existe mais (o link expira 3 dias depois da última edição). ${
              padrao
                ? 'O editor abre com o template padrão.'
                : 'O editor abre com o que esta aba já tinha.'
            }`
          );
          return;
        }
        // Do checkout do /p, o editor abre no modo Checkout.
        carregarEstado(
          params.get('modo') === 'checkout'
            ? { ...snapshot, editorMode: 'checkout' }
            : snapshot
        );
        setTemaAtual(null);
        setPreviewAtual(id);
      })
      .catch(error => console.error('Erro ao abrir o preview:', error))
      .finally(() => {
        setCarregandoExterno(false);
        params.delete('preview');
        params.delete('modo');
        const resto = params.toString();
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${resto ? `?${resto}` : ''}`
        );
      });
  }, [carregarEstado, entrarComOPadrao]);

  /**
   * Preview ao vivo. Com um preview vinculado, toda edição do tema regrava o
   * mesmo id (debounce de 1,2 s: um arraste de cor é uma gravação, não cem) e
   * avisa as abas do /p abertas neste navegador por BroadcastChannel. As de
   * outros navegadores percebem pela revisão, num polling leve (PreviewLive).
   */
  const snapshotRef = useRef(buildPreviewSnapshot);
  snapshotRef.current = buildPreviewSnapshot;
  useEffect(() => {
    if (!hydrated || !previewAtual) return;
    const timer = window.setTimeout(async () => {
      const corpo = JSON.stringify(snapshotRef.current());
      if (corpo === previewEnviado.current) return;
      try {
        const res = await fetch(`/gerador/api/preview/${previewAtual}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: corpo,
        });
        if (!res.ok) return;
        previewEnviado.current = corpo;
        const { rev } = (await res.json()) as { rev: number };
        avisarPreviewAtualizado(previewAtual, rev);
      } catch (error) {
        console.error('Erro ao atualizar o preview:', error);
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [
    hydrated,
    previewAtual,
    themeDoc,
    platform,
    logo,
    favicon,
    ogImage,
    editorMode,
    checkout.model,
  ]);

  /** "Começar do zero" já foi escolhido, ou a aba já tem seções: sem convite. */
  useEffect(() => {
    if (lojaSelections.length > 0) setInicioEscolhido(true);
  }, [lojaSelections.length]);

  /** O convite do canvas vazio (EmptyCanvas). */
  const mostrarInicio =
    hydrated &&
    !carregandoExterno &&
    editorMode === 'loja' &&
    lojaSelections.length === 0 &&
    !inicioEscolhido;

  /** Os dois botões do convite. */
  const comecarPorTemplate = () => {
    setRailTarget('templates');
  };
  /**
   * "Começar do zero": o do convite (loja já vazia) e o do painel "Por
   * template", que tira todas as seções da loja — com confirmação, porque aí há
   * o que perder, e num passo só de desfazer. Cores e fontes ficam. O convite
   * não volta nesta carga (`inicioEscolhido`); recarregar a aba vazia o mostra.
   */
  const comecarDoZero = (): boolean => {
    if (
      lojaSelections.length > 0 &&
      !window.confirm(
        `Começar do zero?\n\nAs ${lojaSelections.length} seções da loja saem, ` +
          `em todas as páginas. Cores e fontes ficam como estão.\n\nDá para desfazer com Voltar.`
      )
    ) {
      return false;
    }
    if (lojaSelections.length > 0) {
      setLojaSelections([]);
      setSelectedUid(null);
      setSelectedPage('home');
    }
    setInicioEscolhido(true);
    setRailTarget('componentes');
    return true;
  };

  useEffect(() => {
    const firstLayoutKey = Object.keys(LAYOUTS)[0] as LayoutKey | undefined;
    if (firstLayoutKey) {
      setFocusedKey(firstLayoutKey);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      estadoDaAba.set('layoutSelections', JSON.stringify(lojaSelections));
    } catch (error) {
      console.error('Erro ao salvar seleções no localStorage:', error);
    }
  }, [lojaSelections, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (platform) estadoDaAba.set('layoutPlatform', platform);
    } catch (error) {
      console.error('Erro ao salvar plataforma no localStorage:', error);
    }
  }, [platform, hydrated]);

  return {
    selections,
    focusedKey,
    platform,
    showPlatformError,
    isMobileView,
    desktopPreviewRef,
    mobilePreviewRef,
    setFocusedKey,
    fontPrimary,
    setFontPrimary,
    fontSecondary,
    setFontSecondary,
    fontTertiary,
    setFontTertiary,
    logo,
    setLogo,
    favicon,
    setFavicon,
    ogImage,
    setOgImage,
    colorPrimary,
    setColorPrimary,
    colorSecondary,
    setColorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
    setColorPrimaryBackground,
    setColorSecondaryBackground,
    setColorTertiaryBackground,
    /* setColorPrimaryText / setColorSecondaryText / setColorTertiary NÃO são
       expostos: as três cores são derivadas por luminância dos fundos de marca
       (ver o efeito de `contrastOn`). Ficavam como campos editáveis cuja
       edição era sobrescrita no toque seguinte em qualquer fundo. Os `useState`
       e a derivação continuam — o que sai é só a possibilidade de escrever
       nelas de fora. */
    setColorFooter,
    setColorFooterText,
    toggleMobileView,
    changePlatform,
    toggleSelection,
    aplicarTemplate,
    exportLayout,
    exportFeedback,
    dismissExportFeedback,
    createPreview,
    previewAtual,
    setPreviewAtual,
    temaAtual,
    setTemaAtual,
    estadoAtual,
    carregarEstado,
    mostrarInicio,
    comecarPorTemplate,
    comecarDoZero,
    setItemVariable,
    resetItemVariables,
    railTarget,
    setRailTarget,
    editorMode,
    setEditorMode,
    lp,
    setLpNome,
    checkout,
    setCheckoutVariable,
    resetCheckoutVariables,
    setCheckoutEtapa,
    logoCheckout,
    logoCheckoutPendente,
    leftCollapsed,
    setLeftCollapsed,
    rightCollapsed,
    setRightCollapsed,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedPage,
    setSelectedPage,
    selectedUid,
    setSelectedUid,
    selectSection,
    expandedUids,
    toggleExpanded,
    collapseAllSections,
    zoomMode,
    setZoomMode,
    hoveredUid,
    setHoveredUid,
    scrollToSectionRef,
    moveSection,
    duplicateSection,
    removeSection,
    isCapturing,
    wakeCustomValue,
    setWakeCustomValue,
    showWakePopup,
    setShowWakePopup,
    wakePopupRef,
  };
}
