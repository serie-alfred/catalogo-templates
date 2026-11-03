'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useProvador } from '@/components/home/Provador';
import { rastrear } from '@/lib/tracking';
import {
  digitosDoTelefone,
  erroDaLoja,
  erroDoEmail,
  erroDoNome,
  erroDoTelefone,
  FAIXAS_COLABORADORES,
  mascararTelefone,
  normalizarLoja,
  PLATAFORMAS,
  PREFERENCIAS,
  SEGMENTOS,
  sugestaoDeEmail,
} from '@/utils/contato';

import styles from './ContactForm.module.css';

type Estado = 'parado' | 'enviando' | 'ok' | 'erro';

type Valores = {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  plataforma: string;
  loja: string;
  segmento: string;
  colaboradores: string;
  preferencia: string;
  desafio: string;
  aceite: boolean;
};

type Campo = keyof Valores;

const VAZIO: Valores = {
  nome: '',
  empresa: '',
  email: '',
  telefone: '',
  plataforma: '',
  loja: '',
  segmento: '',
  colaboradores: '',
  preferencia: PREFERENCIAS[0].valor,
  desafio: '',
  aceite: false,
};

/** A ordem da tela: é a ordem em que o foco procura o primeiro erro. */
const ORDEM: Campo[] = [
  'nome',
  'empresa',
  'email',
  'telefone',
  'plataforma',
  'loja',
  'segmento',
  'colaboradores',
  'desafio',
  'aceite',
];

function erroDe(campo: Campo, v: Valores): string | null {
  switch (campo) {
    case 'nome':
      return erroDoNome(v.nome, 'Como podemos te chamar?');
    case 'empresa':
      return erroDoNome(v.empresa, 'Qual o nome da empresa?');
    case 'email':
      return erroDoEmail(v.email);
    case 'telefone':
      return erroDoTelefone(v.telefone, v.preferencia);
    case 'plataforma':
      return v.plataforma ? null : 'Escolha a plataforma, ou "Outra".';
    case 'loja':
      return erroDaLoja(v.loja);
    case 'segmento':
      return v.segmento ? null : 'Escolha o segmento mais perto do seu.';
    case 'colaboradores':
      return v.colaboradores ? null : 'Escolha uma faixa.';
    case 'aceite':
      return v.aceite
        ? null
        : 'Precisamos do seu aceite para entrar em contato.';
    default:
      return null;
  }
}

function errosDe(v: Valores): Partial<Record<Campo, string>> {
  const erros: Partial<Record<Campo, string>> = {};
  for (const c of ORDEM) {
    const e = erroDe(c, v);
    if (e) erros[c] = e;
  }
  return erros;
}

/**
 * O formulário do comercial. Valida campo a campo no navegador, com as mesmas
 * regras da rota `/api/contato` (`utils/contato.ts`), que valida de novo e
 * manda para a caixa central com a preferência de contato no assunto.
 *
 * - O aviso aparece quando o visitante sai do campo, nunca enquanto digita
 *   pela primeira vez; depois disso some assim que o valor fica certo.
 * - Telefone com máscara; loja sem `https://`; e-mail com sugestão para o
 *   domínio trocado mais comum (`gmial.com`).
 * - O template de interesse segue o que o visitante prova na home, até ele
 *   escolher um no select.
 * - No erro de envio os campos ficam como estavam; no sucesso o formulário
 *   dá lugar à confirmação, que oferece um novo envio.
 */
