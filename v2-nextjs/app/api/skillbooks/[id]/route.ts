import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/skillbooks/:id
export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const skillBook = await prisma.skillBook.findFirst({
    where: { id, authorId: session.user.id },
  });

  if (!skillBook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(skillBook);
}

// PUT /api/skillbooks/:id
export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.skillBook.findFirst({
    where: { id, authorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const { name, description, instructions, documents } = body as {
    name?: string;
    description?: string;
    instructions?: string;
    documents?: Array<{ title: string; content: string }>;
  };

  const skillBook = await prisma.skillBook.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(instructions !== undefined && { instructions: instructions.trim() }),
      ...(documents !== undefined && { documents: JSON.stringify(documents) }),
    },
  });

  return NextResponse.json(skillBook);
}

// DELETE /api/skillbooks/:id
export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.skillBook.findFirst({
    where: { id, authorId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // If this was the active skill book, clear it
  await prisma.user.updateMany({
    where: { id: session.user.id, activeSkillBookId: id },
    data: { activeSkillBookId: null },
  });

  await prisma.skillBook.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
