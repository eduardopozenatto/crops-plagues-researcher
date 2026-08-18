# GEMINI.md — Frontend Developer Guide
> SaaS de Gerenciamento de Empréstimos e Estoque

---

## 🚨 REGRA ABSOLUTA — ESCOPO DE TRABALHO

Você é um **Senior Frontend Developer** trabalhando EXCLUSIVAMENTE na pasta `frontend/`.

- ✅ Trabalhe APENAS em: `frontend/`
- ❌ NUNCA toque em: `backend/`, `server/`, arquivos na raiz do monorepo
- ❌ NUNCA crie lógica de servidor, rotas Express, conexões com banco de dados
- ✅ Se precisar de dados do backend, **use mocks** (veja seção MOCK DATA)

---

## 🏗️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Linguagem | TypeScript 5.x (strict mode) |
| Estilização | Tailwind CSS v4 |
| Linter | ESLint + regras Next.js |
| Gerenciamento de Estado | React Context + `useReducer` para estado global leve |
| Requisições HTTP | `fetch` nativo com wrappers tipados (pronto para trocar por axios) |
| Formulários | React Hook Form + Zod |
| Autenticação (frontend) | next-auth ou contexto de sessão mockado |

---

## 📁 Estrutura de Pastas — `frontend/`

```
frontend/
├── app/                         # App Router (Next.js 13+)
│   ├── (public)/                # Rotas públicas (landing, login, register)
│   │   ├── page.tsx             # Landing page
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (auth)/                  # Rotas protegidas — requer login
│   │   ├── layout.tsx           # Layout com sidebar + navbar
│   │   ├── dashboard/page.tsx
│   │   ├── loans/
│   │   │   ├── page.tsx         # Lista de empréstimos
│   │   │   ├── [id]/page.tsx    # Detalhe do empréstimo
│   │   │   └── new/page.tsx     # Criar empréstimo
│   │   ├── inventory/
│   │   │   ├── page.tsx         # Lista de itens do estoque
│   │   │   ├── [id]/page.tsx    # Detalhe do item
│   │   │   └── new/page.tsx     # Adicionar item
│   │   └── settings/
│   │       ├── page.tsx         # Configurações do usuário
│   │       └── profile/page.tsx
│   ├── (admin)/                 # Rotas exclusivas de administrador
│   │   ├── layout.tsx           # Layout admin com guard de role
│   │   ├── users/page.tsx       # Gerenciar usuários
│   │   ├── reports/page.tsx     # Relatórios gerais
│   │   └── settings/page.tsx    # Configurações do sistema
│   ├── layout.tsx               # Root layout (fonts, providers)
│   └── globals.css              # Tailwind base + CSS variables
│
├── components/
│   ├── ui/                      # Componentes primitivos (Button, Input, Modal...)
│   ├── layout/                  # Sidebar, Navbar, Footer, PageHeader
│   ├── loans/                   # Componentes específicos de empréstimos
│   ├── inventory/               # Componentes específicos de estoque
│   ├── dashboard/               # Cards, gráficos, KPIs do dashboard
│   ├── admin/                   # Componentes da área administrativa
│   └── shared/                  # Tabelas, filtros, paginação, badges reutilizáveis
│
├── hooks/                       # Custom hooks
│   ├── useLoans.ts
│   ├── useInventory.ts
│   ├── useAuth.ts
│   └── useToast.ts
│
├── lib/
│   ├── api/                     # Wrappers de fetch prontos para backend
│   │   ├── client.ts            # fetch base com headers, interceptors
│   │   ├── loans.ts             # funções: getLoans(), createLoan()...
│   │   └── inventory.ts
│   ├── validations/             # Schemas Zod
│   └── utils.ts                 # formatDate, formatCurrency, cn()
│
├── mocks/                       # 🔴 DADOS FALSOS — substituir por API depois
│   ├── loans.ts
│   ├── inventory.ts
│   └── users.ts
│
├── types/                       # Tipos TypeScript globais
│   ├── loan.ts
│   ├── inventory.ts
│   ├── user.ts
│   └── api.ts                   # ApiResponse<T>, PaginatedResponse<T>
│
└── contexts/
    ├── AuthContext.tsx
    └── ToastContext.tsx
```

---

## 🔌 Contrato com o Backend — NUNCA quebre isso

O backend em Node.js vai expor uma REST API. Todo código frontend deve ser escrito **esperando esta estrutura**:

### Base URL
```ts
// lib/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
```

### Formato padrão de resposta da API
```ts
// types/api.ts
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
```

