import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { awardActivityPoints } from '@/lib/activityPoints';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { id } = await params;

  const target = await prisma.skillBook.findUnique({
    where: { id },
    select: { id: true, isPublic: true, authorId: true },
  });
  if (!target || !target.isPublic) {
    return NextResponse.json({ error: 'Public skill book not found' }, { status: 404 });
  }

  await prisma.skillBookFavorite.upsert({
    where: { skillBookId_userId: { skillBookId: id, userId: session.user.id } },
    update: {},
    create: { skillBookId: id, userId: session.user.id },
  });

  if (target.authorId !== session.user.id) {
    await awardActivityPoints(prisma, {
      userId: target.authorId,
      points: Number(process.env.POINTS_PER_SKILLBOOK_FAVORITE ?? '2'),
      sourceType: 'skillbook_favorite',
      sourceId: id,
      reason: 'Skill book favorited',
      metadata: { favoritedByUserId: session.user.id },
    });
  }

  const count = await prisma.skillBookFavorite.count({ where: { skillBookId: id } });
  return NextResponse.json({ ok: true, favoriteCount: count });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { id } = await params;

  await prisma.skillBookFavorite.deleteMany({
    where: { skillBookId: id, userId: session.user.id },
  });
  const count = await prisma.skillBookFavorite.count({ where: { skillBookId: id } });
  return NextResponse.json({ ok: true, favoriteCount: count });
}

