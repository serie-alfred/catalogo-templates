import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  COOKIE_SESSAO,
  iguaisEmTempoConstante,
  lerSessao,
  modoAuth,
} from './auth';
import { lerConta } from './contas';
import { PLATFORMS, type Platform } from '@/types/platform';
import type { ContaAtual } from '@/types/conta';

/**
 * A conta de quem fez a requisição, conferida POR INTEIRO — a camada que o
 * middleware (Edge, sem KV) não consegue ser:
 *   - agência: o cookie lido por `lerSessao` já basta (o carimbo vem das
 *     variáveis); pode todas as plataformas oferecidas;
 *   - convidado: a conta tem de existir no KV, estar ativa e ter o MESMO
 *     carimbo do cookie (senha trocada ou conta desativada derrubam a sessão);
 *     as plataformas são as do KV de agora, não as do momento do login.
 *
 * Em desenvolvimento sem as variáveis (`desligado-dev`) quem chega é tratado
 * como a agência, com todas as plataformas — é assim que o `yarn dev` e o
 * funil rodam. Com o acesso fechado, ninguém.
 */
const AGENCIA_SEM_LOGIN: ContaAtual = {
  usuario: 'dev',
  papel: 'admin',
  plataformas: PLATFORMS,
};

export async function contaDoCookie(
  valor: string | undefined
): Promise<ContaAtual | null> {
  const modo = modoAuth();
  if (modo === 'desligado-dev') return AGENCIA_SEM_LOGIN;
  if (modo === 'fechado') return null;

  const sessao = await lerSessao(valor);
  if (!sessao) return null;
  if (sessao.papel === 'admin')
    return { usuario: sessao.usuario, papel: 'admin', plataformas: PLATFORMS };

  const conta = await lerConta(sessao.usuario).catch(() => null);
  if (!conta || !conta.ativa) return null;
  if (!iguaisEmTempoConstante(conta.carimbo, sessao.carimbo)) return null;
  const plataformas = PLATFORMS.filter(p => conta.plataformas.includes(p));
  if (!plataformas.length) return null;
  return { usuario: conta.usuario, papel: 'convidado', plataformas };
}

/** A conta da requisição atual (página ou rota), pelo cookie. */
export async function contaAtual(): Promise<ContaAtual | null> {
  return contaDoCookie((await cookies()).get(COOKIE_SESSAO)?.value);
}

/**
 * Guarda das rotas do /gerador: a conta, ou a resposta de recusa pronta.
 * `{ admin: true }` exige a conta da agência (o painel de contas).
 */
export async function exigirConta(
  opts: { admin?: boolean } = {}
): Promise<{ conta: ContaAtual } | { resposta: NextResponse }> {
  const conta = await contaAtual();
  if (!conta)
    return {
      resposta: NextResponse.json(
        { message: 'Sessão ausente, expirada ou revogada: faça login.' },
        { status: 401 }
      ),
    };
  if (opts.admin && conta.papel !== 'admin')
    return {
      resposta: NextResponse.json(
        { message: 'Só a conta da agência administra as contas.' },
        { status: 403 }
      ),
    };
  return { conta };
}

/** A plataforma (o valor de `Platform`) cabe na conta? `null` não cabe. */
export function contaPode(
  conta: ContaAtual,
  plataforma: string | null | undefined
): boolean {
  if (!plataforma) return conta.papel === 'admin';
  const p = plataforma === 'Wake' ? 'Wake 2.0' : plataforma;
  return conta.plataformas.includes(p as Platform);
}

/**
 * A plataforma de um `config.json` (a TRILHA: `tray`, `wake`, `faststore`,
 * `vtex`, `nuvemshop`) traduzida para o valor de `Platform`.
 */
export function plataformaDaTrilha(trilha: unknown): Platform | null {
  switch (trilha) {
    case 'tray':
      return 'Tray';
    case 'wake':
      return 'Wake 2.0';
    case 'faststore':
    case 'vtex':
      return 'VTEX';
    case 'nuvemshop':
      return 'Nuvemshop';
    default:
      return null;
  }
}

/** Recusa padrão quando a plataforma não é da conta. */
export function plataformaRecusada(): NextResponse {
  return NextResponse.json(
    { message: 'Esta conta não tem acesso a essa plataforma.' },
    { status: 403 }
  );
}
