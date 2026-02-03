import React from 'react';
import { iconsGenerator } from '@/assets/icons/generator';
import styles from './index.module.css';

interface Props {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: Props) {
  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>Edição de layout</h2>
      <button className={`${styles.icon} icon`} onClick={onClose}>
        {iconsGenerator.closeSide}
      </button>
    </header>
  );
}
