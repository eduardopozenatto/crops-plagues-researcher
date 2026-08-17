# 🗺️ Project Roadmap — Radar Agrícola IA

> **Current Version:** v2.2.0 Crop Imagery Refactor (Science Fair Ready)  
> **Milestone Status:** Phase 1, Phase 2, Phase 3, Phase 5, Phase 6, Phase 7 Completed & Verified

---

## 📌 Milestones & Phase Progress

### Phase 1: Core RAG Engine & Decoupled Architecture
- [x] FastAPI Python Backend setup (`main.py`)
- [x] Integration with Google Gemini 3.5 Flash SDK (`rag_service.py`)
- [x] DuckDuckGo web search integration with Embrapa domain filtering
- [x] Pydantic models for structured JSON output (`PestInfo`, `CropAnalysisResult`)

### Phase 2: High-Rigor Agronomic Base & Scientific Implements
- [x] Curated 30+ Brazilian crops in `AGRONOMIC_KNOWLEDGE_BASE`
- [x] Prioritize crop-characteristic pests (BGMV, Pyricularia, Phytophthora, Moniliophthora)
- [x] Add `controlMethods` (MIP) and `agriculturalImplements` to schema and UI
- [x] Database migration & sync via Prisma (`npx prisma db push`)

### Phase 3: Science Fair UI & Multi-Select Management
- [x] Dark mode emerald glassmorphism dashboard (`page.tsx`)
- [x] Science Fair presentation banner and educational modal
- [x] Agronomic Engineer technical disclaimers
- [x] Multi-selection checkboxes and bulk deletion (`DELETE /api/diseases`)

### Phase 5: Refatoração do Motor Híbrido de Busca (Alternativa C)
- [x] Remoção completa da raspagem ruidosa do DuckDuckGo no `rag_service.py`
- [x] Geração direta estruturada via Gemini 3.5 Flash com schema Pydantic e recusa de entradas não agrícolas
- [x] Expansão da base curada local para 50+ culturas agrícolas brasileiras cobrindo os 5 grandes setores
- [x] Otimização do fluxo Cache-First no Next.js (`search/route.ts`) com gravação automática (Auto-Cache) no Prisma DB e identificação clara da fonte (`Gemini AI Engine`)
- [x] Validação UAT de tempo de resposta (<100ms no cache local, <1.5s na IA) e verificação de zero ruído de web

### Phase 6: Refatoração de UI/UX (Cards Sanfonados Accordion + Responsividade Mobile Total)
- [x] Implementação de sistema sanfonado (accordion) expansível/recolhível com ícones de seta (`ChevronDown`/`ChevronUp`) nas 4 seções de cada ameaça (Descrição, Sintomas, Manejo e Implementos)
- [x] Botão de controle mestre ("Expandir Todos" / "Recolher Todos") para facilidade de navegação
- [x] Otimização de responsividade móvel (breakpoints `sm:`, `md:`, `lg:`, touch-friendly padding, ajuste de tipografia e botões em telas pequenas)
- [x] Validação UAT e verificação de compilação Next.js (`npm run build` compilado com sucesso em 3.9s)

### Phase 7: Imagens Ilustrativas Agronômicas por Cultura (Crop Visuals & DB Persistence)
- [x] Adição do campo `cropImageUrl` ao modelo Prisma `CropDisease` e sincronização via `npx prisma db push`
- [x] Mapeador visual agronômico de fotos HD por cultura (`cropImages.ts` cobrindo 50+ culturas brasileiras)
- [x] Banner visual de destaque (Hero Banner) com foto fotográfica em alta definição no painel de resultados de busca
- [x] Miniaturas visuais nos cards do histórico do banco de dados e no modal de ficha técnica
- [x] Validação UAT e teste de compilação `npm run build` (compilado com sucesso em 2.1s)

### Phase 4: Public Deployment & Science Fair Extras
- [ ] Deploy frontend to Vercel/Netlify with PostgreSQL (Supabase)
- [ ] Deploy backend FastAPI service to Railway/Render
- [ ] Add offline PDF export for Science Fair judges
