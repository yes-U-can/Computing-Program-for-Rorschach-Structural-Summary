import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export async function POST(request: Request) {
  const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET ?? '';
  const providedSecret = request.headers.get('x-admin-bootstrap-secret') ?? '';
  if (!bootstrapSecret || providedSecret !== bootstrapSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  try {
    // Keep migration resilient even before Prisma client is regenerated.
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT \'user\'',
    );
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD CONSTRAINT "User_role_check" CHECK ("role" IN (\'user\', \'admin\'))',
    ).catch(() => {
      // Constraint may already exist.
    });

    const updatedCount = await prisma.$executeRawUnsafe(
      'UPDATE "User" SET "role" = \'admin\' WHERE lower("email") = $1',
      email,
    );
    if (updatedCount === 0) {
      return NextResponse.json(
        { error: 'No user found for this email. The user must sign in at least once first.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      email,
      promotedTo: 'admin',
      updatedCount,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to bootstrap admin role' }, { status: 500 });
  }
}

