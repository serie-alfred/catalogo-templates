import React from 'react';
import type { Metadata } from 'next';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Política de Privacidade · E-temas',
  alternates: { canonical: '/privacidade' },
};

/**
 * TEXTO-BASE, ainda não validado pelo jurídico. Cada `<P>` marca um dado da
 * empresa que o time precisa preencher; nenhum foi inventado aqui. Existe
 * porque o formulário de contato do rodapé coleta dados pessoais (LGPD).
 */
function P({ children }: { children: React.ReactNode }) {
  return <span className={styles.preencher}>[{children}]</span>;
}

export default function Privacidade() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.topo}>
          <span className={styles.sobretitulo}>Documento legal</span>
          <h1>Política de Privacidade</h1>
          <p className={styles.atualizado}>
            Última atualização: <P>DATA DA PUBLICAÇÃO</P>
          </p>
        </header>

        <nav className={styles.indice} aria-label="Nesta página">
          <span className={styles.indiceTitulo}>Nesta página</span>
          <ol>
            <li>
              <a href="#s1">Quais dados coletamos</a>
            </li>
            <li>
              <a href="#s2">Para que usamos</a>
            </li>
            <li>
              <a href="#s3">Com quem compartilhamos</a>
            </li>
            <li>
              <a href="#s4">Por quanto tempo guardamos</a>
            </li>
            <li>
              <a href="#s5">Seus direitos</a>
            </li>
            <li>
              <a href="#s6">Encarregado</a>
            </li>
            <li>
              <a href="#s7">Cookies</a>
            </li>
            <li>
              <a href="#s8">Mudanças nesta política</a>
            </li>
          </ol>
        </nav>

        <article className={styles.texto}>
          <p>
            Esta política explica como o E-temas, mantido por{' '}
            <P>RAZÃO SOCIAL</P>, inscrita no CNPJ <P>CNPJ</P>, com sede em{' '}
            <P>ENDEREÇO</P>, trata os dados pessoais de quem usa este site, nos
            termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>

          <h2 id="s1">
            <span className={styles.num}>01</span> Quais dados coletamos
          </h2>
          <p>
            Pelo formulário de contato: nome, empresa, segmento, número de
            colaboradores, telefone, e-mail, plataforma e endereço da loja, o
            template de interesse, como você prefere ser contatado e a mensagem,
            se escrever uma. Também registramos o endereço IP do envio, por
            segurança e para evitar abuso. Quem clica em “Falar com o comercial”
            recebe um cookie que lembra, por 30 dias, qual pessoa do time está
            atendendo.
          </p>

          <h2 id="s2">
            <span className={styles.num}>02</span> Para que usamos
          </h2>
          <ul>
            <li>Responder ao seu contato e apresentar nossos serviços.</li>
            <li>Proteger o formulário contra envios automatizados.</li>
          </ul>
          <p>
            Base legal:{' '}
            <P>
              BASE LEGAL — ex.: consentimento ou legítimo interesse; validar com
              o jurídico
            </P>
            .
          </p>

          <h2 id="s3">
            <span className={styles.num}>03</span> Com quem compartilhamos
          </h2>
          <p>
            Não vendemos seus dados. Eles passam pelos fornecedores que operam o
            site e o envio de e-mails:{' '}
            <P>FORNECEDORES — ex.: hospedagem e provedor de e-mail</P>.
          </p>

          <h2 id="s4">
            <span className={styles.num}>04</span> Por quanto tempo guardamos
          </h2>
          <p>
            <P>PRAZO DE RETENÇÃO</P>, ou até você pedir a exclusão, salvo
            obrigação legal de guardar por mais tempo.
          </p>

          <h2 id="s5">
            <span className={styles.num}>05</span> Seus direitos
          </h2>
          <p>
            Você pode pedir a confirmação de que tratamos seus dados, o acesso a
            eles, a correção, a exclusão, a portabilidade e a revogação do
            consentimento. Basta escrever para{' '}
            <P>E-MAIL DO ENCARREGADO (DPO)</P>.
          </p>

          <h2 id="s6">
            <span className={styles.num}>06</span> Encarregado
          </h2>
          <p>
            <P>NOME DO ENCARREGADO PELO TRATAMENTO DE DADOS</P> —{' '}
            <P>E-MAIL DO ENCARREGADO (DPO)</P>.
          </p>

          <h2 id="s7">
            <span className={styles.num}>07</span> Cookies
          </h2>
          <p>
            O site mede visitas com o Vercel Analytics, que não usa cookies.
            Ferramentas de análise e de anúncios (Google Tag Manager, Google
            Analytics e Meta Pixel) só são carregadas se você aceitar no aviso
            de cookies; dá para mudar a escolha em “Preferências de cookies”, no
            rodapé. <P>VALIDAR ESTE TRECHO COM O JURÍDICO</P>.
          </p>

          <h2 id="s8">
            <span className={styles.num}>08</span> Mudanças nesta política
          </h2>
          <p>
            Podemos atualizar esta política. A data no topo indica a versão em
            vigor.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
