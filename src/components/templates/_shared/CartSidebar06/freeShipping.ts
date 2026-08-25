/**
 * Porte de faststore.starter/src/utils/freeShipping — funções puras, copiadas
 * verbatim (não dependem de VTEX). Alimentam a barra de frete grátis do
 * CartSidebar06.
 */

export interface FreeShippingRule {
  /** nome da UF, só para leitura humana no painel */
  state: string;
  /** faixa de CEP (inclusiva), sem máscara */
  postalCodeFrom: number;
  postalCodeTo: number;
  /** valor mínimo em REAIS para o frete sair de graça */
  price: number;
}

/**
 * Tabela de frete grátis por faixa de CEP — 27 entradas: R$ 299,90 para
 * Sul/Sudeste (ES, MG, PR, RJ, RS, SC, SP) e R$ 349,90 para as outras 20 UFs.
 */
export const DEFAULT_FREE_SHIPPING_RULES: FreeShippingRule[] = [
  { state: 'Acre', postalCodeFrom: 69900000, postalCodeTo: 69999999, price: 349.9 },
  { state: 'Alagoas', postalCodeFrom: 57000000, postalCodeTo: 57999999, price: 349.9 },
  { state: 'Amapá', postalCodeFrom: 68900000, postalCodeTo: 68999999, price: 349.9 },
  { state: 'Amazonas', postalCodeFrom: 69000000, postalCodeTo: 69899999, price: 349.9 },
  { state: 'Bahia', postalCodeFrom: 40000000, postalCodeTo: 48999999, price: 349.9 },
  { state: 'Ceará', postalCodeFrom: 60000000, postalCodeTo: 63999999, price: 349.9 },
  { state: 'Distrito Federal', postalCodeFrom: 70000000, postalCodeTo: 73699999, price: 349.9 },
  { state: 'Espírito Santo', postalCodeFrom: 29000000, postalCodeTo: 29999999, price: 299.9 },
  { state: 'Goiás', postalCodeFrom: 72800000, postalCodeTo: 76799999, price: 349.9 },
  { state: 'Maranhão', postalCodeFrom: 65000000, postalCodeTo: 65999999, price: 349.9 },
  { state: 'Mato Grosso', postalCodeFrom: 78000000, postalCodeTo: 78899999, price: 349.9 },
  { state: 'Mato Grosso do Sul', postalCodeFrom: 79000000, postalCodeTo: 79999999, price: 349.9 },
  { state: 'Minas Gerais', postalCodeFrom: 30000000, postalCodeTo: 39999999, price: 299.9 },
  { state: 'Pará', postalCodeFrom: 66000000, postalCodeTo: 68899999, price: 349.9 },
  { state: 'Paraíba', postalCodeFrom: 58000000, postalCodeTo: 58999999, price: 349.9 },
  { state: 'Paraná', postalCodeFrom: 80000000, postalCodeTo: 87999999, price: 299.9 },
  { state: 'Pernambuco', postalCodeFrom: 50000000, postalCodeTo: 56999999, price: 349.9 },
  { state: 'Piauí', postalCodeFrom: 64000000, postalCodeTo: 64999999, price: 349.9 },
  { state: 'Rio de Janeiro', postalCodeFrom: 20000000, postalCodeTo: 28999999, price: 299.9 },
  { state: 'Rio Grande do Norte', postalCodeFrom: 59000000, postalCodeTo: 59999999, price: 349.9 },
  { state: 'Rio Grande do Sul', postalCodeFrom: 90000000, postalCodeTo: 99999999, price: 299.9 },
  { state: 'Rondônia', postalCodeFrom: 76800000, postalCodeTo: 76999999, price: 349.9 },
  { state: 'Roraima', postalCodeFrom: 69300000, postalCodeTo: 69399999, price: 349.9 },
  { state: 'Santa Catarina', postalCodeFrom: 88000000, postalCodeTo: 89999999, price: 299.9 },
  { state: 'São Paulo', postalCodeFrom: 1000000, postalCodeTo: 19999999, price: 299.9 },
  { state: 'Sergipe', postalCodeFrom: 49000000, postalCodeTo: 49999999, price: 349.9 },
  { state: 'Tocantins', postalCodeFrom: 77000000, postalCodeTo: 77999999, price: 349.9 },
];

/** acha a regra da UF pelo CEP; `null` quando não há CEP ou nenhuma faixa casa */
export const matchFreeShippingRule = (
  postalCode?: string | null,
  rules?: FreeShippingRule[] | null
): FreeShippingRule | null => {
  const digits = String(postalCode ?? '').replace(/\D/g, '');

  if (digits.length !== 8) return null;

  const cep = Number(digits);
  const table = rules && rules.length ? rules : DEFAULT_FREE_SHIPPING_RULES;

  return (
    table.find(
      rule =>
        cep >= Number(rule?.postalCodeFrom ?? 0) && cep <= Number(rule?.postalCodeTo ?? 0)
    ) ?? null
  );
};

/** Quanto falta e quanto já andou. `value` vem em REAIS, já pós-desconto. */
export const freeShippingProgress = (value: number, threshold: number) => {
  const target = Number(threshold) || 0;
  const current = Math.max(0, Number(value) || 0);

  if (target <= 0) return { priceDiff: 0, percent: 100, reached: true };

  const priceDiff = Math.max(0, target - current);

  return {
    priceDiff,
    percent: Math.min(100, (current / target) * 100),
    reached: priceDiff === 0,
  };
};

/**
 * Micro-markdown: troca `{price}` pelo valor e transforma `**trecho**` em
 * negrito. Devolve pedaços para virarem nós React — nada de innerHTML.
 */
export const renderFreeShippingText = (
  text: string,
  price: string
): Array<string | { bold: string }> => {
  const withPrice = String(text ?? '').replace(/\{price\}/g, price);

  return withPrice
    .split(/\*\*(.+?)\*\*/g)
    .map((chunk, i) => (i % 2 === 1 ? { bold: chunk } : chunk))
    .filter(chunk => chunk !== '');
};

/** Máscara 00000-000 progressiva, como no ShippingSimulator06. */
export const formatPostalCode = (value: string) => {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8);

  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};
