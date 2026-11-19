# Redesign Visual "Bordô & Dourado" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a identidade visual do Luluzinha para a paleta Bordô & Dourado (Cormorant Garamond + Manrope), refazer a home com o card completo e a contagem de dias, reorganizar a navegação (Lulus, Agenda, Galeria, Histórico, Mais) e corrigir os bugs visuais encontrados.

**Architecture:** O tema muda via variáveis CSS em `app/globals.css` + `tailwind.config.ts`, então a maioria das telas herda o visual novo sem mudar a estrutura. A lógica de datas ganha um helper puro (`getDaysUntilBirthday`), usado pela home, pela ordenação "Próximas" e pela Agenda. A navegação passa a ter duas listas em `lib/nav-config.ts`: uma para o desktop e outra para o celular, onde a "Mais" abre um `GenericBottomSheet`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 3.4, Radix/shadcn, `vaul`, `next/font/google`, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-redesign-visual-bordo-dourado-design.md`

## Global Constraints

- Somente UI: não muda regras de negócio, Firestore, permissões nem o fluxo do sorteio.
- Rótulo exato: **"Responsável pela vaquinha"**. Quando não há responsável: **"Não participa da vaquinha este ano"**.
- Selos da home: **"Somos {N} Lulus"** e **"{M} na vaquinha em {CURRENT_YEAR}"** (`CURRENT_YEAR` de `lib/constants.ts`).
- Nenhuma informação sai dos cards: foto, nome, data, signo (com link), Instagram (com link), responsável, "Ver mais informações" (WhatsApp, PIX, QR Code) e o ícone de editar para admin.
- Paleta de referência (ajustável para contraste AA): vinho `#7A1F35`, dourado `#C9A24A`, dourado texto `#A88437`, marfim `#F8F4EC`, borda `#E7DCC8`, marfim quente `#F8F1E4`, fundo escuro `#1E1416`.
- Fontes: Cormorant Garamond (títulos, nomes, números de destaque, pesos 600/700) e Manrope (texto e UI), ambas via `next/font/google`. Sai a Inter.
- Mantém o nome "Luluzinha" e a personagem `public/luluzinha_no_background.png`.
- Mobile-first, área de toque ≥ 44px, contraste WCAG AA no claro e no escuro, `prefers-reduced-motion` respeitado.
- Convenções do `CLAUDE.md`: arrow functions, sem comentários, kebab-case, `cn()`, imports `@/`, `*.spec.tsx` colocalizado, yarn.
- Cada commit precisa passar `yarn lint && yarn typecheck && yarn test`.

## Review Focus

1. **Aniversário hoje:** no dia do aniversário, a contagem deve dar `0` e o card mostrar "Hoje!", e não 365. Testado na Task 2 e na Task 5.
2. **Fuso horário:** `person.date` vem de strings como `'1980-01-10'` (meia-noite UTC). No Brasil (UTC−3), `getDate()` local devolve 9. A contagem e a ordenação devem usar dia e mês em UTC, como o `formatDate` já compensa. Testado na Task 2.
3. **29 de fevereiro em ano não bissexto:** não pode quebrar nem dar `NaN`. Conta até 1º de março. Testado na Task 2.
4. **Filtro que esconde a próxima aniversariante:** o destaque some junto e a lista mostra só o resultado filtrado, sem duplicar. Testado na Task 5.
5. **Participante sem foto no destaque:** o bloco de foto grande mostra um fallback com a inicial, sem imagem quebrada. Testado na Task 5.

---

### Task 1: Tokens de tema, fontes e sombras

**Files:**
- Modify: `app/globals.css` (variáveis `:root` e `.dark`, `.lulu-card`, `.lulu-header`, `.lulu-button`, `font-family` de `body`/`h1–h6`)
- Modify: `tailwind.config.ts` (`fontFamily`, `boxShadow`, cores novas)
- Modify: `app/layout.tsx` (troca a Inter por Cormorant Garamond + Manrope)

**Interfaces:**
- Produces:
  - Variáveis CSS `--primary` (vinho), `--accent` (dourado `#C9A24A`), `--gold-foreground` (dourado texto `#A88437`), `--surface-warm` (`#F8F1E4`), mais as existentes redefinidas. Tudo também no `.dark`.
  - Utilitários Tailwind `font-serif` (Cormorant, via `var(--font-cormorant)`), `font-sans` (Manrope, via `var(--font-manrope)`), cores `gold` (`var(--gold-foreground)`) e `surface-warm`.
  - `shadow-lulu-sm|md|lg` redefinidas como sombras suaves e difusas (o nome é mantido).
  - `.lulu-header` passa a usar `font-serif`, sem `text-shadow`.

