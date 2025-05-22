
import styles from "./page.module.css";
import Header from "./components/Header";
import BannerMain from "./components/BannerMain";
import Footer from "./components/Footer";
import NewsContainer from "./components/NewsContainer"
import CatalogSpots from "./components/Catalogo"

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
