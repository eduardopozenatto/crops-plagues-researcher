---
name: architecture
description: Diretrizes de Arquitetura do Sistema, Topologia Híbrida e Design System Minimalista do Radar Agrícola IA.
---

# 🏛️ Architecture Skill — Radar Agrícola IA

Use esta skill quando precisar entender ou modificar a topologia do sistema, os padrões de UI/UX ou a integração entre frontend e backend.

---

## 📌 Topologia do Sistema

```
[ Frontend: Vite + React 19 (Vercel) ]
                  │
                  ▼ HTTP REST (/api/search)
[ Backend: FastAPI Python (Render) ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ Base Embrapa 0ms ]   [ Google Gemini API ]
(50+ Culturas)         (gemini-2.5-flash / <1.5s)
```

## 🎨 Componentes Principais de UI:
1. **Hero Search**: Campo focal com chips rápidos de cultura (*Feijão*, *Tomate*, *Milho*, *Soja*, *Café*, etc.).
2. **Hero Crop Visual Banner**: Imagem em HD obtida via `getCropImageUrl(cropName)`.
3. **Tabbed Pest Cards**: 4 abas por card (`[Descrição]`, `[Sintomas]`, `[MIP]`, `[Tratores]`).
4. **Tabela Comparativa Agronômica**: Visão lado a lado para apresentações em feiras.
5. **Slide-over Drawer**: Histórico retrátil no topo da tela.