- [ ] **Step 1:** Em `app/layout.tsx`, troque `Inter` por `Cormorant_Garamond({ subsets: ['latin'], weight: ['600','700'], variable: '--font-cormorant', display: 'swap' })` e `Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })`, e aplique as duas `variable` no `<html>`.
- [ ] **Step 2:** Redefina as variáveis em `globals.css`.
  - **Claro:** background `#F8F4EC`, card `#FFFFFF`, foreground `#2A1A1F`, primary `#7A1F35`, primary-foreground `#F3E3C0`, accent `#C9A24A`, muted `#F3ECE0`, muted-foreground `#5E5050`, border/input `#E7DCC8`, ring `#7A1F35`.
  - **Escuro:** background `#1E1416`, card `#2A1C1F`, foreground `#F3EADB`, primary `#E08A9B`, accent `#D4B160`, border `#4A3438`.
  - `destructive` deixa de ser igual ao primary: use um vermelho próprio, por exemplo `#B42318`.
- [ ] **Step 3:** No `tailwind.config.ts`, adicione `fontFamily.serif`/`sans` e as cores `gold`/`surface-warm`. Troque as `shadow-lulu-*` por sombras difusas, por exemplo `0 2px 14px rgba(42,26,31,.06)`, `0 6px 24px rgba(42,26,31,.08)` e `0 12px 40px rgba(42,26,31,.10)`.
- [ ] **Step 4:** Rode `yarn typecheck && yarn test`. Esperado: PASS. Se algum teste depender da Inter ou de `--font-inter`, atualize o teste.
- [ ] **Step 5:** Rode `yarn dev` e abra `http://localhost:3001/` em 390px, no claro e no escuro. Esperado: fundo marfim, nomes em Cormorant e nenhum texto ilegível.
- [ ] **Step 6:** Commit: `style: aplica paleta bordô & dourado e fontes Cormorant/Manrope`.

### Task 2: Helper de contagem de dias e ordenação "Próximas"

**Files:**
- Modify: `components/lulus/utils.ts`
- Test: `components/lulus/utils.spec.ts`

**Interfaces:**
- Produces:
  - `getDaysUntilBirthday(date: Date | string, today?: Date): number`. Usa dia e mês em **UTC** de `date`, compara com a data local de `today` (padrão `new Date()`) zerada à meia-noite, devolve `0` no dia e nunca devolve negativo. Para 29/02 em ano não bissexto, o `Date` rola para 1º/03.
  - `getNextBirthday(participants: Person[], today?: Date): Person | null`, reescrita sobre `getDaysUntilBirthday` (menor contagem; empate pelo nome).
  - `filteredAndSortedParticipantsV2(..., sortBy, assignmentsMap?, today?: Date)` aceita `sortBy === 'upcoming'` (crescente por `getDaysUntilBirthday`). `'date'` continua sendo a ordem de calendário e `'name'` continua igual.
  - `SORT_UPCOMING = 'upcoming'` exportado.

- [ ] **Step 1: Escreva os testes que falham**

```ts
describe('getDaysUntilBirthday', () => {
  const today = new Date(2026, 10, 18, 15, 30);
  it('conta dias até a data no ano corrente', () => {
    expect(getDaysUntilBirthday('1980-11-27', today)).toBe(9);
  });
  it('vira o ano quando a data já passou', () => {
    expect(getDaysUntilBirthday('1980-01-10', today)).toBe(53);
  });
  it('retorna 0 no dia do aniversário', () => {
    expect(getDaysUntilBirthday('1980-11-18', today)).toBe(0);
  });
  it('usa dia/mês UTC da data salva', () => {
    expect(getDaysUntilBirthday(new Date('1980-11-19'), today)).toBe(1);
  });
  it('29/02 em ano não bissexto conta até 01/03', () => {
    expect(getDaysUntilBirthday('1980-02-29', new Date(2027, 1, 27))).toBe(2);
  });
});

it('ordena por próximas a partir de hoje com sortBy "upcoming"', () => {
  const result = filteredAndSortedParticipantsV2(mockParticipants, '', 'all', 'upcoming', undefined, new Date(2026, 10, 18));
  expect(result.map((p) => getDaysUntilBirthday(p.date, new Date(2026, 10, 18)))).toEqual(
    [...result.map((p) => getDaysUntilBirthday(p.date, new Date(2026, 10, 18)))].sort((a, b) => a - b)
  );
});

it('getNextBirthday devolve quem faz aniversário hoje', () => {
  const people = [{ ...base, id: 1, name: 'A', date: '1980-11-18' }, { ...base, id: 2, name: 'B', date: '1980-11-20' }];
  expect(getNextBirthday(people, new Date(2026, 10, 18, 20))?.id).toBe(1);
});
```

