# 🌐 System Integrations — Radar Agrícola IA

---

## 🤖 1. Google Gemini API (AI Engine)
- **SDK**: `google-genai`
- **Fallback**: REST via `httpx` para `https://generativelanguage.googleapis.com/v1beta/models/...`
- **Autenticação**: Variável `GEMINI_API_KEY` (configurada em `backend/.env` ou no painel do Render).
- **Recursos**: Geração estrita de JSON agronômico com 4 pragas, MIP e tratores, mais recusa educada de entradas não agrícolas.

## 🌿 2. Base Agronômica Curada (Embrapa Grounded)
- **Localização**: `backend/services/rag_service.py` (`AGRONOMIC_KNOWLEDGE_BASE`)
- **Desempenho**: Resposta em **0ms** para 50+ culturas brasileiras sem dependência de rede externa.

## ☁️ 3. Integração Vercel (Frontend) ➔ Render (Backend)
- **Comunicação**: HTTP JSON REST API (`/api/search` e `/api/status`)
- **Configuração no Frontend**: `const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')`
