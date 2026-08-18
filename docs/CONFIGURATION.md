# ⚙️ Guia de Configuração e Variáveis de Ambiente (`docs/CONFIGURATION.md`)

---

## 📌 1. Variáveis do Backend (`backend/.env`)

| Variável | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | String (Obrigatório para IA) | Chave do Google AI Studio para o Gemini 2.5 / 3.5 Flash | `AQ.Ab8RN6...` |

---

## 📌 2. Variáveis do Frontend (`frontend/.env` ou Vercel Environment Variables)

| Variável | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `VITE_BACKEND_URL` | String | URL pública do backend FastAPI no Render | `https://seu-backend.onrender.com` ou `http://localhost:8000` |
