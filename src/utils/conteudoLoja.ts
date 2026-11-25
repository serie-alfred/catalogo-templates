import type {
  ConteudoDaSecao,
  ConteudoLoja,
  ValorDeConteudo,
} from '@/types/conteudo';

/**
 * Do conteúdo da LOJA (Nível 2) para o conteúdo de UMA seção: o menu principal
 * vira o `menu` de qualquer header, o rodapé de links vira os `columns` de
 * qualquer rodapé, o contato vira `contactLines`/`whatsappUrl`/`scheduleText`…
 * É isso que faz o menu sobreviver à troca do Header09 pelo Header12: ele mora
 * na loja, e cada header o lê no próprio formato.
 *
 * Os VÍNCULOS (campo da seção ← slot da loja) são por nome de campo, restritos
 * pelo tipo da peça — as famílias 09–17 usam os mesmos nomes do starter. O
 * formato de cada item sai do MOCK da própria peça (as chaves que ela
 * desenha), não do schema: o render não precisa carregar os 700 KB dele.
 *
 * Loja vazia (ou slot vazio) = nenhum vínculo: a seção mostra o próprio mock.
 * O Nível 1 da seção vence a loja (`resolverConteudo(MOCK, loja, secao)`).
 *
 * Só importa tipos: o funil carrega este arquivo direto no Node.
 */

export type SlotDaLoja = Exclude<keyof ConteudoLoja, 'versao'>;

/** O nome de cada slot na tela ("Usando o conteúdo da loja: Menu principal"). */
export const ROTULO_DO_SLOT: Record<SlotDaLoja, string> = {
  nomeDaLoja: 'Nome da loja',
  avisos: 'Avisos do topo',
  menuPrincipal: 'Menu principal',
  menuRodape: 'Menu do rodapé',
  linksLegais: 'Links legais',
  contato: 'Contato',
  redes: 'Redes sociais',
  dadosLegais: 'Dados legais',
  pagamentos: 'Formas de pagamento',
  selos: 'Selos',
  banners: 'Banners principais',
  categorias: 'Categorias',
  produtos: 'Produtos',
};

type Objeto = { [chave: string]: ValorDeConteudo };
type Mock = Record<string, unknown>;

function ehObjeto(v: unknown): v is Record<string, unknown> {
  return Object.prototype.toString.call(v) === '[object Object]';
}

const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const objetos = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter(ehObjeto) : [];

/** A loja tem alguma coisa preenchida? (Lista vazia e texto em branco não contam.) */
export function lojaTemConteudo(loja: ConteudoLoja | null | undefined) {
  if (!loja) return false;
  return Object.entries(loja).some(([chave, valor]) => {
    if (chave === 'versao') return false;
    if (Array.isArray(valor)) return valor.length > 0;
    if (ehObjeto(valor)) return Object.values(valor).some(v => texto(v));
    return !!texto(valor);
  });
}

/* ── Links de contato ───────────────────────────────────────────────────── */

const digitos = (v: string) => v.replace(/\D/g, '');

/** "(11) 98888-7777" → https://wa.me/5511988887777. Link pronto passa como veio. */
export function linkDoWhatsapp(numero: string) {
  const v = numero.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const d = digitos(v);
  if (!d) return '';
  return `https://wa.me/${d.length <= 11 ? `55${d}` : d}`;
}

/** "(11) 3333-4444" → tel:+551133334444. */
export function linkDoTelefone(numero: string) {
  const d = digitos(numero);
  if (!d) return '';
  return `tel:+${d.length <= 11 ? `55${d}` : d}`;
}

/* ── Listas: do item da loja para o item da peça ────────────────────────── */

/**
 * Nome de chave na peça → as chaves da loja que valem para ele, em ordem. A
 * loja fala o vocabulário do starter (`label`, `url`, `ctaLabel`…); as peças
 * antigas e algumas variações (`primaryLabel` no banner da 09, `name` nas
 * categorias) recebem pelo sinônimo.
 */
