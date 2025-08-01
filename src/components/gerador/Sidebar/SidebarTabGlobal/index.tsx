import { useLayoutGenerator } from '@/hooks/useLayoutGenerator';
import FontSelector from '../../FontSelector';
import ColorPicker from '../../ColorPicker';
import { iconsGenerator } from '@/assets/icons/generator';

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
  } = useLayoutGenerator();

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
    </div>
  );
}
