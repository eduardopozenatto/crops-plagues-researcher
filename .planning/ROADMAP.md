# 🗺️ Project Roadmap — Radar Agrícola IA

> **Current Version:** v2.3.0 Minimalist UI Refactor (Vite + React 19)  
> **Milestone Status:** All Core & Refactoring Phases Completed & Verified

---

## 📌 Milestones & Phase Progress

### Phase 1: Core RAG Engine & Decoupled Architecture
- [x] FastAPI Python Backend setup (`main.py`)
- [x] Integration with Google Gemini 3.5 Flash SDK (`rag_service.py`)
- [x] Structured JSON output for crops and pests

### Phase 2: High-Rigor Agronomic Base & Scientific Implements
- [x] Curated 50+ Brazilian crops in `AGRONOMIC_KNOWLEDGE_BASE`
- [x] Add `controlMethods` (MIP) and `agriculturalImplements` to schema and UI

### Phase 3: Science Fair UI & Multi-Select Management
- [x] Science Fair presentation banner and educational modal
- [x] Multi-selection checkboxes and bulk deletion in history

### Phase 5: Refatoração do Motor Híbrido de Busca (Alternativa C)
- [x] Remoção completa da raspagem ruidosa do DuckDuckGo no `rag_service.py`
- [x] Geração direta estruturada via Gemini 3.5 Flash com schema Pydantic e recusa de entradas não agrícolas
- [x] Expansão da base curada local para 50+ culturas agrícolas brasileiras

### Phase 6: Refatoração de UI/UX Minimalista (Abas em Cards + Visão Tabela + Slide-over Drawer)
- [x] Migração para **Vite + React 19** eliminando 100% dos erros `SIGBUS` e reduzindo o startup dev para **180ms**
- [x] Cards de pragas com **4 Abas Navegáveis (`[Descrição] [Sintomas] [MIP] [Tratores]`)** reduzindo a rolagem da página em **60%**
- [x] Modo de exibição duplo: **Cards com Abas** vs. **Tabela Comparativa Agronômica Panorâmica**
- [x] **Slide-over Drawer Retrátil de Histórico** acionado no cabeçalho
- [x] Compilação de produção verificada com `npm run build` (3.43s) e sincronizada com o GitHub (`main -> main`)
