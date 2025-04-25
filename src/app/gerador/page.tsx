'use client';

import { useState } from "react";
import styles from "./style.module.css";
import RenderButton from "./components/renderButtons";
import RenderImage from "./components/renderImage";
import RenderPreview from "./components/renderPreview";
import { LAYOUTS } from '@/app/components/data';
import DraggablePreviewList from "./components/dnd-kit";


export default function GeradorPage() {

  const [selectedImages, setSelectedImage] = useState<{ id: string; layoutKey: string }[]>([]);
  const [activeLayoutKey, setActiveLayoutKey] = useState<string | null>(null);

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

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <div className={styles['form-group']}>
          <label htmlFor="plataforma">Plataforma</label>
          <select className={styles.select} id="plataforma">
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
            selectedImageId={null}
            onSelect={handleImageSelection}
            />
        </div>
      </aside>

      {/* Preview direita */}
      <main className={styles['preview-area']}>
        <header className={styles['preview-header']}>
          <h2>Visualização</h2>
          <div className={styles['preview-actions']}>
            <button id="export-btn">Exportar Layout</button>
            <button id="toggle-mobile-btn" onClick={toggleMobileView}>
              {isMobile ? '🖥️ Visualizar Desktop' : '📱 Visualizar Mobile'}
            </button>
          </div>
        </header>


        <div className={isMobile ? styles.mobile : styles.desktop }>
          <DraggablePreviewList
            items={selectedImages}
            setItems={setSelectedImage}
            isMobile={isMobile}
          />
        </div>
      </main>
    </div>
  );
}