- [ ] **Step 2:** Rode `yarn test components/lulus/utils.spec.ts`. Esperado: FAIL (`getDaysUntilBirthday` não existe).
- [ ] **Step 3:** Implemente `getDaysUntilBirthday`, reescreva `getNextBirthday` e acrescente o caso `'upcoming'` (e o parâmetro `today`) em `filteredAndSortedParticipantsV2`. Remova o cálculo duplicado de dias em `lulus-interactive.tsx` só na Task 5.
- [ ] **Step 4:** Rode `yarn test components/lulus/utils.spec.ts`. Esperado: PASS, incluindo os testes antigos de `getNextBirthday` (ajuste os que dependiam do bug de fuso).
- [ ] **Step 5:** Commit: `feat: adiciona contagem de dias e ordenação por próximas`.

### Task 3: Navegação — Lulus, Agenda, Galeria, Histórico, Mais

**Files:**
- Modify: `lib/nav-config.ts` (+ `lib/nav-config.spec.ts`, se existir; senão crie)
- Modify: `components/layout/footer.tsx` + `components/layout/footer.spec.tsx`
- Create: `components/layout/more-menu-sheet.tsx` + `more-menu-sheet.spec.tsx`
- Modify: `components/layout/navigation-bar/navbar.tsx` + `navbar.spec.tsx` (remove `shortLabel`, mostra Sorteio para admin)

**Interfaces:**
- Consumes: `GenericBottomSheet` (`components/dialog/bottom-sheet.tsx`), `useUserVerification` (`hooks/user-verify.ts`).
- Produces:
  - `NavItem` = `{ href: string; label: string; icon: ComponentType<...>; adminOnly?: boolean }` (sem `shortLabel`).
  - `NAV_ITEMS: NavItem[]` para o desktop, nesta ordem: Lulus `/`, Agenda `/dashboard`, Galeria `/galeria`, Histórico `/historico`, Auditoria `/auditoria`, Sobre `/sobre`, Sorteio `/sorteio` (`adminOnly`).
  - `MOBILE_PRIMARY_NAV: NavItem[]` = Lulus, Agenda, Galeria, Histórico.
  - `MORE_NAV_ITEMS: NavItem[]` = Auditoria, Sobre, Sorteio (`adminOnly`).
  - `filterNavByRole(items: NavItem[], isAdmin: boolean): NavItem[]`.
  - `MoreMenuSheet({ open, onOpenChange, isAdmin }: { open: boolean; onOpenChange: (o: boolean) => void; isAdmin: boolean })`: lista os links de `MORE_NAV_ITEMS` filtrados pelo papel e fecha ao clicar.

- [ ] **Step 1: Escreva os testes que falham**
  - `nav-config.spec.ts`:
    - `MOBILE_PRIMARY_NAV.map(i => i.label)` é `['Lulus','Agenda','Galeria','Histórico']`;
    - `filterNavByRole(MORE_NAV_ITEMS, false).map(i => i.label)` é `['Auditoria','Sobre']`;
    - com `true`, termina em `'Sorteio'`;
    - nenhum item tem `shortLabel`.
  - `footer.spec.tsx`:
    - renderiza 4 links e um botão com nome acessível `"Mais"`;
    - clicar em "Mais" abre o sheet com o título `"Mais"` e os links Auditoria e Sobre;
    - com `isAdmin` mockado `true`, mostra também Sorteio;
    - o botão "Mais" fica com `text-primary` quando `pathname` é `/sobre`, `/auditoria` ou `/sorteio`.
  - `navbar.spec.tsx`:
    - com admin, o desktop mostra o link "Sorteio";
    - sem admin, não mostra;
    - nenhum rótulo abreviado ("Particip.", "Dash.", "Hist.", "Audit.") aparece.
