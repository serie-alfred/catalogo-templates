import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PAGE_SINGLETON_SELECTIONS } from '@/utils/sectionRules';
import { arrayMove } from '@dnd-kit/sortable';
import { LAYOUTS, LayoutKey, LayoutItem } from '@/data/layoutData';
import { belongsToPage } from '@/utils/previewRender';
import { captureAndDownloadScreenshot } from '@/utils/screenshotExport';
import { sendLayoutConfigEmail } from '@/services/emailService';
import type { Platform } from '@/types/platform';
import { useThemeHistory, type ThemeDoc } from './useThemeHistory';
import { buildThemeStyle, contrastOn } from '@/utils/themeStyle';
import {
  partitionByPlatform,
  sanitizePlatform,
  sanitizeSelections,
} from '@/utils/platformCompat';
// type-only: não puxa o módulo server-only para o bundle do cliente.
import type { PreviewSnapshot } from '@/lib/previewStore';

/** Os quatro destinos do rail de navegação do editor, na ordem do Figma. */
export type RailTarget =
  | 'componentes'
  | 'variaveis'
  | 'tipografia'
  | 'identidade';

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

  const changed: Record<string, string> = {};
  for (const variable of schema) {
    const value = overrides[variable.cssVar];
    if (value != null && value !== variable.default) {
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
  const [selections, setSelections] = useState<LayoutSelection[]>([]);

  const [platform, setPlatform] = useState<Platform | null>(null);

  const [wakeCustomValue, setWakeCustomValue] = useState<string>('');
  const [showWakePopup, setShowWakePopup] = useState(false);
  const wakePopupRef = useRef<HTMLDivElement | null>(null);

  const [focusedKey, setFocusedKey] = useState<LayoutKey | null>(null);
  const [showPlatformError, setShowPlatformError] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  /** Destino ativo do rail de navegação — decide o que o painel esquerdo
   *  mostra. Substitui o par `activeTab`/`isOpen` da antiga dock inferior: o
   *  painel agora está SEMPRE aberto, então não existe estado "fechado". */
  const [railTarget, setRailTarget] = useState<RailTarget>('componentes');

  /** Painéis recolhidos. Existem para devolver largura ao canvas: as colunas
   *  fixas comem 840px, e num monitor de 1440 sobram 536 — abaixo da trava de
   *  1200px de `.component__container`, o que faria o preview "Desktop"
   *  renderizar no tier de tablet. */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  /** Página aberta no canvas: "home" | "category" | "product". Vive aqui (e
   *  não na page) porque o canvas, o painel de seções, o iframe mobile e o
   *  palco de export todos precisam dela. */
  const [selectedPage, setSelectedPage] = useState<string>('home');

  /** Seção selecionada no canvas/painel. Transiente: não é persistida. */
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  /** Seção sob o cursor no canvas — usada só para destacar a linha do painel.
   *  O contorno NO CANVAS é imperativo (atributo `data-hovered`, ver
   *  useCanvasInteractions); este estado existe para o caminho inverso. */
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);

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
  };

  const [fontPrimary, setFontPrimary] = useState('Roboto');
  const [fontSecondary, setFontSecondary] = useState('Poppins');
  const [fontTertiary, setFontTertiary] = useState('Open Sans');

  const [logo, setLogo] = useState<string>('');
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
      localStorage.setItem(
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
      const storedColors = localStorage.getItem('colors');
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

  // Hidratação do estado persistido (selections/platform/logo/favicon) — só
  // após o mount, para o 1º render do cliente bater com o SSR. `hydrated`
  // libera os efeitos de save abaixo (que senão gravariam os defaults vazios).
  useEffect(() => {
    try {
      // Validados: o localStorage pode ter sido escrito por uma versão antiga
      // do catálogo (ou pela rota /gerador/import-log, que grava valor cru).
      const storedSelections = localStorage.getItem('layoutSelections');
      if (storedSelections) {
        setSelections(sanitizeSelections(JSON.parse(storedSelections)));
      }
      setPlatform(sanitizePlatform(localStorage.getItem('layoutPlatform')));
      setLogo(localStorage.getItem('logo') || '');
      setFavicon(localStorage.getItem('favicon') || '');
      setOgImage(localStorage.getItem('ogImage') || '');
      setWakeCustomValue(localStorage.getItem('wakeToken') || '');
      setLeftCollapsed(localStorage.getItem('panelLeftCollapsed') === '1');
      setRightCollapsed(localStorage.getItem('panelRightCollapsed') === '1');
    } catch (e) {
      console.error('Erro ao carregar estado do layout:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

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
      localStorage.setItem(
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
        localStorage.setItem('logo', logo);
      } else {
        localStorage.removeItem('logo');
      }
    } catch (e) {
      console.error('Erro ao salvar logo:', e);
    }
  }, [logo, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (favicon) {
        localStorage.setItem('favicon', favicon);
      } else {
        localStorage.removeItem('favicon');
      }
    } catch (e) {
      console.error('Erro ao salvar favicon:', e);
    }
  }, [favicon, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('panelLeftCollapsed', leftCollapsed ? '1' : '0');
      localStorage.setItem('panelRightCollapsed', rightCollapsed ? '1' : '0');
      localStorage.setItem('wakeToken', wakeCustomValue);
    } catch (e) {
      console.error('Erro ao salvar estado dos painéis:', e);
    }
  }, [leftCollapsed, rightCollapsed, wakeCustomValue, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (ogImage) {
        localStorage.setItem('ogImage', ogImage);
      } else {
        localStorage.removeItem('ogImage');
      }
    } catch (e) {
      console.error('Erro ao salvar imagem de compartilhamento:', e);
    }
  }, [ogImage, hydrated]);

  useEffect(() => {
    try {
      const storedFonts = localStorage.getItem('fonts');
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

    const { kept, lostTitles } = partitionByPlatform(selections, value);

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
    if (kept.length !== selections.length) {
      const survivors = new Set(kept.map(s => s.uid));
      setSelections(kept);
      // Não deixa o contorno do canvas nem o painel direito presos numa seção
      // que acabou de deixar de existir.
      setSelectedUid(prev => (prev && survivors.has(prev) ? prev : null));
    }

    if (value === 'Wake') {
      setShowWakePopup(true);
    }
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

  /** Monta JSON de configuração com dados globais e por página */
  const buildConfigJson = (): Record<string, unknown> | null => {
    if (!platform) return null;

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
        variables: {
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
        },
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
  const buildFaststoreConfigJson = (): Record<string, unknown> => {
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

    const config: Record<string, unknown> = {
      platform: 'faststore',
      faststore: {
        global: globalItems,
        // Chave ADITIVA: até aqui o shape faststore não tinha `assets` nenhum e
        // logo, favicon e imagem de compartilhamento eram descartados em silêncio
        // em todo export VTEX. O template-generator ignora chaves que não
        // conhece, então incluir não quebra quem já consome o arquivo.
        assets: {
          logo,
          favicon,
          ogImage,
        },
        variables: {
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
        },
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

      await captureAndDownloadScreenshot(desktop, 'layout-desktop.png');
      await captureAndDownloadScreenshot(mobile, 'layout-mobile.png');
    } catch (error) {
      console.error('Falha ao gerar as imagens do tema:', error);
      window.alert(
        'Não foi possível gerar as imagens do tema. O config.json será baixado assim mesmo.'
      );
    } finally {
      setIsCapturing(false);
    }

    const configJson = buildConfigJson();
    if (configJson) {
      // O botão se chama "Baixar", então ele baixa — em qualquer ambiente.
      // Antes o download só acontecia FORA de produção: em www.e-temas.com.br o
      // clique mandava um e-mail e não entregava arquivo nenhum ao usuário, que
      // ficava sem sinal de que algo tinha acontecido.
      const blob = new Blob([JSON.stringify(configJson, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'config.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Em produção o time também recebe o config por e-mail — é assim que a
      // implantação chega até eles. O download não substitui esse caminho, e
      // uma falha de envio não pode engolir o arquivo que o usuário já tem.
      if (window.location.hostname === 'www.e-temas.com.br') {
        try {
          await sendLayoutConfigEmail(configJson);
        } catch (error) {
          console.error('Falha ao enviar o config por e-mail:', error);
          window.alert(
            'O arquivo foi baixado, mas não foi possível enviá-lo para a equipe. Encaminhe o config.json manualmente.'
          );
        }
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
      selections,
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
    }),
    [
      selections,
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
    setSelections(doc.selections);
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
  }, []);

  const { undo, redo, canUndo, canRedo } = useThemeHistory(
    themeDoc,
    applyThemeDoc,
    hydrated
  );

  const buildPreviewSnapshot = (): PreviewSnapshot => ({
    platform,
    selections,
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
  });

  /**
   * Persiste o tema atual no servidor e retorna a URL compartilhável da home do
   * preview (`/p/{id}/home`). Retorna null em caso de falha.
   */
  const createPreview = async (): Promise<string | null> => {
    try {
      const res = await fetch('/gerador/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPreviewSnapshot()),
      });
      if (!res.ok) return null;
      const { id } = (await res.json()) as { id: string };
      return `${window.location.origin}/p/${id}/home`;
    } catch (error) {
      console.error('Erro ao criar preview:', error);
      return null;
    }
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
      localStorage.setItem('layoutSelections', JSON.stringify(selections));
    } catch (error) {
      console.error('Erro ao salvar seleções no localStorage:', error);
    }
  }, [selections, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (platform) localStorage.setItem('layoutPlatform', platform);
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
    exportLayout,
    createPreview,
    setItemVariable,
    resetItemVariables,
    railTarget,
    setRailTarget,
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
