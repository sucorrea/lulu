# Redesign visual "Bordô & Dourado" — Luluzinha

## Intenção

O Luluzinha é usado por um grupo de amigas de 40–50 anos, antenadas, que abrem o app principalmente para:

1. ver **quem é a próxima aniversariante**, e
2. ver **quem é a responsável pela vaquinha** dela.

O sentimento desejado é **acolhimento**: elas se veem e veem as amigas num lugar quente e familiar.

O app também é o **portfólio da autora**. Recrutadores devem perceber capricho visual, organização do código e uma ideia de produto bem pensada, inclusive o uso de IA no processo. Por isso o acabamento importa: bugs visuais pequenos contam contra.

Esta etapa é **somente UI**. Mudanças de funcionalidade, a presença da Auditoria no menu e a mistura de público na tela Sobre ficam para uma etapa posterior.

## Objetivos

- Trocar a identidade "vermelho em tudo" por uma paleta **Bordô & Dourado** elegante e acolhedora.
- Dar personalidade à tipografia e aumentar a legibilidade para o público 40–50.
- Dar mais protagonismo às fotos das amigas, principalmente à próxima aniversariante.
- Manter **todas** as informações que existem hoje em cada card de participante.
- Corrigir os bugs visuais encontrados na análise.
- Aplicar a mesma linguagem visual em todas as telas, em modo claro e escuro.

## Não-objetivos

- Alterar regras de negócio, coleções do Firestore, permissões ou fluxo do sorteio.
- Reorganizar o conteúdo de Auditoria e Sobre, ou decidir quem vê o quê (fica para a etapa de funcionalidades).
- Trocar o nome "Luluzinha" ou remover a personagem.
- Introduzir uma biblioteca nova de componentes. O projeto continua com Tailwind + Radix/shadcn (`components/ui`).

## Anti-objetivos (seria fracasso mesmo funcionando)

- Remover informação dos cards (Instagram, data, signo, "Ver mais informações" com WhatsApp/PIX/QR Code, responsável pela vaquinha). A autora foi explícita: essas informações são o motivo de abrir o app.
- Trocar o rótulo **"Responsável pela vaquinha"** por outra expressão (ex.: "Vaquinha com"). O termo é esse.
- Visual "frio", corporativo ou de painel de dados.
- Texto pequeno ou com baixo contraste.
- Regressões de layout no celular (rolagem lateral, sobreposição, áreas vazias).

## Restrições

- Mobile-first: estilos padrão para celular, `sm:/md:/lg:` só para ajustes. Área de toque ≥ 44px.
- Convenções do projeto (ver `CLAUDE.md`): arrow functions, sem comentários, kebab-case, `cn()`, tokens do tema em vez de valores arbitrários, `next/image`, testes Vitest colocalizados.
- Lint, typecheck, testes e build precisam passar (o hook pre-push do Husky exige isso).
- Cores definidas como variáveis CSS em `app/globals.css` e expostas no `tailwind.config.ts`, como já acontece hoje, para o modo escuro continuar funcionando por troca de variáveis.
- Contraste WCAG AA em texto (modo claro e escuro).

## Decisões da autora

### Identidade visual (opção "B · Bordô & Dourado" escolhida entre três)

- **Cor principal:** vinho/bordô, referência `#7A1F35`. Usado com moderação: nomes, títulos de seção, botão principal (ex.: Copiar PIX), item ativo da navegação.
- **Detalhe:** dourado, referência `#C9A24A` (aros das fotos, bordas de destaque), e um dourado mais escuro para textos pequenos sobre fundo claro, referência `#A88437` (rótulos em caixa alta, "dias").
- **Fundo:** marfim, referência `#F8F4EC`. Cards brancos com borda bege suave (referência `#E7DCC8`). Blocos secundários em marfim mais quente (referência `#F8F1E4`).
- **Tipografia:** títulos, nomes e números de destaque em **Cormorant Garamond** (peso 600–700). Texto corrido e interface em **Manrope**. Ambas via `next/font/google`, substituindo a Inter.
- **Mantém** o nome Luluzinha e a personagem (`public/luluzinha_no_background.png`) no cabeçalho.
- As sombras "cartoon" `shadow-lulu-*` (sombra dura deslocada) não combinam com a nova linguagem. O builder pode suavizá-las ou substituí-las, mantendo os nomes dos tokens se for mais simples.

Os hex são referências do mockup aprovado, não valores sagrados. O builder pode ajustar a tonalidade para bater contraste AA.

### Tela inicial (Participantes)

Validada em mockup. Do topo para baixo:

1. Cabeçalho com a personagem + "Luluzinha" em Cormorant, vinho.
2. Sobretítulo pequeno em caixa alta dourada com mês e ano (ex.: "NOVEMBRO · 2026"), título "Nossa roda de amigas" e a frase atual "Veja quem faz parte dessa rede de carinho e amizade."
3. Dois selos: **"Somos 19 Lulus"** e **"17 na vaquinha em {CURRENT_YEAR}"** (ano vindo de `CURRENT_YEAR` em `lib/constants.ts`; os números continuam dinâmicos como hoje).
4. **Card da próxima aniversariante**: o mesmo card completo das demais, mas com a **foto grande no topo** (largura total, ~210px de altura, gradiente escuro embaixo), com o selo "Próxima aniversariante · faltam N dias", o nome em Cormorant grande e a data, o signo e o Instagram sobre a foto. Abaixo da foto, o bloco de responsável pela vaquinha e o "Ver mais informações".
5. Filtros (como hoje, restilizados).
6. **Lista de cards**, cada um contendo, sem exceção:
   - foto redonda com aro dourado, nome (Cormorant, vinho), data, signo (com link de horóscopo como hoje) e Instagram (com link);
   - **contagem de dias** até o aniversário no canto superior direito (número em Cormorant + "DIAS");
   - bloco **"Responsável pela vaquinha"** com foto e nome da responsável. Quando não houver, o texto discreto "Não participa da vaquinha este ano";
   - **"Ver mais informações"** (acordeão), que abre os botões **WhatsApp** e **Copiar PIX** e o **QR Code PIX**, como hoje;
   - o ícone de editar para usuário logado, como hoje.
7. **Ordenação padrão:** pela próxima data de aniversário a partir de hoje, coerente com a contagem de dias. As outras opções de ordenação/filtro existentes continuam disponíveis.

### Demais telas

A autora pediu para aplicar a mesma linguagem em Agenda (Dashboard), Galeria, Histórico, perfil/edição da participante, Sorteio, Sobre, Auditoria, Login, telas de erro/offline/404 e modo escuro **sem mockup prévio**. Ela revisará direto no app.

### Correções de bugs visuais incluídas no escopo

- Home com cerca de 3.000px de área vazia no fim da página (provável altura da lista virtualizada).
- Histórico com rolagem horizontal no celular.
- Contador de acessos (`VisitCounter`, fixo no canto) sobrepondo cards.
- Galeria renderizando branco antes do skeleton/conteúdo aparecer.
- Abreviações na barra de navegação inferior ("Particip.", "Dash.", "Hist.", "Audit.").

### Navegação (aprovada pela autora para esta etapa)

- **Navegação inferior no celular:** 5 itens com rótulo inteiro: **Lulus, Agenda, Galeria, Histórico, Mais**. "Mais" agrupa Auditoria, Sobre e (admin) Sorteio.
- **"Dashboard" passa a se chamar "Agenda"** (rótulo, título da página e metadata). A rota `/dashboard` pode continuar existindo.
- **Agenda:** layout "o ano das Lulus", com os meses a partir do mês atual e, em cada mês, rostos + dia + nome (inspirado na opção C do mockup). Substitui a lista simples de nomes por mês.

## Decisões tomadas por mim (Claude), para a autora conferir
- **Modo escuro:** mesma paleta transposta. Fundo vinho-quase-preto (referência `#1E1416`), cards um tom acima, texto marfim, vinho clareado para nomes e dourado para detalhes. Sai o marrom atual.
- **Banner de instalação do PWA:** restilizado na nova paleta, sem cobrir conteúdo importante.
- **Agenda mantém tudo o que o Dashboard tem hoje:** o calendário por mês ganha o layout "o ano das Lulus". A contagem de aniversários por mês e o gráfico "Distribuição por Signo" continuam, restilizados. Nada é removido.
- **Sem duplicar a próxima aniversariante:** ela aparece só no card de destaque e não se repete na lista abaixo. Se um filtro ativo a excluir, o destaque some junto e a lista mostra só o resultado filtrado.
- **Ordenação:** entra uma opção nova, **"Próximas"** (a partir de hoje), como padrão. A ordem de calendário atual (janeiro → dezembro) continua disponível como opção, e as demais opções seguem iguais.
- **"Mais"** abre um bottom sheet (`vaul`, já usado no projeto) com Auditoria, Sobre e, para admin, Sorteio. Login/Logout continuam no cabeçalho. No desktop, a navegação superior mantém todos os itens com o rótulo inteiro, sem "Mais".

## Deixado para o builder

- Escala tipográfica exata, espaçamentos, raios e sombras, desde que fiéis ao mockup aprovado.
- Como implementar a contagem de dias e a ordenação (reaproveitando a lógica de "próximo aniversário" que já existe).
- Como corrigir cada bug visual.
- Microanimações (com moderação e respeitando `prefers-reduced-motion`).
- Como restilizar os componentes base de `components/ui` (pode ajustar as variantes do shadcn).
- Atualizar testes e snapshots afetados pelas mudanças de texto e estrutura.

## Referências

- Mockups aprovados: `.superpowers/brainstorm/1490-1795007905/content/visual-style.html` (paleta B) e `home-cards-v6.html` (tela inicial).
- Capturas do app atual: `.playwright-mcp/home-top.png`, `dash.png`, `galeria2.png`, `historico2.png`, `sobre.png`, `home-dark.png`.