const SINONIMOS: Record<string, string[]> = {
  name: ['label', 'title'],
  label: ['name', 'title', 'text'],
  text: ['label'],
  title: ['label'],
  url: ['href', 'ctaUrl'],
  href: ['url'],
  link: ['url'],
  src: ['image', 'imageDesktop'],
  image: ['src'],
  alt: ['imageAlt', 'label'],
  imageAlt: ['alt', 'name', 'label'],
  imageMobile: ['imageDesktop'],
  primaryLabel: ['ctaLabel'],
  primaryUrl: ['ctaUrl'],
  linkLabel: ['secondaryLabel'],
  linkUrl: ['secondaryUrl'],
  children: ['links'],
  links: ['children'],
  sublinks: ['children'],
  isHighlight: ['highlight'],
};

/**
 * Chaves que a loja não tem e que vêm do item do mock na mesma posição: o
 * ícone de um aviso ou de um canal de ajuda é desenho, não conteúdo.
 */
const DO_MOCK = new Set(['icon']);

function mesmoTipo(a: unknown, b: unknown) {
  if (Array.isArray(a) || Array.isArray(b))
    return Array.isArray(a) && Array.isArray(b);
  return typeof a === typeof b && !ehObjeto(a) && !ehObjeto(b);
}

/** As chaves dos itens do mock (a união), com o valor do primeiro item que a tem. */
function moldeDe(itensDoMock: Record<string, unknown>[]) {
  const molde = new Map<string, unknown>();
  for (const item of itensDoMock)
    for (const [chave, valor] of Object.entries(item))
      if (!molde.has(chave)) molde.set(chave, valor);
  return molde;
}

/**
 * Converte os itens da loja para o formato dos itens do mock da peça. O item
 * da loja vai inteiro (chave que a peça não conhece é ignorada no render); as
 * chaves do mock que faltam saem pelo sinônimo ou com um vazio do tipo certo
 * — `''`, `false`, `[]` —, porque a réplica foi escrita para itens completos.
 */
function projetarLista(
  itens: unknown,
  itensDoMock: Record<string, unknown>[]
): Objeto[] {
  const molde = moldeDe(itensDoMock);
  return objetos(itens).map((item, i) => {
    const saida: Objeto = {};
    for (const [chave, valor] of Object.entries(item))
      if (valor !== undefined) saida[chave] = valor as ValorDeConteudo;
    for (const [chave, exemplo] of molde) {
      if (DO_MOCK.has(chave)) {
        const doMock = itensDoMock[i % itensDoMock.length]?.[chave];
        if (!texto(saida[chave]) && doMock !== undefined)
          saida[chave] = doMock as ValorDeConteudo;
        continue;
      }
      const filhosDoMock = () => itensDoMock.flatMap(m => objetos(m[chave]));
      const atual = saida[chave];
      if (atual !== undefined && atual !== '' && mesmoTipo(atual, exemplo)) {
        if (Array.isArray(atual))
          saida[chave] = projetarLista(atual, filhosDoMock());
        continue;
      }
      const sinonimo = (SINONIMOS[chave] ?? [])
        .map(k => item[k])
        .find(v => v !== undefined && v !== '' && mesmoTipo(v, exemplo));
      if (sinonimo !== undefined) {
        saida[chave] = Array.isArray(sinonimo)
          ? projetarLista(sinonimo, filhosDoMock())
          : (sinonimo as ValorDeConteudo);
      } else if (Array.isArray(exemplo)) saida[chave] = [];
      else if (typeof exemplo === 'boolean') saida[chave] = false;
      else if (typeof exemplo === 'string') saida[chave] = '';
    }
    return saida;
  });
}

