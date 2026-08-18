# 🌾 PROJECT.md — Radar Agrícola IA

> **Project Name**: Radar Agrícola IA  
> **Repository**: `github.com:eduardopozenatto/crops-plagues-researcher.git`  
> **Current Version**: v2.3.0 Minimalist Cloud Ready  
> **Primary Use Case**: Science Fair & Agronomic Fitossanitary Identification Platform  

---

## 🎯 1. Mission & Vision

The **Radar Agrícola IA** is a high-performance, minimalist web application built to connect agricultural crops (*Feijão*, *Tomate*, *Milho*, *Soja*, *Café*, *Trigo*, *Batata*, *Cacau*, etc.) directly to their 4 most emblematic pests/diseases, symptoms, Integrated Pest Management (MIP) practices, and required agricultural implements (tractors, sprayers, nozzles).

### Core Goals:
1. **Instantaneous Diagnoses (0ms)**: Serve pre-grounded Embrapa data for 50+ Brazilian crops with zero network latency.
2. **Generative AI Fallback (<1.5s)**: Direct Google Gemini API generation for uncatalogued crops with strict Pydantic JSON schemas and non-agricultural input rejection.
3. **High Density Minimalist UI**: Tabbed cards (`[Descrição] [Sintomas] [MIP] [Tratores]`), side-by-side agronomic comparison table, and a slide-over history drawer.
4. **Linux & Cloud Stability**: 100% free of SWC/Rust native `mmap` `SIGBUS` crashes via Vite 6 + React 19, ready for free Vercel + Render cloud hosting.

---

## 📐 2. Architecture Overview

```
[ User Browser / Vercel ]
        │
        ▼  HTTP (VITE_BACKEND_URL)
[ FastAPI Backend / Render ]
        │
        ├── 1. Embrapa Knowledge Base (0ms)
        └── 2. Google Gemini API (gemini-2.5-flash / gemini-2.0-flash)
```

---

## 🚀 3. Key Features

- **Minimalist Focal Search**: Clean search bar with quick preset chips.
- **Hero Crop Visual Banner**: High-definition photograph for every searched crop.
- **Tabbed Pest Cards**: 60% reduction in vertical page scroll.
- **Panoramic Agronomic Table View**: Toggle between Tabbed Cards and a comparison table.
- **Slide-over History Drawer**: Floating history panel with multi-selection and bulk deletion.
- **Educational Science Fair Modal**: Non-technical overview for team members and judges.
