import Image from "next/image";
import type { image } from "@/app/types/image";

import styles from "./index.module.css";

export default function BannerMain () {
    const bannerDesktop: image = {
        src: "/images/home/fullbanners/image_fx.png",
        width: 1408,
        height: 768,
        alt: "Foguete Decolando"
    }

    const bannerMobile: image = {
        src: "/images/home/fullbanners/BannerMainMobile.png",
        width: 768,
        height: 1408,
        alt: "Foguete Decolando"
    }

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Image
                    aria-hidden
                    src={bannerDesktop.src}
                    className={`${styles.bannerimg} ${styles.desktopOnly}`}
                    alt={bannerDesktop.alt}
                    width={bannerDesktop.width}
                    height={bannerDesktop.height}
                />  
                <Image
                    aria-hidden
                    src={bannerMobile.src}
                    className={`${styles.bannerimg} ${styles.mobileOnly}`}
                    alt={bannerMobile.alt}
                    width={bannerMobile.width}
                    height={bannerMobile.height}
                />
                <div className={styles.textBanner}>
                    <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h2>
                </div>
            </div>
        </div>
    )
}