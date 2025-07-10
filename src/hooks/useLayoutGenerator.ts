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
  const [selections, setSelections] = useState<LayoutSelection[]>([]);
  const [focusedKey, setFocusedKey] = useState<LayoutKey | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [showPlatformError, setShowPlatformError] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

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
  

  /** Alterna seleção de layout, respeitando propagação para páginas quando for comum */
  const toggleSelection = (id: string, layoutKey: LayoutKey, pagina: string) => {
    setSelections((prev) => {
      // Filtra quantos já existem na página
      const countInPage = prev.filter((item) => item.pagina === pagina).length;

      // Se já tiver 8, não adiciona mais
      if (countInPage >= MAX_PER_PAGE) return prev;
      
      if (pagina === 'common') {
        const item = LAYOUTS[layoutKey].items.find((i) => i.id === id);
        if (!item) return prev;
  
        const newSelections = item.pagina.map((p) => ({
          uid: crypto.randomUUID(),
          id,
          layoutKey,
          pagina: p,
        }));
  
        return [...prev, ...newSelections];
      }
  
      // Para páginas normais, adiciona apenas uma instância
      return [
        ...prev,
        {
          uid: crypto.randomUUID(),
          id,
          layoutKey,
          pagina,
        },
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

  /** Define primeira aba (header) como foco inicial */
  useEffect(() => {
    const firstLayoutKey = Object.keys(LAYOUTS)[0] as LayoutKey | undefined;
    if (firstLayoutKey) {
      setFocusedKey(firstLayoutKey);
    }
  }, []);

  /** Carrega seleções do localStorage */
  useEffect(() => {
    try {
      const storedSelections = localStorage.getItem('layoutSelections');
      const storedPlatform = localStorage.getItem('layoutPlatform');

      if (storedSelections) {
        setSelections(JSON.parse(storedSelections));
      }
      if (storedPlatform) {
        setPlatform(storedPlatform as Platform | null);
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  }, []);

  /** Salva seleções no localStorage */
  useEffect(() => {
    try {
      localStorage.setItem('layoutSelections', JSON.stringify(selections));
    } catch (error) {
      console.error('Erro ao salvar seleções no localStorage:', error);
    }
  }, [selections]);

  /** Salva plataforma no localStorage */
  useEffect(() => {
    try {
      if(platform)
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
    toggleMobileView,
    handlePlatformChange,
    toggleSelection,
    exportLayout,
  };
}
