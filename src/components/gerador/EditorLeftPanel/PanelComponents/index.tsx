'use client';

import React, { useState } from 'react';

import SectionsPanel from '../../SectionsPanel';
import SectionModal from '../../SectionModal';
import { Plus } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Destino "Componentes" do rail: a lista de seções da página e o acesso ao
 * catálogo, que abre no diálogo "Componentes de seções".
 */
export default function PanelComponents() {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <SectionsPanel />

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.add}
          onClick={() => setPickerOpen(true)}
        >
          <Plus width={24} height={24} />
          Adicionar seção
        </button>
      </div>

      {pickerOpen && <SectionModal onClose={() => setPickerOpen(false)} />}
    </>
  );
}
