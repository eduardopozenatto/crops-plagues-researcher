# 🤖 AGENTS.md — Regras de Boas Práticas & Diretrizes da IA

> Este arquivo define as diretrizes estritas de desenvolvimento, qualidade e conduta para agentes de IA atuando no repositório **Radar Agrícola IA**.

---

## 📌 1. Regras Fundamentais de Execução

1. **Nunca Presuma Schemas ou Tipos**:
   - Sempre verifique definições em [`frontend/src/App.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/App.tsx) e [`backend/services/rag_service.py`](file:///home/carlos/Projetos/crops-plagues-website/backend/services/rag_service.py) antes de modificar contratos de API.

2. **Manutenção do Zero-SIGBUS em Linux**:
   - Mantenha o frontend em **Vite + React 19**. Nunca reintroduza empacotadores com binários `.node` nativos SWC que causam `SIGBUS` por `mmap` no Linux.

3. **Proteção da Base Curada Embrapa (0ms)**:
   - Preserve o dicionário `AGRONOMIC_KNOWLEDGE_BASE` cobrindo 50+ culturas agrícolas. Toda nova cultura adicionada deve conter as 4 pragas com `description`, `impactData`, `controlMethods` e `agriculturalImplements`.

4. **Segurança de Variáveis de Ambiente & Chaves**:
   - NUNCA faça commit de arquivos `.env` ou chaves de API (`GEMINI_API_KEY`) no Git.
   - Mantenha `backend/.env` listado no `.gitignore`.
   - Utilize a leitura dinâmica `import.meta.env.VITE_BACKEND_URL` no frontend para permitir a integração Vercel ➔ Render.

5. **Verificação Obrigatória de Build**:
   - Após alterar o frontend, execute sempre `npm run build` na pasta `frontend` para garantir 0 erros de compilação TypeScript.

6. **Inspecione Logs em Silêncio**:
   - Ao executar tarefas em segundo plano (`run_command`, `manage_task`, `git push`), inspecione o output silenciosamente e forneça resumos objetivos em português.
