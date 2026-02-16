import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSkillBookDocuments, normalizeSkillBookText } from '@/lib/skillBookValidation';

type Params = { params: Promise<{ id: string }> };

// POST /api/skillbooks/:id/duplicate
export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const source = await prisma.skillBook.findFirst({
    where: { id, authorId: session.user.id },
  });
  if (!source) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const text = normalizeSkillBookText(
    `${source.name} (Copy)`,
    source.description,
    source.instructions,
  );
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

  const created = await prisma.skillBook.create({
    data: {
      name: text.value.name,
      description: text.value.description,
      instructions: text.value.instructions,
      documents: JSON.stringify(docs.value),
      isPublic: false,
      source: 'user',
      forkedFromId: source.forkedFromId ?? source.id,
      forkedFromName: source.forkedFromName ?? source.name,
      originalAuthor: source.originalAuthor ?? null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
