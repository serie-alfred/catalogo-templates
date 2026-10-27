import { redirect } from 'next/navigation';

/** `/templates/09` sozinho abre a home do template, como o card da home. */
export default async function TemplateRaiz({
  params,
}: {
  params: Promise<{ familia: string }>;
}) {
  const { familia } = await params;
  redirect(`/templates/${familia}/home`);
}
