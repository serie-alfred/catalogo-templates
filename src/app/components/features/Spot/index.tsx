import Image from "next/image";
import { icons } from "@/assets/icons/icons";

import type { CatalogItem } from "@/app/types/catalog";
import styles from "./index.module.css";

type SpotProps = {
  item: CatalogItem;
};

export default function Spot({item}: SpotProps) {
  return (
    <div className={styles.productSpot}>
      <div className={styles.containerImg}>
        <Image aria-hidden src={item.image} alt={item.title} />
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