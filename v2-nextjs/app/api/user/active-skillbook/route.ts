import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user/active-skillbook — get active skill book info
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { activeSkillBookId: true },
  });

  if (!user?.activeSkillBookId) {
    return NextResponse.json({ activeSkillBookId: null, skillBook: null });
  }

  const skillBook = await prisma.skillBook.findUnique({
    where: { id: user.activeSkillBookId },
    select: { id: true, name: true, description: true },
  });

  return NextResponse.json({
    activeSkillBookId: user.activeSkillBookId,
    skillBook,
  });
}

// PUT /api/user/active-skillbook — set active skill book (null = default)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { skillBookId } = body as { skillBookId: string | null };

  // Validate skill book belongs to user (if not null)
  if (skillBookId) {
    const skillBook = await prisma.skillBook.findFirst({
      where: { id: skillBookId, authorId: session.user.id },
    });
    if (!skillBook) {
      return NextResponse.json({ error: 'Skill book not found' }, { status: 404 });
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { activeSkillBookId: skillBookId },
  });

  return NextResponse.json({ activeSkillBookId: skillBookId });
}
