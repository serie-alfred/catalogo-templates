'use client';

import React, { useState } from 'react';

import { useProvador } from '@/components/home/Provador';
import { rastrear } from '@/lib/tracking';
import {
  FAIXAS_COLABORADORES,
  PLATAFORMAS,
  PREFERENCIAS,
  SEGMENTOS,
} from '@/utils/contato';

import styles from './index.module.css';

type Estado = 'parado' | 'enviando' | 'ok' | 'erro';

/**
 * O formulário do comercial: valida no navegador (atributos nativos) e posta
 * em `/api/contato`, que valida de novo e manda para a caixa central, com a
 * preferência de contato no assunto. O template de interesse já vem com o que
 * o visitante estava provando na home. No erro os campos ficam como estavam.
 */
export default function ContactForm({ templates }: { templates: string[] }) {
  const provador = useProvador();
  const [estado, setEstado] = useState<Estado>('parado');
  const [mensagem, setMensagem] = useState('');
  const provado = provador?.atual.visual.nome ?? '';
  // Segue o template provado até o visitante escolher um no select.
  const [templateEscolhido, setTemplateEscolhido] = useState<string | null>(
    null
  );

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
          plataforma: dados.get('plataforma'),
          loja: dados.get('loja'),
          template: dados.get('template'),
          preferencia: dados.get('preferencia'),
          desafio: dados.get('desafio'),
          aceite: dados.get('aceite') === 'on',
          site: dados.get('site'),
        }),
      });
      if (res.ok) {
        rastrear('enviar_formulario', {
          plataforma: String(dados.get('plataforma') ?? ''),
          template: String(dados.get('template') ?? ''),
          preferencia: String(dados.get('preferencia') ?? ''),
        });
        form.reset();
        setTemplateEscolhido(null);
        setEstado('ok');
        setMensagem(
          'Recebemos seu contato. O comercial vai falar com você em breve, do jeito que você escolheu.'
        );
        return;
      }
      setEstado('erro');
      setMensagem(
        res.status === 429
          ? 'Muitos envios seguidos. Tente de novo mais tarde.'
          : res.status === 400
            ? 'Confira os campos marcados e tente de novo.'
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
      className={styles.form}
      onSubmit={enviar}
      aria-label="Falar com o comercial"
      data-contato=""
    >
      <div className={styles.campo}>
        <label htmlFor="ct-nome">Seu nome</label>
        <input
          id="ct-nome"
          name="nome"
          autoComplete="name"
          maxLength={120}
          required
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-empresa">Empresa</label>
        <input
          id="ct-empresa"
          name="empresa"
          autoComplete="organization"
          maxLength={120}
          required
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-email">E-mail</label>
        <input
          id="ct-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          placeholder="voce@empresa.com.br"
          required
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-telefone">Telefone ou WhatsApp</label>
        <input
          id="ct-telefone"
          name="telefone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          pattern="[\d\s\(\)+\-]{10,30}"
          title="Telefone com DDD"
          required
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-plataforma">Plataforma da loja</label>
        <select id="ct-plataforma" name="plataforma" defaultValue="" required>
          <option value="" disabled>
            Selecione
          </option>
          {PLATAFORMAS.map(p => (
            <option key={p.valor} value={p.valor}>
              {p.rotulo}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-loja">Endereço da loja (se já tiver)</label>
        <input
          id="ct-loja"
          name="loja"
          type="text"
          inputMode="url"
          maxLength={200}
          placeholder="sualoja.com.br"
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-template">Template de interesse</label>
        <select
          id="ct-template"
          name="template"
          value={templateEscolhido ?? provado}
          onChange={e => setTemplateEscolhido(e.target.value)}
        >
          <option value="">Ainda não sei</option>
          {templates.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.campo}>
        <label htmlFor="ct-segmento">Segmento</label>
        <select id="ct-segmento" name="segmento" defaultValue="" required>
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
      <div className={styles.campo}>
        <label htmlFor="ct-colaboradores">Colaboradores</label>
        <select
          id="ct-colaboradores"
          name="colaboradores"
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
      <fieldset className={styles.preferencia}>
        <legend>Prefiro que falem comigo por</legend>
        <div className={styles.opcoes}>
          {PREFERENCIAS.map((p, i) => (
            <label key={p.valor} className={styles.opcao}>
              <input
                type="radio"
                name="preferencia"
                value={p.valor}
                defaultChecked={i === 0}
                required
              />
              <span>{p.rotulo}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={`${styles.campo} ${styles.largo}`}>
        <label htmlFor="ct-desafio">
          Quer contar mais alguma coisa? (opcional)
        </label>
        <textarea id="ct-desafio" name="desafio" maxLength={3000} rows={3} />
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

      <label className={`${styles.aceite} ${styles.largo}`}>
        <input type="checkbox" name="aceite" required />
        <span>
          Li e concordo com a{' '}
          <a href="/privacidade" target="_blank">
            Política de Privacidade
          </a>{' '}
          e autorizo o contato com os dados acima.
        </span>
      </label>

      <div className={`${styles.envio} ${styles.largo}`}>
        <button
          type="submit"
          className={styles.enviar}
          disabled={estado === 'enviando'}
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar para o comercial'}
        </button>
        <p
          role="status"
          className={estado === 'erro' ? styles.statusErro : styles.statusOk}
          data-contato-estado={estado}
        >
          {mensagem}
        </p>
      </div>
    </form>
  );
}
