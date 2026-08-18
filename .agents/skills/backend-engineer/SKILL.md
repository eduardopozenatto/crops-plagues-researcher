---
name: backend-engineer
description: Padrões de Engenharia Backend FastAPI, RAG Híbrido, Schemas Pydantic e Integração com Gemini API.
---

# 🐍 Backend Engineer Skill — Radar Agrícola IA

Use esta skill ao modificar o backend FastAPI (`backend/main.py`) ou o serviço RAG (`backend/services/rag_service.py`).

---

## 📌 Padrões do Backend

1. **Schemas Pydantic (`PestInfo` e `CropAnalysisResult`)**:
   - `pestName`: Nome popular + científico entre parênteses.
   - `description`: Biologia e modo de infecção (3 a 5 frases).
   - `impactData`: Sintomas e % de perdas estimadas.
   - `controlMethods`: Recomendações de Manejo Integrado de Pragas (MIP).
   - `agriculturalImplements`: Tratores, pulverizadores de barras e bicos de jato.
   - `sourceUrl`: URL da Embrapa ou `Gemini AI Engine (Gerado via IA)`.

2. **Fluxo RAG Híbrido (`execute_crop_rag_pipeline`)**:
   - **Etapa 1**: Busca exata ou por substring na `AGRONOMIC_KNOWLEDGE_BASE` (0ms).
   - **Etapa 2**: Se não encontrar na base local, lê `GEMINI_API_KEY` do `backend/.env` via `load_dotenv()`.
   - **Etapa 3**: Dispara a chamada ao Gemini com timeout de 20s.
   - **Etapa 4**: Se a API expirar ou falhar, executa `fallback_crop_analysis(crop_name)`.

3. **Endpoints FastAPI**:
   - `GET /api/status`: Retorna `{"status": "online", "model": "FastAPI Hybrid RAG Engine"}`.
   - `POST /api/search`: Recebe `{"cropName": "Feijão"}` e retorna `CropAnalysisResult`.
