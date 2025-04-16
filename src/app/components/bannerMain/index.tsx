"use client";

import styles from "./style.module.css";
import Image from "next/image";
import Banner from "@/assets/bannerMainTwo.png"
import bannerMainMobile from '@/assets/BannerMainMobile.png'
import { useState, useEffect } from "react";

export default function BannerMain () {

    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth >= 1023)
        }

        checkMobile()

        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile) 
    },[]);
    

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                {isMobile ? <Image
                    aria-hidden
                    src={Banner}
                    className={styles.bannerimg}
                    alt="banner principal"
                /> : <Image
                aria-hidden
                src={bannerMainMobile}
                className={styles.bannerimg}
                alt="banner principal"
            />}
            </div>
        </div>
    )
}