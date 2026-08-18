# Directory Structure

## Project Root

```
ppi-next-js/
├── backend/                      # Backend REST API
│   ├── prisma/                   # Database schemas and migrations
│   ├── src/                      # TypeScript backend source files
│   ├── package.json
│   ├── tsconfig.json
│   └── pnpm-lock.yaml
├── frontend/                     # Frontend Next.js Web Application
│   ├── app/                      # Next.js App Router
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities, config, validation
│   ├── mocks/                    # Unused/legacy mock data
│   ├── public/                   # Static assets (SVG icons)
│   ├── types/                    # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   ├── postcss.config.mjs
│   └── proxy.ts                  # Next.js middleware (no-op)
├── config.docx                   # Requirements document (LabControl)
├── frontend_skills.md            # Frontend development guide
└── README.md
```

## Backend Structure (`backend/`)

```
backend/
├── prisma/
│   ├── migrations/               # SQL schema migrations
│   ├── schema.prisma             # Database schema (PostgreSQL models)
│   └── seed.ts                   # Seed script for initial DB setup
└── src/
    ├── app.ts                    # Express application config & middleware
    ├── server.ts                 # HTTP server entry point
    ├── config/
    │   ├── database.ts           # Prisma Client with pg adapter singleton
    │   └── env.ts                # Validated env configurations
    ├── controllers/              # Express request/response logic
    │   ├── auth.controller.ts
    │   ├── categories.controller.ts
    │   ├── inventory.controller.ts
    │   ├── loans.controller.ts
    │   ├── notifications.controller.ts
    │   ├── reports.controller.ts
    │   ├── tags.controller.ts
    │   └── users.controller.ts
    ├── generated/
    │   └── prisma/               # Local compilation destination of Prisma Client
    ├── middlewares/              # Route level middlewares
    │   ├── auth.ts               # JWT auth & permission checking
    │   ├── errorHandler.ts       # Global error processing
    │   ├── notFound.ts           # Route not found handler
    │   └── requestLogger.ts      # Simple console logger
    ├── routes/                   # Router mountings
    │   ├── index.ts              # API root router
    │   ├── auth.routes.ts
    │   ├── categories.routes.ts
    │   ├── health.ts             # Health check endpoint
    │   ├── inventory.routes.ts
    │   ├── loans.routes.ts
    │   ├── notifications.routes.ts
    │   ├── reports.routes.ts
    │   ├── tags.routes.ts
    │   └── users.routes.ts
    ├── schemas/                  # Zod request payload schemas
    │   ├── auth.schema.ts
    │   ├── category.schema.ts
    │   ├── inventory.schema.ts
    │   ├── loan.schema.ts
    │   ├── notification.schema.ts
    │   ├── tag.schema.ts
    │   └── user.schema.ts
    ├── types/
    │   └── api.ts                # Typings for paginated and standard api returns
    └── utils/                    # Shared utility files
        ├── crypto.ts             # Salt & bcrypt password functions
        ├── email.ts              # SMTP Nodemailer notifications setup
        ├── jwt.ts                # JWT creation and verify functions
        ├── params.ts             # Safe parameter parser
        └── response.ts           # Unified API response builders
```

## App Router (`frontend/app/`)

