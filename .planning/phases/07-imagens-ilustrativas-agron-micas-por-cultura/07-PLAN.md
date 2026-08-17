# Phase 07 Plan: Imagens Ilustrativas Agronômicas por Cultura

> **Phase**: 07  
> **Name**: Imagens Ilustrativas Agronômicas por Cultura  
> **Status**: Ready for Execution

---

## 🎯 Task Decomposition & Execution Plan

### Task 1: Update Prisma Schema & Push Migration
- **Goal**: Add `cropImageUrl` to `CropDisease` model.
- **Action**:
  - Update [`frontend/prisma/schema.prisma`](file:///home/carlos/Projetos/crops-plagues-website/frontend/prisma/schema.prisma).
  - Execute `npx prisma db push` in `frontend`.
- **Files**: [`frontend/prisma/schema.prisma`](file:///home/carlos/Projetos/crops-plagues-website/frontend/prisma/schema.prisma)

### Task 2: Implement Crop Photo Mapping in Backend & Frontend
- **Goal**: Provide high-definition agricultural imagery for 50+ Brazilian crops.
- **Action**:
  - Add `getCropImageUrl(cropName)` helper with curated Unsplash photo URLs for Feijão, Tomate, Milho, Soja, Café, Algodão, Trigo, Batata, Cacau, Carambola, Banana, Morango, Mandioca, Cana, Laranja, Uva, Mamão, Abacaxi, Melancia, Goiaba, Abacate, Melão, Maracujá, Pitaya, Cenoura, Cebola, Alho, etc.
  - Include `cropImageUrl` in Next.js `search/route.ts` API response and Prisma DB creation.
- **Files**: [`frontend/src/app/api/search/route.ts`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/api/search/route.ts), [`backend/services/rag_service.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/services/rag_service.py)

### Task 3: Render Hero Crop Visual Banner & Card Thumbnails in `page.tsx`
- **Goal**: Display realistic, crisp photos on the search results banner, history cards, and technical modal.
- **Action**:
  - Render a Hero Visual Crop Header with photo background, dark gradient overlay, and crop badge.
  - Render top image header thumbnails on history cards and in the detail modal.
- **Files**: [`frontend/src/app/page.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/page.tsx)

### Task 4: Build Verification & UAT Check
- **Goal**: Ensure clean Next.js build (`npm run build`).
- **Action**: Run `npm run build` in `frontend`.
- **Files**: All frontend components.
