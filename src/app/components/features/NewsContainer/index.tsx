"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./index.module.css";
// import foto1 from "../../../../assets/spotsImage/foto1.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { mockCatalog } from "../../../data/dataTemplate";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { icons } from "@/assets/icons/icons";

export default function NewsContainer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1023);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const catalog = mockCatalog[0]?.novidade || [];
  
  const filteredCatalog = catalog.filter((item) =>
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
                  <ProductSpot item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={styles.gridSpots}>
              {filteredCatalog.map((item) => (
                <ProductSpot key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSpot({ item }: { item: { title: string; subtitle: string; image: StaticImageData; desktopLink: string; mobileLink: string;} }) {
  return (
    <div className={styles.productSpot}>
      <div className={styles.containerImg}>
        <Image src={item.image} alt={item.title} width={300} height={200} />
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
        <h3>{item.title}</h3>
        <span>{item.subtitle}</span>
      </div>
    </div>
  );
}
