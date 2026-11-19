import 'server-only';

import { cache } from 'react';
import { NextResponse } from 'next/server';

import { modoAuth } from './auth';
import { lerPerfil, TabelaContasAusente } from './contas';
import { clienteDoServidor } from './supabase/servidor';
import { PLATFORMS, type Platform } from '@/types/platform';
import type { ContaAtual } from '@/types/conta';

/**
 * A conta de quem fez a requisição, conferida POR INTEIRO — a camada que o
 * middleware (Edge) não é:
 *   1. o JWT do Supabase, com a assinatura conferida (`getClaims`) e `aal2`
 *      (senha + código do app de autenticação);
 *   2. a linha em `public.contas`: tem de existir e estar ATIVA. Desativar uma
 *      conta derruba quem ainda tem um JWT válido, na requisição seguinte;
 *   3. as plataformas: as da tabela AGORA (convidado), ou todas (agência).
 *
 * Em desenvolvimento sem as variáveis (`desligado-dev`) quem chega é tratado
 * como a agência, com todas as plataformas — é assim que o `yarn dev` e o
 * funil rodam. Com o acesso fechado, ninguém.
 */
const AGENCIA_SEM_LOGIN: ContaAtual = {
  id: 'dev',
  usuario: 'dev',
  papel: 'admin',
  plataformas: PLATFORMS,
};

/** Onde a pessoa está no caminho até o editor (o /login decide a tela por isto). */
export type EstadoDoAcesso =
  | { etapa: 'pronto'; conta: ContaAtual }
  | { etapa: 'sem-login' }
  | { etapa: 'fechado' }
  /** Sem sessão: e-mail e senha. */
  | { etapa: 'senha' }
  /** Senha certa (aal1), app já cadastrado: falta o código. */
  | { etapa: 'codigo'; email: string; fator: string }
  /** Senha certa (aal1), sem app cadastrado: cadastrar (obrigatório). */
  | { etapa: 'cadastro-2fa'; email: string }
  /** Sessão aal2, mas a conta não pode entrar. */
  | {
      etapa: 'bloqueada';
      email: string;
      motivo: 'sem-conta' | 'inativa' | 'sem-plataforma' | 'sem-tabela';
    };

async function resolver(detalharMfa: boolean): Promise<EstadoDoAcesso> {
  const modo = modoAuth();
  if (modo === 'desligado-dev') return { etapa: 'sem-login' };
  if (modo === 'fechado') return { etapa: 'fechado' };

  const sb = await clienteDoServidor();
  if (!sb) return { etapa: 'fechado' };
  const { data, error } = await sb.auth.getClaims();
  const claims = error ? null : data?.claims;
  if (!claims?.sub) return { etapa: 'senha' };
  const email = typeof claims.email === 'string' ? claims.email : '';

  if (claims.aal !== 'aal2') {
    if (!detalharMfa) return { etapa: 'senha' };
    const fatores = await sb.auth.mfa.listFactors();
    const fator = fatores.data?.totp.find(f => f.status === 'verified');
    return fator
      ? { etapa: 'codigo', email, fator: fator.id }
      : { etapa: 'cadastro-2fa', email };
  }

  let perfil;
  try {
    perfil = await lerPerfil(claims.sub);
  } catch (e) {
    if (e instanceof TabelaContasAusente) {
      console.error(e.message);
      return { etapa: 'bloqueada', email, motivo: 'sem-tabela' };
    }
    throw e;
  }
  if (!perfil) return { etapa: 'bloqueada', email, motivo: 'sem-conta' };
  if (!perfil.ativa) return { etapa: 'bloqueada', email, motivo: 'inativa' };

  const plataformas: Platform[] =
    perfil.papel === 'admin' ? PLATFORMS : perfil.plataformas;
  if (!plataformas.length)
    return { etapa: 'bloqueada', email, motivo: 'sem-plataforma' };
  return {
    etapa: 'pronto',
    conta: { id: claims.sub, usuario: email, papel: perfil.papel, plataformas },
  };
}

/** O estado completo, com a etapa do 2FA (lista os fatores: só o /login pede). */
export const estadoDoAcesso = cache(() => resolver(true));

/**
 * A conta da requisição atual (página ou rota), ou `null`. Uma vez por
 * requisição (`cache`): o layout do editor e a página pedem a mesma coisa.
 */
export const contaAtual = cache(async (): Promise<ContaAtual | null> => {
  const estado = await resolver(false);
  if (estado.etapa === 'sem-login') return AGENCIA_SEM_LOGIN;
  return estado.etapa === 'pronto' ? estado.conta : null;
});

/**
 * Guarda das rotas do /gerador: a conta, ou a resposta de recusa pronta.
 * `{ admin: true }` exige a conta da agência (o painel de contas).
 */
export async function exigirConta(
  opts: { admin?: boolean } = {}
): Promise<{ conta: ContaAtual } | { resposta: NextResponse }> {
  const conta = await contaAtual().catch(e => {
    console.error('Falha ao conferir a conta:', e);
    return null;
  });
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
