import { useState, useRef, useEffect } from 'react';
import { LAYOUTS, LayoutKey, LayoutItem } from '@/data/layoutData';
import { captureAndDownloadScreenshot } from '@/utils/screenshotExport';
import { sendLayoutConfigEmail } from '@/services/emailService';
import type { Platform } from '@/types/platform';

export interface LayoutSelection {
  uid: string;
  id: string;
  layoutKey: LayoutKey;
  pagina: string;
}

export const MAX_PER_PAGE = 8;


export function useLayoutGenerator() {

  /** Estados principais */
  // dentro de useLayoutGenerator
  const [selections, setSelections] = useState<LayoutSelection[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('layoutSelections');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [platform, setPlatform] = useState<Platform | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const stored = localStorage.getItem('layoutPlatform');
      return stored ? (stored as Platform) : null;
    } catch {
      return null;
    }
  });

  const [focusedKey, setFocusedKey] = useState<LayoutKey | null>(null);
  const [showPlatformError, setShowPlatformError] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const [fontPrimary, setFontPrimary] = useState('Roboto');
  const [fontSecondary, setFontSecondary] = useState('Poppins');
  const [fontTertiary, setFontTertiary] = useState('Open Sans');
  const [colorPrimary, setColorPrimary] = useState('#1a1a1a');
  const [colorSecondary, setColorSecondary] = useState('#ffffff');
  const [colorTertiary, setColorTertiary] = useState('#f0f0f0');
  const [colorPrimaryBackground, setColorPrimaryBackground] = useState('#F7EFF5');
  const [colorSecondaryBackground, setColorSecondaryBackground] = useState('#E60F73');
  const [colorTertiaryBackground, setColorTertiaryBackground] = useState('#682A77');
  const [colorFooter, setColorFooter] = useState('#E8E8E8');
  const [colorFooterText, setColorFooterText] = useState('#3D3D3D');
  const [colorPrimaryText, setColorPrimaryText] = useState('#000');
  const [colorSecondaryText, setColorSecondaryText] = useState('#FFF');

  useEffect(() => {
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
        setColorTertiary(parsed.colorTertiary || '#f0f0f0');

        setColorPrimaryBackground(parsed.colorPrimaryBackground || '#F7EFF5');
        setColorSecondaryBackground(parsed.colorSecondaryBackground || '#E60F73');
        setColorTertiaryBackground(parsed.colorTertiaryBackground || '#682A77');

        setColorFooter(parsed.colorFooter || '#E8E8E8');
        setColorFooterText(parsed.colorFooterText || '#3D3D3D');

        setColorPrimaryText(parsed.colorPrimaryText || '#000');
        setColorSecondaryText(parsed.colorSecondaryText || '#FFF');
      }
    } catch (e) {
      console.error('Erro ao carregar cores:', e);
    }
  }, []);

  // Aplicar variáveis CSS no documento
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', colorPrimary);
    document.documentElement.style.setProperty('--secondary-color', colorSecondary);
    document.documentElement.style.setProperty('--tertiary-color', colorTertiary);

    document.documentElement.style.setProperty('--background-primary-color', colorPrimaryBackground);
    document.documentElement.style.setProperty('--background-secundary-color', colorSecondaryBackground);
    document.documentElement.style.setProperty('--background-tertiary-color', colorTertiaryBackground);

    document.documentElement.style.setProperty('--background-footer', colorFooter);
    document.documentElement.style.setProperty('--text-color-footer', colorFooterText);

    document.documentElement.style.setProperty('--text-color-base', colorPrimaryText);
    document.documentElement.style.setProperty('--text-color-secundary', colorSecondaryText);
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
  ]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-primary', fontPrimary);
    document.documentElement.style.setProperty('--font-secundary', fontSecondary);
  }, [
    fontPrimary,
    fontSecondary,
    fontTertiary,
  ]);


  useEffect(() => {
    try {
      localStorage.setItem('fonts', JSON.stringify({
        fontPrimary,
        fontSecondary,
        fontTertiary,
      }));
    } catch (e) {
      console.error('Erro ao salvar fontes:', e);
    }
  }, [fontPrimary, fontSecondary, fontTertiary]);

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

  /** Alterna visualização entre desktop/mobile */
  const toggleMobileView = () => {
    setIsMobileView((prev) => !prev);
  };

  /** Manipula seleção da plataforma */
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Platform | null;
    setPlatform(value);

    if (value) {
      setShowPlatformError(false);
    }
  };

  const toggleSelection = (id: string, layoutKey: LayoutKey, pagina: string) => {
    setSelections((prev) => {
      const item = LAYOUTS[layoutKey].items.find((i) => i.id === id);
      if (!item) return prev;

      // helper para saber se um selection é showcase
      const isShowcaseEntry = (s: LayoutSelection) => {
        const found = LAYOUTS[s.layoutKey].items.find((i) => i.id === s.id);
        return found?.selection === "showcase";
      };

      // 👉 Regras especiais para showcase
      if (item.selection === "showcase") {
        const existingShowcases = prev.filter(isShowcaseEntry);

        // 1) Não existe nenhum showcase ainda → adicionar (respeita MAX_PER_PAGE da página alvo)
        if (existingShowcases.length === 0) {
          const countInPage = prev.filter((p) => p.pagina === pagina).length;
          if (countInPage >= MAX_PER_PAGE) return prev;
          return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
        }

        // 2) Já existe o MESMO showcase → pode duplicar (respeita MAX_PER_PAGE da página alvo)
        const sameShowcaseExists = existingShowcases.some(
          (s) => s.id === id && s.layoutKey === layoutKey
        );
        if (sameShowcaseExists) {
          const countInPage = prev.filter((p) => p.pagina === pagina).length;
          if (countInPage >= MAX_PER_PAGE) return prev;
          return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
        }

        // 3) Existe showcase DIFERENTE → substituir TODOS os showcases mantendo suas páginas
        // (não checa MAX_PER_PAGE, pois é substituição 1-para-1, a contagem por página não aumenta)
        const replaced = prev.map((s) => {
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

      if (item.selection === "category-main") {
        const existingIndex = prev.findIndex((s) => {
          const found = LAYOUTS[s.layoutKey].items.find((i) => i.id === s.id);
          return found?.selection === "category-main";
        });

        // Já existe algum category-main
        if (existingIndex !== -1) {
          const existing = prev[existingIndex];
          if (existing.id === id && existing.layoutKey === layoutKey) {
            // É o mesmo → não faz nada
            return prev;
          }
          // É diferente → substituir na mesma posição/página
          const newSelections = [...prev];
          newSelections[existingIndex] = {
            uid: crypto.randomUUID(),
            id,
            layoutKey,
            pagina: existing.pagina, // mantém a mesma página
          };
          return newSelections;
        }

        // Não existe ainda → adicionar (respeita limite da página)
        const countInPage = prev.filter((p) => p.pagina === pagina).length;
        if (countInPage >= MAX_PER_PAGE) return prev;
        return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
      }

      if (item.selection === "product-info") {
        const existingIndex = prev.findIndex((s) => {
          const found = LAYOUTS[s.layoutKey].items.find((i) => i.id === s.id);
          return found?.selection === "product-info";
        });

        if (existingIndex !== -1) {
          const existing = prev[existingIndex];
          if (existing.id === id && existing.layoutKey === layoutKey) {
            return prev;
          }
          // É diferente → substituir na mesma posição/página
          const newSelections = [...prev];
          newSelections[existingIndex] = {
            uid: crypto.randomUUID(),
            id,
            layoutKey,
            pagina: existing.pagina, // mantém a mesma página
          };
          return newSelections;
        }

        const countInPage = prev.filter((p) => p.pagina === pagina).length;
        if (countInPage >= MAX_PER_PAGE) return prev;
        return [...prev, { uid: crypto.randomUUID(), id, layoutKey, pagina }];
      }

      // 👉 Itens não-showcase (mantém sua lógica original)

      // regra especial para "common"
      if (pagina === "common") {
        const alreadySelectedIndex = prev.findIndex(
          (s) =>
            s.pagina === "common" &&
            s.layoutKey === layoutKey &&
            LAYOUTS[s.layoutKey].items.find((i) => i.id === s.id)?.selection === item.selection
        );

        if (alreadySelectedIndex !== -1) {
          const newSelections = [...prev];
          newSelections[alreadySelectedIndex] = {
            uid: crypto.randomUUID(),
            id,
            layoutKey,
            pagina: "common",
          };
          return newSelections;
        }

        const newSelections = item.pagina.map((p) => ({
          uid: crypto.randomUUID(),
          id,
          layoutKey,
          pagina: p,
        }));

        return [...prev, ...newSelections];
      }

      // limite por página só para ADIÇÃO (não afeta substituições)
      const countInPage = prev.filter((p) => p.pagina === pagina).length;
      if (countInPage >= MAX_PER_PAGE) return prev;

      return [
        ...prev,
        { uid: crypto.randomUUID(), id, layoutKey, pagina },
      ];
    });
  };

  /** Monta JSON de configuração com dados globais e por página */
  const buildConfigJson = (): Record<string, unknown> | null => {
    if (!platform) return null;

    const mapToConfig = (item: LayoutSelection) => {
      const section = LAYOUTS[item.layoutKey];
      const found: LayoutItem | undefined = section.items.find(
        (i) => i.id === item.id && i.platforms.includes(platform as Platform)
      );
      if (!found) return null;

      return {
        template: found.template,
        selection: found.selection,
        title: found.title,
        key: found.key,
        pagina: found.pagina,
      };
    };

    const globalItems = selections
      .filter((s) => {
        const section = LAYOUTS[s.layoutKey];
        const found = section.items.find(i => i.id === s.id);
        return found?.pagina.includes("common");
      })
      .map(mapToConfig)
      .filter(Boolean);

    const pageItems = selections
      .filter((s) => {
        const section = LAYOUTS[s.layoutKey];
        const found = section.items.find(i => i.id === s.id);
        return found && !found.pagina.includes("common");
      })
      .map(mapToConfig)
      .filter(Boolean)
      .reduce<Record<string, ReturnType<typeof mapToConfig>[]>>((acc, item) => {
        if (!item) return acc;
        const paginas = Array.isArray(item.pagina) ? item.pagina : [item.pagina];
        paginas.forEach((pg) => {
          if (!acc[pg]) acc[pg] = [];
          acc[pg].push(item);
        });
        return acc;
      }, {});

    return {
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
        ...pageItems,
      },
    };
  };

  /** Exporta capturas de tela e envia JSON por e-mail */
  const exportLayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      setShowPlatformError(true);
      return;
    }
    setShowPlatformError(false);

    if (!desktopPreviewRef.current || !mobilePreviewRef.current) return;

    await captureAndDownloadScreenshot(desktopPreviewRef.current, 'layout-desktop.png');
    await captureAndDownloadScreenshot(mobilePreviewRef.current, 'layout-mobile.png');

    const configJson = buildConfigJson();
    if (configJson) {
      await sendLayoutConfigEmail(configJson);
    }
  };

  useEffect(() => {
    const firstLayoutKey = Object.keys(LAYOUTS)[0] as LayoutKey | undefined;
    if (firstLayoutKey) {
      setFocusedKey(firstLayoutKey);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('layoutSelections', JSON.stringify(selections));
    } catch (error) {
      console.error('Erro ao salvar seleções no localStorage:', error);
    }
  }, [selections]);

  useEffect(() => {
    try {
      if (platform)
        localStorage.setItem('layoutPlatform', platform);
    } catch (error) {
      console.error('Erro ao salvar plataforma no localStorage:', error);
    }
  }, [platform]);

  return {
    selections,
    setSelections,
    focusedKey,
    platform,
    showPlatformError,
    isMobileView,
    desktopPreviewRef,
    mobilePreviewRef,
    setFocusedKey,
    fontPrimary, setFontPrimary,
    fontSecondary, setFontSecondary,
    fontTertiary, setFontTertiary,
    colorPrimary,
    setColorPrimary,
    colorSecondary,
    setColorSecondary,
    colorTertiary,
    setColorTertiary,
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
    setColorFooter,
    setColorFooterText,
    setColorPrimaryText,
    setColorSecondaryText,
    toggleMobileView,
    handlePlatformChange,
    toggleSelection,
    exportLayout,
  };
}
