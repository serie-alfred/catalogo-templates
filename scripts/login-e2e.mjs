/**
 * Prova de ponta a ponta do login do /gerador (Supabase Auth + 2FA TOTP).
 *
 *   FUNIL_BASE_URL=http://localhost:5520 node scripts/login-e2e.mjs
 *
 * Precisa: um `next dev` com o login LIGADO (as três variáveis do Supabase, de
 * `.env.development.local`), um Chrome (ou `CHROME_PATH`) e as mesmas
 * variáveis neste processo (o script lê `.env.development.local` sozinho).
 *
 * Cria um usuário TEMPORÁRIO (`E2E_EMAIL`, ou `etemas-e2e-<aleatório>@example.com`)
 * com senha aleatória — e, se a tabela `contas` existe, a linha dele como
 * convidado com UMA plataforma (Tray) —, e o APAGA no fim, com a linha, passe
 * ou falhe. Nunca toca em outra conta.
 *
 * O que prova:
 *   - sem sessão, /gerador → /login?next=… e a API → 401;
 *   - senha errada não entra;
 *   - 1º login: tela de cadastro do app (QR + chave), código gerado aqui (RFC
 *     6238) confirma, a sessão vira aal2;
 *   - 2º login: tela do código (o app já cadastrado);
 *   - com a tabela: o convidado abre o editor só com a plataforma dele, e a
 *     API recusa outra plataforma (403) e o painel de contas (403); sem ela: a
 *     tela diz que falta a migração, e a API responde 401;
 *   - redefinir a senha pelo link (token_hash e fragmento), pedindo o código
 *     do app — sem mandar e-mail;
 *   - "Esqueci a senha" até o envio (com um e-mail que não existe: o Supabase
 *     não manda nada, e a tela é a mesma).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import { createClient } from "@supabase/supabase-js";
import { RAIZ, findChrome, relatorio, espera } from "./funil/lib/util.mjs";

const BASE = process.env.FUNIL_BASE_URL ?? "http://localhost:5520";

for (const arq of [".env.development.local", ".env.local"]) {
  const p = path.join(RAIZ, arq);
  if (!fs.existsSync(p)) continue;
  for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined)
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SECRETA = process.env.SUPABASE_SECRET_KEY;
if (!URL_SB || !PUBLICA || !SECRETA) {
  console.error("Faltam as variáveis do Supabase (ver .env.example).");
  process.exit(1);
}
const PROIBIDO = "acessos@seriea.digital";

const r = relatorio("Login do /gerador — Supabase + 2FA");
const admin = createClient(URL_SB, SECRETA, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── TOTP (RFC 6238: HMAC-SHA1, 30 s, 6 dígitos) ──────────────────────────────
function base32(s) {
  const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of s.replace(/=+$/, "").toUpperCase())
    bits += alfa.indexOf(c).toString(2).padStart(5, "0");
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8)
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}
function totp(segredo, passo = Math.floor(Date.now() / 30000)) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(passo));
  const h = crypto.createHmac("sha1", base32(segredo)).update(msg).digest();
  const o = h[h.length - 1] & 0xf;
  const n = (h.readUInt32BE(o) & 0x7fffffff) % 1e6;
  return String(n).padStart(6, "0");
}
let ultimoPasso = 0;
/** Um código de um passo de 30 s ainda não usado (o Supabase recusa repetir). */
async function codigoNovo(segredo) {
  while (Math.floor(Date.now() / 30000) <= ultimoPasso) await espera(1000);
  ultimoPasso = Math.floor(Date.now() / 30000);
  return totp(segredo, ultimoPasso);
}

// ── usuário temporário ───────────────────────────────────────────────────────
const email =
  process.env.E2E_EMAIL ??
  `etemas-e2e-${crypto.randomBytes(4).toString("hex")}@example.com`;
if (email.toLowerCase() === PROIBIDO) {
  console.error("Este script nunca usa a conta da agência.");
  process.exit(1);
}
const senha = crypto.randomBytes(18).toString("base64url");
const senhaNova = crypto.randomBytes(18).toString("base64url");

