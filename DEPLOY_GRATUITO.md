# 🌐 Guia de Publicação Gratuita na Nuvem (Deploy sem Gastar Nada)

> Este guia ensina como colocar o **Radar Agrícola IA** no ar na internet de forma **100% gratuita**, gerando um link público (ex: `https://radar-agricola.vercel.app`) para você enviar aos seus colegas e jurados da Feira de Ciências sem precisar rodar no computador local!

---

## 📌 Visão Geral da Publicação Gratuita

Para colocar o site no ar sem pagar nada, usamos duas plataformas líderes no mercado:
1. **Frontend (Interface Web)**: Hospedado na **Vercel** (Gratuito).
2. **Backend (Servidor Python FastAPI)**: Hospedado no **Render** ou **Koyeb** (Gratuito).

---

## 🚀 PASSO 1: Subir o Backend no Render.com (Gratuito)

1. Crie uma conta gratuita em [render.com](https://render.com).
2. No painel do Render, clique em **"New +"** ➔ **"Web Service"**.
3. Conecte sua conta do GitHub e selecione o repositório `crops-plagues-researcher`.
4. Preencha as configurações do serviço:
   - **Name**: `radar-agricola-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py` ou `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Na seção **Environment Variables**, adicione a variável:
   - `GEMINI_API_KEY`: *(sua chave do Google AI Studio)*
6. Clique em **"Create Web Service"**.
7. Quando o deploy terminar, o Render vai gerar um link como:  
   `https://radar-agricola-backend.onrender.com`

---

## 🎨 PASSO 2: Subir o Frontend na Vercel (Gratuito)

1. Crie uma conta gratuita em [vercel.com](https://vercel.com).
2. No painel da Vercel, clique em **"Add New..."** ➔ **"Project"**.
3. Importe o repositório `crops-plagues-researcher` do seu GitHub.
4. Nas configurações do projeto na Vercel:
   - **Root Directory**: Clique em *Edit* e escolha a pasta `frontend`.
   - **Framework Preset**: Selecione `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"**.
6. Em menos de 1 minuto, a Vercel vai gerar seu link público como:  
   `https://crops-plagues-researcher.vercel.app`

---

## 🔗 PASSO 3: Conectar o Frontend com o Backend na Nuvem

No arquivo [`frontend/src/App.tsx`](file:///home/carlos/Projetos/crops-plagues-website/frontend/src/App.tsx), a constante `BACKEND_URL` pode usar a URL do Render:

```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
```

Ou você pode definir a variável de ambiente na Vercel:
- **Key**: `VITE_BACKEND_URL`
- **Value**: `https://radar-agricola-backend.onrender.com`

---

## 🎉 Pronto!

Seu site estará no ar **100% gratuito**, acessível por qualquer celular, tablet ou computador no mundo todo através do link da Vercel!
