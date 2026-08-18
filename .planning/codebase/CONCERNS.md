# Concerns

## Critical Issues

### 🔴 No Automated Tests
Neither `frontend/` nor `backend/` directories contain test files. There are no unit, integration, or E2E tests configured. Any refactoring to the auth controllers, permission guards, or schema integrations lacks a safety net.

### 🔴 Empty SMTP Configurations for Password Reset
In `backend/.env`, the email variables `SMTP_USER` and `SMTP_PASS` are empty by default. While this is expected for template environments, it means the password recovery functionality will fail at runtime on fresh setups because `nodemailer` cannot authenticate with Google or other SMTP providers.

---

## High-Priority Technical Debt

### 🟠 Unused and Alpha Frontend Dependencies
`frontend/package.json` retains several dependencies that should be cleaned up:
- `next-auth@4.24.13` — installed but entirely unused; custom JWT cookie auth is implemented.
- `tw-merge@0.0.1-alpha.3` — a redundant alpha-stage package that duplicates the standard `tailwind-merge@3.5.0` dependency.
- `pnpm@10.32.1` — registered as a package dependency instead of being run purely as a global tool.

### 🟠 Fragile Admin Gate Logic
Admin authorization is checked in multiple parts of the application using simple tag name matching:
- `lib/navigation.ts`:
  ```typescript
  export function isLabAdmin(user: LabSessionUser): boolean {
    return user.tag.name === "laboratorista";
  }
  ```
Checking if a user is an admin by doing string equality comparison on a editable tag name is fragile (case-sensitivity issues, name renames, lack of type-level guarantee).

### 🟠 Logout Forces Full Page Reload
In `components/layout/AppSidebar.tsx`, the logout action triggers:
```typescript
onClick={() => {
  logout();
  window.location.href = "/login";
}}
```
Using `window.location.href` forces the browser to discard SPA state and execute a full reload, which creates a noticeable UI flicker. It should use Next.js `router.push('/login')` instead.

### 🟠 Tailwind Config Mismatch
`tailwind.config.ts` references path globs like `./pages/**/*` (convention of Pages Router) even though the application uses the App Router (`./app/**/*`). It should be cleaned up to prevent build scanning overhead.

---

## Medium-Priority Concerns

### 🟡 Legacy Mock Data Files Remain
The folder `frontend/mocks/` contains all the files representing the initial in-memory database arrays. Now that the frontend is fully connected to the API client, these files are completely unused, but they remain in the directory structure, causing codebase bloat and potential confusion for new developers.

### 🟡 Two Stylistic Token Systems
The frontend code mixes CSS variables (`bg-[var(--color-primary)]`) with custom Tailwind theme classes (`text-azure-800`). Deciding on a single styling standard (either vanilla Tailwind variables or global CSS variables) would improve CSS readability.

### 🟡 Absence of Client-Side Error Boundaries
There are no React error boundary components. Any uncaught runtime exception thrown inside a page will crash the layout, showing the default Next.js error overlay instead of a clean, localized error message.

---

## Low-Priority / Future Concerns

### 🟢 No Accessibilities (A11y) Verification
No keyboard navigation checks or screen reader validation has been performed.

### 🟢 Static SEO
Only the root layout defines basic metadata headers. Individual pages do not export page-specific titles or descriptions.

### 🟢 Missing Localized Loading Screens
Several forms and lists that query the backend API do not display loading skeletons or spinner indicators while resolving network promises, which affects user experience over slower network connections.

---

## Security Audit State

| Component | Risk | Status | Detail |
|---|---|---|---|
| **Authentication** | 🟢 Low | Resolved | Standardized around HTTP-only JWT cookies. |
| **Passwords** | 🟢 Low | Resolved | Hashed with bcrypt on backend; plain-text files deleted. |
| **Authorization** | 🟠 Medium | Ongoing | Enforced via route permissions, but relies on string checks on tags. |
| **Uploads** | 🟡 Medium | Ongoing | Multer filters mime-type, but does not sanitize files or enforce server-side image processing. |
| **Secrets** | 🟢 Low | Resolved | `.env` variables contain credentials locally and are excluded from git. |
