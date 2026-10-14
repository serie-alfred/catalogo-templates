import React from 'react';
import styles from './index.module.css';

export default function MultiCategories() {
  return (
    <section className={styles.homeBIR} data-role="mc-root">
      <div className={`${styles.roomBrowserSection} component__container`}>
        <div className={styles.roomBrowserContent}>
          {/* Living Room */}
          <div className={styles.livingRoomContainer}>
            <div className={styles.roomBrowserHeader}>
              <h3 className={styles.roomBrowserTitle} data-role="mc-title"> Browse by rooms</h3>
              <div className={styles.roomBrowserDescription} data-role="mc-description">
                Sit massa etiam urna id. Non pulvinar aenean ultrices lectus
                vitae imperdiet vulputate a eu. Aliquet ullamcorper leo mi vel
                sit pretium euismod eget.
              </div>
            </div>

            <div className={styles.livingRoomImageWrapper}>
              <div className={styles.bannerImageText} data-role="mc-card">
                <a href="#">
                  <img
                    src="https://placehold.co/580x456"
                    alt="Living Room"
                    loading="lazy"
                    data-role="mc-card-image"
                  />
                </a>
                <div className={styles.bannerText}>
                  <div className={styles.containerBannerText}>
                    <h2 data-role="mc-card-title">Living Room</h2>
                    <p data-role="mc-card-text">15 products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bedroom + Others */}
          <div className={styles.bedroomContainer}>
            <div className={styles.bedroomImageWrapper}>
              <div className={styles.bannerImageText} data-role="mc-card">
                <a href="#">
                  <img
                    src="https://placehold.co/570x278"
                    alt="Bedroom"
                    loading="lazy"
                    data-role="mc-card-image"
                  />
                </a>
                <div className={styles.bannerText}>
                  <div className={styles.containerBannerText}>
                    <h2 data-role="mc-card-title">Bedroom</h2>
                    <p data-role="mc-card-text">24 products</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Walk-in Closet + Kitchen */}
            <div className={styles.customRow}>
              <div className={styles.customRowContent}>
                <div className={styles.walkInClosetColumn}>
                  <div className={styles.walkInClosetContainer}>
                    <div className={styles.walkInClosetImage}>
                      <div className={styles.bannerImageText} data-role="mc-card">
                        <a href="#">
                          <img
                            src="https://placehold.co/275x275"
                            alt="Walk-in Closet"
                            loading="lazy"
                            data-role="mc-card-image"
                          />
                        </a>
                        <div className={styles.bannerText}>
                          <div className={styles.containerBannerText}>
                            <h2 data-role="mc-card-title">Walk-in Closet</h2>
                            <p data-role="mc-card-text">30 products</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.kitchenColumn}>
                  <div className={styles.kitchenContainer}>
                    <div className={styles.kitchenImage}>
                      <div className={styles.bannerImageText} data-role="mc-card">
                        <a href="#">
                          <img
                            src="https://placehold.co/275x275"
                            alt="Kitchen"
                            loading="lazy"
                            data-role="mc-card-image"
                          />
                        </a>
                        <div className={styles.bannerText}>
                          <div className={styles.containerBannerText}>
                            <h2 data-role="mc-card-title">Kitchen</h2>
                            <p data-role="mc-card-text">24 products</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
