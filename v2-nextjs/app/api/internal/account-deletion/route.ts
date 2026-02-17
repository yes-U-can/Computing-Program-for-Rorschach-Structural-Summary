import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  if (configuredSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${configuredSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const deletedCount = await prisma.$executeRawUnsafe(
      'DELETE FROM "User" WHERE "deletionScheduledAt" <= NOW()',
    );

    return NextResponse.json({ ok: true, deletedCount });
  } catch {
    return NextResponse.json({ error: 'Failed to process scheduled deletions.' }, { status: 500 });
  }
}
