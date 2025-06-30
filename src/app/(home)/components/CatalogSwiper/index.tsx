"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Spot from "../Spot";
import type { CatalogItem } from "@/app/types/catalog";
import styles from "./index.module.css";

type Props = {
  items: CatalogItem[];
};

export default function CatalogSwiper({ items }: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      loop
      breakpoints={{
        0: {
          slidesPerView: 1.3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <Spot item={item} className={styles.spotFullWidth} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
