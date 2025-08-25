import styles from './index.module.css';

export default function Breadcrumb() {
  return (
    <div className={`component__container`}>
      <ul className={styles.breadcrumb}>
        <li className={styles['breadcrumb-item']}>
          <a href="/">Home</a>
          <i>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33337 13.8346L11.6667 10.5013L8.33337 7.16797"
                stroke="#141414"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </i>
        </li>

        <li className={styles['breadcrumb-item']}>
          <a href="/categoria">Categoria</a>
        </li>
      </ul>
    </div>
  );
}
