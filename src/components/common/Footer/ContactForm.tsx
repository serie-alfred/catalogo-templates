'use client';

import React, { useState } from 'react';
import { icons } from '@/assets/icons/icons';
import { FAIXAS_COLABORADORES, SEGMENTOS } from '@/utils/contato';

import styles from './index.module.css';

type Estado = 'parado' | 'enviando' | 'ok' | 'erro';

/**
 * O formulário "Iniciar lançamento": valida no navegador (atributos nativos) e
 * posta em `/api/contato`, que valida de novo. Mostra enviando, sucesso e erro;
 * no erro os campos ficam como estavam, para tentar de novo sem redigitar.
 */
export default function ContactForm() {
  const [estado, setEstado] = useState<Estado>('parado');
  const [mensagem, setMensagem] = useState('');

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    const form = e.currentTarget;
    const dados = new FormData(form);
    setEstado('enviando');
    setMensagem('');
    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: dados.get('nome'),
          empresa: dados.get('empresa'),
          segmento: dados.get('segmento'),
          colaboradores: dados.get('colaboradores'),
          telefone: dados.get('telefone'),
          email: dados.get('email'),
          desafio: dados.get('desafio'),
          aceite: dados.get('aceite') === 'on',
          site: dados.get('site'),
        }),
      });
      if (res.ok) {
        form.reset();
        setEstado('ok');
        setMensagem(
          'Recebemos sua mensagem. Nosso time vai falar com você em breve.'
        );
        return;
      }
      setEstado('erro');
      setMensagem(
        res.status === 429
          ? 'Muitos envios seguidos. Tente de novo mais tarde.'
          : res.status === 400
            ? 'Confira os campos e tente de novo.'
            : 'Não conseguimos enviar agora. Tente de novo em instantes.'
      );
    } catch {
      setEstado('erro');
      setMensagem(
        'Não conseguimos enviar agora. Confira sua conexão e tente de novo.'
      );
    }
  };

  return (
    <form
      className={styles.footerDir}
      onSubmit={enviar}
      aria-label="Fale com a gente"
      data-contato=""
    >
      <div className={styles.containerInput}>
        <label htmlFor="name" className={styles.titleInput}>
          Seu nome<span className={styles.blue}>*</span>
        </label>
        <input
          id="name"
          name="nome"
          className={styles.inputBox}
          placeholder="Nome..."
          autoComplete="name"
          maxLength={120}
          required
        />
      </div>
      <div className={styles.containerInput}>
        <label htmlFor="company" className={styles.titleInput}>
          Sua Empresa<span className={styles.blue}>*</span>
        </label>
        <input
          id="company"
          name="empresa"
          className={styles.inputBox}
          placeholder="Nome da sua empresa..."
          autoComplete="organization"
          maxLength={120}
          required
        />
      </div>
      <div className={styles.duploInputContainer}>
        <div className={styles.inputItem}>
          <label htmlFor="segment" className={styles.titleInput}>
            Seu segmento<span className={styles.blue}>*</span>
          </label>
          <select
            id="segment"
            name="segmento"
            className={styles.inputBoxDuplo}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            {SEGMENTOS.map(s => (
              <option key={s.valor} value={s.valor}>
                {s.rotulo}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputItem}>
          <label htmlFor="employees" className={styles.titleInput}>
            Colaboradores<span className={styles.blue}>*</span>
          </label>
          <select
            id="employees"
            name="colaboradores"
            className={styles.inputBoxDuplo}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            {FAIXAS_COLABORADORES.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.containerInput}>
        <label htmlFor="phone" className={styles.titleInput}>
          Telefone<span className={styles.blue}>*</span>
        </label>
        <input
          id="phone"
          name="telefone"
          type="tel"
          className={styles.inputBox}
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          pattern="[\d\s()+\-]{10,30}"
          title="Telefone com DDD"
          required
        />
      </div>
      <div className={styles.containerInput}>
        <label htmlFor="email" className={styles.titleInput}>
          E-mail Corporativo<span className={styles.blue}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.inputBox}
          placeholder="voce@empresa.com.br"
          autoComplete="email"
          maxLength={160}
          required
        />
      </div>
      <div className={styles.containerInput}>
        <label htmlFor="challenge" className={styles.titleInput}>
          Qual seu desafio?<span className={styles.blue}>*</span>
        </label>
        <textarea
          id="challenge"
          name="desafio"
          className={`${styles.inputBox} ${styles.bigBox}`}
          placeholder="Descreva qual o desafio que sua empresa enfrenta..."
          maxLength={3000}
          required
        />
      </div>

      {/* Isca para robô: escondida de gente e de leitor de tela. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className={styles.isca}
      />

      <label className={styles.aceite}>
        <input type="checkbox" name="aceite" required />
        <span>
          Li e concordo com a{' '}
          <a href="/privacidade" target="_blank">
            Política de Privacidade
          </a>
          , e autorizo o contato com os dados acima.
        </span>
      </label>

      <button
        type="submit"
        className={styles.btnAction}
        disabled={estado === 'enviando'}
      >
        {estado === 'enviando' ? 'Enviando…' : 'Iniciar lançamento'}
        {icons.InitLaunchArrowIcon}
      </button>

      <p
        role="status"
        className={estado === 'erro' ? styles.statusErro : styles.statusOk}
        data-contato-estado={estado}
      >
        {mensagem}
      </p>
    </form>
  );
}
