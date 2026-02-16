import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendCreditEntry, isSchemaMismatchError } from '@/lib/creditLedger';

// GET /api/credits
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const [user, recent] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { creditBalance: true },
      }),
      prisma.creditTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: {
          id: true,
          type: true,
          amount: true,
          balanceAfter: true,
          description: true,
          metadataJson: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      creditBalance: user?.creditBalance ?? 0,
      recentTransactions: recent,
    });
  } catch (error) {
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        { error: 'Credits schema is not migrated yet. Please run database migration.' },
        { status: 503 },
      );
    }
    throw error;
  }
}

// POST /api/credits (admin adjustment only)
export async function POST(req: Request) {
  const adminSecret = process.env.CREDIT_ADMIN_SECRET;
  const supplied = req.headers.get('x-credit-admin-secret');
  if (!adminSecret || supplied !== adminSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: {
    userId?: string;
    amount?: number;
    description?: string;
    metadataJson?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const userId = typeof body.userId === 'string' ? body.userId : '';
  const amount = typeof body.amount === 'number' ? body.amount : null;
  if (!userId || amount === null || !Number.isInteger(amount)) {
    return NextResponse.json({ error: 'userId and integer amount are required' }, { status: 400 });
  }

  try {
    const created = await appendCreditEntry(prisma, {
      userId,
      amount,
      type: 'admin_adjustment',
      description: body.description,
      metadataJson: body.metadataJson,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        { error: 'Credits schema is not migrated yet. Please run database migration.' },
        { status: 503 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