- [ ] **Step 2:** Rode `yarn test lib/nav-config components/layout`. Esperado: FAIL.
- [ ] **Step 3:** Implemente a configuração, o `MoreMenuSheet` (título "Mais", itens com ícone e rótulo, `min-h-[44px]`) e o botão "Mais" no footer (ícone `Ellipsis` ou `Menu` do lucide), e ajuste o navbar.
- [ ] **Step 4:** Rode os mesmos testes. Esperado: PASS. Depois rode `yarn test`. Esperado: PASS.
- [ ] **Step 5:** Commit: `feat: reorganiza navegação com Agenda e menu Mais`.

### Task 4: Agenda (antigo Dashboard)

**Files:**
- Modify: `components/modules/dashboard/index.tsx` (+ spec)
- Modify: `components/modules/dashboard/birthday-calendar.tsx` (+ spec), que vira "O ano das Lulus"
- Modify: `app/dashboard/layout.tsx` (metadata)
- Modify: `components/lulus/utils.ts` + spec (helper de agrupamento)

**Interfaces:**
- Consumes: `getDaysUntilBirthday` (Task 2), `getParticipantPhotoUrl` (`components/lulus/utils.ts`).
- Produces: `groupBirthdaysByMonthFrom(participants: Person[], today?: Date): Array<{ monthIndex: number; label: string; isCurrent: boolean; people: Array<{ person: Person; day: number }> }>`. Começa no mês de `today`, percorre 12 meses, omite meses vazios, ordena as pessoas por dia (UTC) e usa `label` de `meses` (por exemplo, "Novembro").

- [ ] **Step 1: Escreva os testes que falham**
  - `groupBirthdaysByMonthFrom(mockParticipants, new Date(2026, 10, 18))[0].monthIndex === 10` e `isCurrent === true`.
  - O primeiro grupo de janeiro vem depois de dezembro.
  - Nenhum grupo tem `people.length === 0`.
  - `'1980-01-10'` gera `day === 10`.
  - Dashboard: o heading `"Agenda das Lulus"` aparece; "Aniversários por mês" e "Distribuição por Signo" continuam presentes; cada pessoa do calendário mostra foto (`img` com `alt` = nome) e dia.
