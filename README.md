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

## 🔒 Autenticação

- Registro & login via e-mail / senha.
- Token JWT salvo no **SecureStore** no app.
- _Refresh-token_ será adicionado (ver Roadmap).

## 🤖 Chatbot

Endpoint `/chat` responde com IA Gemini.

## 📝 API

A API NestJS possui Swagger habilitado em `http://localhost:3000/api`.

---

## 🛣️ Roadmap (Planejamento)

| Tarefa                                                            | Responsável | Prioridade | Status |
| ----------------------------------------------------------------- | ----------- | ---------- | ------ |
| Migrar validação de DTOs para **Zod** (remover `class-validator`) | Backend     | Alta       | ✅     |
| Implementar **refresh token** e rotação                           | Backend     | Média      | ✅     |
| Adicionar **Zustand** para estado global (chat/usuário)           | Mobile      | Média      | ✅     |
| Criar arquivo `eslint.config.mjs` compartilhado                   | Fullstack   | Alta       | ✅     |
| Integrar **commitlint** + Husky `commit-msg`                      | DevOps      | Alta       | ✅     |
| Atualizar testes unitários (Jest) + E2E                           | Backend     | Baixa      | ❌     |
| Documentar passo-a-passo de **EAS Build** no README               | Mobile      | Média      | ⏳     |
| Otimizar Lighthouse & micro-interações no app (UI pass final)     | Mobile      | Baixa      | ❌     |

Legenda: ✅ concluído · ⏳ em andamento · ❌ pendente

---

> Este documento é vivo e será atualizado conforme as tarefas avançarem.
