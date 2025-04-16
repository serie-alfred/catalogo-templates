
import styles from "./page.module.css";
import Header from "./components/header";
import BannerMain from "./components/bannerMain";
import Footer from "./components/footer";
import NewsContainer from "./components/newsContainer"
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
