import CartaoDeAcesso from '@/components/acesso/CartaoDeAcesso';
import Confirmar from './Confirmar';

/**
 * Chegada do link do convite (fluxo implícito: a sessão vem no fragmento
 * `#access_token=…`, que o servidor não vê). Ver /auth/callback.
 */
export default function ConfirmarPage() {
  return (
    <CartaoDeAcesso>
      <Confirmar />
    </CartaoDeAcesso>
  );
}
