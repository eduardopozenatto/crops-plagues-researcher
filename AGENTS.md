# 🤖 AGENTS.md — Regras de Boas Práticas & Diretrizes de Engenharia da IA

> Este arquivo define as diretrizes estritas de desenvolvimento, arquitetura, qualidade e conduta para agentes de IA atuando no repositório **Radar Agrícola IA**.
> Desenvolvido segundo os padrões de Engenharia de Software Sênior (Fullstack 20+ anos de experiência).

---

## 📌 1. Princípios Fundamentais de Engenharia

1. **Zero Presunção de Schemas e Contratos**:
   - NUNCA infira nomes de variáveis, propriedades de JSON ou endpoints de API.
   - Inspecione sempre as definições autoritativas em [`frontend/src/App.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/App.tsx) e [`backend/services/rag_service.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/services/rag_service.py) antes de alterar o contrato entre frontend e backend.

2. **Garantia de Estabilidade Linux (Zero-SIGBUS)**:
   - O frontend DEVE ser mantido exclusivamente no empacotador **Vite 6 + React 19**.
   - NUNCA reintroduza o Next.js ou empacotadores com binários `.node` compilados em Rust (SWC) que realizem mapeamento direto de memória (`mmap`), causa raiz do erro fatal `SIGBUS` no Linux.

3. **Preservação da Base Agronômica Curada (0ms)**:
   - Preserve e expanda o dicionário `AGRONOMIC_KNOWLEDGE_BASE` em `rag_service.py` (50+ culturas agrícolas brasileiras).
   - Toda cultura cadastrada deve possuir rigorosamente 4 pragas/doenças emblemáticas, contendo os campos: `pestName`, `description`, `impactData`, `controlMethods` e `agriculturalImplements`.

4. **Segurança Absoluta de Segredos e Chaves**:
   - NUNCA faça commit de arquivos `.env` ou de chaves de API (`GEMINI_API_KEY`) no repositório Git.
   - O arquivo `backend/.env` DEVE permanecer listado no `.gitignore`.
   - Utilize sempre a leitura dinâmica `import.meta.env.VITE_BACKEND_URL` no frontend para permitir a ponte de comunicação Vercel ➔ Render na nuvem.

5. **Verificação Obrigatória de Build & Compilação**:
   - Após qualquer modificação no frontend, execute `npm run build` na pasta `frontend` e confirme compilação limpa (0 erros TypeScript).

6. **Diagnóstico Baseado em Logs Reais**:
   - NUNCA formule hipóteses de erro sem inspecionar os logs não-truncados da aplicação ou do comando executado.

---

## 🛠️ 2. Padrões de Código e Convenções

### Frontend (React 19 + TypeScript + Vite)
- Mantenha o design minimalista em Dark Graphite (`#090d0b`).
- Utilize os componentes de ícones da biblioteca `lucide-react`.
- Para URLs do backend, use `const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')`.

### Backend (FastAPI + Python 3.10 + Pydantic v2)
- Utilize Pydantic v2 para validação de contratos JSON.
- Sempre chame `load_dotenv()` no início dos serviços para carregar variáveis de ambiente.
- Mantenha a resiliência no `rag_service.py` com múltiplos fallbacks: Base Curada (0ms) ➔ SDK Gemini (direto) ➔ REST Gemini ➔ Sintetizador Agronômico de Contingência.
