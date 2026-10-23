'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import type { TemaResumo } from '@/lib/temasStore';
import type { EstadoDoEditor } from '@/types/estadoEditor';

import styles from './index.module.css';

const API = '/gerador/api/temas';

const quando = (ms: number) =>
  new Date(ms).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Lê a mensagem de erro da rota (503 diz o que configurar). */
async function falha(res: Response, padrao: string) {
  try {
    const { message } = (await res.json()) as { message?: string };
    return message || padrao;
  } catch {
    return padrao;
  }
}

/**
 * "Temas salvos" (rail): o histórico da agência, no KV (src/lib/temasStore.ts).
 *
 * - Em cima, o tema DESTA aba: o nome e "Salvar versão" — a primeira vez cria
 *   o tema no histórico, as seguintes acrescentam versões a ele. "Salvar como
 *   novo" separa a aba num tema próprio.
 * - Embaixo, a lista: nome, plataforma, data da última versão. "Abrir" troca o
 *   tema da aba pela última versão (ou por uma escolhida em "Versões");
 *   "Apagar" remove o tema e todas as versões.
 *
 * Abrir é um passo de desfazer (`carregarEstado`) e desvincula o preview ao
 * vivo da aba: o link que estava aberto pertence ao tema de antes.
 */
export default function PanelSavedThemes() {
  const {
    temaAtual,
    setTemaAtual,
    estadoAtual,
    carregarEstado,
    setPreviewAtual,
    selections,
    lp,
  } = useLayout();

  const [temas, setTemas] = useState<TemaResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nome, setNome] = useState(temaAtual?.nome ?? '');
  const [ocupado, setOcupado] = useState(false);
  const [abertoId, setAbertoId] = useState<string | null>(null);

  useEffect(() => {
    setNome(temaAtual?.nome ?? '');
  }, [temaAtual]);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok)
        throw new Error(await falha(res, 'Não deu para ler o histórico.'));
      const { temas } = (await res.json()) as { temas: TemaResumo[] };
      setTemas(temas);
      setErro(null);
    } catch (e) {
      setTemas([]);
      setErro(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salvar = async (comoNovo: boolean) => {
    const n = nome.trim();
    if (!n) {
      setAviso('Dê um nome ao tema para salvar.');
      return;
    }
    setOcupado(true);
    setAviso(null);
    try {
      const doc = estadoAtual();
      const novo = comoNovo || !temaAtual;
      const res = await fetch(novo ? API : `${API}/${temaAtual!.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: n, doc }),
      });
      if (res.status === 404 && !novo) {
        // Apagado em outra aba: a próxima tentativa cria de novo.
        setTemaAtual(null);
        throw new Error(
          'Este tema foi apagado do histórico. Salve de novo para recriá-lo.'
        );
      }
      if (!res.ok) throw new Error(await falha(res, 'Não deu para salvar.'));
      const { tema } = (await res.json()) as { tema: TemaResumo };
      setTemaAtual({ id: tema.id, nome: tema.nome });
      setAviso(`Versão ${tema.versoes.at(-1)?.n ?? 1} salva.`);
      await carregar();
    } catch (e) {
      setAviso(e instanceof Error ? e.message : String(e));
    } finally {
      setOcupado(false);
    }
  };

  const abrir = async (tema: TemaResumo, versao?: number) => {
    const temTrabalho = selections.length > 0 || lp.selections.length > 0;
    if (
      temTrabalho &&
      temaAtual?.id !== tema.id &&
      !window.confirm(
        `Abrir "${tema.nome}"${versao ? ` (versão ${versao})` : ''}?\n\nO tema desta aba será substituído. Dá para desfazer com Voltar.`
      )
    )
      return;
    setOcupado(true);
    setAviso(null);
    try {
      const res = await fetch(
        `${API}/${tema.id}${versao ? `?versao=${versao}` : ''}`,
        { cache: 'no-store' }
      );
      if (!res.ok)
        throw new Error(await falha(res, 'Não deu para abrir o tema.'));
      const { doc, versao: n } = (await res.json()) as {
        doc: EstadoDoEditor;
        versao: number;
      };
      carregarEstado(doc, { manterPainel: true });
      setTemaAtual({ id: tema.id, nome: tema.nome });
      setPreviewAtual(null);
      setAviso(`"${tema.nome}" aberto (versão ${n}).`);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : String(e));
    } finally {
      setOcupado(false);
    }
  };

  const apagar = async (tema: TemaResumo) => {
    if (
      !window.confirm(
        `Apagar "${tema.nome}" e as ${tema.versoes.length} versões do histórico?\n\nIsto não tem volta.`
      )
    )
      return;
    setOcupado(true);
    setAviso(null);
    try {
      const res = await fetch(`${API}/${tema.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404)
        throw new Error(await falha(res, 'Não deu para apagar.'));
      if (temaAtual?.id === tema.id) setTemaAtual(null);
      setAviso(`"${tema.nome}" apagado.`);
      await carregar();
    } catch (e) {
      setAviso(e instanceof Error ? e.message : String(e));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className={styles.wrap} data-temas-salvos="">
      <section className={styles.block}>
        <h3 className={styles.title}>Este tema</h3>
        <label className={styles.label} htmlFor="tema-nome">
          Nome
        </label>
        <input
          id="tema-nome"
          className={styles.input}
          type="text"
          value={nome}
          maxLength={80}
          placeholder="Ex.: Loja de calçados — proposta 1"
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              salvar(false);
            }
          }}
        />
        <div className={styles.row}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => salvar(false)}
            disabled={ocupado}
            data-acao="salvar"
          >
            {temaAtual ? 'Salvar versão' : 'Salvar no histórico'}
          </button>
          {temaAtual && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => salvar(true)}
              disabled={ocupado}
              data-acao="salvar-novo"
            >
              Salvar como novo
            </button>
          )}
        </div>
        {aviso && (
          <p className={styles.aviso} role="status" data-temas-aviso="">
            {aviso}
          </p>
        )}
      </section>

      <section className={styles.block}>
        <h3 className={styles.title}>Temas salvos</h3>
        {erro && (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        )}
        {temas === null && <p className={styles.hint}>Carregando…</p>}
        {temas?.length === 0 && !erro && (
          <p className={styles.hint}>
            Nenhum tema salvo ainda. Monte um tema e use “Salvar no histórico”.
          </p>
        )}
        <ul className={styles.list}>
          {temas?.map(tema => {
            const ultima = tema.versoes.at(-1);
            const vendoVersoes = abertoId === tema.id;
            return (
              <li
                key={tema.id}
                className={`${styles.item} ${
                  temaAtual?.id === tema.id ? styles.atual : ''
                }`}
                data-tema-id={tema.id}
              >
                <div className={styles.itemHead}>
                  <span className={styles.nome}>{tema.nome}</span>
                  <span className={styles.meta}>
                    {tema.platform ?? 'sem plataforma'} ·{' '}
                    {ultima ? quando(ultima.salvoEm) : '—'}
                  </span>
                  <span className={styles.meta}>
                    {tema.versoes.length}{' '}
                    {tema.versoes.length === 1 ? 'versão' : 'versões'}
                    {temaAtual?.id === tema.id ? ' · nesta aba' : ''}
                  </span>
                </div>
                <div className={styles.row}>
                  <button
                    type="button"
                    className={styles.small}
                    onClick={() => abrir(tema)}
                    disabled={ocupado}
                    data-acao="abrir"
                  >
                    Abrir
                  </button>
                  <button
                    type="button"
                    className={styles.small}
                    onClick={() => setAbertoId(vendoVersoes ? null : tema.id)}
                    aria-expanded={vendoVersoes}
                    data-acao="versoes"
                  >
                    Versões
                  </button>
                  <button
                    type="button"
                    className={`${styles.small} ${styles.perigo}`}
                    onClick={() => apagar(tema)}
                    disabled={ocupado}
                    data-acao="apagar"
                  >
                    Apagar
                  </button>
                </div>
                {vendoVersoes && (
                  <ol className={styles.versoes}>
                    {[...tema.versoes].reverse().map(v => (
                      <li key={v.n}>
                        <button
                          type="button"
                          className={styles.versao}
                          onClick={() => abrir(tema, v.n)}
                          disabled={ocupado}
                          data-versao={v.n}
                        >
                          <span>Versão {v.n}</span>
                          <span className={styles.meta}>
                            {quando(v.salvoEm)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
