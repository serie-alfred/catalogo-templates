import Header        from "@/app/components/Header";
import Footer        from "@/app/components/Footer";

import BannerMain    from "./components/BannerMain";
import ThemeReleases from "./components/ThemeReleases";
import CatalogSpots  from "./components/Catalog";

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
