import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const viewerId = session?.user?.id ?? null;
  const { searchParams } = new URL(req.url);
  const docSlug = searchParams.get('docSlug')?.trim();
  const status = searchParams.get('status')?.trim();
  const from = searchParams.get('from')?.trim();
  const to = searchParams.get('to')?.trim();
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const where: {
    docSlug?: string;
    status?: 'open' | 'reviewed' | 'accepted' | 'rejected';
    createdAt?: { gte?: Date; lte?: Date };
  } = {};
  if (docSlug) where.docSlug = docSlug;
  if (status && ['open', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    where.status = status as 'open' | 'reviewed' | 'accepted' | 'rejected';
  }
  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate && !Number.isNaN(fromDate.getTime())) where.createdAt.gte = fromDate;
    if (toDate && !Number.isNaN(toDate.getTime())) where.createdAt.lte = toDate;
  }

  const threads = await prisma.refDocSuggestionThread.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      docSlug: true,
      title: true,
      body: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, name: true } },
      _count: { select: { replies: true, likes: true } },
      review: {
        select: {
          decision: true,
          decisionReason: true,
          appliedToDoc: true,
          linkedDocRevision: true,
          createdAt: true,
        },
      },
    },
  });

  let likedThreadIdSet = new Set<string>();
  if (viewerId && threads.length > 0) {
    const likedRows = await prisma.refDocSuggestionLike.findMany({
      where: {
        userId: viewerId,
        threadId: { in: threads.map((thread) => thread.id) },
      },
      select: { threadId: true },
    });
    likedThreadIdSet = new Set(likedRows.map((row) => row.threadId));
  }

  return NextResponse.json(
    threads.map((thread) => ({
      ...thread,
      viewerHasLiked: likedThreadIdSet.has(thread.id),
    })),
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = (await req.json()) as {
    docSlug?: string;
    title?: string;
    body?: string;
  };
  const docSlug = body.docSlug?.trim() ?? '';
  const title = body.title?.trim() ?? '';
  const content = body.body?.trim() ?? '';

  if (!docSlug || !title || !content) {
    return NextResponse.json(
      { error: 'docSlug, title, body are required' },
      { status: 400 },
    );
  }

  const created = await prisma.refDocSuggestionThread.create({
    data: {
      docSlug,
      title,
      body: content,
      authorId: session.user.id,
      status: 'open',
    },
    select: {
      id: true,
      docSlug: true,
      title: true,
      body: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
