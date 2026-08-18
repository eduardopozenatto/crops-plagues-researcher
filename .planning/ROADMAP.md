# 🗺️ Project Roadmap — Radar Agrícola IA

> **Current Version:** v2.3.0 Minimalist UI & Cloud Integration (Vite + React 19 + Vercel + Render)  
> **Milestone Status:** All Core, Refactoring & Cloud Integration Phases Completed & Verified

---

## 📌 Milestones & Phase Progress

### Phase 1: Core RAG Engine & Decoupled Architecture
- [x] FastAPI Python Backend setup (`main.py`)
- [x] Integration with Google Gemini SDK (`rag_service.py`)
- [x] Structured JSON output for crops and pests

### Phase 2: High-Rigor Agronomic Base & Scientific Implements
- [x] Curated 50+ Brazilian crops in `AGRONOMIC_KNOWLEDGE_BASE`
- [x] Add `controlMethods` (MIP) and `agriculturalImplements` to schema and UI

### Phase 3: Science Fair UI & Multi-Select Management
- [x] Science Fair presentation banner and educational modal
- [x] Multi-selection checkboxes and bulk deletion in history

### Phase 4: Deploy Gratuito na Nuvem (Vercel + Render)
- [x] Guia de publicação em `DEPLOY_GRATUITO.md`
- [x] Integração dinâmica de `VITE_BACKEND_URL` em `App.tsx` para comunicação Vercel ➔ Render
- [x] Proteção da `GEMINI_API_KEY` via `.gitignore` e `backend/.env`

### Phase 5: Refatoração do Motor Híbrido de Busca (Alternativa C)
- [x] Geração direta estruturada via Gemini com schema Pydantic e recusa de entradas não agrícolas
- [x] Expansão da base curada local para 50+ culturas agrícolas brasileiras

### Phase 6: Refatoração de UI/UX Minimalista & Integração de Nuvem
- [x] Migração para **Vite + React 19** eliminando 100% dos erros `SIGBUS`
- [x] Cards de pragas com **4 Abas Navegáveis (`[Descrição] [Sintomas] [MIP] [Tratores]`)**
- [x] Modo de exibição duplo: **Cards com Abas** vs. **Tabela Comparativa Agronômica Panorâmica**
- [x] **Slide-over Drawer Retrátil de Histórico** acionado no cabeçalho
- [x] Compilação de produção verificada com `npm run build` (2.87s) e sincronizada com o GitHub (`main -> main`)
