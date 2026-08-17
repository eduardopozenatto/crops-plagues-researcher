# 🏗️ Arquitetura do Sistema — Radar Agrícola IA

> **Versão**: 2.2.0 (Alternativa C + Accordions Sanfonados + Fotos Agronômicas HD)  
> **Última Atualização**: 17/08/2026

---

## 📌 1. Visão Geral da Arquitetura Híbrida

O **Radar Agrícola IA** utiliza uma arquitetura desacoplada de alto desempenho baseada em **Cache-First** e **Geração Direta via IA sem raspagem de web**, projetada para latência **0ms** nas 50+ principais culturas brasileiras.

```mermaid
graph TD
    User[Usuário / Apresentação Feira] --> UI[Portal Web Next.js 15]
    UI --> Cache{1. Existe no Banco Local?}
    Cache -- SIM (0ms) --> DB[(PostgreSQL / SQLite via Prisma)]
    DB --> UI
    Cache -- NÃO --> Backend[2. Motor FastAPI Python]
    Backend --> Base[Base Curada Embrapa 50+ Culturas (0ms)]
    Base -- Encontrado --> UI
    Backend -- Não Cadastrado --> Gemini[3. Gemini 3.5 Flash Direto (<1.5s)]
    Gemini --> SaveDB[Grava no Banco via Prisma Auto-Cache + Image URL]
    SaveDB --> UI
```

---

## 🧱 2. Componentes e Tecnologias

### 🎨 Frontend (Next.js 15 App Router)
- **Tecnologias**: React 19, TypeScript 5, Tailwind CSS v4, Lucide React, Prisma ORM.
- **Responsabilidades**:
  - Renderizar o dashboard visual com dark mode emerald e glassmorphism.
  - Exibir o **Hero Crop Visual Banner** com foto fotográfica HD da cultura.
  - Gerenciar os **Cards Sanfonados (Accordions)** com setas interativas (`ChevronDown`/`ChevronUp`) e o controle mestre *"Expandir / Recolher Todos"*.
  - Gerenciar a **Multisseleção** para exclusão de registros do histórico em massa.
  - Orquestrar a consulta Cache-First via `/api/search`.

### 🐍 Backend (FastAPI Python 3.10)
- **Tecnologias**: FastAPI, Uvicorn, Google Gemini API (`google-genai` SDK), Pydantic v2, `httpx`.
- **Responsabilidades**:
  - Manter a base curada `AGRONOMIC_KNOWLEDGE_BASE` cobrindo 50+ culturas agrícolas brasileiras em **0ms**.
  - Acionar o Gemini 3.5 Flash de forma direta com schemas Pydantic JSON estritos.
  - Executar a **Validação Fitossanitária de Entradas Não Agrícolas** (ex: recusa de termos como "Cadeira" ou "Windows").

### 💾 Banco de Dados Relacional (Prisma ORM)
- **Modelagem (`CropDisease`)**:
  - `id`: String UUID
  - `cropName`: Nome da cultura agrícola
  - `cropImageUrl`: URL da foto fotográfica HD da cultura
  - `pestName`: Nome popular e científico da praga
  - `description`: Descrição biológica e agente causador
  - `impactData`: Sintomas e prejuízos quantitativos
  - `controlMethods`: Métodos de Manejo Integrado (MIP)
  - `agriculturalImplements`: Tratores, pulverizadores e equipamentos
  - `sourceUrl`: URL da Embrapa ou `Gemini AI Engine (Gerado via IA)`
  - `createdAt`: Data de gravação
