# 🎀 Lulu

> Interface amigável, divertida e acessível para gerenciamento de dados, utilizando tecnologias modernas, tema personalizado e foco em acessibilidade e usabilidade.

## 📦 Sobre o Projeto

O **Lulu** é um projeto frontend desenvolvido com **Next.js 15**, com foco em acessibilidade, usabilidade e design visual lúdico. Ele conta com uma identidade visual única inspirada em uma estética retrô e amigável, utilizando animações, cores suaves e componentes reutilizáveis para oferecer uma experiência de usuário leve e fluida.

## ✨ Tecnologias Utilizadas

- **Next.js 15** com suporte a `app/` router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3** com configuração customizada e tema claro/escuro
- **Radix UI** para componentes acessíveis
- **React Hook Form** + **Zod** para validações de formulários
- **React Query (Tanstack)** para gerenciamento de dados assíncronos
- **Firebase** (autenticação e/ou banco de dados)
- **Recharts** para visualização de dados
- **Lucide React** e **Iconify** para ícones
- **QRCode** e **QRCode PIX** para geração de códigos QR
- **React Device Detect** para adaptar a experiência por dispositivo
- **Prettier** + **ESLint** para padronização e qualidade de código

## 🎨 Design e Tema

O tema visual é fortemente customizado com variáveis CSS para cores, sombras e fontes. Inclui:

- Tema claro e escuro com `class` (`darkMode: ['class']`)
- Paleta personalizada com nomes semânticos: `primary`, `secondary`, `muted`, `destructive`, `success`, `warning`, etc.
- Animações customizadas com `@keyframes` para botões, acordeões e interações visuais
- Fonte padrão: **Comic Sans MS** (trazendo leveza e personalidade)
- Classes utilitárias com `@apply` para componentes visuais reutilizáveis (`.lulu-button`, `.lulu-card`, `.lulu-header`)

## 🧩 Estrutura de Diretórios

├── app/ # Novo roteamento do Next.js 15
├── components/ # Componentes reutilizáveis
├── pages/ # Compatibilidade com rotas antigas, se necessário
├── src/ # Código adicional
├── styles/ # Estilos globais e Tailwind
├── public/ # Imagens, padrões e arquivos públicos
├── tailwind.config.ts # Configuração do tema visual
├── tsconfig.json # Configuração TypeScript

## 🚀 Scripts Disponíveis

- `npm run dev` — Inicia o projeto em modo de desenvolvimento na porta 3001 com Turbopack
- `npm run build` — Compila a aplicação para produção
- `npm run start` — Inicia o servidor de produção
- `npm run lint` — Executa a análise de lint nos arquivos `.ts` e `.tsx`

## 🔧 Funcionalidades

- Formulários com validação em tempo real
- Componentes acessíveis com Radix UI
- Gerenciamento de estado assíncrono com React Query
- Temas comutáveis claro/escuro com `next-themes`
- Layout responsivo com adaptação a diferentes dispositivos
- Integração com Firebase
- Geração de QR Code (incluindo QR Code PIX)
- Visualização de dados com gráficos

## 🛠️ Configurações Tailwind

Tailwind foi personalizado com:

- Paleta de cores baseada em CSS Variables
- Animações e keyframes customizados (`lulu-bounce`, `accordion-up/down`)
- Breakpoints otimizados e `container` centralizado
- `tailwindcss-animate` para animações suaves
- Estilizações globais em `@layer base` com classes utilitárias

## ✅ Acessibilidade

- Navegação por teclado
- Componentes com foco visível e interações acessíveis
- Labels, tooltips e validações amigáveis
- Temas com contraste suficiente para legibilidade

## 💅 Padrões de Código

- ESLint com `eslint-config-next` e `prettier`
- Tipagem estrita com TypeScript
- Código organizado em camadas reutilizáveis
- Uso de `clsx` e `class-variance-authority` para estilos condicionais

## 📚 Dependências Principais

| Pacote | Descrição |
|--------|-----------|
| `@tanstack/react-query` | Cache e gerenciamento de requisições |
| `@radix-ui/react-*` | Componentes acessíveis e semântico |
| `tailwindcss` + `tailwindcss-animate` | Estilização com animações |
| `react-hook-form` + `zod` | Validação e controle de formulários |
| `firebase` | Autenticação / backend (opcional) |
| `recharts` | Gráficos dinâmicos |
| `lucide-react`, `@iconify/react` | Ícones otimizados |
| `qrcode.react` e `qrcode-pix` | Geração de QR Code padrão e PIX |

## 📦 Requisitos

- Node.js 18 ou superior
- npm ou pnpm
- Ambiente com suporte a ESModules (usado em `tailwind.config.ts`)

## 🤝 Contribuindo

Sinta-se à vontade para sugerir melhorias, abrir issues ou enviar pull requests! Este projeto busca manter um padrão de qualidade, acessibilidade e código limpo.

## 🧠 Inspirado por

Este projeto foi inspirado em uma experiência de interface lúdica, leve e acessível — ideal para produtos digitais voltados ao público geral, especialmente com foco em clareza e inclusão.

## 📄 Licença

Este projeto é privado no momento, mas poderá adotar uma licença de código aberto no futuro.

---

> Feito com carinho, cuidado e bastante café ☕ por Su. 💖
