# 📜 Convenções de Código & Estilo — Radar Agrícola IA

---

## 📌 1. Convenções Frontend (TypeScript + React 19)
- **Modo Estrito**: Todo código TypeScript deve compilar sem avisos de `any` implícito.
- **Tipagem de Variáveis de Ambiente**: Mantenha o arquivo `src/vite-env.d.ts` declarando as variáveis customizadas do Vite (`VITE_BACKEND_URL`).
- **Nomenclatura de Componentes e Funções**:
  - Funções de manipular eventos: prefixo `handle` (ex: `handleSearch`).
  - Funções de estado ou alternadores: prefixo `toggle` ou `set` (ex: `toggleSelectRecord`).
- **Estilização Tailwind CSS**:
  - Paleta principal: Dark Graphite (`#090d0b`), Esmeralda (`emerald-500`), Slate escuro (`slate-950`).
  - Manter transições suaves (`transition-all`, `backdrop-blur-md`).

---

## 📌 2. Convenções Backend (Python + FastAPI)
- **Snake_case vs CamelCase**:
  - Código Python interno utiliza `snake_case`.
  - Atributos das classes Pydantic expostos para o JSON do frontend utilizam `camelCase` (`pestName`, `impactData`, `controlMethods`, `agriculturalImplements`, `sourceUrl`) para manter compatibilidade com o contrato TypeScript no React.
- **Carregamento de Variáveis**:
  - Sempre incluir `load_dotenv()` antes de tentar acessar `os.getenv("GEMINI_API_KEY")`.
- **Tratamento de Exceções**:
  - Capturar exceções de rede com `httpx.Timeout` e registrar logs explicativos sem quebrar a API.
