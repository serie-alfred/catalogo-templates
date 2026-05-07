import ImageUploader from '../../ImageUploader';
import { useLayout } from '@/context/LayoutContext';
import styles from './index.module.css';

export default function SidebarTabAssets() {
  const { logo, setLogo, favicon, setFavicon } = useLayout();

  return (
    <div className={`${styles.sidebarMain} sidebar__main`}>
      <ImageUploader
        label="Enviar o logo"
        value={logo}
        onChange={setLogo}
      />
      <ImageUploader
        label="Enviar o favicon"
        value={favicon}
        onChange={setFavicon}
        accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
      />
    </div>
  );
}
