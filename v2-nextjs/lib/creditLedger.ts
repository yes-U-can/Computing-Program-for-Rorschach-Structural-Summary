import type { PrismaClient, CreditTransactionType } from '@prisma/client';

type AppendCreditEntryInput = {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description?: string;
  metadataJson?: string;
};

export async function appendCreditEntry(prisma: PrismaClient, input: AppendCreditEntryInput) {
  if (!Number.isInteger(input.amount) || input.amount === 0) {
    throw new Error('amount must be a non-zero integer');
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: input.userId },
      select: { id: true, creditBalance: true },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const nextBalance = user.creditBalance + input.amount;
    if (nextBalance < 0) {
      throw new Error('Insufficient credit balance');
    }

    await tx.user.update({
      where: { id: input.userId },
      data: { creditBalance: nextBalance },
    });

    return tx.creditTransaction.create({
      data: {
        userId: input.userId,
        type: input.type,
        amount: input.amount,
        balanceAfter: nextBalance,
        description: input.description?.trim() ?? '',
        metadataJson: input.metadataJson?.trim() || '{}',
      },
    });
  });
}

export function isSchemaMismatchError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = (error as { message?: string }).message ?? '';
  return (
    message.includes('column') ||
    message.includes('does not exist') ||
    message.includes('Unknown field') ||
    message.includes('P2022')
  );
}
