// src/app/gerador/hooks/useLayoutGenerator.ts

import { useState, useRef } from 'react';
import { LAYOUTS, LayoutKey, LayoutItem } from '@/app/data/data';
import { captureAndDownloadScreenshot } from '../utils/screenshotExport';
import { sendLayoutConfigEmail } from '../services/sendEmail';

export interface LayoutSelection {
  id: string;
  layoutKey: LayoutKey;
}

export function useLayoutGenerator() {
  /** 1) Estados principais */
  const [selections, setSelections] = useState<LayoutSelection[]>([]);
  const [focusedKey, setFocusedKey] = useState<LayoutKey | null>(null);
  const [platform, setPlatform] = useState<string>('');
  const [showPlatformError, setShowPlatformError] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  /** 2) Refs para captura de tela */
  const desktopPreviewRef = useRef<HTMLDivElement | null>(null);
  const mobilePreviewRef = useRef<HTMLDivElement | null>(null);

  /** 3) Handlers de UI */
  const toggleMobileView = () => {
    setIsMobileView((prev) => !prev);
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPlatform(value);
    if (value !== 'Selecione uma plataforma') {
      setShowPlatformError(false);
    }
  };

  const toggleSelection = (id: string, layoutKey: LayoutKey) => {
    setSelections((prev) => {
      const exists = prev.some((s) => s.id === id && s.layoutKey === layoutKey);
      if (exists) {
        return prev.filter((s) => !(s.id === id && s.layoutKey === layoutKey));
      }
      return [...prev, { id, layoutKey }];
    });
  };

  /** 4) Geração do JSON de configuração */
  const buildConfigJson = (): Record<string, any> | null => {
    if (!platform || platform === 'Selecione uma plataforma') {
      return null;
    }

    const GLOBAL_KEYS: LayoutKey[] = ['header', 'footer'];

    const mapToConfig = (item: LayoutSelection) => {
      const section = LAYOUTS[item.layoutKey];
      const found: LayoutItem | undefined = section.items.find((i) => i.id === item.id);
      if (!found) return null;
      return { template: found.template, pagina: found.pagina };
    };

    const globalItems = selections
      .filter((s) => GLOBAL_KEYS.includes(s.layoutKey))
      .map(mapToConfig)
      .filter(Boolean);

    const pageItems = selections
      .filter((s) => !GLOBAL_KEYS.includes(s.layoutKey))
      .map(mapToConfig)
      .filter(Boolean);

    return {
      [platform.toLowerCase()]: {
        global: globalItems,
        paginas: pageItems,
      },
    };
  };

  /** 5) Exportar telas e enviar JSON por e-mail */
  const exportLayout = async (e: React.FormEvent) => {
    e.preventDefault();

    // valida plataforma
    if (!platform || platform === 'Selecione uma plataforma') {
      setShowPlatformError(true);
      return;
    }
    setShowPlatformError(false);

    // valida refs
    if (!desktopPreviewRef.current || !mobilePreviewRef.current) return;

    // captura e faz download
    await captureAndDownloadScreenshot(
      desktopPreviewRef.current,
      'layout-desktop.png'
    );
    await captureAndDownloadScreenshot(
      mobilePreviewRef.current,
      'layout-mobile.png'
    );

    // monta e envia JSON por email
    const configJson = buildConfigJson();

    if (configJson) {
      await sendLayoutConfigEmail(configJson);
    }
  };

  return {
    /** Dados */
    selections,
    setSelections,
    focusedKey,
    platform,
    showPlatformError,
    isMobileView,

    /** Refs */
    desktopPreviewRef,
    mobilePreviewRef,

    /** Setters / Handlers */
    setFocusedKey,
    toggleMobileView,
    handlePlatformChange,
    toggleSelection,
    exportLayout,
  };
}
