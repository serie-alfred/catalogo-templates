import styles from "./index.module.css";
import Image from "next/image";
import Banner from "@/assets/image_fx.png"
import bannerMainMobile from '@/assets/BannerMainMobile.png'

export default function BannerMain () {
    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Image
                    aria-hidden
                    src={Banner}
                    className={`${styles.bannerimg} ${styles.desktopOnly}`}
                    alt="banner principal"
                />  
                <Image
                    aria-hidden
                    src={bannerMainMobile}
                    className={`${styles.bannerimg} ${styles.mobileOnly}`}
                    alt="banner principal"
                />
                <div className={styles.textBanner}>
                    <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h2>
                </div>
            </div>
        </div>
    )
}