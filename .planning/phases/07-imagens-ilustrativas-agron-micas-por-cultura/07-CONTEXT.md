# Phase 07 Context: Imagens Ilustrativas Agronômicas por Cultura (Crop Visuals & DB Persistence)

> **Phase**: 07  
> **Name**: Imagens Ilustrativas Agronômicas por Cultura (Crop Visuals & DB Persistence)  
> **Date**: 2026-08-17  
> **Status**: Context Locked — Ready for Execution

---

## 🎯 Domain Boundary & Goal

Implement high-definition, agronomic crop photos for every searched crop (e.g., Feijão, Tomate, Milho, Soja, Café, Algodão, Trigo, Batata, Cacau, Carambola, Banana, Morango, Mandioca, Cana, Laranja, Uva, etc.).
1. **Prisma Schema Update**: Add optional `cropImageUrl` field to `CropDisease` model.
2. **Backend & Frontend Image Mapping**: Provide a comprehensive dictionary of high-resolution Unsplash agricultural photography mapped by normalized crop names.
3. **UI Hero Crop Banner**: Display a prominent crop image header banner on search results.
4. **History & Modal Thumbnails**: Display elegant crop photo thumbnails on history cards and in the detail modal.

---

## 🔒 Locked User Decisions

- **Visual Quality**: Use realistic, professional agronomic photos of crops (fields, fruits, harvests).
- **Fallback**: Provide a default agricultural green field visual if an uncommon crop name is entered.
- **Persistence**: Save `cropImageUrl` in the database so that recalled history items display their associated crop photo instantly.

---

## 📂 Canonical References

- [`frontend/prisma/schema.prisma`](file:///home/carlos/Projetos/crops-plagues-website/frontend/prisma/schema.prisma) — Prisma Database Schema.
- [`frontend/src/app/page.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/page.tsx) — Main React Client Dashboard Component.
- [`frontend/src/app/api/search/route.ts`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/api/search/route.ts) — Search API Orchestrator.
- [`backend/services/rag_service.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/services/rag_service.py) — Python RAG Service.
