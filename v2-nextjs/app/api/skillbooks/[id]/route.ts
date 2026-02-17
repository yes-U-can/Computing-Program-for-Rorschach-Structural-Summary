import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSkillBookDocuments, normalizeSkillBookTextPatch } from '@/lib/skillBookValidation';
import { applyDiscount, getTierDiscounts } from '@/lib/tierPolicy';

type Params = { params: Promise<{ id: string }> };
const LISTING_FEE_CREDITS = Number(process.env.SKILLBOOK_LISTING_FEE_CREDITS ?? '50');

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
  const { name, description, instructions, documents, isPublic } = body as {
    name?: string;
    description?: string;
    instructions?: string;
    documents?: Array<{ title: string; content: string }>;
    isPublic?: boolean;
  };

  const text = normalizeSkillBookTextPatch({ name, description, instructions });
  if (!text.ok) {
    return NextResponse.json({ error: text.error }, { status: 400 });
  }

  const normalizedDocs = documents !== undefined ? normalizeSkillBookDocuments(documents) : null;
  if (normalizedDocs && !normalizedDocs.ok) {
    return NextResponse.json({ error: normalizedDocs.error }, { status: 400 });
  }

  const nextIsPublic = isPublic !== undefined ? Boolean(isPublic) : existing.isPublic;
  const shouldChargeListingFee = !existing.isPublic && nextIsPublic;
  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tierCode: true },
  });
  const tierCode = userProfile?.tierCode ?? 'bronze';
  const tierDiscounts = await getTierDiscounts(tierCode);
  const discountedListingFee = applyDiscount(LISTING_FEE_CREDITS, tierDiscounts.listingFeeDiscountPct);

  try {
    const skillBook = shouldChargeListingFee
      ? await prisma.$transaction(async (tx) => {
          const user = await tx.user.findUnique({
            where: { id: session.user.id },
            select: { creditBalance: true },
          });
          if (!user) {
            throw new Error('User not found');
          }
          if (!Number.isFinite(LISTING_FEE_CREDITS) || LISTING_FEE_CREDITS <= 0) {
            throw new Error('Listing fee configuration is invalid');
          }
          if (user.creditBalance < discountedListingFee) {
            throw new Error(`Insufficient credits. ${discountedListingFee} credits are required to publish.`);
          }

          const nextBalance = user.creditBalance - discountedListingFee;
          await tx.user.update({
            where: { id: session.user.id },
            data: { creditBalance: nextBalance },
          });
          await tx.creditTransaction.create({
            data: {
              userId: session.user.id,
              type: 'listing_fee_burn',
              amount: -discountedListingFee,
              balanceAfter: nextBalance,
              description: `Listing fee burn for publishing skill book: ${existing.name}`,
              metadataJson: JSON.stringify({
                skillBookId: existing.id,
                baseFeeCredits: LISTING_FEE_CREDITS,
                discountedFeeCredits: discountedListingFee,
                tierCode,
                discountPct: tierDiscounts.listingFeeDiscountPct,
              }),
            },
          });

          return tx.skillBook.update({
            where: { id },
            data: {
              ...text.value,
              ...(normalizedDocs && normalizedDocs.ok && { documents: JSON.stringify(normalizedDocs.value) }),
              ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
            },
          });
        })
      : await prisma.skillBook.update({
          where: { id },
          data: {
            ...text.value,
            ...(normalizedDocs && normalizedDocs.ok && { documents: JSON.stringify(normalizedDocs.value) }),
            ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
          },
        });

    return NextResponse.json(skillBook);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update skill book' }, { status: 500 });
  }
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
