# 🌐 Especificação da API REST — Radar Agrícola IA (`docs/API.md`)

---

## 🐍 Endpoints do Backend FastAPI (Porta 8000 / Nuvem Render)

### 1. `GET /api/status`
Verifica a saúde do backend e se a chave do Gemini está configurada.
- **Resposta HTTP 200 OK**:
  ```json
  {
    "status": "online",
    "engine": "Alternativa C Híbrida (Base 50+ Culturas 0ms + Gemini Flash Direto <1.5s)",
    "gemini_api_key_configured": true
  }
  ```

### 2. `POST /api/search`
Processa a cultura agrícola e retorna as 4 principais pragas/doenças com manejo MIP e implementos agrícolas.
- **Requisição Body (JSON)**:
  ```json
  {
    "cropName": "Feijão"
  }
  ```
- **Resposta HTTP 200 OK (JSON)**:
  ```json
  {
    "cropName": "Feijao",
    "pests": [
      {
        "pestName": "Mosaico-Dourado do Feijoeiro (Bean golden mosaic virus - BGMV)",
        "description": "A virose mais severa da cultura do feijão no Brasil...",
        "impactData": "Provoca mosaico amarelo-ouro intenso nas folhas...",
        "controlMethods": "Uso de cultivares resistentes/tolerantes...",
        "agriculturalImplements": "Pulverizador hidráulico tratorizado de barras...",
        "sourceUrl": "https://www.embrapa.br/arroz-e-feijao/doencas"
      }
    ]
  }
  ```

---

## 🎨 Gerenciamento no Frontend Vite (React 19)

- **Comunicação REST**: Requisição `fetch` direta a `${BACKEND_URL}/api/search` (lendo `import.meta.env.VITE_BACKEND_URL`).
- **Persistência de Histórico**: Armazenamento no `localStorage` do navegador sob a chave `radar_agricola_records`, com fotos HD associadas via `getCropImageUrl(cropName)`.