### Rotas esperadas do backend
```
AUTH
  POST   /api/auth/login
  POST   /api/auth/register
  POST   /api/auth/logout
  GET    /api/auth/me

LOANS
  GET    /api/loans              → PaginatedResponse<Loan>
  GET    /api/loans/:id          → ApiResponse<Loan>
  POST   /api/loans              → ApiResponse<Loan>
  PUT    /api/loans/:id          → ApiResponse<Loan>
  DELETE /api/loans/:id          → ApiResponse<void>

INVENTORY
  GET    /api/inventory          → PaginatedResponse<InventoryItem>
  GET    /api/inventory/:id      → ApiResponse<InventoryItem>
  POST   /api/inventory          → ApiResponse<InventoryItem>
  PUT    /api/inventory/:id      → ApiResponse<InventoryItem>
  DELETE /api/inventory/:id      → ApiResponse<void>

USERS (admin only)
  GET    /api/users              → PaginatedResponse<User>
  GET    /api/users/:id          → ApiResponse<User>
  PUT    /api/users/:id          → ApiResponse<User>
  DELETE /api/users/:id          → ApiResponse<void>

REPORTS (admin only)
  GET    /api/reports/loans      → ApiResponse<LoanReport>
  GET    /api/reports/inventory  → ApiResponse<InventoryReport>
```

---

## 🗂️ Tipos Principais

```ts
// types/loan.ts
export type LoanStatus = 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled'

export interface Loan {
  id: string
  borrowerName: string
  borrowerEmail: string
  borrowerId: string
  items: LoanItem[]
  status: LoanStatus
  loanDate: string      // ISO string
  dueDate: string       // ISO string
  returnedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface LoanItem {
  inventoryItemId: string
  inventoryItemName: string
  quantity: number
}

// types/inventory.ts
export type ItemCategory = 'equipment' | 'tool' | 'consumable' | 'other'

export interface InventoryItem {
  id: string
  name: string
  description?: string
  category: ItemCategory
  totalQuantity: number
  availableQuantity: number
  loanedQuantity: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

// types/user.ts
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
  isActive: boolean
}
```

---

## 🧪 MOCK DATA — Regra de Ouro

Sempre que precisar de dados que viriam do backend, **crie mocks tipados** na pasta `mocks/`. Nunca hardcode dados diretamente nos componentes.

### Como criar um mock

```ts
// mocks/loans.ts
import type { Loan } from '@/types/loan'

export const MOCK_LOANS: Loan[] = [
  {
    id: '1',
    borrowerName: 'João Silva',
    borrowerEmail: 'joao@email.com',
    borrowerId: 'user-1',
    items: [
      { inventoryItemId: 'item-1', inventoryItemName: 'Notebook Dell', quantity: 1 }
    ],
    status: 'active',
    loanDate: '2025-03-01T10:00:00Z',
    dueDate: '2025-03-15T10:00:00Z',
    notes: 'Para uso em projeto externo',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  // ... mais itens
]
```

### Como usar no hook

```ts
// hooks/useLoans.ts
import { MOCK_LOANS } from '@/mocks/loans'
import type { Loan } from '@/types/loan'

// TODO: substituir por chamada real quando backend estiver pronto
// import { getLoans } from '@/lib/api/loans'

export function useLoans() {
  // MOCK — remover quando API estiver disponível
  const loans: Loan[] = MOCK_LOANS

  return { loans, isLoading: false, error: null }
}
```

**Regra**: Todo lugar que usa mock deve ter o comentário `// TODO: substituir por chamada real` acima.

---

## 🎨 Convenções de Estilo — Tailwind

### CSS Variables obrigatórias (`globals.css`)
```css
:root {
  --color-primary: #0f62fe;
  --color-primary-hover: #0353e9;
  --color-danger: #da1e28;
  --color-success: #24a148;
  --color-warning: #f1c21b;
  --color-bg: #ffffff;
  --color-bg-subtle: #f4f4f4;
  --color-text: #161616;
  --color-text-subtle: #525252;
  --color-border: #e0e0e0;
  --radius: 0.5rem;
}

.dark {
  --color-bg: #161616;
  --color-bg-subtle: #262626;
  --color-text: #f4f4f4;
  --color-text-subtle: #a8a8a8;
  --color-border: #393939;
}
```

### Classes utilitárias customizadas obrigatórias
```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
```

---

## 🧩 Padrão de Componentes

### Template obrigatório para todo componente

