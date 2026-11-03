'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

import {
  EVENTO_CONSENTIMENTO,
  IDS_DE_RASTREIO,
  gravarConsentimento,
  lerConsentimento,
  temRastreio,
  type Consentimento,
} from '@/lib/tracking/consentimento';

import styles from './index.module.css';

const { gtm, ga4, pixel } = IDS_DE_RASTREIO;
// Os IDs vêm de NEXT_PUBLIC_*, mas entram em JS inline: só o formato esperado.
const seguro = (id: string, re: RegExp) => (re.test(id) ? id : '');
const GTM = seguro(gtm, /^GTM-[A-Z0-9]+$/);
const GA4 = seguro(ga4, /^G-[A-Z0-9]+$/);
const PIXEL = seguro(pixel, /^\d{5,20}$/);

/**
 * O banner de cookies e os scripts de mídia. Nada carrega antes do "Aceitar";
 * com "Recusar" fica só o Vercel Analytics, que não usa cookie. Sem nenhum ID
 * configurado na Vercel, o componente não desenha nada.
 */
export default function Rastreamento() {
  const [escolha, setEscolha] = useState<Consentimento | null | 'lendo'>(
    'lendo'
  );

  const lerConsentimentoAnterior = useRef<Consentimento | null>(null);

  useEffect(() => {
    lerConsentimentoAnterior.current = lerConsentimento();
    setEscolha(lerConsentimentoAnterior.current);
    const aoMudar = (e: Event) => {
      const nova = (e as CustomEvent<Consentimento | null>).detail;
      // GTM, GA4 e Pixel já executados não descarregam: quem retira o aceite
      // recarrega a página, e ela volta sem eles.
      if (lerConsentimentoAnterior.current === 'aceito' && nova !== 'aceito') {
        location.reload();
        return;
      }
      lerConsentimentoAnterior.current = nova;
      setEscolha(nova);
    };
    window.addEventListener(EVENTO_CONSENTIMENTO, aoMudar);
    return () => window.removeEventListener(EVENTO_CONSENTIMENTO, aoMudar);
  }, []);

  if (!temRastreio() || escolha === 'lendo') return null;

  if (escolha === null) {
    return (
      <div
        className={styles.banner}
        role="dialog"
        aria-labelledby="cookies-titulo"
        data-consentimento=""
      >
        <p id="cookies-titulo" className={styles.titulo}>
          Cookies de análise e de anúncios
        </p>
        <p className={styles.texto}>
          Usamos para medir o que funciona no site e nos anúncios. Nada é ligado
          sem o seu aceite. Saiba mais na{' '}
          <a href="/privacidade">Política de Privacidade</a>.
        </p>
        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.secundario}
            onClick={() => gravarConsentimento('recusado')}
          >
            Recusar
          </button>
          <button
            type="button"
            className={styles.primario}
            onClick={() => gravarConsentimento('aceito')}
          >
            Aceitar
          </button>
        </div>
      </div>
    );
  }

  if (escolha !== 'aceito') return null;

  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {GA4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('config','${GA4}');`}
          </Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
