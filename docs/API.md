# 🌐 Especificação da API REST — Radar Agrícola IA (`docs/API.md`)

---

## 🐍 Endpoints do Backend FastAPI (Porta 8000)

### `GET /api/status`
Verifica se o backend e a chave do Gemini estão configurados.
- **Resposta**:
  ```json
  {
    "status": "online",
    "engine": "Alternativa C Híbrida (Base 50+ Culturas 0ms + Gemini Flash Direto <1.5s)",
    "gemini_api_key_configured": true
  }
  ```

### `POST /api/search`
Processa a cultura agrícola e retorna os 4 diagnósticos fitossanitários com implementos e métodos MIP.
- **Body**:
  ```json
  {
    "cropName": "Feijão"
  }
  ```
- **Resposta**:
  ```json
  {
    "cropName": "Feijao",
    "pests": [
      {
        "pestName": "Mosaico-Dourado do Feijoeiro (Bean golden mosaic virus - BGMV)",
        "description": "...",
        "impactData": "...",
        "controlMethods": "...",
        "agriculturalImplements": "...",
        "sourceUrl": "https://www.embrapa.br/arroz-e-feijao/doencas"
      }
    ]
  }
  ```

---

## 🎨 Endpoints do Orchestrator Next.js (Porta 3000)

### `POST /api/search`
Estratégia Cache-First: verifica o banco relacional primeiro (0ms) e, se não encontrar, chama o FastAPI backend e persiste os dados com `cropImageUrl`.

### `GET /api/diseases?q={filtro}`
Retorna o histórico de diagnósticos gravados no banco.

### `DELETE /api/diseases?id={id}` ou `DELETE /api/diseases` com `{ ids: string[] }`
Exclui registros do banco individualmente ou em massa.
