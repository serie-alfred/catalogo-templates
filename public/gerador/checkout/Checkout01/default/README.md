# Checkout da loja — Checkout01 (E-temas)

Gerado pelo `checkout-vtex` na versão `sem SHA (build local)` (contrato 1).
Não edite estes arquivos à mão: mude as cores no /gerador e gere o tema de novo.

## Antes de colar (bloqueia)

Salvar em Admin › Checkout › ⚙ do site › Código **publica na hora, para todos os compradores**.

1. **Faça backup** dos 4 arquivos que estão no Admin hoje (copie o conteúdo de cada aba para um arquivo).
2. **Abra `https://<conta>.vtexcommercestable.com.br/files/checkout6-custom.css` e procure `/* source: <`.** Se aparecer, a conta tem app com builder `checkout-ui-custom` e o Admin é ignorado: **pare** e fale com o time.
3. **Confira se o app `vtex.checkout-ui-custom` está instalado** (`vtex ls`). Se estiver, o CSS dele entra antes do nosso: **pare** e fale com o time.
4. Se a conta ainda tiver `/arquivos/checkout-custom.css` ou `.js` no CMS legado, eles também carregam no checkout: combine com o time antes.

## Onde colar

| Arquivo | Onde, em Admin › Checkout › ⚙ do site |
|---|---|
| `checkout6-custom.css` | aba **Código** › `checkout6-custom.css` |
| `checkout6-custom.js` | aba **Código** › `checkout6-custom.js` |
| `checkout-header.html` | aba **Templates** › `checkout-header` |
| `checkout-footer.html` | aba **Templates** › `checkout-footer` |

## Preencha antes de colar

- `{{RAZAO_SOCIAL}}` em `checkout-footer.html`: razão social da loja, como está no CNPJ.
- `{{CNPJ}}` em `checkout-footer.html`: CNPJ da loja, no formato 00.000.000/0000-00.
- `{{AVISO_LEGAL}}` em `checkout-footer.html`: texto legal do rodapé (preços, promoções, endereço).

## Cores e fonte deste checkout

| Papel | Variável | Valor | De onde |
|---|---|---|---|
| Botão principal | `--checkout-button-bg` | `#009dde` | padrão do modelo (Figma) |
| Texto do botão principal | `--checkout-button-text` | `#ffffff` | padrão do modelo (Figma) |
| Botão de destaque | `--checkout-accent` | `#ed8b00` | padrão do modelo (Figma) |
| Texto do botão de destaque | `--checkout-accent-text` | `#ffffff` | padrão do modelo (Figma) |
| Etiqueta de desconto | `--checkout-tag-bg` | `#0096fe` | padrão do modelo (Figma) |
| Texto da etiqueta de desconto | `--checkout-tag-text` | `#ffffff` | padrão do modelo (Figma) |
| Texto | `--checkout-text` | `#292929` | padrão do modelo (Figma) |
| Texto secundário | `--checkout-text-muted` | `#7a7a7a` | padrão do modelo (Figma) |
| Fundo da página | `--checkout-page-bg` | `#ffffff` | padrão do modelo (Figma) |
| Fundo das caixas | `--checkout-surface-bg` | `#ffffff` | padrão do modelo (Figma) |
| Bordas | `--checkout-border` | `#efeff0` | padrão do modelo (Figma) |
| Fundo do header e do rodapé | `--checkout-header-bg` | `#ffffff` | padrão do modelo (Figma) |
| Texto do header | `--checkout-header-text` | `#292929` | padrão do modelo (Figma) |
| Passo inativo do stepper | `--checkout-header-muted` | `#dfdfe0` | padrão do modelo (Figma) |
| Traço do header no celular | `--checkout-header-line` | `#f5f5f5` | padrão do modelo (Figma) |
| Texto do rodapé | `--checkout-footer-text` | `#8f8f8f` | padrão do modelo (Figma) |
| Cadeado do header | `--checkout-header-icon` | `#009dde` | padrão do modelo (Figma) |
| Fonte | `--checkout-font` | `'Montserrat', Arial, Helvetica, sans-serif` | padrão do modelo (Figma) |

Logo: embutido no `checkout-header.html`.

## Avisos

- `versao-ausente`: sem version (SHA do checkout-vtex): o banner não diz de onde o arquivo veio
- `placeholder-manual`: {{RAZAO_SOCIAL}} em checkout-footer.html: razão social da loja, como está no CNPJ
- `placeholder-manual`: {{CNPJ}} em checkout-footer.html: CNPJ da loja, no formato 00.000.000/0000-00
- `placeholder-manual`: {{AVISO_LEGAL}} em checkout-footer.html: texto legal do rodapé (preços, promoções, endereço)
