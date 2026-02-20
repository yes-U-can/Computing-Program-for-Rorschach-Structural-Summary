import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { favoriteModelIds: true },
  });

  return NextResponse.json({ favoriteModelIds: user?.favoriteModelIds ?? [] });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = (await req.json()) as { modelIds?: unknown };
  const modelIds: string[] = Array.isArray(body?.modelIds) ? (body.modelIds as string[]) : [];

  await prisma.user.update({
    where: { id: session.user.id },
    data: { favoriteModelIds: modelIds },
  });

  return NextResponse.json({ favoriteModelIds: modelIds });
}
