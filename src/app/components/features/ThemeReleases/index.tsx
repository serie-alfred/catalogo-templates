"use client";

import { useState, useEffect } from "react";

import Spot from "../Spot";
import { mockCatalog } from "@/app/data/dataTemplate";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { CatalogItem } from "@/app/types/catalog";
import styles from "./index.module.css";

export default function ThemeReleases() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1023);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const catalog = mockCatalog[0]?.novidade || [];
  
  const filteredCatalog : CatalogItem[] = catalog.filter((item) =>
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
          {isMobile ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1.3}
              loop
            >
              {filteredCatalog.map((item) => (
                <SwiperSlide key={item.id}>
                  <Spot item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={styles.gridSpots}>
              {filteredCatalog.map((item) => (
                <Spot key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}