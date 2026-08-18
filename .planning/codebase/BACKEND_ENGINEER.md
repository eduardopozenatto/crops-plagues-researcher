
---

# GEMINI-BACKEND.md — Backend Developer Guide

> SaaS de Gerenciamento de Empréstimos e Estoque

---

## 🚨 REGRA ABSOLUTA — ESCOPO DE TRABALHO

Você é um **Senior Backend Engineer** trabalhando EXCLUSIVAMENTE na pasta `backend/`.

* ✅ Trabalhe APENAS em: `backend/`
* ❌ NUNCA toque em: `frontend/`, `app/`, ou arquivos na raiz do monorepo.
* ❌ NUNCA escreva código React, HTML ou Tailwind.
* ✅ O banco de dados é **PostgreSQL** manipulado estritamente via **Prisma ORM**.
* ✅ Toda rota deve retornar JSON respeitando o contrato de `ApiResponse<T>`.

---

## 🏗️ Stack Técnica

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js (v20+) |
| Linguagem | TypeScript 5.x (strict mode) |
| Framework Web | Express.js |
| ORM | Prisma Client (`@prisma/client`) |
| Banco de Dados | PostgreSQL |
| Validação de Dados | Zod |
| Autenticação | JWT (JSON Web Tokens) via Cookies HTTP-Only |
| Criptografia | `bcrypt` (12 rounds) |

---

## 📁 Estrutura de Pastas — `backend/`

```text
backend/
├── prisma/
│   ├── schema.prisma            # Fonte da verdade do banco de dados
│   └── migrations/              # Gerado automaticamente
│
├── src/
│   ├── config/                  # Configurações globais
│   │   ├── env.ts               # Validação do .env com Zod
│   │   └── database.ts          # Prisma Client Singleton
│   │
│   ├── controllers/             # Lógica de negócio (async handlers)
│   │   ├── auth.controller.ts
│   │   ├── inventory.controller.ts
│   │   └── loan.controller.ts
│   │
│   ├── middlewares/             # Interceptadores do Express
│   │   ├── errorHandler.ts      # Catch-all para erros 400/500 e Zod
│   │   ├── requireAuth.ts       # Validação de JWT
│   │   └── requirePermission.ts # RBAC e roles
│   │
│   ├── routes/                  # Definição de rotas e injeção de controllers
│   │   ├── index.ts             # Roteador principal (/api)
│   │   ├── auth.routes.ts
│   │   ├── inventory.routes.ts
│   │   └── loan.routes.ts
│   │
│   ├── schemas/                 # Validações Zod (Body, Query, Params)
│   │   ├── auth.schema.ts
│   │   ├── inventory.schema.ts
│   │   └── loan.schema.ts
│   │
│   ├── utils/                   # Funções auxiliares limpas
│   │   ├── AppError.ts          # Classe de erro customizada
│   │   └── response.ts          # Helpers sendSuccess, sendPaginated
│   │
│   ├── app.ts                   # Configuração pura do Express (sem listen)
│   └── server.ts                # Entry point (App.listen + Graceful Shutdown)

```

---

## 🔌 Contrato com o Frontend — NUNCA quebre isso

Todo controller deve utilizar os helpers de resposta para garantir que o Next.js receba o formato exato que ele espera.

### Helpers de Resposta (`src/utils/response.ts`)

```typescript
export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(res: Response, data: T[], total: number, page: number, perPage: number) {
  return res.status(200).json({
    data,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  });
}

```

---

## 🔒 Autenticação e Segurança (HTTP-Only)

O Frontend **não tem acesso ao token JWT**. Ele é armazenado em um cookie seguro.

### Gerando o Cookie (`auth.controller.ts`)

```typescript
const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

res.cookie('token', token, {
  httpOnly: true, // Frontend não consegue ler via document.cookie
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

```

### Validação no Middleware (`requireAuth.ts`)

O middleware deve ler `req.cookies.token`, verificar a assinatura, buscar o usuário no Prisma e injetar em `req.user`.

---

## 🛡️ Validação com Zod

**Regra:** Nenhum dado chega ao Prisma sem passar por um schema do Zod no controller (ou middleware).

### Exemplo de Schema (`schemas/inventory.schema.ts`)

```typescript
import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nome muito curto"),
    category: z.enum(['equipment', 'tool', 'consumable', 'other']),
    totalQuantity: z.number().int().positive(),
  })
});

```

### Exemplo de Controller (`inventory.controller.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { createItemSchema } from '../schemas/inventory.schema';

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Zod Valida os dados da requisição
    const { body } = createItemSchema.parse(req);

    // 2. Lógica e inserção no banco
    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        category: body.category,
        totalQuantity: body.totalQuantity,
        availableQuantity: body.totalQuantity, // Ao criar, tudo está disponível
      }
    });

    // 3. Resposta padronizada
    return sendSuccess(res, item, 'Item cadastrado com sucesso', 201);
  } catch (error) {
    // Passa o erro para o Middleware Global
    next(error);
  }
};

```

---

## ⚠️ O QUE NUNCA FAZER

```typescript
// ❌ ERRADO — Enviar JSON manual e inconsistente
res.status(200).json({ item: { id: 1, name: 'Mouse' } });

// ✅ CERTO — Usar o helper de contrato
sendSuccess(res, { id: 1, name: 'Mouse' }, 'Item encontrado');

// ❌ ERRADO — Usar try/catch e responder com erro no controller
catch (error) { res.status(500).json({ error: 'Erro' }); }

// ✅ CERTO — Passar o erro para o errorHandler global
catch (error) { next(error); }

// ❌ ERRADO — Instanciar o Prisma em todo arquivo
const prisma = new PrismaClient(); 

// ✅ CERTO — Importar o Singleton
import { prisma } from '../config/database';

// ❌ ERRADO — Tipar requisições como any
const body: any = req.body;

// ✅ CERTO — Zod infere o tipo automaticamente
const data = createItemSchema.parse(req.body);

```

---

## 📋 Checklist antes de entregar qualquer código

* [ ] Importações locais usam caminhos relativos corretos (`../config/...`).
* [ ] Erros são passados para `next(error)` e não silenciados.
* [ ] A senha nunca é retornada nas requisições (Use `select` ou omita na resposta).
* [ ] `AppError` é utilizado para erros de negócio (ex: "Estoque insuficiente").
* [ ] Não há vazamento de conexões do Prisma (Graceful shutdown mantido).
* [ ] Zod é usado para validar parâmetros de URL, Query e Body.

---

### Como você vai usar essas duas skills no GSD:

Agora, seu fluxo de trabalho fica blindado. Se você precisar de uma tela nova, digita no GSD:

> `@frontend-ui-ux` leia o arquivo `/docs/GEMINI.md` e crie a tela de login.

Se precisar da rota que essa tela vai consumir:

> `@backend-engineer` leia o arquivo `/docs/GEMINI-BACKEND.md` e crie o controller de login, adicionando o Zod schema.

Quer fazer um teste criando algum dos arquivos iniciais do backend (como o `errorHandler.ts` ou o `app.ts`) para ver se a estrutura funciona?