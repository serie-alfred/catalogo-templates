import type { CampoDoSchema } from '@/types/conteudo';
import type { SlotDaLoja } from '@/utils/conteudoLoja';
import { ROTULO_DO_SLOT } from '@/utils/conteudoLoja';

/**
 * O formulário do "Conteúdo da loja" (rail), no mesmo formato dos schemas das
 * seções — o painel o desenha com o mesmo `Campo` do painel de uma seção.
 * As chaves dos itens são as do starter (ver `ConteudoLoja`), então o que o CS
 * preenche aqui chega às seções quase sem conversão.
 */

const texto = (title: string, description?: string): CampoDoSchema => ({
  type: 'string',
  title,
  ...(description ? { description } : {}),
});

const imagem = (title: string, description?: string): CampoDoSchema => ({
  ...texto(title, description),
  widget: { 'ui:widget': 'image-uploader' },
});

const link = (title = 'Link'): CampoDoSchema => texto(title);

const lista = (
  title: string,
  item: string,
  properties: Record<string, CampoDoSchema>,
  extra: Partial<CampoDoSchema> = {}
): CampoDoSchema => ({
  type: 'array',
  title,
  items: { type: 'object', title: item, properties },
  ...extra,
});

export const SCHEMA_DA_LOJA: Record<SlotDaLoja, CampoDoSchema> = {
  nomeDaLoja: texto(
    ROTULO_DO_SLOT.nomeDaLoja,
    'Aparece no header e no rodapé enquanto a loja não tem logo, e na linha legal do rodapé.'
  ),
  avisos: lista(
    ROTULO_DO_SLOT.avisos,
    'Aviso',
    { text: texto('Texto'), url: link('Link (opcional)') },
    {
      description:
        'A faixa acima do header. Nas famílias com uma mensagem só, vale a primeira.',
      maxItems: 6,
    }
  ),
  menuPrincipal: lista(ROTULO_DO_SLOT.menuPrincipal, 'Item do menu', {
    label: texto('Nome'),
    url: link(),
    highlight: { type: 'boolean', title: 'Destacar (ex.: Ofertas)' },
    image: imagem(
      'Imagem do submenu',
      'Só as famílias com imagem no menu aberto a mostram.'
    ),
    children: lista('Subitens', 'Subitem', {
      label: texto('Nome'),
      url: link(),
    }),
  }),
  menuRodape: lista(ROTULO_DO_SLOT.menuRodape, 'Coluna', {
    title: texto('Título da coluna'),
    links: lista('Links', 'Link', { label: texto('Nome'), url: link() }),
  }),
  linksLegais: lista(
    ROTULO_DO_SLOT.linksLegais,
    'Link',
    { label: texto('Nome'), url: link() },
    { description: 'Política de privacidade, termos de uso, trocas…' }
  ),
  contato: {
    type: 'object',
    title: ROTULO_DO_SLOT.contato,
    properties: {
      whatsapp: texto('WhatsApp', 'Com DDD. Os botões viram o link wa.me.'),
      telefone: texto('Telefone'),
      email: texto('E-mail'),
      endereco: texto('Endereço'),
      horario: texto('Horário de atendimento', 'Ex.: Seg a sex, 9h às 18h'),
    },
  },
  redes: lista(ROTULO_DO_SLOT.redes, 'Rede', {
    network: {
      type: 'string',
      title: 'Rede',
      enum: ['instagram', 'facebook', 'youtube', 'x', 'linkedin'],
      enumNames: ['Instagram', 'Facebook', 'YouTube', 'X (Twitter)', 'LinkedIn'],
    },
    url: link('Link do perfil'),
  }),
  dadosLegais: {
    type: 'object',
    title: ROTULO_DO_SLOT.dadosLegais,
    description:
      'Formam a linha legal do rodapé: © ano · nome da loja · razão social · CNPJ · endereço.',
    properties: {
      razaoSocial: texto('Razão social'),
      cnpj: texto('CNPJ'),
    },
  },
  pagamentos: lista(ROTULO_DO_SLOT.pagamentos, 'Forma de pagamento', {
    method: {
      type: 'string',
      title: 'Bandeira',
      enum: [
        'visa',
        'mastercard',
        'elo',
        'amex',
        'hipercard',
        'diners',
        'aura',
        'pix',
        'boleto',
      ],
      enumNames: [
        'Visa',
        'Mastercard',
        'Elo',
        'American Express',
        'Hipercard',
        'Diners',
        'Aura',
        'Pix',
        'Boleto',
      ],
    },
  }),
  selos: lista(ROTULO_DO_SLOT.selos, 'Selo', {
    image: imagem('Imagem'),
    label: texto('Nome do selo'),
    url: link(),
  }),
  banners: lista(
    ROTULO_DO_SLOT.banners,
    'Banner',
    {
      imageDesktop: imagem('Imagem (computador)'),
      imageMobile: imagem('Imagem (celular)', 'Sem ela, vale a do computador.'),
      imageAlt: texto('Texto alternativo da imagem'),
      eyebrow: texto('Chamada'),
      title: texto('Título'),
      text: { ...texto('Texto'), widget: { 'ui:widget': 'textarea' } },
      ctaLabel: texto('Botão'),
      ctaUrl: link('Link do botão'),
      secondaryLabel: texto('Botão secundário'),
      secondaryUrl: link('Link do botão secundário'),
    },
    { description: 'O carrossel do topo da home.' }
  ),
  categorias: lista(
    ROTULO_DO_SLOT.categorias,
    'Categoria',
    {
      name: texto('Nome'),
      url: link(),
      image: imagem('Imagem'),
      imageAlt: texto('Texto alternativo da imagem'),
    },
    { description: 'A seção de categorias da home.' }
  ),
};

/** Os blocos do painel, na ordem em que o CS costuma preencher. */
export const GRUPOS_DA_LOJA: { titulo: string; slots: SlotDaLoja[] }[] = [
  { titulo: 'Marca e avisos', slots: ['nomeDaLoja', 'avisos'] },
  { titulo: 'Menus', slots: ['menuPrincipal', 'menuRodape', 'linksLegais'] },
  { titulo: 'Contato e redes', slots: ['contato', 'redes'] },
  { titulo: 'Rodapé', slots: ['dadosLegais', 'pagamentos', 'selos'] },
  { titulo: 'Banners e categorias', slots: ['banners', 'categorias'] },
];
