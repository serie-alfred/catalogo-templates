import 'server-only';

import type { User } from '@supabase/supabase-js';
import { clienteAdmin } from './supabase/admin';
import type { Papel } from './auth';
import { PLATFORMS, type Platform } from '@/types/platform';

/**
 * As contas do /gerador: o USUÁRIO é do Supabase Auth (e-mail, senha, 2FA) e
 * o PERFIL é uma linha de `public.contas` (supabase/migrations):
 *
 *   user_id (→ auth.users) · papel ('admin' | 'convidado') · plataformas ·
 *   nome · ativo · criado_em
 *
 * A tabela tem RLS ligado e NENHUMA política: só a chave secreta (servidor)
 * lê e grava. O cliente nunca a enxerga.
 *
 * A agência (`admin`) vê tudo e é a única que administra as contas, pelo
 * painel `/gerador/contas`. Convidado (`convidado`, stakeholder) vê só as
 * plataformas marcadas e os temas que ele mesmo salvou.
 *
 * Convidar é `auth.admin.inviteUserByEmail`: a pessoa recebe o e-mail, define a
 * senha em /auth/definir-senha e, no primeiro login, cadastra o app de
 * autenticação (a verificação em duas etapas é obrigatória para todos).
 *
 * Desativar marca `ativo = false` E bane o usuário no Auth: o banimento impede
 * renovar a sessão e logar de novo, e o `ativo` derruba na hora o que ainda
 * tem um JWT válido (a camada Node confere a tabela a cada requisição).
 */

export interface Perfil {
  papel: Papel;
  plataformas: Platform[];
  nome: string;
  ativa: boolean;
}

/** O que o painel mostra: sem nada do Auth além de e-mail e situação. */
export interface ContaPublica {
  id: string;
  email: string;
  nome: string;
  papel: Papel;
  plataformas: Platform[];
  ativa: boolean;
  criadaEm: number;
  /** Nunca entrou (convite ainda não aceito). */
  convitePendente: boolean;
  /** Já cadastrou o app de autenticação. */
  tem2fa: boolean;
}

/** Erro de entrada do painel: a mensagem vai para a tela como está. */
export class ContaInvalida extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContaInvalida';
  }
}

/** A tabela `contas` ainda não foi criada no projeto (a migração não rodou). */
export class TabelaContasAusente extends Error {
  constructor() {
    super(
      'A tabela public.contas não existe no Supabase: rode supabase/migrations/*_contas.sql no SQL Editor do projeto.'
    );
    this.name = 'TabelaContasAusente';
  }
}

const BANIDA = '876000h'; // ~100 anos: "até reativar"

interface Linha {
  user_id: string;
  papel: string;
  plataformas: string[] | null;
  nome: string | null;
  ativo: boolean;
  criado_em: string;
}

/** Erro do PostgREST/Postgres → `TabelaContasAusente` quando é a tabela que falta. */
function erroDoBanco(erro: { code?: string; message: string }): Error {
  if (erro.code === 'PGRST205' || erro.code === '42P01')
    return new TabelaContasAusente();
  return new Error(`Falha ao ler as contas: ${erro.message}`);
}

/** Só as plataformas OFERECIDAS, sem repetir, na ordem do seletor. */
export function normalizarPlataformas(valor: unknown): Platform[] | null {
  if (!Array.isArray(valor)) return null;
  const escolhidas = PLATFORMS.filter(p => valor.includes(p));
  return escolhidas.length ? escolhidas : null;
}

function papelDe(valor: string): Papel {
  return valor === 'admin' ? 'admin' : 'convidado';
}

function validarNome(nome: unknown): string {
  const n = typeof nome === 'string' ? nome.trim() : '';
  if (n.length > 80) throw new ContaInvalida('Nome com mais de 80 caracteres.');
  return n;
}