/** Lista da loja sem os itens em branco (`campo` vazio), já no formato da peça. */
function listaDaLoja(
  itens: unknown,
  mockDoCampo: unknown,
  ...obrigatorios: string[]
): Objeto[] | undefined {
  const validos = objetos(itens).filter(item =>
    obrigatorios.every(k => texto(item[k]))
  );
  return validos.length
    ? projetarLista(validos, objetos(mockDoCampo))
    : undefined;
}

/* ── Linha legal e contato ─────────────────────────────────────────────── */

function partesLegais(
  loja: ConteudoLoja,
  comEndereco: boolean,
  semCnpj = false
) {
  const razao = texto(loja.dadosLegais?.razaoSocial);
  const cnpj = texto(loja.dadosLegais?.cnpj);
  if (!razao && !cnpj) return null;
  return [
    razao,
    cnpj && !semCnpj ? `CNPJ ${cnpj}` : '',
    comEndereco ? texto(loja.contato?.endereco) : '',
  ].filter(Boolean);
}

/** "© 2026 Marca · Razão Social · CNPJ … · Endereço" — só com razão social ou CNPJ preenchidos. */
function linhaLegal(loja: ConteudoLoja, semCnpj = false) {
  const partes = partesLegais(loja, true, semCnpj);
  if (!partes) return undefined;
  const marca = texto(loja.nomeDaLoja);
  const comMarca =
    marca && marca.toLowerCase() !== partes[0]?.toLowerCase()
      ? [marca, ...partes]
      : partes;
  return `© ${new Date().getFullYear()} ${comMarca.join(' · ')}`;
}

/**
 * As linhas de contato do rodapé. Canal que a peça desenha em campo próprio
 * (`whatsappUrl`, `phoneUrl`, `emailUrl`, `contactLinks`, `contactHours`) fica
 * fora da lista, para não aparecer duas vezes.
 */
function linhasDeContato(loja: ConteudoLoja, mock: Mock) {
  const c = loja.contato ?? {};
  const linhas: Record<string, ValorDeConteudo>[] = [];
  const tel = texto(c.telefone);
  const zap = texto(c.whatsapp);
  const email = texto(c.email);
  const horario = texto(c.horario);
  const endereco = texto(c.endereco);
  if (tel && !('phoneUrl' in mock))
    linhas.push({ text: tel, url: linkDoTelefone(tel) });
  if (zap && !('whatsappUrl' in mock))
    linhas.push({ text: `WhatsApp ${zap}`, url: linkDoWhatsapp(zap) });
  if (horario && !('contactHours' in mock) && !('scheduleText' in mock))
    linhas.push({ text: horario, muted: true });
  if (email && !('emailUrl' in mock) && !('contactLinks' in mock))
    linhas.push({ text: email, url: `mailto:${email}` });
  if (endereco) linhas.push({ text: endereco });
  return linhas.length
    ? projetarLista(linhas, objetos(mock.contactLines))
    : undefined;
}

/** O canal de WhatsApp de uma lista de ajuda: pelo ícone, pelo link ou pelo nome. */
function ehWhatsapp(item: Record<string, unknown>) {
  return (
    item.icon === 'whatsapp' ||
    /wa\.me|whatsapp/i.test(texto(item.url)) ||
    /whatsapp/i.test(texto(item.label))
  );
}

/* ── Nomes para as peças que desenham rótulo (famílias 01–08) ────────── */

const NOME_DA_REDE: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  x: 'X',
  linkedin: 'LinkedIn',
};

const NOME_DO_METODO: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  elo: 'Elo',
  amex: 'American Express',
  hipercard: 'Hipercard',
  diners: 'Diners',
  aura: 'Aura',
  pix: 'Pix',
  boleto: 'Boleto',
};

/** Os campos de texto (URL) de cada rede nas peças antigas: `socialFacebook`, `facebookUrl`… */
const CAMPOS_DE_REDE: Record<string, string[]> = {
  instagram: ['socialInstagram', 'instagramUrl'],
  facebook: ['socialFacebook', 'facebookUrl'],
  youtube: ['socialYoutube', 'youtubeUrl'],
  x: ['socialTwitter', 'twitterUrl'],
  linkedin: ['socialLinkedin', 'linkedinUrl'],
};

