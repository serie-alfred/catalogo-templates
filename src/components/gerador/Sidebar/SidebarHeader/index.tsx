import React from 'react';
import Link from 'next/link';
import { iconsGenerator } from '@/assets/icons/generator';
import styles from './index.module.css';

interface Props {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: Props) {
  return (
    <header className={styles.header}>
      <Link className={styles.link} href="#">
        {iconsGenerator.etemasMain}
      </Link>
      <button className="icon" onClick={onClose}>
        {iconsGenerator.closeSide}
      </button>
    </header>
  );
}
