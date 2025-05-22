
import Header        from "./components/Header";
import BannerMain    from "./components/BannerMain";
import NewsContainer from "./components/NewsContainer";
import CatalogSpots  from "./components/Catalogo";
import Footer        from "./components/Footer";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
        <Header/>
        <BannerMain/>
        <NewsContainer/>
        <CatalogSpots/>
        <Footer/>
    </div>
  );
}