/** As redes da loja com o nome para mostrar (`socials[label,url]` das famílias 04–06). */
const redesComNome = (loja: ConteudoLoja) =>
  objetos(loja.redes).map(r => ({
    ...r,
    label: NOME_DA_REDE[String(r.network)] ?? '',
  }));

/** As bandeiras da loja com o nome (`payments[name]`, `paymentMethods[label]`). */
const pagamentosComNome = (loja: ConteudoLoja) =>
  objetos(loja.pagamentos).map(p => {
    const nome = NOME_DO_METODO[String(p.method)] ?? '';
    return { ...p, label: nome, name: nome };
  });

/**
 * A lista da peça desenha imagem por item (bandeira, selo): a loja não tem a
 * imagem, então a lista da peça fica — melhor o desenho de exemplo que ícone quebrado.
 */
const temImagem = (lista: unknown) =>
  objetos(lista).some(i => 'image' in i || 'src' in i);

/* ── Os vínculos ───────────────────────────────────────────────────────── */

interface Vinculo {
  /** As peças em que o campo é este (nome no TemplateRegistry). */
  de: RegExp;
  campo: string;
  slot: SlotDaLoja;
  projetar: (loja: ConteudoLoja, mock: Mock) => ValorDeConteudo | undefined;
  /**
   * Vale mesmo sem o campo no mock. Só para o nome da loja: as réplicas
   * desenham `brandName` mas o deixam FORA do mock (sem ele, `SERIE//A`), e
   * um texto a mais numa peça que não o desenha é ignorado no render.
   */
  semMock?: true;
}

const HEADER = /^Header\d+$/;
const FOOTER = /^Footer\d+$/;
const HEADER_OU_FOOTER = /^(Header|Footer)\d+$/;

