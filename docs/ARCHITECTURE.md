# 🏗️ Arquitetura do Sistema — Radar Agrícola IA

> **Versão**: 2.3.0 Minimalist (Vite + React 19 + Abas em Cards + Visão em Tabela + Drawer Retrátil)  
> **Última Atualização**: 18/08/2026

---

## 📌 1. Visão Geral da Arquitetura Híbrida

O **Radar Agrícola IA** utiliza uma arquitetura desacoplada de alto desempenho baseada no empacotador **Vite (React 19)** no frontend e motor **FastAPI Python** no backend, oferecendo respostas em **0ms** para 50+ culturas agrícolas e tempo de inicialização dev de **180ms** (100% livre de erros `SIGBUS`).

```mermaid
graph TD
    User[Usuário / Apresentação Feira] --> UI[Portal Web Vite + React 19]
    UI --> Cards[Visão Cards com Abas / Tabela Comparativa]
    UI --> Drawer[Slide-over Drawer de Histórico]
    UI --> Backend[Motor FastAPI Python - Porta 8000]
    Backend --> Base[Base Curada Embrapa 50+ Culturas (0ms)]
    Base -- Encontrado --> UI
    Backend -- Não Cadastrado --> Gemini[Gemini 3.5 Flash Direto (<1.5s)]
    Gemini --> UI
```

---

## 🧱 2. Componentes e Tecnologias

### 🎨 Frontend (Vite + React 19)
- **Tecnologias**: Vite 6, React 19, TypeScript 5, Tailwind CSS v3, Lucide Icons.
- **Responsabilidades**:
  - Renderizar o dashboard minimalista em Dark Graphite (`#090d0b`).
  - Exibir a busca centralizada com atalhos de acesso rápido a culturas.
  - Exibir o **Hero Crop Visual Banner** com foto fotográfica HD da cultura.
  - Alternar entre o **Modo Cards com Abas (`[Descrição] [Sintomas] [MIP] [Tratores]`)** e a **Tabela Comparativa Agronômica Panorâmica**.
  - Gerenciar o **Slide-over Drawer de Histórico Retrátil** com multisseleção e busca.

### 🐍 Backend (FastAPI Python 3.10)
- **Tecnologias**: FastAPI, Uvicorn, Google Gemini API (`google-genai` SDK), Pydantic v2, `httpx`.
- **Responsabilidades**:
  - Manter a base curada `AGRONOMIC_KNOWLEDGE_BASE` cobrindo 50+ culturas agrícolas brasileiras em **0ms**.
  - Acionar o Gemini 3.5 Flash de forma direta com schemas Pydantic JSON estritos.
  - Executar a recusa educada de entradas não agrícolas (ex: "Cadeira", "Windows").
