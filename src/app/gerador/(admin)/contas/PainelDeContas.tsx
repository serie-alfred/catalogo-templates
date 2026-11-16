'use client';

import React, { useState } from 'react';
import type { ContaPublica } from '@/lib/contas';
import type { Platform } from '@/types/platform';

import styles from './index.module.css';

interface OpcaoDePlataforma {
  valor: Platform;
  rotulo: string;
}

/** Senha aleatória legível (sem 0/O, 1/l/I), para a agência passar adiante. */
function gerarSenha(tamanho = 14): string {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = new Uint8Array(tamanho);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => alfabeto[b % alfabeto.length]).join('');
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

const urlDa = (usuario: string) =>
  `/gerador/api/contas/${encodeURIComponent(usuario)}`;

/**
 * O painel da agência: cria contas de convidado, escolhe as plataformas de
 * cada uma, troca a senha, desativa e apaga. Toda ação vai à API
 * (`/gerador/api/contas`), que confere de novo que quem pede é a agência.
 */
export default function PainelDeContas({
  inicial,
  erroInicial,
  agencia,
  senhaMinima,
  plataformas,
}: {
  inicial: ContaPublica[];
  erroInicial: string | null;
  agencia: string;
  senhaMinima: number;
  plataformas: OpcaoDePlataforma[];
}) {
  const [contas, setContas] = useState(inicial);
  const [aviso, setAviso] = useState<{
    tipo: 'ok' | 'erro';
    texto: string;
  } | null>(erroInicial ? { tipo: 'erro', texto: erroInicial } : null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  // Formulário de conta nova.
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [escolhidas, setEscolhidas] = useState<Platform[]>([]);
  /** A senha que acabou de ser definida, para a agência copiar e enviar. */
  const [senhaParaPassar, setSenhaParaPassar] = useState<{
    usuario: string;
    senha: string;
  } | null>(null);

  const rotulo = (p: Platform) =>
    plataformas.find(o => o.valor === p)?.rotulo ?? p;

  const trocarNaLista = (conta: ContaPublica) =>
    setContas(lista =>
      lista.map(c => (c.usuario === conta.usuario ? conta : c))
    );

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setOcupado('nova');
    setAviso(null);
    try {
      const { conta } = await chamar<{ conta: ContaPublica }>(
        '/gerador/api/contas',
        'POST',
        { usuario, nome, senha, plataformas: escolhidas }
      );
      setContas(lista => [conta, ...lista]);
      setSenhaParaPassar({ usuario: conta.usuario, senha });
      setUsuario('');
      setNome('');
      setSenha('');
      setEscolhidas([]);
      setAviso({ tipo: 'ok', texto: `Conta "${conta.usuario}" criada.` });
    } catch (err) {
      setAviso({ tipo: 'erro', texto: (err as Error).message });
    } finally {
      setOcupado(null);
    }
  }

  async function atualizar(
    conta: ContaPublica,
    mudancas: { plataformas?: Platform[]; ativa?: boolean; senha?: string },
    mensagem: string
  ) {
    setOcupado(conta.usuario);
    setAviso(null);
    try {
      const { conta: nova } = await chamar<{ conta: ContaPublica }>(
        urlDa(conta.usuario),
        'PATCH',
        mudancas
      );
      trocarNaLista(nova);
      setAviso({ tipo: 'ok', texto: mensagem });
      return true;
    } catch (err) {
      setAviso({ tipo: 'erro', texto: (err as Error).message });
      return false;
    } finally {
      setOcupado(null);
    }
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
      `"${conta.usuario}" ${tem ? 'perdeu' : 'ganhou'} ${rotulo(p)}. Vale no próximo carregamento do editor.`
    );
  }

  async function novaSenha(conta: ContaPublica) {
    const s = gerarSenha();
    const ok = await atualizar(
      conta,
      { senha: s },
      `Senha de "${conta.usuario}" trocada. As sessões abertas dela caíram.`
    );
    if (ok) setSenhaParaPassar({ usuario: conta.usuario, senha: s });
  }

  async function apagar(conta: ContaPublica) {
    if (
      !window.confirm(
        `Apagar a conta "${conta.usuario}"? Ela perde o acesso na hora. Os temas que ela salvou continuam no histórico, visíveis só para a agência.`
      )
    )
      return;
    setOcupado(conta.usuario);
    setAviso(null);
    try {
      await chamar(urlDa(conta.usuario), 'DELETE');
      setContas(lista => lista.filter(c => c.usuario !== conta.usuario));
      setAviso({ tipo: 'ok', texto: `Conta "${conta.usuario}" apagada.` });
    } catch (err) {
      setAviso({ tipo: 'erro', texto: (err as Error).message });
    } finally {
      setOcupado(null);
    }
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
              vê tudo e é a única que abre esta página.
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

        {senhaParaPassar && (
          <div className={styles.senhaBox} role="status" data-contas-senha="">
            <p>
              Senha de <strong>{senhaParaPassar.usuario}</strong>. Ela não é
              mostrada de novo: copie agora e envie à pessoa por um canal
              privado.
            </p>
            <code className={styles.senha}>{senhaParaPassar.senha}</code>
            <div className={styles.linha}>
              <button
                type="button"
                className={styles.secundario}
                onClick={() =>
                  void navigator.clipboard?.writeText(senhaParaPassar.senha)
                }
              >
                Copiar
              </button>
              <button
                type="button"
                className={styles.secundario}
                onClick={() => setSenhaParaPassar(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <section className={styles.card} aria-labelledby="nova-conta">
          <h2 id="nova-conta" className={styles.h2}>
            Nova conta
          </h2>
          <form className={styles.form} onSubmit={criar} data-contas-nova="">
            <label className={styles.campo}>
              <span>Usuário</span>
              <input
                name="usuario"
                value={usuario}
                onChange={e => setUsuario(e.target.value.toLowerCase())}
                placeholder="ex.: cliente.loja"
                autoComplete="off"
                required
                minLength={3}
                maxLength={40}
                pattern="[a-z0-9][a-z0-9._\-]{2,39}"
                title="3 a 40 caracteres: letras minúsculas, números, ponto, hífen e sublinhado"
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
            <label className={styles.campo}>
              <span>Senha</span>
              <div className={styles.linha}>
                <input
                  name="senha"
                  type="text"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  minLength={senhaMinima}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className={styles.secundario}
                  onClick={() => setSenha(gerarSenha())}
                >
                  Gerar
                </button>
              </div>
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
              {ocupado === 'nova' ? 'Criando…' : 'Criar conta'}
            </button>
          </form>
        </section>

        <section className={styles.card} aria-labelledby="lista-contas">
          <h2 id="lista-contas" className={styles.h2}>
            Contas de convidado ({contas.length})
          </h2>
          {!contas.length ? (
            <p className={styles.vazio}>Nenhuma conta criada ainda.</p>
          ) : (
            <ul className={styles.lista} data-contas-lista="">
              {contas.map(conta => (
                <li
                  key={conta.usuario}
                  className={`${styles.item} ${conta.ativa ? '' : styles.inativa}`}
                  data-conta={conta.usuario}
                  aria-busy={ocupado === conta.usuario}
                >
                  <div className={styles.quem}>
                    <strong>{conta.usuario}</strong>
                    {conta.nome && <span>{conta.nome}</span>}
                    {!conta.ativa && (
                      <span className={styles.selo}>Desativada</span>
                    )}
                  </div>
                  <div
                    className={styles.linha}
                    role="group"
                    aria-label={`Plataformas de ${conta.usuario}`}
                  >
                    {plataformas.map(({ valor, rotulo: r }) => (
                      <label key={valor} className={styles.check}>
                        <input
                          type="checkbox"
                          checked={conta.plataformas.includes(valor)}
                          disabled={ocupado === conta.usuario}
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
                      disabled={ocupado === conta.usuario}
                      onClick={() => void novaSenha(conta)}
                    >
                      Nova senha
                    </button>
                    <button
                      type="button"
                      className={styles.secundario}
                      disabled={ocupado === conta.usuario}
                      onClick={() =>
                        void atualizar(
                          conta,
                          { ativa: !conta.ativa },
                          conta.ativa
                            ? `"${conta.usuario}" desativada: as sessões dela caíram.`
                            : `"${conta.usuario}" reativada.`
                        )
                      }
                      data-contas-ativa=""
                    >
                      {conta.ativa ? 'Desativar' : 'Reativar'}
                    </button>
                    <button
                      type="button"
                      className={styles.perigo}
                      disabled={ocupado === conta.usuario}
                      onClick={() => void apagar(conta)}
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
