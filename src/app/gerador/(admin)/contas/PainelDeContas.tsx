'use client';

import React, { useState } from 'react';
import type { ContaPublica } from '@/lib/contas';
import type { Platform } from '@/types/platform';

import styles from './index.module.css';

interface OpcaoDePlataforma {
  valor: Platform;
  rotulo: string;
}

async function chamar<T>(
  url: string,
  metodo: 'POST' | 'PATCH' | 'DELETE',
  corpo?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const dados = (await res.json().catch(() => ({}))) as {
    message?: string;
  } & T;
  if (!res.ok) throw new Error(dados.message ?? `Falha (HTTP ${res.status})`);
  return dados;
}

const urlDa = (id: string) => `/gerador/api/contas/${encodeURIComponent(id)}`;

/**
 * O painel da agência: convida contas de convidado pelo e-mail, escolhe as
 * plataformas de cada uma, reenvia o acesso, zera o app de autenticação,
 * desativa e apaga. Toda ação vai à API (`/gerador/api/contas`), que confere
 * de novo que quem pede é a agência.
 *
 * Senha a agência não vê nem define: quem recebe o convite cria a própria
 * senha pelo link do e-mail, e cadastra o app de autenticação no 1º login.
 */
export default function PainelDeContas({
  inicial,
  erroInicial,
  agencia,
  plataformas,
}: {
  inicial: ContaPublica[];
  erroInicial: string | null;
  agencia: string;
  plataformas: OpcaoDePlataforma[];
}) {
  const [contas, setContas] = useState(inicial);
  const [aviso, setAviso] = useState<{
    tipo: 'ok' | 'erro';
    texto: string;
  } | null>(erroInicial ? { tipo: 'erro', texto: erroInicial } : null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  // Formulário do convite.
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [escolhidas, setEscolhidas] = useState<Platform[]>([]);

  const rotulo = (p: Platform) =>
    plataformas.find(o => o.valor === p)?.rotulo ?? p;

  const trocarNaLista = (conta: ContaPublica) =>
    setContas(lista => lista.map(c => (c.id === conta.id ? conta : c)));

  /** Roda uma ação da conta com o "ocupado" e o aviso de resultado. */
  async function acao(id: string, fazer: () => Promise<string>) {
    setOcupado(id);
    setAviso(null);
    try {
      setAviso({ tipo: 'ok', texto: await fazer() });
      return true;
    } catch (err) {
      setAviso({ tipo: 'erro', texto: (err as Error).message });
      return false;
    } finally {
      setOcupado(null);
    }
  }

  async function convidar(e: React.FormEvent) {
    e.preventDefault();
    const ok = await acao('nova', async () => {
      const { conta } = await chamar<{ conta: ContaPublica }>(
        '/gerador/api/contas',
        'POST',
        { email, nome, plataformas: escolhidas }
      );
      setContas(lista => [conta, ...lista]);
      return `Convite enviado para ${conta.email}. A pessoa cria a senha pelo link do e-mail e cadastra o app de autenticação no primeiro login.`;
    });
    if (ok) {
      setEmail('');
      setNome('');
      setEscolhidas([]);
    }
  }

  function atualizar(
    conta: ContaPublica,
    mudancas: { plataformas?: Platform[]; ativa?: boolean },
    mensagem: string
  ) {
    return acao(conta.id, async () => {
      const { conta: nova } = await chamar<{ conta: ContaPublica }>(
        urlDa(conta.id),
        'PATCH',
        mudancas
      );
      trocarNaLista(nova);
      return mensagem;
    });
  }

  function alternarPlataforma(conta: ContaPublica, p: Platform) {
    const tem = conta.plataformas.includes(p);
    const lista = tem
      ? conta.plataformas.filter(x => x !== p)
      : [...conta.plataformas, p];
    if (!lista.length) {
      setAviso({
        tipo: 'erro',
        texto:
          'A conta precisa de ao menos uma plataforma. Para tirar o acesso, desative a conta.',
      });
      return;
    }
    void atualizar(
      conta,
      { plataformas: lista },
      `${conta.email} ${tem ? 'perdeu' : 'ganhou'} ${rotulo(p)}. Vale no próximo carregamento do editor.`
    );
  }

  function reenviar(conta: ContaPublica) {
    void acao(conta.id, async () => {
      const { enviado } = await chamar<{ enviado: 'convite' | 'senha' }>(
        urlDa(conta.id),
        'POST',
        { acao: 'reenviar' }
      );
      return enviado === 'convite'
        ? `Convite reenviado para ${conta.email}.`
        : `${conta.email} já tinha entrado: foi um e-mail para criar uma senha nova.`;
    });
  }

  function zerar2fa(conta: ContaPublica) {
    if (
      !window.confirm(
        `Zerar a verificação em duas etapas de ${conta.email}? O app cadastrado deixa de valer e a pessoa cadastra outro no próximo login (use quando ela perdeu o celular).`
      )
    )
      return;
    void acao(conta.id, async () => {
      const { conta: nova } = await chamar<{ conta: ContaPublica }>(
        urlDa(conta.id),
        'POST',
        { acao: 'zerar-2fa' }
      );
      trocarNaLista(nova);
      return `2FA de ${conta.email} zerado: no próximo login ela cadastra o app de novo.`;
    });
  }

  function apagar(conta: ContaPublica) {
    if (
      !window.confirm(
        `Apagar a conta ${conta.email}? Ela perde o acesso na hora. Os temas que ela salvou continuam no histórico, visíveis só para a agência.`
      )
    )
      return;
    void acao(conta.id, async () => {
      await chamar(urlDa(conta.id), 'DELETE');
      setContas(lista => lista.filter(c => c.id !== conta.id));
      return `Conta ${conta.email} apagada.`;
    });
  }

  return (
    <div className={styles.fundo}>
      <main className={styles.page}>
        <header className={styles.topo}>
          <div>
            <a className={styles.voltar} href="/gerador">
              ← Voltar ao editor
            </a>
            <h1 className={styles.titulo}>Contas e acessos</h1>
            <p className={styles.sub}>
              Cada conta só vê no editor as plataformas marcadas, e só os temas
              que ela mesma salvou. A conta da agência (<code>{agencia}</code>)
              vê tudo e é a única que abre esta página. Todo login pede senha e
              o código de um app de autenticação.
            </p>
          </div>
        </header>

        {aviso && (
          <p
            className={aviso.tipo === 'ok' ? styles.ok : styles.erro}
            role={aviso.tipo === 'ok' ? 'status' : 'alert'}
            data-contas-aviso={aviso.tipo}
          >
            {aviso.texto}
          </p>
        )}

        <section className={styles.card} aria-labelledby="nova-conta">
          <h2 id="nova-conta" className={styles.h2}>
            Convidar
          </h2>
          <form className={styles.form} onSubmit={convidar} data-contas-nova="">
            <label className={styles.campo}>
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="ex.: ana@lojax.com.br"
                autoComplete="off"
                required
                maxLength={254}
              />
            </label>
            <label className={styles.campo}>
              <span>Quem é (opcional)</span>
              <input
                name="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="ex.: Ana — Loja X"
                maxLength={80}
              />
            </label>
            <fieldset className={styles.plataformas}>
              <legend>Plataformas que a conta vê</legend>
              {plataformas.map(({ valor, rotulo: r }) => (
                <label key={valor} className={styles.check}>
                  <input
                    type="checkbox"
                    name="plataformas"
                    value={valor}
                    checked={escolhidas.includes(valor)}
                    onChange={() =>
                      setEscolhidas(lista =>
                        lista.includes(valor)
                          ? lista.filter(x => x !== valor)
                          : [...lista, valor]
                      )
                    }
                  />
                  {r}
                </label>
              ))}
            </fieldset>
            <button
              type="submit"
              className={styles.primario}
              disabled={ocupado === 'nova' || !escolhidas.length}
            >
              {ocupado === 'nova' ? 'Enviando…' : 'Enviar convite'}
            </button>
          </form>
        </section>

        <section className={styles.card} aria-labelledby="lista-contas">
          <h2 id="lista-contas" className={styles.h2}>
            Contas de convidado ({contas.length})
          </h2>
          {!contas.length ? (
            <p className={styles.vazio}>Nenhuma conta convidada ainda.</p>
          ) : (
            <ul className={styles.lista} data-contas-lista="">
              {contas.map(conta => (
                <li
                  key={conta.id}
                  className={`${styles.item} ${conta.ativa ? '' : styles.inativa}`}
                  data-conta={conta.email}
                  aria-busy={ocupado === conta.id}
                >
                  <div className={styles.quem}>
                    <strong>{conta.email}</strong>
                    {conta.nome && <span>{conta.nome}</span>}
                    {!conta.ativa && (
                      <span className={styles.selo}>Desativada</span>
                    )}
                    {conta.convitePendente && (
                      <span className={styles.selo}>Convite pendente</span>
                    )}
                    {!conta.convitePendente && !conta.tem2fa && (
                      <span className={styles.selo}>Sem 2FA ainda</span>
                    )}
                  </div>
                  <div
                    className={styles.linha}
                    role="group"
                    aria-label={`Plataformas de ${conta.email}`}
                  >
                    {plataformas.map(({ valor, rotulo: r }) => (
                      <label key={valor} className={styles.check}>
                        <input
                          type="checkbox"
                          checked={conta.plataformas.includes(valor)}
                          disabled={ocupado === conta.id}
                          onChange={() => alternarPlataforma(conta, valor)}
                          data-plataforma={valor}
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                  <div className={styles.acoes}>
                    <button
                      type="button"
                      className={styles.secundario}
                      disabled={ocupado === conta.id || !conta.ativa}
                      onClick={() => reenviar(conta)}
                      data-contas-reenviar=""
                      title={
                        conta.convitePendente
                          ? 'Manda o convite de novo'
                          : 'Manda um e-mail para criar uma senha nova'
                      }
                    >
                      Reenviar acesso
                    </button>
                    <button
                      type="button"
                      className={styles.secundario}
                      disabled={ocupado === conta.id || !conta.tem2fa}
                      onClick={() => zerar2fa(conta)}
                      data-contas-zerar-2fa=""
                    >
                      Zerar 2FA
                    </button>
                    <button
                      type="button"
                      className={styles.secundario}
                      disabled={ocupado === conta.id}
                      onClick={() =>
                        void atualizar(
                          conta,
                          { ativa: !conta.ativa },
                          conta.ativa
                            ? `${conta.email} desativada: as sessões dela caíram.`
                            : `${conta.email} reativada.`
                        )
                      }
                      data-contas-ativa=""
                    >
                      {conta.ativa ? 'Desativar' : 'Reativar'}
                    </button>
                    <button
                      type="button"
                      className={styles.perigo}
                      disabled={ocupado === conta.id}
                      onClick={() => apagar(conta)}
                    >
                      Apagar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
