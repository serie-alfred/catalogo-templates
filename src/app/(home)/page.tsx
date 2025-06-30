import Header        from "@/components/common/Header";
import Footer        from "@/components/common/Footer";

import BannerMain    from "@/components/home/BannerMain";
import ThemeReleases from "@/components/home/ThemeReleases";
import CatalogSpots  from "@/components/home/Catalog";

import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <BannerMain />
        <ThemeReleases />
        <CatalogSpots />
      </main>
      <Footer />
    </>
  );
}
