
import Header        from "./components/Header";
import BannerMain    from "./components/BannerMain";
import NewsContainer from "./components/NewsContainer";
import CatalogSpots  from "./components/Catalogo";
import Footer        from "./components/Footer";

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
