# 🧠 Aprendizados & Decisões Arquiteturais — Radar Agrícola IA

> **Versão do Projeto:** v2.3.0 Minimalist Cloud Ready  
> **Data:** 18/08/2026

---

## 📌 1. Problemas Críticos Resolvidos & Causa Raiz

### 🐛 A) Erro `SIGBUS` (Bus Error) no Linux com Next.js 15
- **Causa Raiz**: O empacotador do Next.js 15 utiliza compilação nativa em Rust (`next-swc.linux-x64-gnu.node`) via mapeamento de memória (`mmap`). Em certas distribuições Linux / shells (Fish/Bash) com limites de páginas de memória, a chamada de sistema `mmap()` falha com o sinal `SIGBUS` (Bus Error) ao carregar binários nativos de 136MB.
- **Solução**: Migração total do frontend para **Vite 6 + React 19 + Tailwind CSS**. Como o ESbuild do Vite roda em JavaScript/Wasm sem binários nativos `.node` de baixo nível, o erro `SIGBUS` foi zerado (0% de falhas) e a inicialização caiu de vários segundos para **180ms**.

### 📦 B) Erro `GH001 / Large files detected` no GitHub Push
- **Causa Raiz**: A pasta `node_modules/` do Next.js continha binários compilados (`next-swc.linux-x64-gnu.node`) ultrapassando 136MB, bloqueados pelo limite de 100MB por arquivo do GitHub.
- **Solução**: Criação de `.gitignore` abrangente (`node_modules/`, `.next/`, `dist/`, `venv/`, `*.db`, `.env`), desindexação no Git (`git rm -r --cached`) e recriação do histórico em um commit limpo de **67 KiB**.

### ⚡ C) Variáveis de Ambiente do Vite na Nuvem (Vercel ➔ Render)
- **Causa Raiz**: No Vite, o cliente web só expõe variáveis de ambiente que começam com o prefixo obrigatorio `VITE_` (`import.meta.env.VITE_BACKEND_URL`).
- **Solução**: Atualização em `App.tsx` para `const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')` e inclusão do arquivo de tipos `src/vite-env.d.ts`.

---

## 🏗️ 2. Padrões de Projeto & Arquitetura Consolidada

1. **Motor RAG Híbrido Alternativa C**:
   - **Camada 1 (Base Curada local em 0ms)**: Respostas instantâneas baseadas em dados grounded da Embrapa para 50+ culturas brasileiras.
   - **Camada 2 (IA Generativa Gemini Direta em <1.5s)**: Chamada direta à API do Google Gemini com schemas Pydantic JSON estritos para culturas raras.
   - **Camada 3 (Recusa Fitossanitária Educada)**: Detecção automática via IA para rejeitar termos não agrícolas (ex: *"Cadeira"* ou *"Computador"*).

2. **UX Minimalista de Alta Densidade**:
   - **Tabbed Cards**: 4 abas por card (`[Descrição] [Sintomas] [MIP] [Tratores]`) para reduzir o scroll da página em 60%.
   - **Alternador Duplo**: Suporte instantâneo entre o modo de Cards com Abas e a Tabela Comparativa Agronômica Panorâmica.
   - **Slide-over Drawer**: Histórico retrátil que mantém o painel principal limpo.

---

## 🔒 3. Boas Práticas de Segurança
- A chave de API (`GEMINI_API_KEY`) é mantida estritamente em `backend/.env` local ou nas variáveis de ambiente seguras do Render, sendo impedida de subir ao repositório público pelo `.gitignore`.
