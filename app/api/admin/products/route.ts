export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 50,

      select: {
        id: true,
        name: true,
        slug: true,
        coverImage: true,
      },
    });

    return NextResponse.json({
      ok: true,
      products,
    });

  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message,
    });
  }
}