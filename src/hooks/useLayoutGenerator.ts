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
        variables:{
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

  useEffect(() => {
    try {
      localStorage.setItem('layoutSelections', JSON.stringify(selections));
    } catch (error) {
      console.error('Erro ao salvar seleções no localStorage:', error);
    }
  }, [selections]);

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
