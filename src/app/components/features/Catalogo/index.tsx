"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";

import { mockCatalog } from "../../../data/dataTemplate";
import { icons } from "../../../../assets/icons/icons";

import styles from "./index.module.css";

export default function CatalogSpots() {
  const [search, setSearch] = useState("");

    const catalog = mockCatalog[0]?.catalogo || [];
  
    const filteredCatalog = catalog.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className={styles.catalogoContainer}>
      <div className={styles.container}>
        <div className={styles.infoTitle}>
          <h3>Descubra diversos templates</h3>
          <span>Porem ipsum dolor sit amet, consectetur adipiscing elit. </span>
        </div>

        <div className={styles.search}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Buscar modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {icons.MagnifierIcon}
          </div>
          <span>{filteredCatalog.length} templates</span>
        </div>

        <div className={styles.containerCatalogo}>
          <div className={styles.containerSpots}>
            {filteredCatalog.map((item) => (
              <CatalogSpot key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogSpot({
  item,
}: {
  item: { title: string; subtitle: string; image: StaticImageData; desktopLink: string; mobileLink: string; };
}) {
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
