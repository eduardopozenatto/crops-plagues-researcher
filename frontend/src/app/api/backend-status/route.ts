import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  try {
    const res = await fetch(`${backendUrl}/api/status`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ online: true, data });
    }

    return NextResponse.json({ online: false }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ online: false, details: String(error) }, { status: 503 });
  }
}
