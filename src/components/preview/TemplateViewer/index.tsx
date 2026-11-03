'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Logo from '@/components/common/Logo';
import Dropdown from '@/components/gerador/SelectPage/Dropdown';
import { PAGES } from '@/components/gerador/SelectPage';
import ResponsiveToggle from '@/components/gerador/ResponsiveToggle';
import LinkComercial from '@/components/site/LinkComercial';
import { PREVIEW_PAGES } from '@/utils/previewRender';
import {
  VISUAL_NEUTRO,
  variaveisDoVisual,
  type VisualDoTemplate,
} from '@/utils/provador';

import styles from './index.module.css';

/** As três páginas do template, com os nomes do seletor do editor. */
const OPCOES = PREVIEW_PAGES.map(p => ({
  key: p.slug as string,
  name: PAGES.find(x => x.key === p.pagina)?.name ?? p.label,
}));

/** Sem documento montado nesse tempo, a loja aparece mesmo assim. */
const MAXIMO_CARREGANDO_MS = 5000;

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
  /** A cara do template na home; null para quem não tem (a 01): a neutra. */
  visual: VisualDoTemplate | null;
  /** O time do comercial está cadastrado: o botão abre o WhatsApp. */
  whatsapp: boolean;
}

/**
 * A barra da vitrine sobre a loja do template. Só olha: o seletor de página e o
 * Desktop/Mobile são os MESMOS controles da topbar do editor (com os tokens
 * `--ed-` trocados pelos da marca, no CSS), e não há nada que leve ao /gerador.
 * A barra veste a cara que o template tem na home — fundo, acento e a fonte do
 * nome —, e o botão do comercial já leva o template na mensagem.
 */
export default function TemplateViewer({
  slug,
  nome,
  paleta,
  pagina,
  mobileInicial,
  visual,
  whatsapp,
}: TemplateViewerProps) {
  const router = useRouter();
  const [mobile, setMobile] = useState(mobileInicial);
  const vista = (m: boolean) => (m ? '?vista=mobile' : '');
  const src = `/templates/${slug}/${pagina}/frame`;
  // Qual `src` já terminou de carregar: trocar de página volta ao carregando.
  const [carregado, setCarregado] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // A loja aparece quando o documento dela está montado, sem esperar o `load`
  // (que espera todas as imagens). Pergunta-se ao documento, e não ao evento:
  // o iframe está no HTML servido e pode ficar pronto ANTES da hidratação. Uma
  // loja que nunca responde aparece pelo teto de tempo: nunca fica escondida.
  useEffect(() => {
    const inicio = Date.now();
    const espera = window.setInterval(() => {
      const doc = frameRef.current?.contentDocument;
      const montada =
        doc?.readyState !== 'loading' &&
        doc?.location.pathname === src &&
        Boolean(doc?.body?.childElementCount);
      if (montada || Date.now() - inicio > MAXIMO_CARREGANDO_MS) {
        window.clearInterval(espera);
        setCarregado(src);
      }
    }, 120);
    return () => window.clearInterval(espera);
  }, [src]);

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
  const [numero, ...resto] = nome.split(' · ');
  const nomeCurto = visual?.nome ?? resto.join(' · ');
  const cara = visual ?? VISUAL_NEUTRO;

  return (
    <div
      className={`ed-shell ${styles.shell}`}
      data-vitrine={slug}
      style={variaveisDoVisual(cara) as React.CSSProperties}
    >
      <header className={styles.topbar}>
        <div className={styles.identidade}>
          {/* `<a>` comum: a home é outro root layout, e a navegação entre root
              layouts recarrega a página de qualquer jeito. */}
          <a
            href="/"
            className={styles.marca}
            aria-label="e-temas, página inicial"
          >
            <Logo tamanho={22} />
          </a>
          <span className={styles.divisor} aria-hidden />
          <a
            href="/#templates"
            className={styles.voltar}
            data-vitrine-voltar=""
            aria-label="Voltar para os templates"
          >
            <svg
              width="18"
              height="18"
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
          <span className={styles.nome}>
            {resto.length > 0 ? (
              <>
                <span className={styles.numero}>{numero} · </span>
                <span
                  className={styles.nomeTexto}
                  style={{
                    fontFamily: `${cara.fonte}, var(--f-display), sans-serif`,
                    fontWeight: cara.peso,
                    fontStyle: cara.estilo,
                  }}
                >
                  {resto.join(' · ')}
                </span>
              </>
            ) : (
              <span className={styles.nomeTexto}>{nome}</span>
            )}
          </span>
          {paleta.length > 0 && (
            <span className={styles.paleta} aria-hidden>
              {paleta.map((c, i) => (
                <span key={i} style={{ background: c }} />
              ))}
            </span>
          )}
        </div>

        <div className={styles.pagina}>
          <Dropdown
            options={OPCOES}
            value={pagina}
            onChange={k =>
              router.push(`/templates/${slug}/${k}${vista(mobile)}`)
            }
            ariaLabel="Página"
            fallback={OPCOES[0]}
          />
        </div>

        <div className={styles.acoes}>
          <div className={styles.vista}>
            <ResponsiveToggle
              isMobile={mobile}
              onToggleMobile={alternarVista}
            />
          </div>
          <LinkComercial
            whatsapp={whatsapp}
            origem="vitrine"
            template={nomeCurto || nome}
            className={styles.cta}
          >
            Quero este
            <span className={styles.ctaLongo}>&nbsp;template</span>
          </LinkComercial>
        </div>
      </header>

      <main
        className={styles.palco}
        data-carregando={carregado === src ? undefined : ''}
      >
        <div className={styles.carregando} aria-hidden>
          <Logo tamanho={40} nome={false} />
        </div>
        <iframe
          ref={frameRef}
          src={src}
          title={`${nome} · ${atual.name}`}
          className={mobile ? styles.mobile : styles.desktop}
          data-vitrine-frame={mobile ? 'mobile' : 'desktop'}
        />
      </main>
    </div>
  );
}
