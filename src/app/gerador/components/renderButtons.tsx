'use client';

import React from 'react';
import { LAYOUTS } from '../../components/data';
import styles from './styles/renderButton.module.css';

interface RenderButtonProps {
  activeLayoutKey: string | null;
  setActiveLayoutKey: (key: string) => void;
}

const RenderButton: React.FC<RenderButtonProps> = ({ activeLayoutKey, setActiveLayoutKey }) => {
  const layoutNames = Object.keys(LAYOUTS)
    .filter((key) => {
      const layout = LAYOUTS[key as keyof typeof LAYOUTS];
      return (
        layout &&
        layout.items &&
        Array.isArray(layout.items) &&
        layout.items.length > 0
      );
    })
    .map((key) => ({
      name: LAYOUTS[key as keyof typeof LAYOUTS]?.name,
      layoutKey: key,
    }))
    .filter((item): item is { name: string; layoutKey: string } => !!item.name);

  return (
    <div className={styles.tabs} id="dynamic-tabs">
      {layoutNames.map((layoutInfo, index) => (
        <button
          key={index}
          onClick={() => setActiveLayoutKey(layoutInfo.layoutKey)}
          className={layoutInfo.layoutKey === activeLayoutKey ? styles.active : ''}
        >
          {layoutInfo.name}
        </button>
      ))}
    </div>
  );
};

export default RenderButton;
