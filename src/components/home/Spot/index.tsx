import React from 'react';
import Image from 'next/image';

import { icons } from '@/assets/icons/icons';
import type { CatalogItem } from '@/types/catalog';

import styles from './index.module.css';

type SpotProps = {
  item: CatalogItem;
  className?: string;
};

export default function Spot({ item, className }: SpotProps) {
  return (
    <div className={`${styles.productSpot} ${className || ''}`}>
      <div className={styles.containerImg}>
        <Image
          aria-hidden
          src={item.image}
          alt={item.title}
          width={400}
          height={304}
        />
      </div>
      <div className={styles.containerInfo}>
        <div className={styles.containerButtonsHover}>
          <div className={styles.spotButtons}>
            <p>Escolha um tipo de visualização</p>
            <div className={styles.buttons}>
              <a href={item.desktopLink} className={styles.buttonContainer}>
                {icons.DesktopIcon}
                Desktop
              </a>
              <a href={item.mobileLink} className={styles.buttonContainer}>
                {icons.MobileIcon}
                Mobile
              </a>
            </div>
          </div>
        </div>
        <h3 className={styles.nameText}>{item.title}</h3>
        <span>{item.subtitle}</span>
      </div>
    </div>
  );
}
