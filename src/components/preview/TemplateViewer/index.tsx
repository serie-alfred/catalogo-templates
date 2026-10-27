'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Dropdown from '@/components/gerador/SelectPage/Dropdown';
import { PAGES } from '@/components/gerador/SelectPage';
import ResponsiveToggle from '@/components/gerador/ResponsiveToggle';
import { PREVIEW_PAGES } from '@/utils/previewRender';

import styles from './index.module.css';

/** As três páginas do template, com os nomes do seletor do editor. */
const OPCOES = PREVIEW_PAGES.map(p => ({
  key: p.slug as string,
  name: PAGES.find(x => x.key === p.pagina)?.name ?? p.label,
}));

interface TemplateViewerProps {
  /** "09". */
  slug: string;
  /** "09 · Editorial". */
  nome: string;
  /** As cores autorais da família, quando ela tem (Template 01 não tem). */
  paleta: string[];
  /** Slug da página aberta: "home" | "categoria" | "produto". */
  pagina: string;
  mobileInicial: boolean;
}

/**
 * A barra da vitrine sobre a loja do template. Só olha: o seletor de página e o
 * Desktop/Mobile são os MESMOS controles da topbar do editor, e não há nada que
 * leve ao /gerador.
 */
export default function TemplateViewer({
  slug,
  nome,
  paleta,
  pagina,
  mobileInicial,
}: TemplateViewerProps) {
  const router = useRouter();
  const [mobile, setMobile] = useState(mobileInicial);
  const vista = (m: boolean) => (m ? '?vista=mobile' : '');

  // Trocar a visão é só a moldura (CSS): o documento do iframe é o mesmo. A URL
  // acompanha sem navegar, para recarregar e compartilhar manterem a visão.
  const alternarVista = () => {
    const proxima = !mobile;
    setMobile(proxima);
    window.history.replaceState(
      null,
      '',
      `/templates/${slug}/${pagina}${vista(proxima)}`
    );
  };

  const atual = OPCOES.find(o => o.key === pagina) ?? OPCOES[0];

  return (
    <div className={`ed-shell ${styles.shell}`} data-vitrine={slug}>
      <header className={styles.topbar}>
        <div className={styles.identidade}>
          {/* `<a>` comum: a home é outro root layout, e a navegação entre root
              layouts recarrega a página de qualquer jeito. */}
          <a
            href="/#templates"
            className={styles.voltar}
            data-vitrine-voltar=""
            aria-label="Voltar para os templates"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.voltarTexto}>Templates</span>
          </a>
          <span className={styles.nome}>{nome}</span>
          {paleta.length > 0 && (
            <span className={styles.paleta} aria-hidden>
              {paleta.map((c, i) => (
                <span key={i} style={{ background: c }} />
              ))}
            </span>
          )}
        </div>

        <Dropdown
          options={OPCOES}
          value={pagina}
          onChange={k => router.push(`/templates/${slug}/${k}${vista(mobile)}`)}
          ariaLabel="Página"
          fallback={OPCOES[0]}
        />

        <div className={styles.vista}>
          <ResponsiveToggle isMobile={mobile} onToggleMobile={alternarVista} />
        </div>
      </header>

      <main className={styles.palco}>
        <iframe
          src={`/templates/${slug}/${pagina}/frame`}
          title={`${nome} · ${atual.name}`}
          className={mobile ? styles.mobile : styles.desktop}
          data-vitrine-frame={mobile ? 'mobile' : 'desktop'}
        />
      </main>
    </div>
  );
}
