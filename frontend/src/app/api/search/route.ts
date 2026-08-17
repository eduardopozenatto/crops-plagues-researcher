import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCropImageUrl } from '@/lib/cropImages';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cropName, forceRefresh } = body;

    if (!cropName || !cropName.trim()) {
      return NextResponse.json(
        { error: 'O campo Cultura Agrícola (cropName) é obrigatório.' },
        { status: 400 }
      );
    }

    const trimmedCrop = cropName.trim();
    const cropImageUrl = getCropImageUrl(trimmedCrop);

    // 1. ESTRATÉGIA CACHE-FIRST: Busca primeiramente no Banco de Dados PostgreSQL via Prisma
    if (!forceRefresh) {
      try {
        const existingPests = await prisma.cropDisease.findMany({
          where: {
            cropName: {
              equals: trimmedCrop,
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 4,
        });

        // Se a busca exata falhar, tenta buscar registros recentes no banco com ilike/lowercase
        let cachedPests = existingPests;
        if (!cachedPests || cachedPests.length < 4) {
          const recentRecords = await prisma.cropDisease.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
          });
          const matched = recentRecords.filter(
            (item) => item.cropName.toLowerCase().trim() === trimmedCrop.toLowerCase()
          );
          if (matched.length >= 4) {
            cachedPests = matched.slice(0, 4);
          }
        }

        if (cachedPests && cachedPests.length >= 4) {
          return NextResponse.json({
            cropName: cachedPests[0].cropName || trimmedCrop,
            cropImageUrl: cachedPests[0].cropImageUrl || cropImageUrl,
            pests: cachedPests,
            cached: true,
            source: 'database',
            message: 'Dados recuperados instantaneamente do Banco de Dados local (0ms).'
          }, { status: 200 });
        }
      } catch (dbReadErr) {
        console.warn('Aviso: Falha ao ler cache do banco de dados, prosseguindo com chamada à IA:', dbReadErr);
      }
    }

    // 2. SE NÃO HOUVER CACHE OU SE FORÇAR ATUALIZAÇÃO: Aciona o Motor de IA FastAPI + Gemini 3.5 Flash
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    let backendRes;
    try {
      backendRes = await fetch(`${backendUrl}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropName: trimmedCrop }),
        cache: 'no-store',
      });
    } catch (fetchErr) {
      console.error('Erro ao conectar ao backend FastAPI:', fetchErr);
      return NextResponse.json(
        { 
          error: 'Não foi possível conectar ao Motor de IA (FastAPI na porta 8000). Verifique se o servidor backend está rodando.',
          details: String(fetchErr) 
        },
        { status: 503 }
      );
    }

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.detail || 'Erro retornado pelo Motor de IA.' },
        { status: backendRes.status }
      );
    }

    const aiResult = await backendRes.json();
    const pestsList = aiResult.pests || [];

    // 3. Grava os 4 novos diagnósticos no Banco de Dados via Prisma ORM
    const savedPests = [];
    for (const pest of pestsList) {
      const savedRecord = await prisma.cropDisease.create({
        data: {
          cropName: aiResult.cropName || trimmedCrop,
          cropImageUrl: cropImageUrl,
          pestName: pest.pestName || 'Praga/Doença Agrícola',
          description: pest.description || 'Sem descrição informada.',
          impactData: pest.impactData || 'Sem dados de impacto informados.',
          controlMethods: pest.controlMethods || pest.control_methods || 'Manejo cultural, biológico e monitoramento fitossanitário integrado segundo literatura da Embrapa.',
          agriculturalImplements: pest.agriculturalImplements || pest.agricultural_implements || 'Pulverizador agrícola hidráulico/pneumático, atomizador acoplado ao trator ou barra de aplicação com bicos de jato cônico.',
          sourceUrl: pest.sourceUrl || 'https://www.embrapa.br',
        },
      });
      savedPests.push(savedRecord);
    }

    return NextResponse.json({
      cropName: aiResult.cropName || trimmedCrop,
      cropImageUrl: cropImageUrl,
      pests: savedPests,
      cached: false,
      source: 'ai_engine',
      message: 'Pesquisa concluída via RAG Híbrido e gravada no banco de dados para futuras consultas.'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro na rota POST /api/search:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a busca e gravação.', details: String(error) },
      { status: 500 }
    );
  }
}
