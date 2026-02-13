import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { sessionId } = await params;

  if (!session || !session.user || !session.user.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const chatSession = await prisma.chatSession.findUnique({
      where: {
        id: sessionId,
        userId: session.user.id, // Ensure user can only access their own sessions
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chatSession) {
      return new NextResponse('Chat session not found', { status: 404 });
    }

    return NextResponse.json(chatSession);
  } catch (error) {
    console.error(`Error fetching chat session ${sessionId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

