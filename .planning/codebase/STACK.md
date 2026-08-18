# 🛠️ Codebase Tech Stack — Radar Agrícola IA

> **Versão**: 2.3.0 Minimalist Cloud Ready  
> **Última Atualização**: 18/08/2026

---

## 🎨 Frontend Stack
- **Framework**: React 19 (`react`, `react-dom`)
- **Bundler & Dev Server**: Vite 6 (`vite`, `@vitejs/plugin-react`)
- **Estilização**: Tailwind CSS v3 (`tailwindcss`, `autoprefixer`, `postcss`)
- **Ícones**: Lucide Icons (`lucide-react`)
- **Linguagem**: TypeScript 5 (`typescript`)
- **Hospedagem**: Vercel (Configurado em `VITE_BACKEND_URL`)

## 🐍 Backend Stack
- **Framework**: FastAPI (`fastapi`, `uvicorn`)
- **Linguagem**: Python 3.10+
- **Motor de IA Generativa**: Google GenAI SDK (`google-genai`) & Gemini REST Fallback (`httpx`)
- **Modelos Recomendados**: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`
- **Validação de Schemas**: Pydantic v2 (`pydantic`)
- **Variáveis de Ambiente**: `python-dotenv`
- **Hospedagem**: Render.com (`backend/main.py`)
