import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { awardActivityPoints } from '@/lib/activityPoints';

type Params = { params: Promise<{ threadId: string }> };
const BASE_ACCEPT_POINTS = Number(process.env.POINTS_FOR_ACCEPTED_SUGGESTION ?? '20');
const LIKE_WEIGHT = Number(process.env.POINTS_PER_SUGGESTION_LIKE ?? '2');
const LIKE_CAP = Number(process.env.POINTS_SUGGESTION_LIKE_CAP ?? '30');

async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<Array<{ role: string | null }>>`
      SELECT "role" FROM "User" WHERE "id" = ${userId} LIMIT 1
    `;
    return rows[0]?.role === 'admin';
  } catch {
    return false;
  }
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const isAdmin = await isAdminUser(session.user.id);
  if (!isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { threadId } = await params;
  const payload = (await req.json()) as {
    decision?: 'reviewed' | 'accepted' | 'rejected';
    decisionReason?: string;
    appliedToDoc?: boolean;
    linkedDocRevision?: string;
  };

  const decision = payload.decision;
  if (!decision || !['reviewed', 'accepted', 'rejected'].includes(decision)) {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
  }

  const thread = await prisma.refDocSuggestionThread.findUnique({
    where: { id: threadId },
    select: {
      id: true,
      authorId: true,
      status: true,
      _count: { select: { likes: true } },
    },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.refDocSuggestionReview.upsert({
      where: { threadId },
      update: {
        reviewerId: session.user.id,
        decision,
        decisionReason: payload.decisionReason?.trim() ?? '',
        appliedToDoc: Boolean(payload.appliedToDoc),
        linkedDocRevision: payload.linkedDocRevision?.trim() || null,
      },
      create: {
        threadId,
        reviewerId: session.user.id,
        decision,
        decisionReason: payload.decisionReason?.trim() ?? '',
        appliedToDoc: Boolean(payload.appliedToDoc),
        linkedDocRevision: payload.linkedDocRevision?.trim() || null,
      },
    });

    await tx.refDocSuggestionThread.update({
      where: { id: threadId },
      data: { status: decision },
    });

    return review;
  });

  if (decision === 'accepted') {
    const likes = Math.min(thread._count.likes, Math.max(0, LIKE_CAP));
    const points = Math.max(1, Math.floor(BASE_ACCEPT_POINTS + likes * LIKE_WEIGHT));
    await awardActivityPoints(prisma, {
      userId: thread.authorId,
      points,
      sourceType: 'doc_suggestion_accepted',
      sourceId: thread.id,
      reason: 'Suggestion accepted by reviewer',
      metadata: {
        likesConsidered: likes,
        basePoints: BASE_ACCEPT_POINTS,
        likeWeight: LIKE_WEIGHT,
        reviewerId: session.user.id,
      },
    });
  }

  return NextResponse.json({ ok: true, reviewId: result.id });
}
