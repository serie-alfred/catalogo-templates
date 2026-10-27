import { redirect } from 'next/navigation';

/** A lista dos templates mora na home. */
export default function TemplatesRaiz() {
  redirect('/#templates');
}
