import styles from "./style.module.css";
import Image from "next/image";
import logo from "../../../assets/logoSerie.svg"

export default function Header() {
  return (
    <div className={styles.container}>
        <a href="/">
          <Image
                aria-hidden
                src={logo}
                alt="logo Icon"
            />
        </a>
          <div className={styles.callUs}>
              <a href="/">
                <p>Fale conosco</p>
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_5644_2220)">
                  <g clip-path="url(#clip1_5644_2220)">
                  <path d="M14.5 23.5L23.5 14.5" stroke="#F2994A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.1875 14.5H23.5V21.8125" stroke="#F2994A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  </g>
                  <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="18.25" stroke="white" stroke-opacity="0.32" stroke-width="1.5"/>
                  <defs>
                  <clipPath id="clip0_5644_2220">
                  <rect width="38" height="38" rx="19" fill="white"/>
                  </clipPath>
                  <clipPath id="clip1_5644_2220">
                  <rect width="18" height="18" fill="white" transform="translate(10 10)"/>
                  </clipPath>
                  </defs>
                </svg>
              </a>
          </div>
    </div>
  );
}