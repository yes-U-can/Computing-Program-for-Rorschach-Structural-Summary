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

  await prisma.skillBookLike.upsert({
    where: { skillBookId_userId: { skillBookId: id, userId: session.user.id } },
    update: {},
    create: { skillBookId: id, userId: session.user.id },
  });

  if (target.authorId !== session.user.id) {
    await awardActivityPoints(prisma, {
      userId: target.authorId,
      points: Number(process.env.POINTS_PER_SKILLBOOK_LIKE ?? '3'),
      sourceType: 'skillbook_like',
      sourceId: id,
      reason: 'Skill book liked',
      metadata: { likedByUserId: session.user.id },
    });
  }

  const count = await prisma.skillBookLike.count({ where: { skillBookId: id } });
  return NextResponse.json({ ok: true, likeCount: count });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { id } = await params;

  await prisma.skillBookLike.deleteMany({
    where: { skillBookId: id, userId: session.user.id },
  });
  const count = await prisma.skillBookLike.count({ where: { skillBookId: id } });
  return NextResponse.json({ ok: true, likeCount: count });
}

