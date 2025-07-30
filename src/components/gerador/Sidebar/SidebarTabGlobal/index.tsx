import React from 'react';
import FontSelector from '../../FontSelector';
import ColorPicker from '../../ColorPicker';
import { iconsGenerator } from '@/assets/icons/generator';

export default function SidebarTabGlobal() {
  return (
    <div className="sidebar__main">
      <div className="header">
        <div className="icon">{iconsGenerator.configTheme}</div>
      </div>

      <FontSelector
        label="Defina a fonte primária"
        cssVariable="font-primary"
        defaultFont="Roboto"
      />

      <FontSelector
        label="Defina a fonte secundária"
        cssVariable="font-secondary"
        defaultFont="Poppins"
      />
      <FontSelector
        label="Defina a fonte terciária"
        cssVariable="font-tertiary"
        defaultFont="Open Sans"
      />

      <ColorPicker
        label="Defina a cor primária"
        colorKey="--primary-color"
        defaultColor="#1a1a1a"
      />
      <ColorPicker
        label="Defina a cor secundária"
        colorKey="--secondary-color"
        defaultColor="#ffffff"
      />
      <ColorPicker
        label="Defina a cor terciária"
        colorKey="--tertiary-color"
        defaultColor="#f0f0f0"
      />
    </div>
  );
}
