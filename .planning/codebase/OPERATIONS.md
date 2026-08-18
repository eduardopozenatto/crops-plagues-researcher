# ⚙️ Manual de Operações, Deploy e Manutenção — Radar Agrícola IA

---

## 📌 1. Guia de Execução Local

### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
- Servidor estará disponível em: `http://localhost:3000` (ou `3001` se 3000 estiver ocupada).
- Tempo de inicialização esperado: **~180ms**.

### Backend (FastAPI Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
- Servidor FastAPI estará rodando em: `http://localhost:8000`.

---

## ☁️ 2. Deploy na Nuvem (Vercel + Render)

### Frontend (Vercel)
1. Importe o repositório no painel da Vercel.
2. Defina a pasta raiz como `frontend`.
3. Adicione a variável de ambiente:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://seu-backend.onrender.com`

### Backend (Render)
1. Crie um **Web Service** no Render conectando o repositório.
2. Defina a pasta raiz como `backend`.
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `python main.py`
5. Adicione a variável de ambiente:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(sua chave do Google AI Studio)*

---

## 🔐 3. Fluxo de Publicação Git Push (SSH)
```bash
git add -A
git commit -m "sua mensagem"
git push origin main
```
- Quando solicitado a senha da chave SSH no terminal: digite `ssh`.
