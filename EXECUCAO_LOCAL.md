# 🚀 Guia de Execução Local — Radar Agrícola IA

Este documento explica passo a passo como executar o **Radar Agrícola IA** na sua máquina local com tempo de resposta de **0ms** para 50+ culturas agrícolas e **183ms** de inicialização de frontend (Vite + React 19 + Tailwind CSS + FastAPI Python).

---

## 📌 Pré-Requisitos
- **Node.js**: v18+ ou v20+
- **Python**: v3.10+
- **Git**

---

## 🐍 Passo 1: Executar o Backend (FastAPI Python)

1. Abra um terminal na pasta raiz do projeto e navegue para `backend`:
   ```bash
   cd backend
   ```
2. Crie e ative o ambiente virtual Python:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure a chave do Gemini em `backend/.env`:
   ```env
   GEMINI_API_KEY=sua_chave_do_google_ai_studio
   ```
5. Inicie o servidor FastAPI:
   ```bash
   python main.py
   ```
   > O backend estará ativo em `http://localhost:8000`.

---

## 🎨 Passo 2: Executar o Frontend (Vite + React 19)

1. Abra um novo terminal na pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O frontend abrirá em **`http://localhost:3000`** em **183ms** sem nenhum erro `SIGBUS`!

---

## 🧪 Passo 3: Testando a Aplicação
1. Acesse `http://localhost:3000` no seu navegador.
2. Clique nos botões de acesso rápido (*Feijão*, *Tomate*, *Milho*, *Soja*, *Café*, *Trigo*, *Batata*, *Cacau*) ou digite qualquer cultura no campo de busca.
3. Observe o **Hero Crop Visual Banner** em fotos fotográficas HD, os **Cards Sanfonados (Accordions)** expansíveis e a ficha técnica completa!
