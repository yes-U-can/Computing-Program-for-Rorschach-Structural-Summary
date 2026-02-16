import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skillbooks — list my skill books
export async function GET() {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(skillBooks);
}

// POST /api/skillbooks — create a new skill book
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { name, description, instructions, documents } = body as {
    name?: string;
    description?: string;
    instructions?: string;
    documents?: Array<{ title: string; content: string }>;
  };

  if (!name?.trim() || !instructions?.trim()) {
    return NextResponse.json(
      { error: 'name and instructions are required' },
      { status: 400 },
    );
  }

  const skillBook = await prisma.skillBook.create({
    data: {
      name: name.trim(),
      description: description?.trim() ?? '',
      instructions: instructions.trim(),
      documents: JSON.stringify(documents ?? []),
      authorId: session.user.id,
    },
  });

  return NextResponse.json(skillBook, { status: 201 });
}
