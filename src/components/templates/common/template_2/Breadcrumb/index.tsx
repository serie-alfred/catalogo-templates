import styles from './index.module.css';

export default function Breadcrumb() {
  return (
    <div className={styles['breadcrumb']} data-role="breadcrumb">
      <div className={`component__container`}>
        <ul className={styles.breadcrumb}>
          <li className={styles['breadcrumb-item']} data-role="breadcrumb-item">
            <a href="/" data-role="breadcrumb-link">Home</a>
            <i data-role="breadcrumb-sep">
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

          <li className={styles['breadcrumb-item']} data-role="breadcrumb-item">
            <a href="/categoria" data-role="breadcrumb-current">Categoria</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
