import Image from "next/image";
import Link from "next/link";

import { icons } from "../../../../assets/icons/icons";

import styles from "./index.module.css";

export default function Header() {
  return (
    <header className={styles.container}>
        <Link href="/">
          <Image
                aria-hidden
                src={"/logo-etemas.svg"}
                alt="Logo E-Temas"
                width={180}
                height={40}
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