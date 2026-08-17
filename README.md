# 🌾 Radar Agrícola IA (Feira de Ciências)

> **Descrição**: Portal web didático, moderno e de alta performance que conecta a **Cultura Agrícola (Planta Semeada)** às suas **Pragas e Doenças Características**, **Métodos de Manejo Integrado (MIP)** e **Implementos e Equipamentos Agrícolas Recomendados** pela literatura científica da Embrapa.

📖 **Guia Completo de Execução Local**: Veja [`EXECUCAO_LOCAL.md`](file:///home/carlos/Projetos/crops-plagues-website/EXECUCAO_LOCAL.md) para instruções detalhadas passo a passo.  
👥 **Explicação Didática para a Equipe**: Veja [`EXPLICACAO_DO_PROJETO.md`](file:///home/carlos/Projetos/crops-plagues-website/EXPLICACAO_DO_PROJETO.md) para entender como o site opera em linguagem simples e sem jargões.  
🚀 **Publicação 100% Gratuita na Internet**: Veja [`DEPLOY_GRATUITO.md`](file:///home/carlos/Projetos/crops-plagues-website/DEPLOY_GRATUITO.md) para subir o site na nuvem (Vercel + Render + Neon).

---

## 📌 1. Visão Geral e Proposta Educativa

O **Radar Agrícola IA** foi desenvolvido para apresentação na **Feira de Ciências**, feiras agrícolas e ambientes acadêmicos. Ele utiliza a **Arquitetura Híbrida Alternativa C** (Base Curada Local + IA Gemini Direta sem Raspagem Web + Auto-Cache no Banco Relacional + Fotos Fotográficas HD) para garantir respostas instantâneas em **0ms** e **zero ruído de internet**.

### 🏆 Pilares do Sistema:
1. **Fotos Ilustrativas Agronômicas por Cultura**: Hero Banner visual HD com fotos fotográficas de alta definição para 50+ culturas agrícolas brasileiras.
2. **Identificação de Pragas por Cultura**: Diagnósticos fitossanitários com 100% de nomes científicos exatos, biologia do patógeno e sintomas específicos nas plantas.
3. **Implementos e Equipamentos Agrícolas**: Mapeamento dos tratores, pulverizadores de barras, atomizadores, sulcadores e bicos de pulverização recomendados para a cultura.
4. **Manejo & Controle Recomendado**: Métodos de Manejo Integrado de Pragas (MIP), controle biológico (*Trichoderma*, *Baculovirus*, parasitóides), controle cultural e vazio sanitário.
5. **Cards Sanfonados (Accordions)**: 4 seções por ameaça com setas interativas (`ChevronDown`/`ChevronUp`) e botão master "Expandir / Recolher Todos".
6. **Multisseleção & Gestão do Banco**: Interface com caixas de seleção, botão "Selecionar Todos" e exclusão em massa no banco de dados.

---

## 🏗️ 2. Arquitetura do Sistema e Fluxo de Dados Híbrido (Alternativa C)

```mermaid
graph TD
    User[Usuário / Jurado da Feira] --> UI[Portal Web Next.js 15]
    UI --> Cache{1. Existe no Banco Local?}
    Cache -- SIM (0ms) --> DB[(PostgreSQL / SQLite via Prisma)]
    DB --> UI
    Cache -- NÃO --> Backend[2. Motor FastAPI Python]
    Backend --> Base[Base Curada Embrapa 50+ Culturas (0ms)]
    Base -- Encontrado --> UI
    Backend -- Não Cadastrado --> Gemini[3. Gemini 3.5 Flash Direto sem Web Scraper (<1.5s)]
    Gemini --> SaveDB[Grava no Banco via Prisma Auto-Cache + Image URL]
    SaveDB --> UI
```

---

## 📁 3. Mapeamento de Arquivos e Funcionalidades

### 🎨 Frontend (`/frontend`)
- [`frontend/src/app/page.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/page.tsx): Componente principal do dashboard.
- [`frontend/src/lib/cropImages.ts`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/lib/cropImages.ts): Mapeador visual de fotos fotográficas HD para 50+ culturas brasileiras.
- [`frontend/src/app/api/search/route.ts`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/api/search/route.ts): Rota API Orchestrator (Cache-First).
- [`frontend/src/app/api/diseases/route.ts`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/app/api/diseases/route.ts): Rota API para consulta do histórico e exclusão individual ou em massa.
- [`frontend/prisma/schema.prisma`](file:///home/carlos/Projetos/crops-plagues-website/frontend/prisma/schema.prisma): Modelagem da tabela `CropDisease`.

### ⚙️ Backend (`/backend`)
- [`backend/main.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/main.py): Aplicação FastAPI.
- [`backend/services/rag_service.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/services/rag_service.py): Núcleo da inteligência fitossanitária híbrida.

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Prisma ORM, SQLite / PostgreSQL.
- **Backend**: FastAPI, Python 3.10+, Uvicorn, Google Gemini API (`google-genai` SDK, `gemini-3.5-flash`), Pydantic v2, `httpx`.
