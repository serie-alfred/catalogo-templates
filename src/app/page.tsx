
import Header        from "./components/layout/Header";
import BannerMain    from "./components/features/BannerMain";
import NewsContainer from "./components/features/NewsContainer";
import CatalogSpots  from "./components/features/Catalogo";
import Footer        from "./components/layout/Footer";

import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header/>
      <main className={styles.page}>
          <BannerMain/>
          <NewsContainer/>
          <CatalogSpots/>
      </main>
      <Footer/>
    </>
  );
}
