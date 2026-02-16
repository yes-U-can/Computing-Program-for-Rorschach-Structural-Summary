import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSkillBookDocuments, normalizeSkillBookText } from '@/lib/skillBookValidation';

// GET /api/skillbooks
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visibility = searchParams.get('visibility');
  const skillBookId = searchParams.get('id');

  if (visibility === 'public') {
    if (skillBookId) {
      const detail = await prisma.skillBook.findFirst({
        where: { id: skillBookId, isPublic: true },
        select: {
          id: true,
          name: true,
          description: true,
          instructions: true,
          documents: true,
          updatedAt: true,
          author: { select: { name: true } },
        },
      });
      if (!detail) {
        return NextResponse.json({ error: 'Public skill book not found' }, { status: 404 });
      }
      return NextResponse.json({
        id: detail.id,
        name: detail.name,
        description: detail.description,
        instructions: detail.instructions,
        documents: detail.documents,
        updatedAt: detail.updatedAt,
        authorName: detail.author?.name ?? 'Anonymous',
      });
    }

    const skillBooks = await prisma.skillBook.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
        author: {
          select: { name: true },
        },
      },
      take: 100,
    });

    return NextResponse.json(
      skillBooks.map((book) => ({
        id: book.id,
        name: book.name,
        description: book.description,
        updatedAt: book.updatedAt,
        authorName: book.author?.name ?? 'Anonymous',
      })),
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const skillBooks = await prisma.skillBook.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      source: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      originalAuthor: true,
      forkedFromName: true,
    },
  });

  return NextResponse.json(skillBooks);
}

// POST /api/skillbooks
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { name, description, instructions, documents, isPublic, forkedFromId } = body as {
    name?: string;
    description?: string;
    instructions?: string;
    documents?: Array<{ title: string; content: string }>;
    isPublic?: boolean;
    forkedFromId?: string;
  };

  const text = normalizeSkillBookText(name, description, instructions);
  if (!text.ok) {
    return NextResponse.json({ error: text.error }, { status: 400 });
  }
  const docs = normalizeSkillBookDocuments(documents);
  if (!docs.ok) {
    return NextResponse.json({ error: docs.error }, { status: 400 });
  }

  let attribution:
    | {
        forkedFromId: string;
        forkedFromName: string;
        originalAuthor: string;
      }
    | undefined;
  if (typeof forkedFromId === 'string' && forkedFromId.trim()) {
    const source = await prisma.skillBook.findFirst({
      where: {
        id: forkedFromId.trim(),
        OR: [{ isPublic: true }, { authorId: session.user.id }],
      },
      select: {
        id: true,
        name: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!source) {
      return NextResponse.json({ error: 'Invalid forkedFromId' }, { status: 400 });
    }
    attribution = {
      forkedFromId: source.id,
      forkedFromName: source.name,
      originalAuthor: source.author?.name ?? 'Anonymous',
    };
  }

  const skillBook = await prisma.skillBook.create({
    data: {
      name: text.value.name,
      description: text.value.description,
      instructions: text.value.instructions,
      documents: JSON.stringify(docs.value),
      isPublic: Boolean(isPublic),
      authorId: session.user.id,
      ...(attribution ?? {}),
    },
  });

  return NextResponse.json(skillBook, { status: 201 });
}
