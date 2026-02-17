import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

async function getAuthorizedEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function GET() {
  const email = await getAuthorizedEmail();

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{ deletionRequestedAt: Date | null; deletionScheduledAt: Date | null }>
    >`SELECT "deletionRequestedAt", "deletionScheduledAt" FROM "User" WHERE "email" = ${email} LIMIT 1`;
    const user = rows[0] ?? null;

    return NextResponse.json({
      ok: true,
      deletionRequestedAt: user?.deletionRequestedAt?.toISOString() ?? null,
      deletionScheduledAt: user?.deletionScheduledAt?.toISOString() ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load account deletion status.' }, { status: 500 });
  }
}

export async function DELETE() {
  const email = await getAuthorizedEmail();

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const scheduledAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await prisma.$executeRaw`
      UPDATE "User"
      SET "deletionRequestedAt" = ${now}, "deletionScheduledAt" = ${scheduledAt}
      WHERE "email" = ${email}
    `;
    return NextResponse.json({
      ok: true,
      deletionRequestedAt: now.toISOString(),
      deletionScheduledAt: scheduledAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to schedule account deletion.' }, { status: 500 });
  }
}

export async function PATCH() {
  const email = await getAuthorizedEmail();

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.$executeRaw`
      UPDATE "User"
      SET "deletionRequestedAt" = NULL, "deletionScheduledAt" = NULL
      WHERE "email" = ${email}
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to cancel account deletion.' }, { status: 500 });
  }
}
