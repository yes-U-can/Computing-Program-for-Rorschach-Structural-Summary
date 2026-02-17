import type { PrismaClient } from '@prisma/client';

type AwardPointInput = {
  userId: string;
  points: number;
  sourceType:
    | 'skillbook_download'
    | 'skillbook_favorite'
    | 'skillbook_like'
    | 'doc_suggestion_accepted'
    | 'admin_adjustment';
  sourceId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
};

export async function awardActivityPoints(prisma: PrismaClient, input: AwardPointInput) {
  const amount = Math.floor(input.points);
  if (!Number.isFinite(amount) || amount === 0) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: input.userId },
      select: { activityPoints: true },
    });
    if (!user) return null;

    const nextPoints = Math.max(0, user.activityPoints + amount);
    await tx.user.update({
      where: { id: input.userId },
      data: {
        activityPoints: nextPoints,
      },
    });

    await tx.userActivityPointLedger.create({
      data: {
        userId: input.userId,
        sourceType: input.sourceType,
        sourceId: input.sourceId ?? null,
        points: amount,
        reason: input.reason?.trim() ?? '',
        metadataJson: JSON.stringify(input.metadata ?? {}),
      },
    });

    return { nextPoints };
  });
}