const VINCULOS: Vinculo[] = [
  {
    de: HEADER_OU_FOOTER,
    campo: 'brandName',
    slot: 'nomeDaLoja',
    projetar: loja => texto(loja.nomeDaLoja) || undefined,
    semMock: true,
  },
  ...['topbarMessages', 'topbarItems'].map(
    (campo): Vinculo => ({
      de: HEADER,
      campo,
      slot: 'avisos',
      projetar: (loja, mock) => listaDaLoja(loja.avisos, mock[campo], 'text'),
    })
  ),
  {
    de: HEADER,
    campo: 'topbarText',
    slot: 'avisos',
    projetar: loja =>
      texto(objetos(loja.avisos).find(a => texto(a.text))?.text) || undefined,
  },
  {
    de: HEADER,
    campo: 'topbarLinkUrl',
    slot: 'avisos',
    projetar: loja =>
      texto(objetos(loja.avisos).find(a => texto(a.text))?.url) || undefined,
  },
  {
    de: HEADER,
    campo: 'menu',
    slot: 'menuPrincipal',
    projetar: (loja, mock) =>
      Array.isArray(mock.menu)
        ? listaDaLoja(loja.menuPrincipal, mock.menu, 'label')
        : undefined,
  },
  {
    de: FOOTER,
    campo: 'columns',
    slot: 'menuRodape',
    projetar: (loja, mock) => listaDaLoja(loja.menuRodape, mock.columns),
  },
  {
    de: FOOTER,
    campo: 'legalLinks',
    slot: 'linksLegais',
    projetar: (loja, mock) =>
      listaDaLoja(loja.linksLegais, mock.legalLinks, 'label'),
  },
  {
    de: FOOTER,
    campo: 'socials',
    slot: 'redes',
    projetar: (loja, mock) =>
      listaDaLoja(redesComNome(loja), mock.socials, 'network', 'url'),
  },
  {
    de: FOOTER,
    campo: 'payments',
    slot: 'pagamentos',
    projetar: (loja, mock) =>
      temImagem(mock.payments)
        ? undefined
        : listaDaLoja(pagamentosComNome(loja), mock.payments, 'method'),
  },
  {
    de: FOOTER,
    campo: 'seals',
    slot: 'selos',
    projetar: (loja, mock) => {
      const selos = objetos(loja.selos).filter(
        s => texto(s.image) || texto(s.label)
      );
      return selos.length ? projetarLista(selos, objetos(mock.seals)) : undefined;
    },
  },
  {
    de: FOOTER,
    campo: 'contactLines',
    slot: 'contato',
    projetar: linhasDeContato,
  },
  {
    de: FOOTER,
    campo: 'contactLinks',
    slot: 'contato',
    projetar: (loja, mock) => {
      const email = texto(loja.contato?.email);
      return email
        ? projetarLista(
            [{ text: email, url: `mailto:${email}` }],
            objetos(mock.contactLinks)
          )
        : undefined;
    },
  },
  ...[
    { campo: 'contactHours', de: FOOTER },
    { campo: 'scheduleText', de: /^(Footer|HelpFloat)\d+$/ },
  ].map(
    ({ campo, de }): Vinculo => ({
      de,
      campo,
      slot: 'contato',
      projetar: loja => texto(loja.contato?.horario) || undefined,
    })
  ),
  {
    de: HEADER_OU_FOOTER,
    campo: 'whatsappLabel',
    slot: 'contato',
    projetar: loja => {
      const zap = texto(loja.contato?.whatsapp);
      return zap ? `WhatsApp ${zap}` : undefined;
    },
  },
  {
    de: HEADER_OU_FOOTER,
    campo: 'whatsappUrl',
    slot: 'contato',
    projetar: loja =>
      linkDoWhatsapp(texto(loja.contato?.whatsapp)) || undefined,
  },
  {
    de: FOOTER,
    campo: 'phoneLabel',
    slot: 'contato',
    projetar: loja => texto(loja.contato?.telefone) || undefined,
  },
  {
    de: FOOTER,
    campo: 'phoneUrl',
    slot: 'contato',
    projetar: loja =>
      linkDoTelefone(texto(loja.contato?.telefone)) || undefined,
  },
  {
    de: FOOTER,
    campo: 'emailLabel',
    slot: 'contato',
    projetar: loja => texto(loja.contato?.email) || undefined,
  },
  {
    de: FOOTER,
    campo: 'emailUrl',
    slot: 'contato',
    projetar: loja => {
      const email = texto(loja.contato?.email);
      return email ? `mailto:${email}` : undefined;
    },
  },
  {
    // Com `legalText` ao lado (Footer11), o copyright é só "© ano Marca".
    de: FOOTER,
    campo: 'copyright',
    slot: 'dadosLegais',
    projetar: (loja, mock) => {
      if (!('legalText' in mock)) return linhaLegal(loja, 'cnpj' in mock);
      const marca = texto(loja.nomeDaLoja);
      return partesLegais(loja, false) && marca
        ? `© ${new Date().getFullYear()} ${marca}`
        : undefined;
    },
  },
  {
    de: FOOTER,
    campo: 'legalText',
    slot: 'dadosLegais',
    projetar: loja => partesLegais(loja, false)?.join(' · ') || undefined,
  },
  {
    de: FOOTER,
    campo: 'legal',
    slot: 'dadosLegais',
    projetar: loja => linhaLegal(loja),
  },
  {
    // A 1ª linha é a legal; as outras (aviso de preços) continuam as do mock.
    de: FOOTER,
    campo: 'legalLines',
    slot: 'dadosLegais',
    projetar: (loja, mock) => {
      const linha = linhaLegal(loja);
      if (!linha) return undefined;
      const doMock = objetos(mock.legalLines) as Objeto[];
      return [{ ...(doMock[0] ?? {}), text: linha }, ...doMock.slice(1)];
    },
  },
  {
    de: /^BannerMain\d+$/,
    campo: 'slides',
    slot: 'banners',
    projetar: (loja, mock) => {
      const slides = objetos(loja.banners).filter(
        s => texto(s.imageDesktop) || texto(s.title)
      );
      return slides.length
        ? projetarLista(slides, objetos(mock.slides))
        : undefined;
    },
  },
  {
    de: /^Categories\d+$/,
    campo: 'categories',
    slot: 'categorias',
    projetar: (loja, mock) =>
      listaDaLoja(loja.categorias, mock.categories, 'name'),
  },
  {
    // O canal de WhatsApp da ajuda flutuante passa a abrir o número da loja.
    de: /^HelpFloat\d+$/,
    campo: 'helpItems',
    slot: 'contato',
    projetar: (loja, mock) => {
      const zap = texto(loja.contato?.whatsapp);
      const itens = objetos(mock.helpItems);
      if (!zap || !itens.some(ehWhatsapp)) return undefined;
      return itens.map(item =>
        ehWhatsapp(item)
          ? ({
              ...item,
              ...('href' in item
                ? { href: linkDoWhatsapp(zap) }
                : { url: linkDoWhatsapp(zap) }),
              ...('detail' in item ? { detail: zap } : {}),
            } as Objeto)
          : (item as Objeto)
      );
    },
  },
  {
    de: /^HelpFloat\d+$/,
    campo: 'footerText',
    slot: 'contato',
    projetar: loja => {
      const partes = [loja.contato?.horario, loja.contato?.telefone]
        .map(texto)
        .filter(Boolean);
      return partes.length ? partes.join(' · ') : undefined;
    },
  },

  /* ── Nomes das famílias 01–08 (origem Tray) ── */
  ...['navItems', 'mobileNavItems'].map(
    (campo): Vinculo => ({
      de: HEADER,
      campo,
      slot: 'menuPrincipal',
      projetar: (loja, mock) =>
        listaDaLoja(loja.menuPrincipal, mock[campo], 'label'),
    })
  ),
  {
    // O menu do Header05 se chama `categories`.
    de: /^Header0[1-8]$/,
    campo: 'categories',
    slot: 'menuPrincipal',
    projetar: (loja, mock) =>
      listaDaLoja(loja.menuPrincipal, mock.categories, 'label'),
  },
  {
    de: HEADER,
    campo: 'topbarNotices',
    slot: 'avisos',
    projetar: (loja, mock) =>
      listaDaLoja(loja.avisos, mock.topbarNotices, 'text'),
  },
  {
    // Lista de textos soltos (Header04).
    de: HEADER,
    campo: 'announcementMessages',
    slot: 'avisos',
    projetar: loja => {
      const textos = objetos(loja.avisos)
        .map(a => texto(a.text))
        .filter(Boolean);
      return textos.length ? textos : undefined;
    },
  },
  {
    de: HEADER,
    campo: 'logoText',
    slot: 'nomeDaLoja',
    projetar: loja => texto(loja.nomeDaLoja) || undefined,
    semMock: true,
  },
  ...(
    [
      ['whatsapp', 'whatsapp'],
      ['phone', 'telefone'],
      ['email', 'email'],
      ['address', 'endereco'],
    ] as const
  ).map(
    ([campo, chave]): Vinculo => ({
      de: HEADER_OU_FOOTER,
      campo,
      slot: 'contato',
      projetar: loja => texto(loja.contato?.[chave]) || undefined,
    })
  ),
  {
    de: FOOTER,
    campo: 'contactItems',
    slot: 'contato',
    projetar: (loja, mock) => {
      const c = loja.contato ?? {};
      const itens = (
        [
          ['WhatsApp', c.whatsapp],
          ['Telefone', c.telefone],
          ['E-mail', c.email],
          ['Endereço', c.endereco],
          ['Horário', c.horario],
        ] as const
      )
        .map(([label, valor]) => ({ label, detail: texto(valor) }))
        .filter(i => i.detail);
      return itens.length
        ? projetarLista(itens, objetos(mock.contactItems))
        : undefined;
    },
  },
  // Uma URL por rede (`socialFacebook`, `instagramUrl`…): rede que a loja não
  // tem fica vazia — a lista de redes da loja é A lista.
  ...Object.entries(CAMPOS_DE_REDE).flatMap(([rede, campos]) =>
    campos.map(
      (campo): Vinculo => ({
        de: HEADER_OU_FOOTER,
        campo,
        slot: 'redes',
        projetar: loja => {
          const redes = objetos(loja.redes).filter(r => texto(r.url));
          if (!redes.length) return undefined;
          return texto(redes.find(r => r.network === rede)?.url);
        },
      })
    )
  ),
  ...['institucionalMenu', 'institutionalLinks'].map(
    (campo): Vinculo => ({
      de: FOOTER,
      campo,
      slot: 'linksLegais',
      projetar: (loja, mock) =>
        listaDaLoja(loja.linksLegais, mock[campo], 'label'),
    })
  ),
  {
    // Bandeiras como texto: lista de nomes (Footer05) ou de rótulos (Footer03).
    de: FOOTER,
    campo: 'paymentMethods',
    slot: 'pagamentos',
    projetar: (loja, mock) => {
      const comNome = pagamentosComNome(loja).filter(p => p.label);
      if (!comNome.length) return undefined;
      const doMock = mock.paymentMethods;
      if (!Array.isArray(doMock)) return undefined;
      if (doMock.every(x => typeof x === 'string'))
        return comNome.map(p => p.label);
      return temImagem(doMock)
        ? undefined
        : projetarLista(
            comNome.map(p => ({ label: p.label })),
            objetos(doMock)
          );
    },
  },
  {
    de: FOOTER,
    campo: 'cnpj',
    slot: 'dadosLegais',
    projetar: loja => texto(loja.dadosLegais?.cnpj) || undefined,
  },
];

