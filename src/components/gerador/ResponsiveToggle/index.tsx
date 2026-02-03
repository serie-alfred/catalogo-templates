import React from 'react';
import { iconsGenerator } from '@/assets/icons/generator';
import styles from './index.module.css';

interface ResponsiveToggleProps {
  onToggleMobile: () => void;
  isMobile: boolean;
}
export default function ResponsiveToggle({
  onToggleMobile,
  isMobile,
}: ResponsiveToggleProps) {
  return (
    <div
      className={`${styles['preview-actions']} ${isMobile ? 'mobile' : ''}`}
      onClick={onToggleMobile}
    >
      <button className={!isMobile ? styles['active'] : ''}>
        {iconsGenerator.desktopTheme}
        <span>Desktop</span>
      </button>
      <button className={isMobile ? styles['active'] : ''}>
        {iconsGenerator.mobileTheme}
        <span>Mobile</span>
      </button>
    </div>
  );
}
