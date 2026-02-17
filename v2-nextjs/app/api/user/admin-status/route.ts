import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? '';
  if (!userId) {
    return NextResponse.json({ docReviewAdmin: false }, { status: 401 });
  }
  try {
    const rows = await prisma.$queryRaw<Array<{ role: string | null }>>`
      SELECT "role" FROM "User" WHERE "id" = ${userId} LIMIT 1
    `;
    return NextResponse.json({
      docReviewAdmin: rows[0]?.role === 'admin',
    });
  } catch {
    return NextResponse.json({ docReviewAdmin: false });
  }
}