/** O que a loja dá a uma seção: os campos e, para o painel, de que slot veio cada um. */
export interface ConteudoDaLojaNaSecao {
  conteudo?: ConteudoDaSecao;
  origem: Record<string, SlotDaLoja>;
}

const NADA: ConteudoDaLojaNaSecao = { origem: {} };

/**
 * O Nível 2 de uma seção. Só campos que a peça desenha (presentes no `mock`;
 * o nome da loja é a exceção, ver `semMock`) e só slots preenchidos; o resto
 * continua com o mock (ou o Nível 1).
 */
export function projetarLoja(
  componente: string,
  loja: ConteudoLoja | null | undefined,
  mock: object
): ConteudoDaLojaNaSecao {
  if (!loja || !componente) return NADA;
  const doMock = mock as Mock;
  const conteudo: ConteudoDaSecao = {};
  const origem: Record<string, SlotDaLoja> = {};
  for (const v of VINCULOS) {
    if ((!v.semMock && !(v.campo in doMock)) || !v.de.test(componente))
      continue;
    const valor = v.projetar(loja, doMock);
    if (valor === undefined) continue;
    conteudo[v.campo] = valor;
    origem[v.campo] = v.slot;
  }
  return Object.keys(conteudo).length ? { conteudo, origem } : NADA;
}

/** Os vínculos em forma de dado, para o funil conferir cada um contra os schemas. */
export const VINCULOS_RESUMO = VINCULOS.map(v => ({
  de: v.de.source,
  campo: v.campo,
  slot: v.slot,
}));

/** Os slots da loja que alguma peça lê (o funil confere que todos existem em ROTULO_DO_SLOT). */
export const SLOTS_VINCULADOS: SlotDaLoja[] = [
  ...new Set(VINCULOS.map(v => v.slot)),
];
