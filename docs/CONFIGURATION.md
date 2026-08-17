# ⚙️ Guia de Configuração e Variáveis de Ambiente (`docs/CONFIGURATION.md`)

---

## 📌 1. Variáveis do Backend (`backend/.env`)

| Variável | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | String (Obrigatório para IA) | Chave do Google AI Studio para o Gemini 3.5 Flash | `AIzaSyD...` |

---

## 📌 2. Variáveis do Frontend (`frontend/.env`)

| Variável | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String (Obrigatório) | Connection string do SQLite (local) ou PostgreSQL (nuvem) | `file:./dev.db` ou `postgresql://...` |
| `NEXT_PUBLIC_BACKEND_URL` | String | URL pública do backend FastAPI | `http://localhost:8000` ou `https://radar-backend.onrender.com` |
