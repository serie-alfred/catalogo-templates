import Header        from "@/app/components/layout/Header";
import BannerMain    from "@/app/components/features/BannerMain";
import ThemeReleases from "@/app/components/features/ThemeReleases";
import CatalogSpots  from "@/app/components/features/Catalog";
import Footer        from "@/app/components/layout/Footer";

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
