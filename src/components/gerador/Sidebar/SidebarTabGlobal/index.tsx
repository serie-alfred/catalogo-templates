import FontSelector from '../../FontSelector';
import ColorPicker from '../../ColorPicker';
import { iconsGenerator } from '@/assets/icons/generator';
import { useLayout } from '@/context/LayoutContext';

export default function SidebarTabGlobal() {
  const {
    fontPrimary,
    setFontPrimary,
    fontSecondary,
    setFontSecondary,
    fontTertiary,
    setFontTertiary,
    colorPrimary,
    setColorPrimary,
    colorSecondary,
    setColorSecondary,
    colorTertiary,
    setColorTertiary,
    colorPrimaryBackground,
    setColorPrimaryBackground,
    colorSecondaryBackground,
    setColorSecondaryBackground,
    colorTertiaryBackground,
    setColorTertiaryBackground,
    colorPrimaryText,
    setColorPrimaryText,
    colorSecondaryText,
    setColorSecondaryText,
    colorFooter,
    setColorFooter,
    colorFooterText,
    setColorFooterText,
  } = useLayout();

  return (
    <div className="sidebar__main">
      <div className="header">
        <div className="icon">{iconsGenerator.configTheme}</div>
      </div>

      <FontSelector
        label="Defina a fonte primária"
        cssVariable="font-primary"
        selectedFont={fontPrimary}
        onFontChange={setFontPrimary}
      />
      <FontSelector
        label="Defina a fonte secundária"
        cssVariable="font-secondary"
        selectedFont={fontSecondary}
        onFontChange={setFontSecondary}
      />
      <FontSelector
        label="Defina a fonte terciária"
        cssVariable="font-tertiary"
        selectedFont={fontTertiary}
        onFontChange={setFontTertiary}
      />

      <ColorPicker
        label="Defina a cor primária"
        color={colorPrimary}
        setColor={setColorPrimary}
      />
      <ColorPicker
        label="Defina a cor secundária"
        color={colorSecondary}
        setColor={setColorSecondary}
      />
      <ColorPicker
        label="Defina a cor terciária"
        color={colorTertiary}
        setColor={setColorTertiary}
      />

      <ColorPicker
        label="Defina a cor primária do background"
        color={colorPrimaryBackground}
        setColor={setColorPrimaryBackground}
      />
      <ColorPicker
        label="Defina a cor secundária do background"
        color={colorSecondaryBackground}
        setColor={setColorSecondaryBackground}
      />
      <ColorPicker
        label="Defina a cor terciária do background"
        color={colorTertiaryBackground}
        setColor={setColorTertiaryBackground}
      />
      <ColorPicker
        label="Defina a cor primária do texto"
        color={colorPrimaryText}
        setColor={setColorPrimaryText}
      />
      <ColorPicker
        label="Defina a cor secundária do texto"
        color={colorSecondaryText}
        setColor={setColorSecondaryText}
      />
      <ColorPicker
        label="Defina a cor do rodapé"
        color={colorFooter}
        setColor={setColorFooter}
      />
      <ColorPicker
        label="Defina a cor do texto do rodapé"
        color={colorFooterText}
        setColor={setColorFooterText}
      />
    </div>
  );
}
