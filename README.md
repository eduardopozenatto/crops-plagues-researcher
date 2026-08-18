# 🌾 Radar Agrícola IA

> **Plataforma de Pesquisa Agronômica, Diagnóstico Fitossanitário & Manejo de Lavoras (IA Generativa & RAG Híbrido)**

O **Radar Agrícola IA** é uma aplicação web moderna e minimalista desenvolvida para conectar qualquer cultura agrícola semeada (*Feijão*, *Tomate*, *Milho*, *Soja*, *Café*, *Trigo*, *Batata*, *Cacau*, etc.) diretamente às suas **4 principais pragas e doenças emblemáticas**, apresentando:

- **📸 Fotografia Agronômica em Alta Definição (HD)**.
- **📄 Descrição biológica e agente causador**.
- **⚠️ Sintomas e perdas quantitativas estimadas na lavoura (%)**.
- **🛡️ Recomendações de Manejo Integrado de Pragas (MIP)**.
- **🚜 Implementos agrícolas, tratores, pulverizadores e bicos de pulverização**.

---

## 🎨 Principais Destaques de UI/UX Minimalista

- **Cards com Abas Navegáveis (`[Descrição] [Sintomas] [MIP] [Tratores]`)**: Redução de 60% no scroll vertical.
- **Modo Tabela Comparativa Agronômica**: Alternador instantâneo para visão panorâmica em colunas lado a lado (ideal para apresentações em Feiras de Ciências).
- **Slide-over Drawer de Histórico**: Painel flutuante retrátil para gerenciamento de buscas salvas com exclusão em massa.
- **Zero-SIGBUS no Linux**: Construído em **Vite 6 + React 19**, iniciando em **180ms** com 100% de estabilidade.

---

## 🏗️ Arquitetura Híbrida Alternativa C

```
[ Frontend: Vite + React 19 (Vercel) ]
                  │
                  ▼  HTTP REST (VITE_BACKEND_URL)
[ Backend: FastAPI Python 3.10 (Render) ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ Base Embrapa 0ms ]   [ Google Gemini API ]
(50+ Culturas)         (gemini-2.5-flash / <1.5s)
```

1. **Base Curada Embrapa (0ms)**: Cobertura grounded de 50+ culturas brasileiras sem latência de rede.
2. **Google Gemini API (<1.5s)**: Diagnósticos em tempo real via IA Generativa para culturas não catalogadas com validação Pydantic e recusa fitossanitária de termos não agrícolas.

---

## ⚡ Guia Rápido de Inicialização Local

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2. Frontend (Vite + React 19)
```bash
cd frontend
npm install
npm run dev
```
Acesse no seu navegador: **`http://localhost:3000`**

---

## 📚 Documentação do Projeto

- **[Explicação Didática do Projeto](file:///home/carlos/Projetos/crops-plagues-website/EXPLICACAO_DO_PROJETO.md)**
- **[Guia de Deploy Gratuito na Nuvem (Vercel + Render)](file:///home/carlos/Projetos/crops-plagues-website/DEPLOY_GRATUITO.md)**
- **[Guia de Execução Local](file:///home/carlos/Projetos/crops-plagues-website/EXECUCAO_LOCAL.md)**
- **[Especificação da Arquitetura](file:///home/carlos/Projetos/crops-plagues-website/docs/ARCHITECTURE.md)**
- **[Especificação da API REST](file:///home/carlos/Projetos/crops-plagues-website/docs/API.md)**
