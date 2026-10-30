import React from 'react';
import type { Metadata } from 'next';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Política de Privacidade · E-temas',
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
        <h1>Política de Privacidade</h1>
        <p className={styles.atualizado}>
          Última atualização: <P>DATA DA PUBLICAÇÃO</P>
        </p>

        <p>
          Esta política explica como o E-temas, mantido por <P>RAZÃO SOCIAL</P>,
          inscrita no CNPJ <P>CNPJ</P>, com sede em <P>ENDEREÇO</P>, trata os
          dados pessoais de quem usa este site, nos termos da Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <h2>1. Quais dados coletamos</h2>
        <p>
          Pelo formulário de contato: nome, empresa, segmento, número de
          colaboradores, telefone, e-mail e a descrição do seu desafio. Também
          registramos o endereço IP do envio, por segurança e para evitar abuso.
        </p>

        <h2>2. Para que usamos</h2>
        <ul>
          <li>Responder ao seu contato e apresentar nossos serviços.</li>
          <li>Proteger o formulário contra envios automatizados.</li>
        </ul>
        <p>
          Base legal:{' '}
          <P>
            BASE LEGAL — ex.: consentimento ou legítimo interesse; validar com o
            jurídico
          </P>
          .
        </p>

        <h2>3. Com quem compartilhamos</h2>
        <p>
          Não vendemos seus dados. Eles passam pelos fornecedores que operam o
          site e o envio de e-mails:{' '}
          <P>FORNECEDORES — ex.: hospedagem e provedor de e-mail</P>.
        </p>

        <h2>4. Por quanto tempo guardamos</h2>
        <p>
          <P>PRAZO DE RETENÇÃO</P>, ou até você pedir a exclusão, salvo
          obrigação legal de guardar por mais tempo.
        </p>

        <h2>5. Seus direitos</h2>
        <p>
          Você pode pedir a confirmação de que tratamos seus dados, o acesso a
          eles, a correção, a exclusão, a portabilidade e a revogação do
          consentimento. Basta escrever para <P>E-MAIL DO ENCARREGADO (DPO)</P>.
        </p>

        <h2>6. Encarregado</h2>
        <p>
          <P>NOME DO ENCARREGADO PELO TRATAMENTO DE DADOS</P> —{' '}
          <P>E-MAIL DO ENCARREGADO (DPO)</P>.
        </p>

        <h2>7. Cookies</h2>
        <p>
          <P>DESCREVER OS COOKIES E FERRAMENTAS DE ANÁLISE EM USO, SE HOUVER</P>
          .
        </p>

        <h2>8. Mudanças nesta política</h2>
        <p>
          Podemos atualizar esta política. A data no topo indica a versão em
          vigor.
        </p>
      </main>
      <Footer />
    </>
  );
}