- [ ] **Step 2:** Rode `yarn test components/modules/dashboard components/lulus/utils.spec.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implemente o helper e refaça o `BirthdayCalendar`: coluna do mês em Cormorant vinho, com "AGORA" dourado no mês atual, e um card branco com chips de avatar, dia em Cormorant e nome. Troque o título para "Agenda das Lulus", mude a descrição para "Os aniversários do ano, a partir de agora, e os signos das Lulus." e a metadata para `title: 'Agenda | Luluzinha'`. Restilize os outros dois cards com os tokens novos, sem remover nada.
- [ ] **Step 4:** Rode os mesmos testes. Esperado: PASS.
- [ ] **Step 5:** Commit: `feat: transforma dashboard na Agenda das Lulus`.

### Task 5: Home — card completo, destaque com foto grande e contagem de dias

**Files:**
- Modify: `components/lulus/lulus-interactive.tsx` (+ spec)
- Modify: `components/lulus/lulu-card/lulu-card-home.tsx` (+ spec)
- Modify: `components/lulus/lulu-card/next-birthday-banner.tsx` (+ spec), que vira o selo sobre a foto
- Modify: `components/lulus/lulu-card/responsable-gift.tsx` (+ spec)
- Modify: `components/lulus/badge-lulu.tsx`, `components/lulus/badge-lulu-participants.tsx` (+ specs)
- Modify: `components/lulus/filter/filter.tsx`, `components/lulus/filter/filter-component.tsx` (+ specs)
- Modify: `app/page.tsx`, se o cabeçalho da home estiver lá (sobretítulo "{MÊS} · {ANO}" + "Nossa roda de amigas" + a frase atual)

**Interfaces:**
- Consumes: `getDaysUntilBirthday`, `getNextBirthday`, `SORT_UPCOMING` (Task 2).
- Produces:
  - `LulusCardHome` com props `{ participant; participants; user: boolean; daysUntil: number; variant?: 'default' | 'featured' }`. `showDetails` e `isNextBirthday` são removidos: o card sempre mostra tudo. `featured` = foto grande no topo.

- [ ] **Step 1: Escreva os testes que falham** (use `vi.setSystemTime(new Date(2026, 10, 18, 12))`)
  - `LulusCardHome` com `variant="featured"`:
    - mostra o texto "Próxima aniversariante · faltam 9 dias" para `daysUntil={9}`;
    - mostra "Próxima aniversariante · é hoje!" para `daysUntil={0}`;
    - mostra "Responsável pela vaquinha" e "Ver mais informações".
  - `LulusCardHome` sem foto em `featured`: não há `img` quebrada, e a inicial do nome aparece no bloco da foto.
  - `LulusCardHome` default:
    - mostra `"53"` e `"dias"` para `daysUntil={53}`;
    - mostra "Hoje!" para `0`;
    - mostra o link do Instagram e o acordeão "Ver mais informações".
  - `ResponsableGift` sem responsável: texto exato "Não participa da vaquinha este ano".
  - `LulusInteractive`:
    - a próxima aniversariante aparece **uma vez** (`getAllByRole('heading', { name: 'Aline' })` tem tamanho 1);
    - com `filterMonth` que a exclui, o destaque não renderiza;
    - a ordem padrão é por próximas;
    - os selos mostram `"Somos 19 Lulus"` e `` `17 na vaquinha em ${CURRENT_YEAR}` ``.
  - `Filter`: a opção "Próximas" existe e é a padrão; "Limpar filtros" volta para `'upcoming'`; o contador de filtros ativos não conta `'upcoming'`.
- [ ] **Step 2:** Rode `yarn test components/lulus`. Esperado: FAIL.
- [ ] **Step 3:** Implemente seguindo `home-cards-v6.html`:
  - **Destaque:** foto `next/image` com largura total, ~210px de altura e gradiente vinho escuro embaixo. Sobre a foto, o selo vinho com texto marfim, o nome em `font-serif` ~28px e a linha data · signo · Instagram.
  - **Card comum:** avatar de 62px com aro `accent`, nome em `font-serif` vinho ~24px, metadados em 13–14px e, no canto direito, o número em `font-serif` com "DIAS" em dourado.
  - **Bloco do responsável:** fundo `surface-warm`, rótulo em caixa alta dourada e nome em `font-serif`.
  - **Acordeão:** WhatsApp e Copiar PIX lado a lado, com o QR Code abaixo.
  - **Selos:** pílulas brancas com borda.
  - Na lista, exclua a pessoa que está no destaque. Mantenha o botão de Sorteio para admin.
- [ ] **Step 4:** Rode `yarn test components/lulus`. Esperado: PASS. Depois rode `yarn test`. Esperado: PASS.
- [ ] **Step 5:** Abra a home em 390px no claro e no escuro e compare com `.superpowers/brainstorm/1490-1795007905/content/home-cards-v6.html`.
- [ ] **Step 6:** Commit: `feat: nova home com destaque, contagem de dias e card completo`.

### Task 6: Estrutura compartilhada — cabeçalho, marca, layout, contador de acessos e banner PWA

**Files:**
- Modify: `components/layout/header.tsx` (+ spec): prop opcional `eyebrow?: string`, título em `font-serif` ~30px
- Modify: `components/layout/page-layout.tsx`: fundo `bg-background` (sai o `bg-muted/40`)
- Modify: `components/layout/navigation-bar/navbar-brand.tsx` (+ spec): "Luluzinha" em `font-serif` vinho, sem o ano no celular (o ano continua no desktop)
- Modify: `app/layout.tsx` + `components/layout/visit-counter.tsx`: o contador sai do `fixed` e vira texto estático centralizado no fim do `<main>`, acima da navegação inferior
- Modify: `components/layout/pwa-install-manager.tsx` (+ spec): paleta nova; no celular, posicionado acima da barra inferior (`bottom-20`), sem cobrir o card de destaque na primeira dobra

**Interfaces:**
- Produces: `Header({ title, description, eyebrow }: { title: string; description?: string; eyebrow?: string })`.

- [ ] **Step 1:** Escreva os testes que falham:
  - `Header` com `eyebrow="NOVEMBRO · 2026"` renderiza esse texto antes do `h1`;
  - o `VisitCounter` não tem classe `fixed` no wrapper do layout (teste no componente wrapper, se houver; senão, valide no Step 4);
  - no `NavbarBrand`, o texto "Luluzinha" está presente.
- [ ] **Step 2:** Rode os testes. Esperado: FAIL.
- [ ] **Step 3:** Implemente.
- [ ] **Step 4:** Rode `yarn test`. Esperado: PASS. No navegador em 390px, role até o fim da home: o contador aparece abaixo do último card e não sobrepõe nada.
- [ ] **Step 5:** Commit: `style: restiliza estrutura compartilhada e tira contador fixo`.

### Task 7: Galeria e Histórico (com correção de bugs)

**Files:**
- Modify: `components/galeria/galeria-fotos-dynamic.tsx`: `loading` do `dynamic` renderiza o mesmo skeleton de `app/galeria/loading.tsx` (extraia o skeleton para `components/galeria/galeria-skeleton.tsx` + spec, se ele ainda não existir como componente)
- Modify: `components/galeria/*` (restilização: tiles com `rounded-2xl`, overlay de curtidas/comentários na paleta e modal com títulos em serif)
- Modify: `components/historico/*`, `app/historico/loading.tsx`: timeline com marcador dourado e linhas "Aniversariante ← Responsável" em cards marfim
- Investigar e corrigir a rolagem horizontal no Histórico em 390px (inclusive no estado de loading, onde o skeleton passa da largura)

- [ ] **Step 1:** Escreva o teste que falha: `galeria-fotos-dynamic.spec.tsx` renderiza o skeleton (`getAllByTestId('skeleton-item').length > 0`) enquanto o import não resolve.
- [ ] **Step 2:** Rode `yarn test components/galeria`. Esperado: FAIL.
- [ ] **Step 3:** Implemente o loading e restilize Galeria e Histórico.
- [ ] **Step 4:** Rode `yarn test components/galeria components/historico`. Esperado: PASS.
- [ ] **Step 5:** No navegador em 390px, com `/historico` carregando e carregado, execute `document.documentElement.scrollWidth <= window.innerWidth`. Esperado: `true` nos dois estados. Em `/galeria`, a tela nunca aparece totalmente branca.
- [ ] **Step 6:** Commit: `style: restiliza galeria e histórico e corrige loading e overflow`.

### Task 8: Demais telas

**Files:**
- Modify (somente estilo/tokens): `components/lulus/form-edit-data/*` e `app/participantes/[id]/*` (perfil/edição), `components/sorteio/*`, `app/sobre/page.tsx`, `components/audit/**`, `components/modules/login/login.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/offline/page.tsx`, `components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `select.tsx`, `accordion.tsx`, `dialog.tsx` e `components/dialog/bottom-sheet.tsx`.

- [ ] **Step 1:** Ajuste as variantes do shadcn:
  - `Button` default = vinho com texto marfim, `rounded-full`;
  - `outline` = borda `border` com texto vinho;
  - `Badge` default = pílula vinho;
  - `Card` = branco, borda bege e `rounded-2xl`;
  - inputs com altura ≥ 44px e foco `ring-primary`.
- [ ] **Step 2:** Passe por cada tela da lista acima. Troque vermelhos fixos (`text-red-*`, `bg-red-*`, `#c62828` e semelhantes; confira com `rg -n "red-|#c62828|#ff6b6b" app components`) e o `font-bold text-primary` dos títulos por `Header`/`font-serif`.
- [ ] **Step 3:** Rode `yarn lint && yarn typecheck && yarn test`. Esperado: PASS. Atualize os testes que verificam classes antigas.
- [ ] **Step 4:** Commit: `style: aplica nova linguagem visual nas demais telas`.

### Task 9: Verificação final no app

- [ ] **Step 1:** Rode `yarn check && yarn build`. Esperado: tudo verde.
- [ ] **Step 2:** Com `yarn dev`, percorra em 390×844, no claro e no escuro: `/`, `/dashboard`, `/galeria`, `/historico`, `/participantes/<token>`, `/sorteio` (admin), `/sobre`, `/auditoria`, `/login`, uma rota inexistente (404) e `/offline`. Em cada uma, confira:
  - `scrollWidth <= innerWidth`;
  - nada fica escondido atrás da barra inferior;
  - nenhuma abreviação na navegação;
  - o texto pequeno continua legível.
- [ ] **Step 3:** Sobre o "espaço vazio" de cerca de 3.000px no fim da home: confirme rolando a página real (não a captura de página inteira). A captura pode mostrar áreas em branco por causa do `content-visibility:auto` nos cards. Se o vazio for real, corrija. Se for só da captura, registre isso no resumo da entrega.
- [ ] **Step 4:** Salve capturas de antes/depois em `.playwright-mcp/` para a autora revisar.
- [ ] **Step 5:** Commit final, se houver ajustes: `fix: ajustes da revisão visual`.
