import FormDeSenha from '@/components/acesso/FormDeSenha';

// A sessão é do cookie que o link do e-mail abriu: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return <FormDeSenha tipo="nova" erro={erro} />;
}
