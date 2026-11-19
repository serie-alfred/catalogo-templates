-- Perfis das contas do /gerador (E-temas). O usuário (e-mail, senha, 2FA) é do
-- Supabase Auth; aqui fica o que o editor precisa saber dele: papel,
-- plataformas e se a conta está ativa. Ver src/lib/contas.ts.
--
-- RLS LIGADO e SEM NENHUMA POLÍTICA, de propósito: nem a chave pública nem um
-- usuário logado leem ou gravam esta tabela. Só o servidor do catálogo, com a
-- chave secreta (SUPABASE_SECRET_KEY), que passa por cima do RLS.
--
-- Idempotente: rodar de novo não quebra nem duplica.

create table if not exists public.contas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  papel text not null default 'convidado' check (papel in ('admin', 'convidado')),
  plataformas text[] not null default '{}',
  nome text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table public.contas enable row level security;

-- Nada de acesso direto pelos papéis da API (a chave secreta usa service_role).
revoke all on table public.contas from anon, authenticated;

-- Projetos novos do Supabase não concedem nada a tabela criada pelo SQL Editor, nem ao
-- service_role: sem isto, até o servidor (chave secreta) toma 42501 "permission denied".
grant select, insert, update, delete on table public.contas to service_role;

comment on table public.contas is
  'Perfis do /gerador do E-temas (papel, plataformas, ativo). RLS sem políticas: só o servidor, com a chave secreta.';

-- A conta da AGÊNCIA (admin), com todas as plataformas. O usuário já existe no
-- Auth; sem ele, o insert não faz nada.
insert into public.contas (user_id, papel, plataformas, nome)
select id, 'admin', array['Tray', 'Wake 2.0', 'VTEX', 'Nuvemshop'], 'Agência'
from auth.users
where email = 'acessos@seriea.digital'
on conflict (user_id) do update
  set papel = 'admin', ativo = true;