export function normalizarEmail(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const e = valor.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

/** O perfil de um usuário do Auth, ou `null` se ele não tem linha em `contas`. */
export async function lerPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await clienteAdmin()
    .from('contas')
    .select('papel, plataformas, nome, ativo')
    .eq('user_id', userId)
    .maybeSingle<Pick<Linha, 'papel' | 'plataformas' | 'nome' | 'ativo'>>();
  if (error) throw erroDoBanco(error);
  if (!data) return null;
  return {
    papel: papelDe(data.papel),
    plataformas: PLATFORMS.filter(p => (data.plataformas ?? []).includes(p)),
    nome: data.nome ?? '',
    ativa: data.ativo,
  };
}

function publica(linha: Linha, usuario: User | undefined): ContaPublica {
  return {
    id: linha.user_id,
    email: usuario?.email ?? '(usuário apagado no Auth)',
    nome: linha.nome ?? '',
    papel: papelDe(linha.papel),
    plataformas: PLATFORMS.filter(p => (linha.plataformas ?? []).includes(p)),
    ativa: linha.ativo,
    criadaEm: Date.parse(linha.criado_em) || 0,
    convitePendente: !usuario?.last_sign_in_at,
    tem2fa: !!usuario?.factors?.some(f => f.status === 'verified'),
  };
}

/** Todos os usuários do Auth (paginado; poucas contas, mas sem teto escondido). */
async function usuariosDoAuth(): Promise<Map<string, User>> {
  const mapa = new Map<string, User>();
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await clienteAdmin().auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw new Error(`Falha ao listar usuários: ${error.message}`);
    for (const u of data.users) mapa.set(u.id, u);
    if (data.users.length < 1000) break;
  }
  return mapa;
}

/** As contas de CONVIDADO (a da agência não entra no painel). */
export async function listarContas(): Promise<ContaPublica[]> {
  const { data, error } = await clienteAdmin()
    .from('contas')
    .select('*')
    .eq('papel', 'convidado')
    .order('criado_em', { ascending: false })
    .returns<Linha[]>();
  if (error) throw erroDoBanco(error);
  const usuarios = await usuariosDoAuth();
  return (data ?? []).map(l => publica(l, usuarios.get(l.user_id)));
}

/** Uma conta de convidado (`null` se não existe ou é da agência). */
async function lerConvidado(id: string): Promise<ContaPublica | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await clienteAdmin()
    .from('contas')
    .select('*')
    .eq('user_id', id)
    .maybeSingle<Linha>();
  if (error) throw erroDoBanco(error);
  if (!data || data.papel !== 'convidado') return null;
  const { data: u } = await clienteAdmin().auth.admin.getUserById(id);
  return publica(data, u?.user ?? undefined);
}

/** Para onde o link do convite leva (precisa estar nas Redirect URLs do projeto). */
const linkDoConvite = (origem: string) =>
  `${origem}/auth/callback?next=/auth/definir-senha`;

/**
 * Convida um convidado: cria o usuário no Auth (o Supabase manda o e-mail) e
 * a linha em `contas`. Se a linha falhar, o usuário recém-criado é apagado.
 */
export async function convidarConta(
  dados: { email: unknown; nome?: unknown; plataformas: unknown },
  origem: string
): Promise<ContaPublica> {
  const email = normalizarEmail(dados.email);
  if (!email) throw new ContaInvalida('E-mail inválido.');
  const plataformas = normalizarPlataformas(dados.plataformas);
  if (!plataformas) throw new ContaInvalida('Escolha ao menos uma plataforma.');
  const nome = validarNome(dados.nome);

  // A tabela antes do convite: sem ela, nenhum e-mail sai à toa.
  const teste = await clienteAdmin().from('contas').select('user_id').limit(1);
  if (teste.error) throw erroDoBanco(teste.error);

  const admin = clienteAdmin().auth.admin;
  const { data, error } = await admin.inviteUserByEmail(email, {
    redirectTo: linkDoConvite(origem),
    data: nome ? { nome } : undefined,
  });
  if (error || !data.user) {
    if (error?.code === 'email_exists' || error?.status === 422)
      throw new ContaInvalida('Já existe um usuário com esse e-mail.');
    throw new Error(`Falha ao convidar: ${error?.message ?? 'sem usuário'}`);
  }

  const linha = {
    user_id: data.user.id,
    papel: 'convidado',
    plataformas,
    nome,
    ativo: true,
  };
  const ins = await clienteAdmin()
    .from('contas')
    .insert(linha)
    .select('*')
    .single<Linha>();
  if (ins.error) {
    await admin.deleteUser(data.user.id).catch(() => {});
    throw erroDoBanco(ins.error);
  }
  return publica(ins.data, data.user);
}

