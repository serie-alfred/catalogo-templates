import React from 'react';
import styles from './index.module.css';

export default function HomeCarousel() {
  const categories = [
    {
      position: 1,
      title: 'Categoria 1',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 2,
      title: 'Categoria 2',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 3,
      title: 'Categoria 3',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 4,
      title: 'Categoria 4',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 5,
      title: 'Categoria 5',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 6,
      title: 'Categoria 6',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 7,
      title: 'Categoria 7',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
    {
      position: 8,
      title: 'Categoria 8',
      link: '#',
      img: 'https://placehold.co/250x250',
    },
  ];

  return (
    <section className={styles.carouselContainer}>
      <div className="component__container">
        <div className={styles.swiper}>
          <div className={styles.swiperWrapper}>
            {categories.map((cat, index) => (
              <div key={index} className={styles.swiperSlide}>
                <a href={cat.link} className={styles.rulerItem}>
                  <img src={cat.img} alt={cat.title} />
                  <span>{cat.title}</span>
                </a>
              </div>
            ))}
          </div>
          <div className={styles.swiperButtonPrev}></div>
          <div className={styles.swiperButtonNext}></div>
        </div>
      </div>
    </section>
  );
}
