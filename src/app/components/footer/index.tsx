import styles from "./index.module.css";
import Image from "next/image";

import selo1 from "../../../assets/selosFooterBottom/selo1.png";
import selo2 from "../../../assets/selosFooterBottom/selo2.png";
import selo3 from "../../../assets/selosFooterBottom/selo3.png";
import selo4 from "../../../assets/selosFooterBottom/selo4.png";

import social1 from "../../../assets/selosSocial/social1.png";
import social2 from "../../../assets/selosSocial/social2.png";
import social3 from "../../../assets/selosSocial/social3.png";
import social4 from "../../../assets/selosSocial/social4.png";

import ecommerce1 from "../../../assets/selosEcommerce/ecommerce1.png";
import ecommerce2 from "../../../assets/selosEcommerce/ecommerce2.png";
import ecommerce3 from "../../../assets/selosEcommerce/ecommerce3.png";



const selos = [selo1, selo2, selo3, selo4];
const selosSocial = [social1, social2, social3, social4]
const seloEcommerce = [ecommerce1, ecommerce2, ecommerce3]

export default function Footer() {
    return (
        <>
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
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_4065_80285)">
                                    <path d="M3 9L9 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M4.125 3H9V7.875" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_4065_80285">
                                    <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
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
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="44" height="44" rx="22" fill="#0E0F12"/>
                            <g clip-path="url(#clip0_5712_3267)">
                            <path d="M16 28L28 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.25 16H28V25.75" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_5712_3267">
                            <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
                            </clipPath>
                            </defs>
                            </svg>
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
                                {seloEcommerce.map((seloEcommerce, index) => (
                                    <Image
                                        key={index}
                                        src={seloEcommerce}
                                        alt={`Selo ${index + 1}`}
                                        aria-hidden
                                        width={seloEcommerce.width}
                                        height={seloEcommerce.height}
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
                    <div className={styles.bottomSelos}>
                        {selos.map((selo, index) => (
                            <Image
                                key={index}
                                src={selo}
                                alt={`Selo ${index + 1}`}
                                aria-hidden
                                width={selo.width}
                                height={selo.height}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