const tabela = await admin
  .from("contas")
  .select("user_id")
  .limit(1);
const temTabela = !tabela.error;
console.log(`  tabela contas: ${temTabela ? "existe" : tabela.error.code}`);

const criado = await admin.auth.admin.createUser({
  email,
  password: senha,
  email_confirm: true,
});
if (criado.error) {
  console.error("Não consegui criar o usuário de teste:", criado.error.message);
  process.exit(1);
}
const userId = criado.data.user.id;
if (temTabela) {
  const ins = await admin
    .from("contas")
    .insert({ user_id: userId, papel: "convidado", plataformas: ["Tray"] });
  r.ok("linha de convidado criada (Tray)", !ins.error, ins.error?.message);
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--no-sandbox"],
});
let segredo = "";

try {
  const aba = await browser.newPage();
  const ir = (u, opts = {}) =>
    aba.goto(`${BASE}${u}`, { waitUntil: "networkidle2", timeout: 90000, ...opts });
  const caminho = () => new URL(aba.url()).pathname;
  const tem = sel => aba.$(sel).then(Boolean);
  const texto = () =>
    aba
      .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 240))
      .catch(() => "");
  const api = (u, init = {}) =>
    aba.evaluate(
      async (u, init) => {
        const res = await fetch(u, init);
        return res.status;
      },
      u,
      init
    );

  // 1. sem sessão
  await ir("/gerador");
  r.ok(
    "sem sessão, /gerador leva ao /login com next",
    caminho() === "/login" && new URL(aba.url()).searchParams.get("next") === "/gerador",
    aba.url()
  );
  r.ok("sem sessão, a API do editor responde 401", (await api("/gerador/api/temas")) === 401);
  r.ok('o /login tem o "Esqueci a senha"', await tem("[data-login-esqueci]"));

  const entrarComSenha = async s => {
    await ir("/login?next=/gerador");
    await aba.type("#email", email);
    await aba.type("#senha", s);
    await Promise.all([
      aba.waitForNavigation({ waitUntil: "networkidle2", timeout: 90000 }),
      aba.click("[data-login-form] button[type=submit]"),
    ]);
  };
  /**
   * Espera a URL parar de mudar: o código entra por fetch + location.assign, e
   * o layout do editor pode redirecionar de novo no cliente (redirect() de
   * layout em renderização dinâmica).
   */
  const assentar = async () => {
    let antes = "";
    for (let i = 0; i < 40 && antes !== aba.url(); i++) {
      antes = aba.url();
      await espera(2000);
    }
    await aba.waitForSelector("body", { timeout: 30000 });
  };
  const mandarCodigo = async codigo => {
    await aba.type("#codigo", codigo);
    await aba.click("[data-login-codigo] button[type=submit]");
    await aba.waitForFunction(u => location.href !== u, { timeout: 90000 }, aba.url()).catch(() => null);
    await assentar();
  };

  // 2. senha errada
  await entrarComSenha("senha-errada-123");
  r.ok(
    "senha errada não entra (erro de credenciais)",
    await tem('[data-login-erro="credenciais"]')
  );

  // 3. primeiro login: cadastro do app
  await entrarComSenha(senha);
  r.ok("senha certa sem app leva ao cadastro do 2FA", await tem('[data-login-etapa="cadastro-2fa"]'));
  r.ok("o cadastro mostra o QR code", await tem("[data-login-qr]"));
  segredo = (await aba.$eval("[data-login-segredo]", e => e.textContent.trim())) ?? "";
  r.ok("o cadastro mostra a chave", /^[A-Z2-7]{16,}$/.test(segredo), segredo ? "(chave lida)" : "vazia");
  r.ok("aal1 ainda não abre o editor (API 401)", (await api("/gerador/api/temas")) === 401);

  // código errado não confirma (sem recarregar: o QR fica)
  await aba.type("#codigo", "000000");
  await aba.click("[data-login-codigo] button[type=submit]");
  await aba.waitForSelector('[data-login-codigo] [data-login-erro="codigo"]', { timeout: 30000 }).catch(() => null);
  r.ok(
    "código errado mostra o erro sem trocar o QR",
    (await tem('[data-login-erro="codigo"]')) &&
      (await aba.$eval("[data-login-segredo]", e => e.textContent.trim())) === segredo
  );
  await aba.$eval("#codigo", e => (e.value = ""));
  await mandarCodigo(await codigoNovo(segredo));

  const conferirDepoisDoCodigo = async quando => {
    if (temTabela) {
      r.ok(`${quando}: o convidado chega ao editor`, caminho() === "/gerador", `${aba.url()} | ${await texto()}`);
      await aba.waitForSelector("[data-rail-target]", { timeout: 60000 }).catch(() => null);
      await aba
        .waitForFunction(() => sessionStorage.getItem("layoutPlatform"), { timeout: 60000 })
        .catch(() => null);
      const plataforma = await aba.evaluate(() => sessionStorage.getItem("layoutPlatform"));
      r.ok(`${quando}: o editor abre na plataforma da conta (Tray)`, /Tray/.test(plataforma ?? ""), String(plataforma));
      const estado = await aba.evaluate(() => fetch("/api/auth/estado").then(x => x.json()));
      r.ok(
        `${quando}: a conta só tem Tray`,
        estado.conta?.papel === "convidado" && JSON.stringify(estado.conta?.plataformas) === '["Tray"]',
        JSON.stringify(estado.conta)
      );
      r.ok(`${quando}: o painel de contas recusa o convidado (403)`, (await api("/gerador/api/contas")) === 403);
      const s403 = await api("/gerador/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "VTEX", selections: [], colors: {}, fonts: {} }),
      });
      r.ok(`${quando}: preview de outra plataforma (VTEX) responde 403`, s403 === 403, String(s403));
      r.ok(`${quando}: a API do editor responde 200`, (await api("/gerador/api/temas")) === 200);
    } else {
      r.ok(
        `${quando}: sem a tabela contas, a tela diz que falta a migração`,
        await tem('[data-login-bloqueio="sem-tabela"]'),
        `${aba.url()} | ${await texto()}`
      );
      r.ok(`${quando}: sem a tabela, a API do editor responde 401`, (await api("/gerador/api/temas")) === 401);
      await ir("/gerador");
      r.ok(`${quando}: sem a tabela, /gerador volta ao /login`, caminho() === "/login", aba.url());
    }
  };
  await conferirDepoisDoCodigo("1º login");

  // 4. sair e entrar de novo: agora é a tela do código
  await aba.goto(`${BASE}/login`, { waitUntil: "networkidle2" });
  await aba.evaluate(() => fetch("/api/auth/logout", { method: "POST" }));
  await entrarComSenha(senha);
  r.ok("2º login: senha certa leva à tela do código", await tem('[data-login-etapa="codigo"]'));
  await mandarCodigo(await codigoNovo(segredo));
  await conferirDepoisDoCodigo("2º login");

  // 5. redefinir a senha pelo link do e-mail, sem e-mail: token_hash…
  await aba.evaluate(() => fetch("/api/auth/logout", { method: "POST" }));
  const link = await admin.auth.admin.generateLink({ type: "recovery", email });
  r.ok("link de redefinição gerado (sem e-mail)", !link.error, link.error?.message);
  await ir(
    `/auth/callback?token_hash=${link.data.properties.hashed_token}&type=recovery&next=/auth/nova-senha`
  );
  r.ok("token_hash abre a tela da senha nova", caminho() === "/auth/nova-senha" && (await tem('[data-senha-form="nova"]')), aba.url());
  r.ok("quem tem o app digita também o código", await tem("[data-senha-form] #codigo"));
  await aba.type("#senha", senhaNova);
  await aba.type("#confirmacao", senhaNova);
  await aba.type("#codigo", await codigoNovo(segredo));
  await Promise.all([
    aba.waitForNavigation({ waitUntil: "networkidle2", timeout: 90000 }),
    aba.click("[data-senha-form] button[type=submit]"),
  ]);
  await assentar();
  const depois = caminho();
  r.ok(
    "senha nova salva (com o código) e leva adiante",
    temTabela ? depois === "/gerador" : await tem('[data-login-bloqueio="sem-tabela"]'),
    `${aba.url()} | ${await texto()}`
  );
  const comNova = await createClient(URL_SB, PUBLICA, { auth: { persistSession: false } }).auth.signInWithPassword({
    email,
    password: senhaNova,
  });
  r.ok("a senha nova vale no Supabase", !comNova.error, comNova.error?.message);

  // …e o fragmento (#access_token, o formato do convite do painel)
  await aba.evaluate(() => fetch("/api/auth/logout", { method: "POST" }));
  const link2 = await admin.auth.admin.generateLink({ type: "recovery", email });
  const verifica = await fetch(link2.data.properties.action_link, { redirect: "manual" });
  const destino = verifica.headers.get("location") ?? "";
  const frag = destino.includes("#") ? destino.slice(destino.indexOf("#")) : "";
  r.ok("o link do Supabase devolve a sessão no fragmento", /access_token=/.test(frag), destino.replace(/#.*/, "#…"));
  await ir(`/auth/callback?next=/auth/nova-senha${frag}`);
  await aba.waitForFunction(() => location.pathname !== "/auth/confirmar", { timeout: 30000 }).catch(() => null);
  await aba.waitForSelector("[data-senha-form]", { timeout: 30000 }).catch(() => null);
  r.ok("o fragmento passa por /auth/confirmar e abre a senha nova", caminho() === "/auth/nova-senha", aba.url());
  r.ok("o token não fica na barra de endereço", !/access_token/.test(aba.url()));

  // 6. link inválido / sem sessão
  await aba.evaluate(() => fetch("/api/auth/logout", { method: "POST" }));
  await ir("/auth/callback?code=invalido&next=/auth/nova-senha");
  r.ok("código de link inválido cai no 'esqueci' com erro", caminho() === "/auth/esqueci" && (await tem('[data-esqueci-erro="link"]')), aba.url());
  await ir("/auth/nova-senha");
  r.ok("senha nova sem sessão diz que o link venceu", await tem("[data-senha-sem-sessao]"));

  // 7. esqueci a senha (e-mail inexistente: nada sai, a tela é a mesma)
  await ir("/login");
  const hrefEsqueci = await aba.$eval("[data-login-esqueci]", a => a.getAttribute("href")).catch(() => null);
  r.ok("o link do /login leva a /auth/esqueci", hrefEsqueci === "/auth/esqueci", String(hrefEsqueci));
  await ir("/auth/esqueci");
  await aba.waitForSelector("[data-esqueci-form] #email", { timeout: 30000 });
  await aba.type("#email", `ninguem-${crypto.randomBytes(3).toString("hex")}@example.com`);
  await Promise.all([
    aba.waitForNavigation({ waitUntil: "networkidle2", timeout: 90000 }),
    aba.click("[data-esqueci-form] button[type=submit]"),
  ]);
  r.ok("'esqueci a senha' confirma com a mensagem genérica", await tem("[data-esqueci-enviado]"), aba.url());

  // 8. sessão de outro site não entra pelo /api/auth/sessao
  const csrf = await fetch(`${BASE}/api/auth/sessao`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://outro.site" },
    body: JSON.stringify({ access_token: "x", refresh_token: "y" }),
  });
  r.ok("/api/auth/sessao recusa outra origem (403)", csrf.status === 403, String(csrf.status));
} catch (e) {
  r.ok("o roteiro rodou até o fim", false, String(e?.stack ?? e));
} finally {
  await browser.close().catch(() => {});
  const apagado = await admin.auth.admin.deleteUser(userId);
  r.ok("usuário de teste apagado", !apagado.error, apagado.error?.message);
  if (temTabela) {
    const sobra = await admin.from("contas").select("user_id").eq("user_id", userId);
    r.ok("linha de teste apagada (cascade)", !sobra.error && sobra.data.length === 0);
  }
}

process.exit(r.fechar() ? 0 : 1);