```
app/
├── layout.tsx                    # Root layout (Poppins font, AppProviders)
├── types.ts                      # Mode type ("login" | "register")
├── src/
│   └── globals.css               # Global CSS tokens, theme, resets
├── _data/                        # Empty (reserved for data loading)
├── (public)/                     # Unauthenticated routes
│   ├── layout.tsx                # Pass-through layout (no shell)
│   ├── page.tsx                  # Landing page (login/register toggle)
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   └── recovery/page.tsx         # Password recovery page
└── (auth)/                       # Authenticated routes (requires AuthGate)
    ├── layout.tsx                # AuthGate → AppShell → ToastProvider
    ├── dashboard/page.tsx        # Main dashboard
    ├── items/page.tsx            # Item catalog search
    ├── loans/
    │   ├── page.tsx              # Loan list (tabs: active, pending, history)
    │   ├── new/page.tsx          # New loan form
    │   └── [id]/page.tsx         # Loan detail page
    ├── inventory/
    │   ├── page.tsx              # Inventory management table
    │   ├── new/page.tsx          # New inventory item form
    │   └── [id]/page.tsx         # Inventory item detail
    ├── cart/page.tsx              # Shopping cart → loan request
    ├── notifications/page.tsx    # User notifications
    ├── settings/
    │   ├── page.tsx              # User settings (notification prefs)
    │   └── profile/
    │       ├── page.tsx          # Profile settings page
    │       └── ProfileSummary.tsx # Profile edit component
    ├── approvals/
    │   ├── page.tsx              # Loan approvals (admin/estagiário)
    │   └── ApprovalsActions.tsx  # Approve/reject action handlers
    └── admin/                    # Admin-only routes (requires AdminGate)
        ├── layout.tsx            # AdminGate wrapper
        ├── users/page.tsx        # User management
        ├── reports/page.tsx      # Reports with KPI cards and export
        └── settings/
            ├── page.tsx          # Admin settings tabs
            ├── SystemSettingsMock.tsx
            ├── categories/page.tsx  # Category management
            ├── tags/page.tsx        # Tag/role management
            └── permissions/page.tsx # Permission management
```

## Components (`frontend/components/`)

```
components/
├── Body/
│   ├── FormCard.tsx              # Card wrapper for auth forms
│   └── Slogan.tsx                # LabControl branding/logo
├── Button/
│   ├── Button.tsx                # Primary/secondary/ghost button primitive
│   └── Link.tsx                  # Button-styled Next.js Link
├── Input/
│   └── Input.tsx                 # Labeled input with forwarded ref
90: ├── Link/
│   └── Link.tsx                  # Styled anchor/link component
├── auth/
│   ├── Form.tsx                  # Auth form wrapper
│   ├── FormBody.tsx              # Form body content
│   ├── Header.tsx                # Auth page header
│   ├── Title.tsx                 # Form title component
│   ├── AuthFormFooter.tsx        # Login/register toggle footer
│   └── RecoveryForm.tsx          # Password recovery form
├── inventory/
│   ├── CatalogSearchBar.tsx      # Search + category filter bar
│   ├── CategoryList.tsx          # Category label list
│   ├── InventoryCatalogGrid.tsx  # Item grid with cards
│   ├── InventoryManagementTable.tsx # Admin inventory table
│   └── NewInventoryItemForm.tsx  # Add item form (with image upload)
├── layout/
│   ├── AdminGate.tsx             # Admin role check + redirect
│   ├── AppShell.tsx              # Desktop sidebar + mobile drawer layout
│   ├── AppSidebar.tsx            # Navigation sidebar with permission filtering
│   └── AuthGate.tsx              # Auth check + redirect to login
├── loans/
│   ├── LoanStatusBadge.tsx       # Colored status badge
│   └── NewLoanForm.tsx           # New loan form with Zod validation
├── providers/
│   └── AppProviders.tsx          # Composes AuthProvider
├── search/                       # Empty (reserved)
└── shared/
    ├── EmptyState.tsx            # Empty state with icon + message
    ├── PageHeader.tsx            # Page title + description header
    └── Toast.tsx                 # Toast notification system (context + UI)
```

## Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| **Components** | PascalCase | `AppShell.tsx`, `AuthGate.tsx` |
| **Hooks** | camelCase with `use` prefix | `useAuth.ts` |
| **Utils** | camelCase | `utils.ts`, `navigation.ts` |
| **Types** | PascalCase interfaces | `LabSessionUser`, `TagPermissions` |
| **Routes (Frontend)** | kebab-case directories | `admin/settings/permissions/` |
| **Routes (Backend)** | camelCase controller imports, kebab-case router files | `auth.routes.ts` |
| **CSS variables** | kebab-case with prefix | `--color-primary`, `--color-bg-subtle` |

## File Stats

- **Total source files (TS/TSX/CSS/Prisma):** ~120 files
- **Frontend source files:** ~85 files
- **Backend source files:** ~35 files
- **API routes mapped:** ~10 endpoint routers
- **Prisma Models:** 8 schema models
