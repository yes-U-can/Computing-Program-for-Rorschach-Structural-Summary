import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(chatSessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const result = await prisma.chatSession.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ deletedCount: result.count });
  } catch (error) {
    console.error('Error deleting all chat sessions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

