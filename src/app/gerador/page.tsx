'use client';

import { useState, useRef } from "react";
import styles from "./style.module.css";
import RenderButton from "./components/renderButtons";
import RenderImage from "./components/renderImage";
import html2canvas from 'html2canvas';
import DraggablePreviewList from "./components/dnd-kit";
import { LAYOUTS } from '@/app/components/data'


export default function GeradorPage() {

  const [selectedImages, setSelectedImage] = useState<{ id: string; layoutKey: string }[]>([]);
  const [activeLayoutKey, setActiveLayoutKey] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [plataforma, setPlataforma] = useState('');

  const [isMobile, setIsMobile] = useState(false);

  const toggleMobileView = () => {
    setIsMobile((prev) => !prev);
  };

  const handleImageSelection = (id: string, layoutKey: string) => {
    setSelectedImage((prevSelected) => {
      const alreadySelected = prevSelected.some((item) => item.id === id && item.layoutKey === layoutKey);
      if (alreadySelected) {

        return prevSelected.filter((item) => !(item.id === id && item.layoutKey === layoutKey));
      } else {

        return [...prevSelected, { id, layoutKey }];
      }
    });
  };

  const progress = (selectedImages.length / 8) * 100;

  const previewRef = useRef<HTMLDivElement>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setPlataforma(value);

    if (value !== 'Selecione uma plataforma') {
      setShowError(false);
    }
  };

  const desktopPreviewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (plataforma === '' || plataforma === 'Selecione uma plataforma') {
      setShowError(true);
      return;
    } else {
      setShowError(false);
    }
  
    if (desktopPreviewRef.current && mobilePreviewRef.current) {
      // Captura Desktop
      const canvasDesktop = await html2canvas(desktopPreviewRef.current, {
        backgroundColor: null,
      });
      const desktopDataUrl = canvasDesktop.toDataURL('image/png');
      const desktopLink = document.createElement('a');
      desktopLink.href = desktopDataUrl;
      desktopLink.download = 'layout-desktop.png';
      desktopLink.click();
  
      // Captura Mobile
      const canvasMobile = await html2canvas(mobilePreviewRef.current, {
        backgroundColor: null,
      });
      const mobileDataUrl = canvasMobile.toDataURL('image/png');
      const mobileLink = document.createElement('a');
      mobileLink.href = mobileDataUrl;
      mobileLink.download = 'layout-mobile.png';
      mobileLink.click();

      handleDownloadJson()
    }
  };

  const handleDownloadJson = () => {
    if (!plataforma || plataforma === "Selecione uma plataforma") {
      alert("Selecione uma plataforma primeiro!");
      return;
    }
  
    const globalPages = ['footer', 'header'];
  
    const global = selectedImages
      .filter((item) => globalPages.includes(item.layoutKey))
      .map((item) => {
        const baseItem = LAYOUTS[item.layoutKey as keyof typeof LAYOUTS]?.items.find(i => i.id === item.id);
        return baseItem ? { template: baseItem.template, pagina: baseItem.pagina } : null;
      })
      .filter(Boolean);
  
    const paginas = selectedImages
      .filter((item) => !globalPages.includes(item.layoutKey))
      .map((item) => {
        const baseItem = LAYOUTS[item.layoutKey as keyof typeof LAYOUTS]?.items.find(i => i.id === item.id);
        return baseItem ? { template: baseItem.template, pagina: baseItem.pagina } : null;
      })
      .filter(Boolean);
  
    const data = {
      [plataforma.toLowerCase()]: {
        global,
        paginas
      }
    };
  
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'layout-config.json';
    link.click();
  
    URL.revokeObjectURL(url);
  };
  
  
  
  

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <div className={styles['form-group']}>
          <label htmlFor="plataforma">Plataforma</label>
          {showError && (
          <span className={styles.errorText}>Selecione uma plataforma</span>
        )}
          <select className={styles.select} id="plataforma" onChange={handleSelectChange}>
            <option>Selecione uma plataforma</option>
            <option>VTEX</option>
            <option>Shopify</option>
            <option>Wake</option>
          </select>
        </div>

        <div className={styles.progresso}>
          <p>
            <strong id="progress-count">{selectedImages.length}</strong> de 
            <span id="progress-total"> 8</span> seções selecionadas
          </p>
          <div className={styles.barra}>
            <div className={styles.preenchida} id="progress-bar" style={{ width: `${(selectedImages.length / 8) * 100}%` }}></div>
          </div>
        </div>


        <RenderButton activeLayoutKey={activeLayoutKey} setActiveLayoutKey={setActiveLayoutKey} />

        <div id="options-container" className={styles['options-container']}>
          <h3>Selecione um modelo</h3>
          <RenderImage
            activeLayoutKey={activeLayoutKey}
            selectedImages={selectedImages}
            onSelect={handleImageSelection}
            />
        </div>
      </aside>

      {/* Preview direita */}
      <main className={styles['preview-area']}>
        <header className={styles['preview-header']}>
          <h2>Visualização</h2>
          <div className={styles['preview-actions']}>
            <button id="export-btn" onClick={handleSubmit}>Exportar Layout</button>
            <button id="toggle-mobile-btn" onClick={toggleMobileView}>
              {isMobile ? '🖥️ Visualizar Desktop' : '📱 Visualizar Mobile'}
            </button>
          </div>
        </header>


        <div className={isMobile ? styles.mobile : styles.desktop}>
          <div ref={previewRef}>
            <DraggablePreviewList
              items={selectedImages}
              setItems={setSelectedImage}
              isMobile={isMobile}
            />
          </div>
        </div>
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div ref={desktopPreviewRef} style={{ background: 'white', padding: '10px', width: '100%' }}>
            <DraggablePreviewList
              items={selectedImages}
              setItems={setSelectedImage}
              isMobile={false}
            />
          </div>
          <div ref={mobilePreviewRef} style={{ background: 'white', padding: '10px', width: '375px' }}>
            <DraggablePreviewList
              items={selectedImages}
              setItems={setSelectedImage}
              isMobile={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