export default function ContactForm({ templates }: { templates: string[] }) {
  const provador = useProvador();
  const provado = provador?.atual.visual.nome ?? '';
  const [templateEscolhido, setTemplateEscolhido] = useState<string | null>(
    null
  );
  const [valores, setValores] = useState<Valores>(VAZIO);
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [estado, setEstado] = useState<Estado>('parado');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState<Valores | null>(null);
  // Reprovados pelo servidor e ainda não mexidos: a regra local pode ser
  // mais branda que a dele.
  const [doServidor, setDoServidor] = useState<Partial<Record<Campo, true>>>(
    {}
  );
  const [tremer, setTremer] = useState(0);
  // Barrado aqui, antes de ir ao servidor: o aviso de baixo conta os campos
  // que faltam AO VIVO e some quando o último fica certo.
  const [barrado, setBarrado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmacaoRef = useRef<HTMLHeadingElement>(null);

  const erros = errosDe(valores);
  const avisoDe = (c: Campo): string | null =>
    tocados[c]
      ? (erros[c] ?? (doServidor[c] ? 'Confira este campo.' : null))
      : null;
  const template = templateEscolhido ?? provado;
  const faltam = Object.keys(erros).length;
  const status =
    estado === 'enviando'
      ? 'Enviando…'
      : barrado
        ? faltam === 0
          ? ''
          : faltam === 1
            ? 'Falta acertar 1 campo.'
            : `Faltam acertar ${faltam} campos.`
        : mensagem;
  const sugestao = sugestaoDeEmail(valores.email);

  useEffect(() => {
    if (estado === 'ok') confirmacaoRef.current?.focus();
  }, [estado]);

  const mudar = <C extends Campo>(campo: C, valor: Valores[C]) => {
    setValores(v => ({ ...v, [campo]: valor }));
    if (doServidor[campo])
      setDoServidor(d => {
        const resto = { ...d };
        delete resto[campo];
        return resto;
      });
  };

  const tocar = (campo: Campo) => setTocados(t => ({ ...t, [campo]: true }));

  const digitarTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novo = e.target.value;
    const antes = valores.telefone;
    let digitos = digitosDoTelefone(novo);
    // Apagar um ")" ou "-" da máscara não muda os dígitos, e a máscara o poria
    // de volta: o backspace apaga o dígito de antes dele.
    if (novo.length < antes.length && digitos === digitosDoTelefone(antes))
      digitos = digitos.slice(0, -1);
    mudar('telefone', mascararTelefone(digitos));
  };

  const focarPrimeiroErro = (lista: Campo[]) => {
    const primeiro = ORDEM.find(c => lista.includes(c));
    if (!primeiro) return;
    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${primeiro}"]`
    );
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    const pendentes = Object.keys(erros) as Campo[];
    if (pendentes.length) {
      setTocados(Object.fromEntries(ORDEM.map(c => [c, true])));
      setTremer(n => n + 1);
      setBarrado(true);
      focarPrimeiroErro(pendentes);
      return;
    }
    setBarrado(false);
    const site = new FormData(e.currentTarget).get('site');
    setEstado('enviando');
    setMensagem('');
    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...valores,
          nome: valores.nome.trim(),
          empresa: valores.empresa.trim(),
          email: valores.email.trim(),
          loja: normalizarLoja(valores.loja),
          template,
          site,
        }),
      });
      if (res.ok) {
        rastrear('enviar_formulario', {
          plataforma: valores.plataforma,
          template,
          preferencia: valores.preferencia,
        });
        setEnviado(valores);
        setEstado('ok');
        setMensagem('');
        return;
      }
      setEstado('erro');
      if (res.status === 400) {
        const corpo = (await res.json().catch(() => null)) as {
          campos?: string[];
        } | null;
        const campos = (corpo?.campos ?? []).filter((c): c is Campo =>
          ORDEM.includes(c as Campo)
        );
        setDoServidor(Object.fromEntries(campos.map(c => [c, true])));
        setTocados(t => ({
          ...t,
          ...Object.fromEntries(campos.map(c => [c, true])),
        }));
        setTremer(n => n + 1);
        focarPrimeiroErro(campos);
      }
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

  const recomecar = () => {
    setValores(v => ({ ...VAZIO, preferencia: v.preferencia }));
    setTocados({});
    setBarrado(false);
    setTemplateEscolhido(null);
    setEnviado(null);
    setEstado('parado');
  };

  if (estado === 'ok' && enviado) {
    const primeiroNome = enviado.nome.trim().split(/\s+/)[0];
    const porWhats = enviado.preferencia === 'whatsapp';
    return (
      <div className={styles.confirmacao} data-contato-estado="ok">
        <svg
          className={styles.selo}
          viewBox="0 0 64 64"
          width="64"
          height="64"
          aria-hidden
        >
          <circle cx="32" cy="32" r="29" />
          <path d="M20 33l8 8 16-17" />
        </svg>
        <h3 ref={confirmacaoRef} tabIndex={-1}>
          Recebemos, {primeiroNome}!
        </h3>
        <p>
          {porWhats ? (
            <>
              O comercial vai te chamar no WhatsApp{' '}
              <strong>{enviado.telefone}</strong> em breve.
            </>
          ) : (
            <>
              O comercial vai responder em <strong>{enviado.email}</strong> em
              breve.
            </>
          )}
        </p>
        <button type="button" className={styles.denovo} onClick={recomecar}>
          Enviar outro contato
        </button>
      </div>
    );
  }

  const ligar = (campo: Campo) => ({
    id: `ct-${campo}`,
    name: campo,
    'aria-invalid': avisoDe(campo) ? true : undefined,
    'aria-describedby': `ct-${campo}-aviso`,
    onBlur: () => tocar(campo),
  });

  const caixa = (
    campo: Campo,
    rotulo: string,
    controle: React.ReactNode,
    extra: { largo?: boolean; cheio?: boolean; dica?: React.ReactNode } = {}
  ) => {
    const aviso = avisoDe(campo);
    const valor = valores[campo];
    const cheio = extra.cheio ?? (typeof valor === 'string' && valor !== '');
    const certo = Boolean(tocados[campo] && cheio && !aviso);
    return (
      <div
        className={`${styles.campo} ${extra.largo ? styles.largo : ''}`}
        data-cheio={cheio ? '' : undefined}
        data-erro={aviso ? '' : undefined}
        data-certo={certo ? '' : undefined}
      >
        <div className={styles.caixa}>
          {controle}
          <label htmlFor={`ct-${campo}`}>{rotulo}</label>
          <svg className={styles.ok} viewBox="0 0 20 20" aria-hidden>
            <path d="M5 10.5l3.2 3.2L15 7" />
          </svg>
        </div>
        <Aviso id={`ct-${campo}-aviso`} erro={aviso}>
          {extra.dica}
        </Aviso>
      </div>
    );
  };

  const opcoes = (lista: readonly { valor: string; rotulo: string }[]) => (
    <>
      <option value="" disabled hidden />
      {lista.map(o => (
        <option key={o.valor} value={o.valor}>
          {o.rotulo}
        </option>
      ))}
    </>
  );

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={enviar}
      noValidate
      aria-label="Falar com o comercial"
      data-contato=""
      data-tremer={tremer % 2 ? 'a' : tremer ? 'b' : undefined}
    >
      {caixa(
        'nome',
        'Seu nome',
        <input
          {...ligar('nome')}
          autoComplete="name"
          maxLength={120}
          required
          enterKeyHint="next"
          value={valores.nome}
          onChange={e => mudar('nome', e.target.value)}
        />
      )}
      {caixa(
        'empresa',
        'Empresa',
        <input
          {...ligar('empresa')}
          autoComplete="organization"
          maxLength={120}
          required
          enterKeyHint="next"
          value={valores.empresa}
          onChange={e => mudar('empresa', e.target.value)}
        />
      )}
      {caixa(
        'email',
        'E-mail',
        <input
          {...ligar('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={160}
          placeholder="voce@empresa.com.br"
          required
          enterKeyHint="next"
          value={valores.email}
          onChange={e => mudar('email', e.target.value.replace(/\s/g, ''))}
        />,
        {
          dica: sugestao ? (
            <>
              Você quis dizer{' '}
              <button
                type="button"
                className={styles.sugestao}
                onClick={() => mudar('email', sugestao)}
              >
                {sugestao}
              </button>
              ?
            </>
          ) : undefined,
        }
      )}
      {caixa(
        'telefone',
        valores.preferencia === 'whatsapp'
          ? 'WhatsApp com DDD'
          : 'Telefone com DDD',
        <input
          {...ligar('telefone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(11) 99999-9999"
          required
          enterKeyHint="next"
          value={valores.telefone}
          onChange={digitarTelefone}
        />
      )}
      {caixa(
        'plataforma',
        'Plataforma da loja',
        <select
          {...ligar('plataforma')}
          required
          value={valores.plataforma}
          onChange={e => {
            mudar('plataforma', e.target.value);
            tocar('plataforma');
          }}
        >
          {opcoes(PLATAFORMAS)}
        </select>
      )}
      {caixa(
        'loja',
        'Endereço da loja (se já tiver)',
        <input
          {...ligar('loja')}
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={200}
          placeholder="sualoja.com.br"
          enterKeyHint="next"
          value={valores.loja}
          onChange={e => mudar('loja', e.target.value.replace(/\s/g, ''))}
          onBlur={() => {
            tocar('loja');
            mudar('loja', normalizarLoja(valores.loja));
          }}
        />
      )}
      <div className={styles.campo} data-cheio="">
        <div className={styles.caixa}>
          <select
            id="ct-template"
            name="template"
            value={template}
            onChange={e => setTemplateEscolhido(e.target.value)}
          >
            <option value="">Ainda não sei</option>
            {templates.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <label htmlFor="ct-template">Template de interesse</label>
        </div>
      </div>
      {caixa(
        'segmento',
        'Segmento',
        <select
          {...ligar('segmento')}
          required
          value={valores.segmento}
          onChange={e => {
            mudar('segmento', e.target.value);
            tocar('segmento');
          }}
        >
          {opcoes(SEGMENTOS)}
        </select>
      )}
      {caixa(
        'colaboradores',
        'Colaboradores',
        <select
          {...ligar('colaboradores')}
          required
          value={valores.colaboradores}
          onChange={e => {
            mudar('colaboradores', e.target.value);
            tocar('colaboradores');
          }}
        >
          {opcoes(FAIXAS_COLABORADORES.map(f => ({ valor: f, rotulo: f })))}
        </select>
      )}
      <fieldset className={styles.preferencia}>
        {/* Sem rótulo visível: as opções dizem "Prefiro …" e a caixa fica com
            a altura dos campos ao lado. */}
        <legend className="siteSr">Prefiro que falem comigo por</legend>
        <div
          className={styles.opcoes}
          data-escolha={PREFERENCIAS.findIndex(
            p => p.valor === valores.preferencia
          )}
        >
          {PREFERENCIAS.map(p => (
            <label key={p.valor} className={styles.opcao}>
              <input
                type="radio"
                name="preferencia"
                value={p.valor}
                checked={valores.preferencia === p.valor}
                onChange={() => mudar('preferencia', p.valor)}
              />
              <span>Prefiro {p.valor === 'email' ? 'e-mail' : p.rotulo}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {caixa(
        'desafio',
        'Mais alguma coisa? (opcional)',
        <textarea
          {...ligar('desafio')}
          maxLength={3000}
          rows={3}
          value={valores.desafio}
          onChange={e => mudar('desafio', e.target.value)}
        />,
        {
          largo: true,
          dica:
            valores.desafio.length > 2500
              ? `${3000 - valores.desafio.length} caracteres restantes.`
              : undefined,
        }
      )}

      {/* Isca para robô: escondida de gente e de leitor de tela. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className={styles.isca}
      />

      <div
        className={`${styles.aceite} ${styles.largo}`}
        data-erro={avisoDe('aceite') ? '' : undefined}
      >
        <label>
          <input
            type="checkbox"
            {...ligar('aceite')}
            required
            checked={valores.aceite}
            onChange={e => {
              mudar('aceite', e.target.checked);
              tocar('aceite');
            }}
          />
          <span className={styles.marca} aria-hidden>
            <svg viewBox="0 0 20 20">
              <path d="M5 10.5l3.2 3.2L15 7" />
            </svg>
          </span>
          <span>
            Li e concordo com a{' '}
            <a href="/privacidade" target="_blank">
              Política de Privacidade
            </a>{' '}
            e autorizo o contato com os dados acima.
          </span>
        </label>
        <Aviso id="ct-aceite-aviso" erro={avisoDe('aceite')} />
      </div>

      <div className={`${styles.envio} ${styles.largo}`}>
        <button
          type="submit"
          className={styles.enviar}
          data-enviando={estado === 'enviando' ? '' : undefined}
          aria-disabled={estado === 'enviando' || undefined}
        >
          <span className={styles.enviarTexto}>Enviar para o comercial</span>
          <span className={styles.giro} aria-hidden />
        </button>
        <p
          role="status"
          className={styles.status}
          data-contato-estado={barrado && faltam ? 'erro' : estado}
        >
          {status}
        </p>
      </div>
    </form>
  );
}

/**
 * A linha de baixo do campo: erro (vermelho) ou dica. Abre e fecha pela altura,
 * e guarda o último texto enquanto fecha, para ele não sumir antes da caixa.
 */
function Aviso({
  id,
  erro,
  children,
}: {
  id: string;
  erro: string | null;
  children?: React.ReactNode;
}) {
  const conteudo = erro ?? children ?? null;
  const ultimo = useRef<React.ReactNode>(null);
  if (conteudo) ultimo.current = conteudo;
  return (
    <div
      className={styles.aviso}
      data-aberto={conteudo ? '' : undefined}
      data-tipo={erro ? 'erro' : 'dica'}
      aria-hidden={conteudo ? undefined : true}
    >
      <p id={id} aria-live="polite">
        {conteudo ?? ultimo.current}
      </p>
    </div>
  );
}
