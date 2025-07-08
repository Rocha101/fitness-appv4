# Fitness App

Aplicativo mobile completo para registro e acompanhamento de atividades físicas, com backend NestJS, autenticação via JWT e interface de chatbot com IA.

## ✨ Tecnologias Principais

| Camada    | Tecnologias                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| Mobile    | **Expo** · **React Native** · **TypeScript** · **Nativewind** · Tailwind · React Query |
| Backend   | **NestJS** · **TypeScript** · **Prisma** · **Zod**                                     |
| Auth      | JWT (e-mail & senha)                                                                   |
| Banco     | PostgreSQL                                                                             |
| Qualidade | ESLint · Prettier · Husky · Commitlint (Conventional Commits)                          |
| Dev Tools | Bun · Turborepo                                                                        |
| IA        | Google Gemini via `@ai-sdk/google`                                                     |

## 📐 Estrutura do Monorepo

```
fitness-app/
├── apps/
│   ├── native/   # App Expo/React Native
│   └── server/   # API NestJS
├── .husky/       # Git hooks
└── ...
```

### Pastas Importantes

- `apps/native/components` – UI e páginas do app.
- `apps/server/src/modules` – Módulos Nest (auth, activity, chat, ai, …).
- `prisma/` – Esquema e migrações.

## ⚙️ Requisitos

1. **Bun 1.2+** – <https://bun.sh>
2. **Node 20+** (_apenas para EAS Build_
3. **PostgreSQL 15+**
4. **Expo CLI** `bun x expo --version`

## 🔑 Variáveis de Ambiente

Copie `.env.example` para `apps/server/.env` e ajuste:

```
DATABASE_URL=postgres://user:password@localhost:5432/fitness
JWT_SECRET=super_secret_key
GOOGLE_AI_KEY=your_google_gemini_key
```

## 🏗️ Instalação

```bash
bun install           # instala dependências do monorepo
```

### Banco de Dados

```bash
bun db:push           # executa prisma db push (Schema → DB)
bun db:generate       # gera cliente Prisma
bun db:studio         # abre Prisma Studio (opcional)
```

## ▶️ Execução em Desenvolvimento

Rodar API e mobile em paralelo:

```bash
# 1. Backend
bun dev:server        # http://localhost:3000

# 2. Mobile (Expo)
bun dev:native        # abre Metro bundler
```

Abra o app no **Expo Go** escaneando o QR-Code.

## 🧹 Lint & Formatação

```bash
bun run lint          # ESLint (automático no pre-commit)
```

Husky + lint-staged formatam arquivos com Prettier antes do commit. Commitlint impede mensagens fora do padrão Conventional Commits.

## 📦 Build Produção

```bash
bun build             # turbo build (backend + mobile)
```

Para gerar binários, use **EAS Build**:

```bash
bun x eas build --platform android --profile production
```

## 🚀 Passo-a-Passo: EAS Build

1. **Login na conta Expo** (apenas uma vez):

   ```bash
   bun x expo login
   ```

2. **Configurar o projeto para EAS** (gera `eas.json` e configurações nativas):

   ```bash
   bun x eas build:configure
   ```

   Se solicitado, selecione a **conta/organisation** correta e aceite criar os workflows.

3. **Definir perfis de build** em `eas.json` (já gerado). Exemplo mínimo:

   ```jsonc
   {
     "build": {
       "production": {
         "android": {
           "workflow": "managed",
           "buildType": "apk",
         },
         "ios": {
           "workflow": "managed",
           "simulator": false,
         },
       },
     },
   }
   ```

4. **Configurar variáveis de ambiente** (se necessário):

   ```bash
   bun x eas secret:create --name GOOGLE_AI_KEY --value "<sua-chave-gpt>"
   ```

5. **Gerar o build** (Android como exemplo):

   ```bash
   bun x eas build --platform android --profile production
   ```

   Acompanhe o progresso no terminal ou em <https://expo.dev/accounts/SEU_USUARIO/projects/fitness-app/builds>.

6. **Baixar o artefato** quando o build finalizar; um link é exibido no terminal.

7. **Testar no dispositivo** (APK) ou subir para as lojas (AAB / IPA).

> Dica: para builds mais rápidos em _debug_, use `--profile preview`.

## 🔒 Autenticação

- Registro & login via e-mail / senha.
- Token JWT salvo no **SecureStore** no app.
- _Refresh-token_ será adicionado (ver Roadmap).

## 🤖 Chatbot

Endpoint `/chat` responde com IA Gemini.

## 📝 API

A API NestJS possui Swagger habilitado em `http://localhost:3000/api`.

## 🛠️ Decisões Técnicas

| Tema                       | Escolha                                               | Justificativa                                                       |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| **Monorepo**               | **Turborepo** + workspaces                            | Cache compartilhado e pipelines paralelos entre frontend e backend. |
| **Gerenciador de pacotes** | **Bun**                                               | Scripts nativos (`bun run`, `bun x`) e desempenho superior.         |
| **Mobile**                 | **Expo** + **React Native** + **Nativewind/Tailwind** | Iteração rápida; estilo declarativo consistente.                    |
| **Backend**                | **NestJS** + **Prisma**                               | Arquitetura modular e tipagem forte end-to-end.                     |
| **Validação**              | **Zod**                                               | Validação funcional reutilizável em ambos os lados.                 |
| **State Management**       | **Zustand**                                           | API simples e leve para React Native; evita boilerplate.            |
| **Auth**                   | JWT access + refresh-token rotation                   | Tokens no **SecureStore**; fluxo seguro.                            |
| **Chat IA**                | Google Gemini (`@ai-sdk/google`)                      | Integração direta e custo/benefício.                                |
| **CI/CD Mobile**           | **EAS Build**                                         | Builds nativos em nuvem integrados ao Expo.                         |
| **Qualidade**              | ESLint & Prettier + Husky + Commitlint                | Código consistente e commits padronizados.                          |
| **UI/UX**                  | Huge-icons, micro-interações, otimização Lighthouse   | Experiência moderna e performática.                                 |
