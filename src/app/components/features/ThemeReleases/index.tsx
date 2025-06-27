import { catalogMock } from "@/mocks/catalogMock";
import type { CatalogItem } from "@/app/types/catalog";
import styles from "./index.module.css";
import CatalogSwiper from "../CatalogSwiper";

export default function ThemeReleases() {
  const catalog = catalogMock[0]?.novidade || [];

  const filteredCatalog: CatalogItem[] = catalog.filter((item) =>
    item.title.toLowerCase()
  );

  return (
    <div className={styles.newsContainer}>
      <div className={styles.container}>
        <div className={styles.containerTitle}>
          <h3 className={styles.title}>Novos</h3>
          <span>Porem ipsum dolor sit amet, consectetur adipiscing elit.</span>
        </div>

        <div className={styles.containerSpots}>
          <CatalogSwiper items={filteredCatalog} />
        </div>
      </div>
    </div>
  );
}
