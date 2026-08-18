# Testing

## Current State

**No tests exist in this project.**
- There are no test files (`*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx`) in either `frontend/` or `backend/` source directories.
- No testing framework (Vitest, Jest, Playwright, or Cypress) is configured.
- No test script shortcuts are registered inside `frontend/package.json` or `backend/package.json`.
- ESLint and TypeScript compilation checks are the only active quality verification steps configured in the project pipelines.

---

## Infrastructure Summary

| Aspect | Frontend (`frontend/`) | Backend (`backend/`) |
|--------|------------------------|----------------------|
| **Unit Test Runner** | ❌ None | ❌ None |
| **Component/Integration Testing** | ❌ None | ❌ None (No Supertest) |
| **E2E/System Testing** | ❌ None | ❌ None |
| **Test Coverage** | ❌ Not tracked | ❌ Not tracked |

---

## Recommendations for Test Configuration

### 1. Frontend Test Setup
Given the Next.js 16 + React 19 + Tailwind v4 stack:
- **Test Runner**: Vitest (faster build time, native ES module resolution).
- **Component Tests**: `@testing-library/react` + `@testing-library/user-event`.
- **API Mocking**: `msw` (Mock Service Worker) to intercept REST requests hitting `http://localhost:3001/api` and return structured mock JSON.

### 2. Backend Test Setup
Given the Express 5 + Prisma 7 + PostgreSQL stack:
- **Test Runner**: Vitest (for consistency with the frontend).
- **Endpoint Tests**: `supertest` to run integration tests against the Express `app` instance without launching the HTTP server listener.
- **Database Isolation**:
  - *Option A (Mock)*: Mock `prisma` database queries using `@prisma/client/testing` or `vitest-mock-extended`.
  - *Option B (Integration)*: Run tests against a local test PostgreSQL database, clearing tables before each test suite execution.

---

## Critical Test Scenarios

### Frontend Coverage Areas
1. **User Authentication Flow**:
   - Client redirect guards (`AuthGate` / `AdminGate`) triggering when session is invalid or loading.
   - Login and recovery form input validations (Zod schemas).
2. **Catalog and Cart State**:
   - Filtering items, checking cart quantity updates, checkout submittals.
3. **Admin Settings**:
   - Checking state updates for categories, permissions, and roles.

### Backend Coverage Areas
1. **Authentication API**:
   - Correct JWT issue in HTTP-only cookie on success login.
   - Password reset code table insertions and expirations.
2. **Access Middleware**:
   - Ensuring `requireAuth` blocks calls missing cookies.
   - Ensuring `requirePermission` returns `403 Forbidden` for insufficient privileges.
3. **Database CRUD**:
   - Inventory item counts, quantity restrictions (e.g. loan item count cannot exceed available stock).
   - Report generating buffers.
