import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from services.rag_service import execute_crop_rag_pipeline, CropAnalysisResult

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend_main")

app = FastAPI(
    title="Radar Agrícola IA - API Backend",
    description="Motor de Inteligência Fitossanitária Híbrido (Alternativa C)",
    version="2.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropSearchRequest(BaseModel):
    cropName: str

@app.get("/api/status")
def status_check():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    return {
        "status": "online",
        "engine": "Alternativa C Híbrida (Base 50+ Culturas 0ms + Gemini Flash Direto <1.5s)",
        "gemini_api_key_configured": bool(api_key),
    }

@app.post("/api/search", response_model=CropAnalysisResult)
def search_crop(request: CropSearchRequest):
    crop_name = request.cropName.strip()
    if not crop_name:
        raise HTTPException(status_code=400, detail="O nome da cultura agrícola é obrigatório.")

    try:
        result = execute_crop_rag_pipeline(crop_name)
        return result
    except Exception as e:
        logger.error(f"Erro ao processar busca para '{crop_name}': {e}")
        raise HTTPException(status_code=500, detail="Erro interno no processamento fitossanitário.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
