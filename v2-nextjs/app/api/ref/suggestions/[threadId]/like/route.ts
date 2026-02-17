import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ threadId: string }> };

export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { threadId } = await params;

  const thread = await prisma.refDocSuggestionThread.findUnique({
    where: { id: threadId },
    select: { id: true },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  await prisma.refDocSuggestionLike.upsert({
    where: { threadId_userId: { threadId, userId: session.user.id } },
    update: {},
    create: { threadId, userId: session.user.id },
  });

  const count = await prisma.refDocSuggestionLike.count({ where: { threadId } });
  return NextResponse.json({ ok: true, likeCount: count });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { threadId } = await params;

  await prisma.refDocSuggestionLike.deleteMany({
    where: { threadId, userId: session.user.id },
  });
  const count = await prisma.refDocSuggestionLike.count({ where: { threadId } });
  return NextResponse.json({ ok: true, likeCount: count });
}

