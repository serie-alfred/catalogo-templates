# Funil de teste do E-temas

Cobre o produto inteiro, na ordem em que ele acontece: **catálogo → editor →
export do `config.json` → tema montado pelo generator → tema que compila**. Existe porque cada
perna tem um jeito próprio de falhar em silêncio — item invisível no catálogo,
seção que não monta no canvas, config que sai válido mas aponta para uma pasta
inexistente, tema que só quebra na loja.

```bash
yarn funil                # tudo, para no primeiro erro
yarn funil 1              # só o estágio 1
yarn funil 2-edicao       # um estágio específico
yarn funil 4              # só o tema FastStore (minutos)
yarn alcance              # diagnóstico avulso, não é estágio (ver abaixo)
```

**Pré-requisitos:** Node 24 (`nvm use 24`), Chrome instalado (ou `CHROME_PATH`),
e o `yarn dev` de pé para os estágios 2 e 3. Saídas em `.funil/` (ignorada).

| Estágio | O que prova | Precisa de |
|---|---|---|
| `1-catalogo` | chaves e ids únicos, registry casado **pelas chaves do objeto `TemplateRegistry`** (não pelas linhas de import), mock em disco, **origem real em `global-templates`** para todo item Tray/Wake (e diz QUAL clone leu — ver abaixo), `CONTAMINADOS_CONHECIDOS` exato nos dois sentidos, manifest para todo `path` VTEX e para as **raízes que o generator injeta** (`CrossSellingShelf01` e o `ProductShowcase` da vitrine), fragment, import e SCSS de todas elas — import de override lido onde o tema o lê (o destino achatado), e import que não resolve em lugar nenhum reprova —, a matriz vitrine×card (lado vazio reprova), e o `registration.spread` de todo resolver casa com a forma do default export, nas quatro grafias que o `ResolverIndexPatcher` escreve — texto, objeto, `QueryAndMutation` e `root` (espalhar o objeto inteiro com `Query` no topo dá `Query.Query` no tema, e o GraphQL inteiro dele responde 500; bloco que o export não tem quebra o tsc; texto desconhecido deixa o resolver importado e não registrado) | nada |
| `1-grafo` | todo `path` VTEX **e toda raiz que o generator injeta** resolve no grafo de `manifest.json`, com o `AssetRegistry` e o `DependencyResolver` reais do generator, e todo `scss` declarado existe em `src/sass`. Prova que o que está DECLARADO existe — não que a declaração está completa (isso é o `conferirImports` do estágio 1) | checkouts irmãos de `faststore.starter` e `produtos-template-generator` |
| `1-checkout` | o checkout-vtex vendorizado pelo `yarn checkout:sync` é byte a byte o `git show <sha>` (lib, `checkout.json`, dist) e os hashes do `VERSION.json` batem com o disco; as fixtures não têm script nem dado da conta/pessoal, só CDN público, e trazem base, tokens e slots (`[data-etm-slot]` na real, comentários na provisória); a fixture **real** é o `fixtures/<etapa>/<vp>/index.html` do SHA (só o `src` do cartão achatado), o `card.html` do pagamento idem, e o **JS dela é o do dist** (`sha256Js` do `fixture.json` = do VERSION.json = o do `default/checkout6-custom.js`); `provisorio: false` exige as 10 reais; todo papel é consumido como Nível 1 com a cadeia e o `default` = Nível 3, e (com as reais) todo alias pinta alguma regra; o compose de amostra passa no lint do checkout-vtex e o lib reproduz o `dist/default`; o Nível 2 ⊆ `VAR_MAP` do generator; o VERSION.json tem o sha256 de **cada** arquivo vendorizado; o catálogo **não guarda** a lista do que o repo público não pode receber (gate0 #29) — com o checkout-vtex ao lado ela é carregada de lá, em memória, e os vendorizados e todo arquivo que a integração criou ou mudou (`FONTES_DA_INTEGRACAO`) têm zero termos; sem ele, "termos não conferidos: sem checkout-vtex ao lado" e as comparações com o SHA viram aviso (a integridade fica com os hashes) | `src/data/checkout/VERSION.json`; o `../checkout-vtex` com o SHA (ou `CHECKOUT_VTEX_DIR`) para a comparação byte a byte e os termos |
| `1-variaveis` | toda `cssVar` do `variablesSchema` é consumida pelo CSS da réplica **e** lida por uma **regra viva** do SCSS do fecho do `path` no starter (pastas dos componentes + `dependencies.scss`): cada SCSS é compilado com o sass do catálogo (aninhamento, `&` e `$x` resolvidos como no build), e num dos seletores da regra **toda** classe do módulo aparece como `<import>.x` ou `<import>['x']` (ou no camelCase que o css-loader também exporta) num TSX do fecho que importa aquele módulo. Atributo (`[data-fs-*]`), tag, `:global(...)` e `:not(...)` não pedem nada do TSX, `@keyframes` vive pela regra que anima com ele, e a folha de `themeImports` fica isenta. Regra morta ao lado de uma viva vira linha ℹ️, e um autoteste de 21 casos exercita o ramo que reprova. O `default` bate com o nível 3 da réplica; e a réplica não lê token interno do catálogo — o que `src/styles/*.css` e o `frame.css` declaram, menos os tokens de tema do `buildThemeStyle` e a lista `PERMITIDOS`. **Não** prova que o nó aparece: o TSX referenciar a classe não é renderizar (render condicional, prop que ninguém passa), a parte do seletor que o TSX não escreve é presumida, e classe que só `style[chave]` alcança conta como morta. Também **não** lê o tema gerado: consumir no SCSS não prova que a injeção alcança o nó (conteúdo portado precisa de seletor de topo `…Portal`) — isso é com o estágio 4 e as sondas do `2-fidelidade` | checkout irmão de `faststore.starter` (o sass e o postcss são do próprio catálogo) |
| `2-fidelidade` | a réplica do catálogo bate com o componente real do starter. Os pares moram em `lib/fidelidade.mjs` — o estágio 1 confere que cada um aponta para a réplica certa —, e um par que estoura vira divergência dele, sem esconder os outros. **Dois placares**: nó a nó por `data-role` (caixa e CSS, em repouso; nó repetido casa pela ordem entre os iguais, e a propriedade é comparada quando QUALQUER lado a estabelece) e a **paleta** — cor e fonte de tema em todo nó, inclusive sem `data-role` e sob `:hover`; chave de um lado só que pinta com o tema reprova, e tela com 0 asserções também (ver 2f abaixo) | dev server **e** o `yarn dev` do `faststore.starter` em :3000 |
| `2-checkout` | o modo Checkout: só em VTEX; entra e sai pelo rail, e **trocar de plataforma pela UI sai do modo** (voltar a VTEX não o reabre); cor global muda o nó-sonda e o header recomposto, e a cor da loja que some no fundo cai na **guarda** (o botão real volta ao Figma e o painel diz por quê); o hex digitado com o seletor **aberto** fica exatamente o digitado, tecla a tecla (o `#NaN…` do react-colorful); cada papel muda o nó-sonda **e nós reais** — pela UI no carrinho e no alcance direto das 10 fixtures, cartão incluso; pesos 300–700; logo reduzido no slot; desfazer/refazer e reload; clique/submit não navegam nem enviam, e os botões de etapa ("Seguir com o pedido", "Ir para…", "Editar") trocam a fixture do preview; as 5 etapas em 1280 e 390, com o cartão do pagamento pintado e na altura da `scrollHeight`; **equivalência 0 px** entre `<link>` base + `<style>` do `emitTokens` e o arquivo composto (carrinho e pagamento, 1280 e 390) com **controle negativo** (um papel trocado tem de diferir); o export leva `faststore.checkout` e o mesmo logo do preview; logo https passa como veio e logo recusado vira aviso no painel; o rodapé do preview mostra **texto de exemplo** no lugar de `{{RAZAO_SOCIAL}}`/`{{CNPJ}}`/`{{AVISO_LEGAL}}` e o painel diz que o arquivo sai com eles (gate0 #26); **header escuro** troca o texto do header, o "100% seguro" e o passo ativo pelo contraste calculado (gate0 #23); a rota **`/p/{id}/checkout/{etapa}`** com o armazenamento local (provado antes de postar: um arquivo em `.preview-store/` tem de abrir, senão o dev lê o KV e nada é gravado) — 200 com o tema do snapshot VTEX, valores **injetados** filtrados (ck-tokens = emitTokens só do aceito, nada executa), 404 para snapshot Tray (com ou sem o bloco `checkout`), etapa inválida e id inexistente. A nova tentativa da equivalência (só para ≤ 50 px, a 1ª captura no log) e o seletor de plataforma no modo Checkout são do gate0 #27, aprovados. Capturas em `.funil/checkout/` | dev server **sem KV** (`FUNIL_BASE_URL=http://localhost:<porta>` se não for a 5503) |
| `2-editor` | shell, canvas, painéis, atalhos, modal, troca de plataforma, fonte que não vaza no `:root`, contraste derivado | dev server |
| `2-render` | **todo item do catálogo** monta sozinho, sem erro de console, com altura e conteúdo, e sem o marcador vermelho `[data-registry-missing]` do ThemeRenderer (`FUNIL_RENDER_NOVOS=1` reduz aos 23 do redesign — execução parcial) | dev server |
| `2-edicao` | regras de negócio: singleton substitui, não-singleton coexiste, duplicar/remover, painel de variáveis, troca de plataforma | dev server |
| `2-geometria` | fidelidade ao Figma: **119 nós comparados** (134 asserções), tolerância por classe de nó e exceções codificadas por eixo. Imprime o censo das fixtures e reprova se a cobertura regredir. **Reprova** | dev server |
| `2-preview` | visão mobile, link `/p/{id}/{page}` compartilhável e a rota `/gerador/import-log` | dev server |
| `2-landing` | a página **LPs**: o seletor só a oferece onde há LP (Wake e VTEX, não Tray); a LP entra pelo modal e o canvas monta header → LP → footer, sem breadcrumb e sem vazar para a home; é singleton; a variável do painel pinta o canvas; o export leva o balde `landing` (`faststore.landing` com o `path`, `wake.landing` com template/selection de origem real) e passa no contrato do estágio 3; `/p/{id}/lp` abre a LP | dev server |
| `2-zoom` | o preview "Desktop" é desktop: viewport lógica de 1440 em qualquer tela, escala, controle de zoom e **clique de mouse real** dentro do frame escalado | dev server |
| `2-usabilidade` | todo controle é achável, alcançável e faz alguma coisa: varredura de alcance, as 10 cores globais, o `FontSelector` no caminho feliz, `ScrollArea`, o `Fechar` do modal, a fonte das superfícies portalizadas e o `DesktopOnlyNotice` | dev server |
| `2-integracao` | a escolha do cliente **chega ao config**: cor global → `config.json` → as 3 páginas do preview → sobrevive ao reload | dev server |
| `3-export` | toda seleção semeada hidrata (o app servido é este catálogo); o botão "Baixar" entrega os três configs; cada um resolve o contrato da sua plataforma — em VTEX, `faststore.checkout` com o modelo, o SHA vendorizado e os papéis semeados, e o compose do config exportado (`optionsFromConfig` + o lib do SHA, o que o generator roda) sai com os placeholders do rodapé no footer e no README (o texto de exemplo é só do preview, gate0 #26); em Tray/Wake, nenhum checkout mesmo com papéis no localStorage —; os dois PNGs saem | dev server |
| `4-tema-faststore` | o generator monta o tema de verdade e **ele compila** (`yarn build`) — a única perna do pipeline executável desta máquina. As travas de dado de exemplo (`MOCK_ENABLED`, `DevFidelityStage`) são conferidas no tema entregue, e arquivo ausente reprova (`FUNIL_TEMA_BUILD=0` pula o build — execução parcial). **Checkout VTEX:** papel desconhecido e, com `faststore.checkout` no config, checkout-vtex que não clona (`clone-falhou`, gate0 #25) fazem a VALIDATE abortar sem escrever; no positivo, `checkout/` com exatamente 5 arquivos, `@import` primeiro, nível 1 marcador no `:root`, logo no header, zero `{{ETC_`, README com placeholders e pre-flight, e **os bytes = o compose do lib vendorizado no catálogo** para o mesmo config | estágio 3 · `gh` autenticado · `CHECKOUT_VTEX_REPO` (ou o irmão `../checkout-vtex` com commit) · minutos |
| `5-contrato-tray-wake` | contrato estático de Tray e Wake: pasta de origem, `instanceCount`, dedupe `key::arquivo`, nenhum caminho com espaço — no clone local de `global-templates` (ver abaixo) | estágio 3 |

## Estágio 4 — o que ele monta, e por que cruzado

Ele parte do config **coerente** do estágio 3 (um modelo por slot, mesma família)
e troca a vitrine da home pela da família 06, mantendo o `ProductCard01` como
spot. Só assim a **substituição de spot** é exercitada: ela é um
`replaceAll('ProductCard06','ProductCard01')` sobre todo arquivo de texto do
asset, e num tema de família única não há o que trocar.

Ele também põe **cor por componente** no config, como sai de um export real
(o `pickChangedVariables` grava toda variável que o cliente mexeu): um bloco
`variables` num componente comum e num override, com os nomes do
`variablesSchema` do catálogo e valores-marcador. Depois confere que cada
declaração `--var: marcador;` chegou a algum SCSS do tema (qualquer arquivo da
pasta do componente, ou de `src/sass/` para o override). Não confere em QUE
seletor ela caiu, nem que o SCSS de fato lê a variável — essa segunda é do
`1-variaveis`. O config coerente não traz `variables`, e foi assim que o VALIDATE
do generator reprovou todo componente não-override com cor escolhida de 08/09 a
23/09 ("destino disputado por duas origens") sem este estágio perceber.

O `config.json` do generator é versionado — o estágio guarda e devolve, inclusive
se algo estourar no meio.

Duas coisas que ele **não** faz, de propósito: não roda `--push` (não cria
`preview/<hash>`) e não roda `--sync` (não publica no Headless CMS da VTEX).

⚠️ O generator **clona** a origem dos componentes, inclusive de um `file://`.
Clone enxerga **commit**, não working tree: trabalho não commitado no starter fica
invisível e o tema sai com a versão antiga, sem aviso. O estágio avisa quando
`FASTSTORE_COMPONENTS_REPO` aponta para um checkout sujo.

### O checkout VTEX no estágio 4

Todo tema FastStore sai com `checkout/` (os 4 arquivos do Admin + o README de upload). O
generator clona o checkout-vtex no SHA de `faststore.checkout.version` — o que o export leva, e o
estágio confere que é o do `src/data/checkout/VERSION.json`. Sem
`CHECKOUT_VTEX_REPO`, o estágio passa ao generator o irmão `../checkout-vtex` **quando ele tem
commit**, e reprova se esse checkout estiver sujo ou não tiver o SHA; com
`CHECKOUT_VTEX_REPO=https://github.com/seriedesign/checkout-vtex` (privado), prova contra o remote,
que é o que o generator usa por default. Como os outros, o clone enxerga commit.

No config ele troca o nível 1 do export por **marcadores** (`#0c0c01`, `#fcfcf3`…, fonte Karla)
em 7 papéis do painel — botão, tag e texto ficam de fora para herdar o nível 2 — e põe um logo
data URL marcador. Três rodadas do generator:

1. **negativa, antes** (o SYNC da rodada seguinte reclona o tema-base, então ao contrário apagaria o
   tema que o build compila): `--checkout-nao-existe` no nível 1 → exit ≠ 0, a VALIDATE aponta
   `papel-desconhecido`, o EXECUTE não começa e o tema-base fica como o clone o deixou
   (`git status --porcelain --ignored` vazio, sem `checkout/`). Log em `.funil/generator-negativo.log`;
2. **o clone que falha (gate0 #25), também antes**: o config do positivo (COM `faststore.checkout`)
   e `CHECKOUT_VTEX_REPO=file://…/.funil/checkout-vtex-inexistente` → exit ≠ 0, o SYNC registra
   `checkout-vtex (clone-falhou)` e segue, a VALIDATE reprova com **um** erro do checkout,
   `clone-falhou`, com o caminho e o `fatal:` do git, sem `checkout-pulado` (isso é só para config
   SEM a chave), sem EXECUTE nem `WriteCheckout`, e o tema-base intacto, sem `checkout/`. Log em
   `.funil/generator-sem-clone.log`. O remote trocado apaga o `repo-temp-checkout/`: o positivo
   reclona do zero;
3. **positiva**: exatamente `README.md`, `checkout-footer.html`, `checkout-header.html`,
   `checkout6-custom.css`, `checkout6-custom.js` (nada de `.ts` nem `manifest.json`); o clone parado
   no SHA; `@import` do Google Fonts como primeira instrução; os marcadores e o nível 2 no `:root` do
   bloco `tokens`; o logo no header; zero `{{ETC_`/`ETC:SLOT`; README com os placeholders que
   sobraram e o pre-flight bloqueante (`/* source: <`, `vtex.checkout-ui-custom`) com o SHA; e a
   **equivalência com o /gerador** — `composeCheckout` do `src/lib/checkout/` sobre a base de
   `public/gerador/checkout/`, com `optionsFromConfig` do mesmo config, dá os mesmos bytes nos 5
   arquivos. O `1-checkout` prova vendorizado == SHA; isto prova generator == SHA.

## Por que Tray e Wake param na validação estática

Não é escolha: `git ls-remote` do GitLab e do `git.fbits.net` **trava** dentro do
`git-credential-osxkeychain` — só `github.com` tem helper aqui, via `gh`. Além
disso o fluxo da Tray usa `start cmd /k` e `cd /d` (Windows), e o da Wake publica
em loja real sem opt-in. O estágio 5 confere o contrato sem executar.

## Estágio 2c — as três features que os outros não tocam

A visão mobile troca a **moldura** do iframe: o documento é o mesmo
(`/gerador/frame-mobile`) dos dois lados. O preview serializa o tema num snapshot
do servidor (`.preview-store/` em dev, KV em produção) e devolve
`/p/{id}/{page}` — que renderiza **sem** o editor e sem postMessage, então é o
único lugar onde o caminho de serialização é exercitado ponta a ponta. E o
`import-log` é rota pública que lê o filesystem.

Ele achou dois defeitos no primeiro run: o `import-log` dava 500 em toda visita
sem `~/Downloads/log.txt`, e o logo da agência no `Footer` do template_1 tinha o
`d` do path truncado com reticências **no código-fonte**, reclamando
«<path> attribute d: Expected number» a cada render.

## Estágio 2e — o que os outros estágios não conseguem ver

Os demais provam que a UI reage. Este prova que a escolha **atravessa as camadas**.
A diferença importa: uma cor que se perde entre o ColorPicker, o estado, o
`postMessage` de tema e o `buildConfigJson` sai **verde no funil inteiro** — o
cliente escolhe a paleta, o tema é montado "com sucesso" e chega com outra cor.

Ele fecha o circuito: digita a cor, exporta, confere no `config.json`, abre o
preview compartilhável nas três páginas e procura a cor no HTML servido, e por fim
recarrega o editor para ver se o trabalho sobreviveu — o `/gerador` não tem
"salvar", o localStorage é o único lugar onde o tema vive entre sessões.

A perna **editor → config** da *variável por componente* não é exercitada aqui: o
painel de propriedades não expõe um seletor estável para dirigi-la. A perna
**config → tema** é, em parte, no estágio 4: ele confere que a declaração de cada
variável escolhida chegou a um SCSS do componente no tema gerado — não o seletor
em que o `InjectComponentVariables` a pôs.

## Estágio 2f — o que o `data-role` não vê

A medição nó a nó só enxerga quem tem `data-role`, e só em repouso. O back-port `92aa66f`
do starter (22/09) mostrou o custo: o sublinhado do `<a class=comprar>` do BannerCarousel06
virou `#fff` cravado e o par seguiu **198/198**; o mesmo com o `.outer` do Categories06, o
`.accordion`/`.sign` do TrustvoxReviews06 e três bordas de `:hover`. Uma sonda à mão achou.

Por isso o estágio faz uma **segunda leitura na mesma página**, depois da primeira, com
placar próprio (`N/M passam (paleta fora do [data-role] e sob :hover)` — o `funil.mjs`
soma as duas linhas). Ela mora em `lib/fidelidade-paleta.mjs`:

- **todo nó** da raiz do componente, com chave = `data-role`, senão o nome local da classe
  de CSS module (`style_comprar__…` no starter, `BannerCarousel_comprar__…` aqui), senão a
  do ancestral + a tag;
- **só o que pinta**: cor e fonte onde há texto próprio, borda do lado visível, fundo,
  sombra, degradê, `fill`/`stroke` de forma SVG, o `::placeholder` de campo;
- **duas vezes**, com a paleta-sonda e com uma segunda paleta. O valor que muda entre as
  duas acompanha o tema; o que não muda está cravado. Vira asserção onde algum lado
  acompanha o tema, então `color-mix` com branco e sombra entram sem interpretar cor;
- **de novo com `:hover` emulado** em toda regra (cópia de cada regra com `:hover`, o pseudo
  trocado por um `:not()` de mesma especificidade), comparando só o que o hover mudou.

**Provado em 23/09**: com o `#ffffff` do `.comprar` e o `rgba(33, 39, 33, 0.16)` do
`.vejaLink:hover` re-cravados no starter, os placares deram `198/198` + `8/10` e
`228/228` + `10/12`, e as divergências dizem onde:
`.comprar · borderBottomColor "rgb(255, 255, 255) cravado" → "var(--banner-carousel-cta-color)"`.
Na primeira rodada completa (25 pares, `9897/9897` + `1201/1203`) ela achou uma divergência
real que ninguém via: a aba mobile do HelpFloatButton06 desenhava um balão com `stroke` na
réplica, onde a origem tem o glifo com `fill` — os dois no mesmo token, então nenhum portão
de variável acusava. A réplica passou a usar o glifo da origem.

**Chave de um lado só que pinta com o tema reprova** (desde 24/09). Antes ela sumia da
conta: trocar `.comprar` por `.buy` com `#fff` cravado dava 0 asserções e 0 falhas, e a
tela sem asserção nenhuma passava com `0/0` — hoje ela também reprova, salvo par que
declara `semPaleta` (o ProductDescriptionBanner01, banner só de imagem). Divergência
conhecida fica em `paletaDeUmLado` no par, com o motivo, até a réplica ser consertada — e
a dispensa que nenhuma tela usa reprova, então o conserto leva a linha junto. A primeira
rodada achou divergências reais que nenhum portão via, todas consertadas em 25/09: o
slider de preço do MainCategory07 sem os `.rangeThumb` na réplica, e no ProductDetails06
o `ShareIcon` e o `GuiaIcon` com glifos diferentes e as setas do carrossel de cores
sempre visíveis na réplica (a origem as esconde com o carrossel travado). Hoje sobra uma
dispensa, e ela não é defeito: o rótulo sr-only do CEP, `.srOnly` no ShippingSimulator06
da origem e `.shipSrOnly` na réplica, que inlina os dois componentes num CSS module só.

O que ela **não** vê: chave de um lado só que só pinta cravado (estrutura, assunto do
`data-role`), cor dentro de SVG em data-URI, conteúdo portado para fora da raiz, e
qualquer propriedade que não seja cor ou fonte. O conserto de 25/09 achou duas assim, só
olhando as telas: a seta do carrossel de cores da réplica era o caret do palco e, com o
giro do CSS, apontava para o lado errado; e os rótulos do slider de preço saíam com
centavos (texto de `<span>` sem `data-role` não é comparado). O `:hover` emulado é tudo
pairado ao mesmo tempo, um superconjunto do real, e vale porque os dois lados recebem o
mesmo.

## Por que quase toda falha do funil já foi do PRÓPRIO funil

Cinco reprovações em 08–09/09 foram do harness, não do produto. Vale o padrão, porque a
próxima vai ser igual: **o teste chegava antes da UI**.

| Sintoma | Causa real |
| --- | --- |
| "seção não montou" | sleep fixo em vez de esperar a seção pintar |
| "0 botões de duplicar" | `semear` aguardava só `.ed-shell` — a casca, não a lista |
| "#dynamic-tabs não achado" | 15s fixos, insuficientes sob carga |
| "o botão Baixar não entrega o config" | o botão é `disabled` até o `platform` hidratar; clicar nele não faz nada, **em silêncio** |
| "404 no /p/{id}" | regex do teste parava no id e descartava o `/{page}` |
| "canvas renderiza no 1º load → 0 seções" | `s(6000)` fixo, e o canvas pinta **por volta** de 6 s — o estágio media na borda |
| "alternar para mobile não troca a moldura" (`desktop → desktop`) | o botão existe no HTML antes de o React hidratar; `.click()` num botão não hidratado não faz nada, **em silêncio** |
| o estágio de render morreu no 3º de 23, e levou 4 estágios junto | o mesmo clique não hidratado, agora num `waitForFunction` seco: a exceção subiu e abortou o lote inteiro |
| `2-checkout`, 14 rodadas vermelhas sob carga: "iframe trocado no meio do passo" (sondas somem, `#ck-base`/`ck-tokens` null, captura branca com "1 cores") | a captura com recorte do Puppeteer usa `captureBeyondViewport: true` por padrão, e o Chrome **redimensiona a janela** durante a captura: a aba viu `resize` para 1×1; o `useIsMobile` do /gerador (≤ 768) trocou o editor pelo `DesktopOnlyNotice`, o shell desmontou e voltou com um iframe novo (medido em 25/09 com um observador de mutação: `removido=DIV.ed-shell` logo depois do `resize w=1`) |
| `2-checkout`: o desfazer parava no `#123` digitado pela metade, ou no padrão | **produto**, não harness: o histórico fechava uma entrada a cada pausa de 250 ms, e o campo hex grava a cada tecla — quem digita devagar (ou a máquina carregada) guardava `#123` e `#12345` (inválido, que cai no padrão). O `useThemeHistory` agora fecha a entrada de um campo de texto quando o foco sai dele, e o desfazer fecha antes o que está aberto (reproduzido com a CPU da aba a 20×: antes parava no padrão, depois volta ao valor anterior) |
| `2-checkout`: o menu do `/p` vazio | o clique no balão chegava antes da hidratação da página do `/p` (que compila na 1ª vez); agora clica até `aria-expanded="true"` |
| `2-checkout`: o "nós reais por papel" mudava de rodada para rodada (accent 12/11/10, text-muted 38/34/26) com as mesmas variantes | a CSS da VTEX na fixture tem **transição** de cor, fundo e borda: o rAF duplo lia o nó no meio do caminho, e o que o papel anterior mexeu, ainda voltando à base, contava para o papel de agora — contagem inflada, que podia aprovar um papel que não pinta nada. A leitura (`pintura()` e o alcance direto) agora espera as transições acabarem (`assentarTransicoes`, pelo `getAnimations()`): 3 repetições idênticas (26/09) |

As regras que saíram disso, e que valem para qualquer estágio novo:

1. **Espere a condição, não o relógio.** `waitForFunction` no elemento que você vai usar, nunca
   `espera(n)` como garantia.
2. **Antes de clicar, confira que dá para clicar.** Botão desabilitado engole o clique sem erro
   — foi a falha mais cara de diagnosticar, porque o estágio esperava 120s por um export que
   nunca começou.
3. **Um clique não é uma garantia.** Botão presente no HTML mas ainda não hidratado engole o
   clique do mesmo jeito. Clique e **verifique o efeito**; se não veio, clique de novo até vir
   ou até estourar o limite. Um clique único mais `espera(n)` reprovava 1 em 2 execuções.
4. **Clique por DOM prova lógica, não alcance.** `el.click()` dispara o handler sem hit-test,
   sem olhar `opacity`, `visibility` ou o que está por cima. O `PanelToggle` passou meses verde
   com `opacity: 0` — teste passando, feature que nenhum humano achava. Todo controle que o
   usuário precisa **descobrir** exige duas asserções: `visibilidadeDe()` (opacidade e caixa
   reais) e `clicarDeVerdade()` (hit-test do Chrome). As duas, porque o clique do Puppeteer pega
   oclusão mas ignora `opacity`. `.click()` por DOM continua legítimo para dirigir estado que já
   foi provado alcançável em outro lugar.
5. **Varredura não pode ser tudo-ou-nada.** Estágio que percorre N itens tem que envolver cada
   item num `try/catch`: a falha de um alvo é a falha DAQUELE alvo, aparece na tabela e conta no
   placar. Sem isso, uma exceção no 3º de 23 derruba o estágio — e, no `funil.mjs`, os quatro
   estágios seguintes que dependem dele. Um flake vira "6/10" e some a informação dos outros 20.
6. **Captura com recorte, sempre `captureBeyondViewport: false`** (`page.screenshot({ clip })` e
   `elemento.screenshot()`). O padrão do Puppeteer redimensiona a janela durante a captura, e o
   /gerador reage a largura ≤ 768 desmontando o editor. O recorte tem de caber na janela
   (1920×1080). Sem recorte o Puppeteer já força `false`.
7. **Depois de mudar o canvas do checkout, espere o frame dizer que aplicou.** O `CheckoutFrame`
   publica `data-pedido` (a impressão da fixture + níveis + logo que recebeu) e, depois dos
   efeitos, `data-aplicado` com o mesmo valor; `data-pronto` só vem com o logo já reduzido. O
   `2-checkout` espera `data-aplicado === data-pedido` e um rAF duplo no iframe
   (`esperarAplicado`) em vez de `espera(n)`; a captura da equivalência só vale quando duas
   seguidas têm os mesmos bytes (`capturaEstavel`). Quem lê cor **computada** espera também o
   fim das transições CSS (`assentarTransicoes`): o rAF duplo não basta, a CSS da fixture anima.

## O resultado vira evidência, não recado

Uma execução COMPLETA grava `.funil/resultado.json`: placar por estágio, total de asserções, e o
**commit de cada um dos 4 repos** naquele instante. É esse campo que faz diferença — "o funil
passou" não diz nada sobre o código de agora se alguém commitou depois.

Commit igual não basta, e até 24/09 era só o que ele guardava. O registro agora traz também,
no início e no fim da execução, o que estava **fora do commit** em cada repo (`git status
--porcelain` — o funil lê o working tree) e **de que pasta rodava** o processo que respondeu em
`FUNIL_BASE_URL`/`FUNIL_STARTER_URL` (`lsof`: outra sessão pode subir o catálogo de outro
checkout na mesma porta), e as variáveis que desviam o que é medido (`FASTSTORE_*`,
`NEXT_PUBLIC_DEV_FIDELITY`). Com isso ele diz `evidencia: true|false` e os `motivos`. As que
**estreitam** — `FUNIL_TEMA_BUILD=0`, `FIDELIDADE_SO`, `FUNIL_RENDER_NOVOS=1` — a execução
completa recusa: para iterar, rode os estágios por nome.

O `cutover-preflight.sh` lê esse arquivo e reprova se a última execução foi vermelha, se nunca
houve uma, se qualquer repo mudou desde então, se ela não vale como evidência (cada motivo vira
uma linha) ou se o registro é de antes desses campos. Execução parcial não grava nada: carimbar
o conjunto a partir de um estágio seria provar o todo olhando uma parte.

Quando um estágio falhar, a primeira pergunta é "o produto está errado ou o teste chegou cedo?".
Rode o estágio sozinho, com o dev quente: se passar, é o segundo caso.

**E se falhar sozinho, ainda não terminou.** O último flake desta lista falhou 3 de 3 vezes
isolado — parecia regressão, e eu cheguei a chamá-la assim. O que desempatou foi uma sonda de
timeline: medir a mesma condição aos 2, 4, 6 e 10 s e imprimir `pageerrors` junto. Deu
`0, 0, 3, 3` com zero erro — o produto renderizava, o relógio é que estava na borda.
Reprovação reprodutível prova que o teste é determinístico, não que o produto está errado.

## Por que a origem é conferida por caminho

Tray e Wake não têm manifest: o generator monta
`global-templates/<Plataforma>/<Common|Home|Category|Product>/template_<template>/<selection>`
e copia o que achar. O campo `component` **não participa do caminho** — é rótulo
do catálogo. Um `selection` com typo não dá erro em lugar nenhum: a seção
simplesmente não existe no tema entregue. O estágio 1 é o único lugar onde isso
aparece antes da loja.

Com uma ressalva que os estágios 1 e 5 agora dizem em voz alta: eles leem o checkout
irmão, que é clone do **GitHub**, e o generator clona o **GitLab**
(`GLOBAL_COMPONENTS_REPO_URL`). Componente empurrado só para um dos dois passa aqui e some
do tema. Os dois remotos são privados; com `credential.helper` vazio o `ls-remote` do
GitLab responde 401 em ~2 s em vez de travar, então onde houver acesso sem o keychain o
estágio compara os commits e reprova se divergirem, e onde não houver imprime o que leu
(`ℹ️ origem Tray/Wake conferida em … @ <commit>; … paridade não verificada`).

No VTEX é o oposto: o `path` resolve contra `faststore.starter` pelo grafo de
`manifest.json`, e o estágio 3 usa o `AssetRegistry` + `DependencyResolver`
**reais do generator** — não uma réplica — porque um path que não resolve derruba
a geração do tema inteiro, não só aquele componente.

## `yarn alcance` — o que o catálogo NÃO alcança

`scripts/funil/alcance.mjs` não é estágio: não falha, não entra no `yarn funil`
(o runner só pega `^\d`). É inventário para decidir.

Ele responde "quais assets do `faststore.starter` nenhum tema consegue receber". As raízes
são três grupos: os `path` VTEX do catálogo, `overrides/CrossSellingShelf01`
(auto-injetado por `useLayoutGenerator` quando `ProductShowcase01` é escolhido) e
`organisms/ProductShowcase<NN>` (empurrado por `BuildPipeline._resolve` para o sufixo da
vitrine escolhida). A lista sai de `raizesDoTema` (`lib/contrato.mjs`), a mesma dos estágios
1 e 1g — até 24/09 eles partiam só do primeiro grupo, e o `ProductShowcase07` ficava fora de
toda checagem estática. É também por isso que uma varredura ingênua o acusa de órfão sem ele
ser. Os números envelhecem a cada componente novo — rode `yarn alcance` em vez de confiar
em algum escrito aqui.

O script também varre **import não declarado nos 186 manifests**, não só nos que
estão no alcance — um asset com `section` e import não declarado compila aqui e
quebra em `Cannot find module` no dia em que entrar no catálogo.

A leitura dos números e a decisão de cada caso ficam em
`faststore.starter/docs/alcance-do-catalogo.md`.
