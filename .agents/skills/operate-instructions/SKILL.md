---
name: operate-instructions
description: Instruções de Operação Local, Build de Produção, Deploy na Nuvem e Fluxo de Git Push SSH.
---

# ⚙️ Operate Instructions Skill — Radar Agrícola IA

Use esta skill para orientar a inicialização local, compilação de produção e sincronização com o GitHub.

---

## 📌 Comandos de Operação

### 1. Inicialização Local (Dev)
- **Frontend (Vite 180ms)**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend (FastAPI)**:
  ```bash
  cd backend
  source venv/bin/activate
  python main.py
  ```

### 2. Validação & Build de Produção
- **Build Frontend**:
  ```bash
  cd frontend
  npm run build
  ```
  *(Deve retornar `✓ built in X.XXs` com 0 erros)*

### 3. Sincronização com o GitHub via SSH
- **Git Push**:
  ```bash
  git add -A
  git commit -m "feat/fix/docs: sua mensagem"
  git push origin main
  ```
  *(Quando solicitar passphrase SSH: informe `ssh`)*
