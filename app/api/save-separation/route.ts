// app/api/save-separation/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const { userId, originalName, originalSize, vocalsUrl, instrumentalUrl } = body;
    
    const separation = await prisma.separation.create({
      data: {
        userId,
        originalName,
        originalSize,
        vocalsUrl,
        instrumentalUrl,
      },
    });
    
    return NextResponse.json({ success: true, data: separation });
  } catch (error) {
    console.error('Error saving separation:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}