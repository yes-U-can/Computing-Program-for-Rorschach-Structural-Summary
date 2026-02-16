import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSkillBookDocuments, normalizeSkillBookText } from '@/lib/skillBookValidation';

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

  const text = normalizeSkillBookText(source.name, source.description, source.instructions);
  if (!text.ok) {
    return NextResponse.json({ error: text.error }, { status: 400 });
  }
  let parsedDocs: unknown = [];
  try {
    parsedDocs = JSON.parse(source.documents || '[]');
  } catch {
    parsedDocs = [];
  }
  const docs = normalizeSkillBookDocuments(parsedDocs);
  if (!docs.ok) {
    return NextResponse.json({ error: docs.error }, { status: 400 });
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
      name: text.value.name,
      description: text.value.description,
      instructions: text.value.instructions,
      documents: JSON.stringify(docs.value),
      source: 'user',
      isPublic: false,
      authorId: session.user.id,
    },
    select: { id: true },
  });

  return NextResponse.json({ imported: true, id: created.id }, { status: 201 });
}
