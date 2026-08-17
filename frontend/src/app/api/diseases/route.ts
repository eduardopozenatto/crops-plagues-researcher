import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let whereClause = {};
    if (query && query.trim()) {
      const q = query.trim();
      whereClause = {
        OR: [
          { cropName: { contains: q } },
          { pestName: { contains: q } },
          { description: { contains: q } },
        ],
      };
    }

    const diseases = await prisma.cropDisease.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(diseases);
  } catch (error) {
    console.error('Erro ao buscar histórico de doenças:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar o banco de dados.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const singleId = searchParams.get('id');

    if (singleId) {
      await prisma.cropDisease.delete({
        where: { id: singleId },
      });
      return NextResponse.json({ success: true, message: 'Registro excluído com sucesso.' });
    }

    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      const deleteResult = await prisma.cropDisease.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return NextResponse.json({
        success: true,
        count: deleteResult.count,
        message: `${deleteResult.count} registros excluídos com sucesso.`,
      });
    }

    return NextResponse.json(
      { error: 'Nenhum ID válido informado para exclusão.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao excluir registro(s):', error);
    return NextResponse.json(
      { error: 'Erro ao excluir do banco de dados.' },
      { status: 500 }
    );
  }
}
