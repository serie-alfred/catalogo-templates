"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import foto1 from "../../../assets/spotsImage/foto1.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const mockData = [
    {
    id: 1,
    title: "Template 2.4",
    subtitle: "Perfumaria & Cosméticos",
    image: foto1,
    desktopLink: "https://example.com/desktop",
    mobileLink: "https://example.com/mobile",
  },
  {
    id: 2,
    title: "Template 2.3",
    subtitle: "Moda Feminina",
    image: foto1,
    desktopLink: "https://example.com/desktop2",
    mobileLink: "https://example.com/mobile2",
  },
  {
    id: 3,
    title: "Template 2.4",
    subtitle: "Moda Feminina",
    image: foto1,
    desktopLink: "https://example.com/desktop2",
    mobileLink: "https://example.com/mobile2",
  },
  {
    id: 4,
    title: "Template 2.5",
    subtitle: "Moda Feminina",
    image: foto1,
    desktopLink: "https://example.com/desktop2",
    mobileLink: "https://example.com/mobile2",
  },
];

export default function NewsContainer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1023);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
              {mockData.map((item) => (
                <SwiperSlide key={item.id}>
                  <ProductSpot item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={styles.gridSpots}>
              {mockData.map((item) => (
                <ProductSpot key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSpot({ item }: { item: { title: string; subtitle: string; image: any; desktopLink: any; mobileLink: any;} }) {
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
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.1667 1.6665H8.83334C6.10065 1.6665 4.73431 1.6665 3.76576 2.34469C3.40743 2.59559 3.09575 2.90726 2.84485 3.2656C2.16667 4.23414 2.16667 5.60048 2.16667 8.33317C2.16667 11.0658 2.16667 12.4322 2.84485 13.4008C3.09575 13.7591 3.40743 14.0708 3.76576 14.3217C4.73431 14.9998 6.10065 14.9998 8.83334 14.9998H12.1667C14.8993 14.9998 16.2657 14.9998 17.2343 14.3217C17.5926 14.0708 17.9043 13.7591 18.1552 13.4008C18.8333 12.4322 18.8333 11.0658 18.8333 8.33317C18.8333 5.60048 18.8333 4.23414 18.1552 3.2656C17.9043 2.90726 17.5926 2.59559 17.2343 2.34469C16.2657 1.6665 14.8993 1.6665 12.1667 1.6665Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M9.66666 12.5H11.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.5833 18.3333L12.3204 17.9843C11.7277 17.1974 11.5807 15.9953 11.9557 15M8.41666 18.3333L8.67958 17.9843C9.27225 17.1974 9.41925 15.9953 9.04433 15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M6.33334 18.3335H14.6667" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Desktop
                </a>
                <a href={item.mobileLink} className={styles.buttonContainer}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16667 7.49984C4.16667 4.74998 4.16667 3.37505 5.02094 2.52078C5.87521 1.6665 7.25014 1.6665 10 1.6665C12.7498 1.6665 14.1248 1.6665 14.9791 2.52078C15.8333 3.37505 15.8333 4.74998 15.8333 7.49984V12.4998C15.8333 15.2497 15.8333 16.6246 14.9791 17.4789C14.1248 18.3332 12.7498 18.3332 10 18.3332C7.25014 18.3332 5.87521 18.3332 5.02094 17.4789C4.16667 16.6246 4.16667 15.2497 4.16667 12.4998V7.49984Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M9.16666 15.8335H10.8333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.5 1.6665L7.57417 2.11152C7.7349 3.07591 7.81527 3.55811 8.14599 3.85154C8.491 4.15762 8.98008 4.1665 10 4.1665C11.0199 4.1665 11.509 4.15762 11.854 3.85154C12.1847 3.55811 12.2651 3.07591 12.4258 2.11152L12.5 1.6665" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
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
