import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import {
  getMarkupMultiplier,
  getModelCatalog,
  getUsdPerCredit,
  toPsychologyLabel,
} from '@/lib/aiModels';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      encryptedOpenAIKey: true,
      encryptedGoogleKey: true,
      encryptedAnthropicKey: true,
      creditBalance: true,
    },
  });

  const keyStatus = {
    openai: Boolean(user?.encryptedOpenAIKey),
    google: Boolean(user?.encryptedGoogleKey),
    anthropic: Boolean(user?.encryptedAnthropicKey),
  };

  const models = getModelCatalog().map((model) => ({
    ...model,
    psychologyLabel: toPsychologyLabel(model.qualityLevel),
    byokAvailable: keyStatus[model.provider],
    platformAvailable:
      (model.provider === 'openai' && Boolean(process.env.PLATFORM_OPENAI_API_KEY)) ||
      (model.provider === 'google' && Boolean(process.env.PLATFORM_GOOGLE_API_KEY)) ||
      (model.provider === 'anthropic' && Boolean(process.env.PLATFORM_ANTHROPIC_API_KEY)),
  }));

  return NextResponse.json({
    models,
    keyStatus,
    creditBalance: user?.creditBalance ?? 0,
    pricingPolicy: {
      markupMultiplier: getMarkupMultiplier(),
      usdPerCredit: getUsdPerCredit(),
    },
  });
}

