# Technology Stack

## Multi-Package Structure
The project is structured as two independent node packages within the same repository:
- `frontend/`: Next.js Web Application
- `backend/`: Express.js REST API with Prisma ORM

---

## Frontend Stack

### Language & Runtime
| Aspect | Details |
|--------|---------|
| **Language** | TypeScript 5.x (strict mode enabled) |
| **Runtime** | Node.js (via Next.js) |
| **Module system** | ESNext modules, bundler resolution |
| **Target** | ES2017 |

### Framework
| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **React** | React 19.2.3 / ReactDOM 19.2.3 |
| **Routing** | App Router with route groups `(auth)` / `(public)` |
| **Rendering** | Client-side rendering — all interactive components use `"use client"` |
| **Font** | Poppins via `next/font/google` (weights 300, 400, 500, 700) |

### Styling
| Aspect | Details |
|--------|---------|
| **CSS Framework** | Tailwind CSS v4.2.0 |
| **PostCSS** | `@tailwindcss/postcss` plugin |
| **Utility library** | `clsx` (2.1.1) + `tailwind-merge` (3.5.0) via `cn()` helper in `lib/utils.ts` |
| **Design tokens** | CSS custom properties in `app/src/globals.css` (semantic color system: `--color-primary`, `--color-bg`, `--color-text`, etc.) |
| **Custom theme** | `@theme` block with `azure-50` through `azure-900` color palette |
| **Tailwind config** | `tailwind.config.ts` — content paths for `pages/`, `components/`, `app/`, custom gradients |

### Form Handling & Validation
| Aspect | Details |
|--------|---------|
| **Form library** | `react-hook-form` 7.72.0 |
| **Resolver** | `@hookform/resolvers` 5.2.2 |
| **Schema validation** | Zod 4.3.6 |
| **Validation schemas** | `lib/validations/inventory.ts`, `lib/validations/loan.ts` |

### Authentication & API Integration
| Aspect | Details |
|--------|---------|
| **Authentication** | Cookie-based JWT authentication, state managed in `AuthContext` |
| **API Client** | Custom fetch wrapper in `lib/api/client.ts` transmitting `credentials: "include"` |
| **Route protection** | `AuthGate` and `AdminGate` layout components with client-side redirect |

---

## Backend Stack

### Language & Runtime
| Aspect | Details |
|--------|---------|
| **Language** | TypeScript 6.0.2 (strict mode enabled) |
| **Runtime** | Node.js (>=20.0.0) |
| **Module system** | CommonJS compilation from TypeScript |

### Framework & HTTP
| Aspect | Details |
|--------|---------|
| **Framework** | Express.js v5.2.1 |
| **Middlewares** | `cors` (2.8.6), `cookie-parser` (1.4.7), `multer` (2.1.1) |
| **Routing** | Modular routers configured under `src/routes/` |

### Database & ORM
| Aspect | Details |
|--------|---------|
| **ORM** | Prisma v7.7.0 |
| **Prisma client** | Configured with Custom Output to `src/generated/prisma` |
| **Database** | PostgreSQL |
| **Client Adapter** | `@prisma/adapter-pg` (7.7.0) with `pg` (8.20.0) pool adapter |

### Security & Services
| Aspect | Details |
|--------|---------|
| **Hashing** | `bcryptjs` (3.0.3) for password storage |
| **Tokens** | `jsonwebtoken` (9.0.3) for JWT cookies |
| **Email service** | `nodemailer` (8.0.8) for password reset codes via SMTP |
| **Validation** | `zod` (4.3.6) parsed in Express controllers |
| **Reports** | `exceljs` (4.4.0) for exporting lab inventory and loan history |

---

## Package Management & Dev Tooling

| Aspect | Details |
|--------|---------|
| **Package manager** | pnpm (configured independently for `frontend/` and `backend/`) |
| **Monorepo** | Independent directories, no shared workspace configuration |
| **Frontend Dev** | `next dev` |
| **Backend Dev** | `tsx watch src/server.ts` (using `tsx` v4.21.0) |
| **Backend Build** | `tsc` compile to `dist/` |