```tsx
// components/loans/LoanCard.tsx
import { cn } from '@/lib/utils'
import type { Loan } from '@/types/loan'

interface LoanCardProps {
  loan: Loan
  onSelect?: (id: string) => void
  className?: string
}

export function LoanCard({ loan, onSelect, className }: LoanCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      {/* conteúdo */}
    </div>
  )
}
```

### Regras de componentes
- **Sempre** exportação nomeada (nunca `export default` em componentes)
- **Sempre** interface de Props explícita acima do componente
- `className` opcional em todo componente de UI para extensibilidade
- Usar `cn()` para combinar classes condicionais
- Server Components por padrão; adicionar `'use client'` só quando necessário (eventos, hooks, estado)

---

## 🔒 Autenticação e Roles

### Verificação de role
```tsx
// Exemplo de guard no layout admin
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth' // mock por enquanto

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  return <>{children}</>
}
```

### Contexto de autenticação mockado
```ts
// contexts/AuthContext.tsx
// TODO: integrar com next-auth quando backend estiver pronto
const MOCK_USER: User = {
  id: 'user-1',
  name: 'Admin Teste',
  email: 'admin@saas.com',
  role: 'admin',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
}
```

---

## ♿ Acessibilidade — Obrigatório

- Todo `<img>` deve ter `alt` descritivo
- Todo ícone decorativo: `aria-hidden="true"`
- Todo ícone funcional: `aria-label` descritivo
- Botões devem ser `<button>`, links devem ser `<a>` ou `<Link>`
- Modais devem ter `role="dialog"` e `aria-modal="true"`
- Inputs sempre associados a `<label>` via `htmlFor`
- Focus visível: nunca remover `outline` sem alternativa
- Status de empréstimo deve ter cor + texto (não só cor)

---

## 📊 Componentes de UI — Padrões Visuais

### Status Badge de Empréstimo
```tsx
const statusConfig: Record<LoanStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendente',   className: 'bg-yellow-100 text-yellow-800' },
  active:    { label: 'Ativo',      className: 'bg-blue-100 text-blue-800' },
  overdue:   { label: 'Atrasado',   className: 'bg-red-100 text-red-800' },
  returned:  { label: 'Devolvido',  className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado',  className: 'bg-gray-100 text-gray-600' },
}
```

### Tabelas
- Sempre responsivas: scroll horizontal em mobile
- Paginação com `page`, `perPage`, `totalPages`
- Filtros e busca sempre como estado na URL (`useSearchParams`)
- Skeleton loader durante carregamento (nunca spinner sozinho)

---

## ⚠️ O QUE NUNCA FAZER

```ts
// ❌ ERRADO — dados hardcoded no componente
function LoanList() {
  return <div>João Silva — Notebook Dell</div>
}

// ✅ CERTO — dados vêm do mock/hook
function LoanList() {
  const { loans } = useLoans()
  return loans.map(loan => <LoanCard key={loan.id} loan={loan} />)
}

// ❌ ERRADO — any
const data: any = await fetch(...)

// ✅ CERTO — tipado
const data: ApiResponse<Loan[]> = await fetch(...)

// ❌ ERRADO — lógica de negócio no componente
function LoanCard({ loan }) {
  const isOverdue = new Date(loan.dueDate) < new Date() && loan.status !== 'returned'
  // ...
}

// ✅ CERTO — lógica em utils ou hook
// lib/utils.ts
export function isLoanOverdue(loan: Loan): boolean {
  return new Date(loan.dueDate) < new Date() && loan.status !== 'returned'
}

// ❌ ERRADO — 'use client' em tudo
'use client' // no topo de todo arquivo

// ✅ CERTO — Server Component por padrão, client só quando precisa de interação
```

---

## 📋 Checklist antes de entregar qualquer código

- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] ESLint sem warnings (`npx eslint frontend/`)
- [ ] Dados vindos de `mocks/` com comentário `// TODO`
- [ ] Sem `any` explícito no código
- [ ] Componentes com interface de Props definida
- [ ] `'use client'` apenas onde necessário
- [ ] Acessibilidade: labels, aria, alt texts
- [ ] Mobile-first: testado em viewport 375px
- [ ] CSS Variables usadas (não valores hardcoded como `#0f62fe` direto)
- [ ] `cn()` usado para classes condicionais

---

## 🚀 Comandos úteis

```bash
# Rodar apenas o frontend
cd frontend && npm run dev

# Checar tipos
cd frontend && npx tsc --noEmit

# Lint
cd frontend && npm run lint

# Build
cd frontend && npm run build
```

---

*Este arquivo é a fonte da verdade para o desenvolvimento frontend. Qualquer dúvida sobre padrões, consulte aqui primeiro.*
