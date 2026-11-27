import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente ADMINISTRADOR do Supabase: a chave secreta (`SUPABASE_SECRET_KEY`),
 * que passa por cima do RLS e administra os usuários. Só existe no servidor
 * (`server-only`): nunca importe isto de um arquivo `'use client'`, e nunca
 * dê à variável o prefixo `NEXT_PUBLIC_`.
 *
 * Sem sessão própria: cada chamada é a chave, e só.
 */
let cliente: SupabaseClient | null = null;

export class SupabaseNaoConfigurado extends Error {
  constructor() {
    super(
      'Supabase não configurado: faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SECRET_KEY.'
    );
    this.name = 'SupabaseNaoConfigurado';
  }
}

export function clienteAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secreta = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secreta) throw new SupabaseNaoConfigurado();
  cliente ??= createClient(url, secreta, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cliente;
}
