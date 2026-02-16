import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/skillbooks/import
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { skillBookId } = body as { skillBookId?: string };
  if (!skillBookId) {
    return NextResponse.json({ error: 'skillBookId is required' }, { status: 400 });
  }

  const source = await prisma.skillBook.findFirst({
    where: { id: skillBookId, isPublic: true },
    select: {
      id: true,
      name: true,
      description: true,
      instructions: true,
      documents: true,
    },
  });

  if (!source) {
    return NextResponse.json({ error: 'Public skill book not found' }, { status: 404 });
  }

  const existing = await prisma.skillBook.findFirst({
    where: {
      authorId: session.user.id,
      name: source.name,
      instructions: source.instructions,
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ imported: false, reason: 'already_exists', id: existing.id });
  }

  const created = await prisma.skillBook.create({
    data: {
      name: source.name,
      description: source.description,
      instructions: source.instructions,
      documents: source.documents,
      source: 'user',
      isPublic: false,
      authorId: session.user.id,
    },
    select: { id: true },
  });

  return NextResponse.json({ imported: true, id: created.id }, { status: 201 });
}
