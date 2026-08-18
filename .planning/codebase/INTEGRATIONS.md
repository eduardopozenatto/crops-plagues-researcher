# External Integrations

## Current State

**The frontend is fully connected to the backend REST API.** There is no longer any mock data dependency in the UI layers. The application interacts with a Node/Express backend that manages data state and operations via Prisma ORM connected to a PostgreSQL database.

---

## API Client & Connection

| Aspect | Details |
|--------|---------|
| **Base URL** | Configured via `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:3001/api`) |
| **Client Code** | `frontend/lib/api/client.ts` exports a unified `api` utility object (`get`, `post`, `put`, `patch`, `del`) |
| **Credentials** | All request options use `credentials: "include"`, enabling JWT transport via HTTP-only cookies |
| **Error Handling** | Throws `Error` when the server returns a non-OK status, which is caught and displayed by the UI |

---

## Authenticated Session & Access Control

1. **State Injection**: The frontend `AuthContext` requests `GET /api/auth/me` on startup. If authenticated, the response sets the user state.
2. **Session Cookie**: Auth token is generated as a JWT by the backend on `/api/auth/login` or `/api/auth/register`, and transported back to the client in an HTTP-only secure cookie named `token`.
3. **Session Interceptor**: The backend middleware `requireAuth` extracts the JWT from request cookies, verifies it with `JWT_SECRET`, checks if the user exists in the DB, and appends the user details to `req.user`.
4. **Permission Guard**: The middleware `requirePermission(permissionName)` checks if `req.user`'s role matches `"admin"` or has the required boolean permission flag in their assigned Tag JSON configuration or per-user overrides.

---

## File Uploads & Asset Serving

The backend implements multipart form-data handling for user avatars and inventory items.

- **Multer Middleware**: Configured in `backend/src/routes/auth.routes.ts` and `backend/src/routes/inventory.routes.ts` using `diskStorage`.
- **Destination**: Uploaded files are renamed using a unique timestamp suffix and saved inside `backend/public/uploads/`.
- **Static Assets Host**: Express serves these files statically. The client retrieves the image by prepending the backend's host origin to the path saved in the database (e.g., `http://localhost:3001/uploads/image-12345.png`).

---

## Email Service (Nodemailer)

Used for transaction notifications and account management.

- **SMTP Transport**: Configured via environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) using `nodemailer`.
- **Password Reset Code**: `POST /api/auth/recovery` generates a random 6-character string reset code, persists it in the `PasswordResetCode` model with a 15-minute expiration window, and emails it to the user.

---

## Reports & Document Export

Reports are dynamically generated on the server:
- **Excel Export**: Express controller parses inventory or loan records, formats them, and writes them to a spreadsheet buffer using the `exceljs` package.
- **Stream Return**: The spreadsheet file is sent back with appropriate `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` headers, prompting a browser download.

---

## Databases

- **Database**: PostgreSQL (relational storage).
- **ORM**: Prisma Client. Models are defined in `backend/prisma/schema.prisma`.
- **Initialization**: Database migrations are handled via Prisma CLI (`npx prisma migrate dev`), and static/initial data seeds are populated via `prisma/seed.ts`.
