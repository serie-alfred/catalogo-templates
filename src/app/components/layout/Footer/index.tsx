import Image from "next/image";
import { icons } from "@/assets/icons/icons";

import flag1 from "@/assets/footerBadges/flag1.png";
import flag2 from "@/assets/footerBadges/flag2.png";
import flag3 from "@/assets/footerBadges/flag3.png";
import flag4 from "@/assets/footerBadges/flag4.png";

import ecommerce1 from "@/assets/ecommerceBadges/ecommerce1.png";
import ecommerce2 from "@/assets/ecommerceBadges/ecommerce2.png";
import ecommerce3 from "@/assets/ecommerceBadges/ecommerce3.png";

const flags = [flag1, flag2, flag3, flag4];
const flagEcommerce = [ecommerce1, ecommerce2, ecommerce3];

import styles from "./index.module.css";

export default function Footer() {
    return (
        <footer>
            <div className={styles.footerTopContainer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerEsq}>
                        <div className={styles.containerTitle}>
                            <h2>Que tal lançar sua loja dos sonhos em órbita?</h2>
                            <h3>Compartilhe os desafios da sua empresa com nossa tripulação de especialistas que iremos te ajudar!</h3>
                        </div>
                        <div className={styles.containerSubTitle}>
                            <h4>Cadastre-se para ter a oportunidades de fazer parte da nossa tripulação<span>.</span></h4>
                            <a href="#">
                                Saiba mais
                                {icons.KnowMorearrowIcon}
                            </a>
                        </div>
                    </div>
                    <div className={styles.footerDir}>
                        <div className={styles.containerInput}>
                            <h2 className={styles.titleInput}>Seu nome<span className={styles.blue}>*</span></h2>
                            <input className={styles.inputBox} placeholder="Nome..."></input>
                        </div>
                        <div className={styles.containerInput}>
                            <h2 className={styles.titleInput}>Sua Empresa<span className={styles.blue}>*</span></h2>
                            <input className={styles.inputBox} placeholder="Nome da sua empresa..."></input>
                        </div>
                        <div className={styles.duploInputContainer}>
                            <div className={styles.inputItem}>
                                <h2 className={styles.titleInput}>
                                    Seu segmento<span className={styles.blue}>*</span>
                                </h2>
                                <select className={styles.inputBoxDuplo} defaultValue="">
                                    <option value="" disabled>Selecione</option>
                                    <option value="varejo">Varejo</option>
                                    <option value="alimentacao">Construção</option>
                                    <option value="servicos">Moda</option>
                                </select>
                            </div>
                            <div className={styles.inputItem}>
                                <h2 className={styles.titleInput}>
                                    Colaboradores<span className={styles.blue}>*</span>
                                </h2>
                                <select className={styles.inputBoxDuplo} defaultValue="">
                                    <option value="" disabled>1-20</option>
                                    <option value="1-20">1-20</option>
                                    <option value="21-50">21-50</option>
                                    <option value="51-100">51-100</option>
                                    <option value="100+">100+</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.containerInput}>
                            <h2 className={styles.titleInput}>Telefone<span className={styles.blue}>*</span></h2>
                            <input className={styles.inputBox} placeholder="Número de Telefone..."></input>
                        </div>
                        <div className={styles.containerInput}>
                            <h2 className={styles.titleInput}>E-mail Corporativo<span className={styles.blue}>*</span></h2>
                            <input className={styles.inputBox} placeholder="seuemail@serie.com.br"></input>
                        </div>
                        <div className={styles.containerInput}>
                            <h2 className={styles.titleInput}>Qual seu desafio?<span className={styles.blue}>*</span></h2>
                            <textarea className={`${styles.inputBox} ${styles.bigBox}`} placeholder="Descreva qual o desafio que sua empresa enfrenta..."></textarea>
                        </div>
                        <button className={styles.btnAction}>
                            Iniciar lançamento
                            {icons.InitLaunchArrowIcon}
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.footerMiddleContainer}>
                <div className={styles.footerMiddle}>
                    <div className={styles.menu}>
                        <span className={styles.menuTitle}>Sobre nós</span>
                        <ul className={styles.menuContainer}>
                            <li><a href="">Quem somos</a></li>
                            <li><a href="">Seja parceiro</a></li>
                            <li><a href="">Trabalhe conosco</a></li>
                        </ul>
                    </div>
                    <div className={styles.menu}>
                        <span className={styles.menuTitle}>Atendimento</span>
                        <ul className={styles.menuContainer}>
                            <li><a href="">+55 11 4115-8384</a></li>
                            <li><a href="">comercial@e-temas.com.br</a></li>
                        </ul>
                    </div>
                    <div className={styles.menu}>
                        <span className={styles.menuTitle}>Onde nos encontrar</span>
                        <ul className={styles.menuContainer}>
                            <li><a href="">Quem somos</a></li>
                        </ul>
                    </div>
                    <div className={styles.menu}>
                        <span className={styles.menuTitle}>Selos</span>
                        <ul className={styles.menuContainer}>
                            <li>
                                {flagEcommerce.map((flagEcommerce, index) => (
                                    <Image
                                        key={index}
                                        src={flagEcommerce}
                                        alt={`flag ${index + 1}`}
                                        aria-hidden
                                        width={flagEcommerce.width}
                                        height={flagEcommerce.height}
                                        loading="lazy"
                                    />
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.footerBottomContainer}>
                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        <p>© 2025 E-TEMAS - Empresa P4C Group</p>
                        <a href="#">Política de Privacidade</a>
                    </div>
                    <div className={styles.bottomflags}>
                        {flags.map((flag, index) => (
                            <Image
                                key={index}
                                src={flag}
                                alt={`flag ${index + 1}`}
                                aria-hidden
                                width={flag.width}
                                height={flag.height}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
