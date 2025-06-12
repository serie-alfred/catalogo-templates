import Image from "next/image";
import Link from "next/link";

import logo from "../../../../assets/logo-etemas.svg"
import { icons } from "../../../../assets/icons/icons";

import styles from "./style.module.css";

export default function Header() {
  return (
    <header className={styles.container}>
        <Link href="/">
          <Image
                aria-hidden
                src={logo}
                alt="logo Icon"
                width={180}
            />
        </Link>
        <div className={styles.containerNav}>
          <Link style={{display: "none"}} href="/gerador">Gerador</Link>
        </div>
          <div className={styles.callUs}>
              <Link href="/">
                <p>Fale conosco</p>
                {icons.TalkToUsArrowIcon}
              </Link>
          </div>
    </header>
  );
}