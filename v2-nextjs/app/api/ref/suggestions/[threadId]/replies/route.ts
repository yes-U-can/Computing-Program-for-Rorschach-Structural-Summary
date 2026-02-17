import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ threadId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { threadId } = await params;
  const replies = await prisma.refDocSuggestionReply.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(replies);
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { threadId } = await params;
  const body = (await req.json()) as { body?: string };
  const content = body.body?.trim() ?? '';
  if (!content) {
    return NextResponse.json({ error: 'body is required' }, { status: 400 });
  }

  const thread = await prisma.refDocSuggestionThread.findUnique({
    where: { id: threadId },
    select: { id: true },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  const created = await prisma.refDocSuggestionReply.create({
    data: {
      threadId,
      authorId: session.user.id,
      body: content,
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