/**
 * Muda nome, plataformas ou se a conta está ativa. Desativar bane no Auth
 * (não renova nem loga de novo); reativar tira o banimento.
 */
export async function atualizarConta(
  id: string,
  mudancas: { nome?: unknown; plataformas?: unknown; ativa?: unknown }
): Promise<ContaPublica | null> {
  const atual = await lerConvidado(id);
  if (!atual) return null;

  const update: Partial<Pick<Linha, 'nome' | 'plataformas' | 'ativo'>> = {};
  if (mudancas.nome !== undefined) update.nome = validarNome(mudancas.nome);
  if (mudancas.plataformas !== undefined) {
    const p = normalizarPlataformas(mudancas.plataformas);
    if (!p) throw new ContaInvalida('Escolha ao menos uma plataforma.');
    update.plataformas = p;
  }
  if (mudancas.ativa !== undefined) {
    if (typeof mudancas.ativa !== 'boolean')
      throw new ContaInvalida('Valor inválido para "ativa".');
    update.ativo = mudancas.ativa;
    const { error } = await clienteAdmin().auth.admin.updateUserById(id, {
      ban_duration: mudancas.ativa ? 'none' : BANIDA,
    });
    if (error) throw new Error(`Falha ao (des)banir: ${error.message}`);
  }

  const { error } = await clienteAdmin()
    .from('contas')
    .update(update)
    .eq('user_id', id);
  if (error) throw erroDoBanco(error);
  return lerConvidado(id);
}

/**
 * Reenvia o acesso: quem nunca entrou recebe o convite de novo; quem já
 * entrou recebe o e-mail de redefinir a senha (o convite só vale uma vez).
 */
export async function reenviarConvite(
  id: string,
  origem: string
): Promise<'convite' | 'senha' | null> {
  const conta = await lerConvidado(id);
  if (!conta) return null;
  if (conta.convitePendente) {
    const { error } = await clienteAdmin().auth.admin.inviteUserByEmail(
      conta.email,
      { redirectTo: linkDoConvite(origem) }
    );
    if (error) throw new Error(`Falha ao reenviar: ${error.message}`);
    return 'convite';
  }
  const { error } = await clienteAdmin().auth.resetPasswordForEmail(
    conta.email,
    { redirectTo: `${origem}/auth/callback?next=/auth/nova-senha` }
  );
  if (error) throw new Error(`Falha ao reenviar: ${error.message}`);
  return 'senha';
}

/**
 * Zera a verificação em duas etapas (celular perdido): apaga os fatores, e a
 * pessoa cadastra o app de novo no próximo login.
 */
export async function zerar2fa(id: string): Promise<ContaPublica | null> {
  const conta = await lerConvidado(id);
  if (!conta) return null;
  const mfa = clienteAdmin().auth.admin.mfa;
  const { data, error } = await mfa.listFactors({ userId: id });
  if (error) throw new Error(`Falha ao ler os fatores: ${error.message}`);
  for (const f of data.factors) {
    const r = await mfa.deleteFactor({ id: f.id, userId: id });
    if (r.error) throw new Error(`Falha ao apagar fator: ${r.error.message}`);
  }
  return lerConvidado(id);
}

/** Apaga o usuário do Auth; a linha de `contas` cai junto (on delete cascade). */
export async function apagarConta(id: string): Promise<boolean> {
  const conta = await lerConvidado(id);
  if (!conta) return false;
  const { error } = await clienteAdmin().auth.admin.deleteUser(id);
  if (error && error.status !== 404)
    throw new Error(`Falha ao apagar: ${error.message}`);
  // Se o Auth não tinha o usuário, a linha ficaria órfã: apaga explicitamente.
  await clienteAdmin().from('contas').delete().eq('user_id', id);
  return true;
}
