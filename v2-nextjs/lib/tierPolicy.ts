import { prisma } from '@/lib/prisma';

export type TierDiscounts = {
  listingFeeDiscountPct: number;
  saleCommissionDiscountPct: number;
};

const DEFAULT_TIER_DISCOUNTS: Record<string, TierDiscounts> = {
  bronze: { listingFeeDiscountPct: 0, saleCommissionDiscountPct: 0 },
  silver: { listingFeeDiscountPct: 10, saleCommissionDiscountPct: 2 },
  gold: { listingFeeDiscountPct: 20, saleCommissionDiscountPct: 4 },
  platinum: { listingFeeDiscountPct: 35, saleCommissionDiscountPct: 6 },
};

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(95, Math.floor(value)));
}

export async function getTierDiscounts(tierCode: string | null | undefined): Promise<TierDiscounts> {
  const normalized = (tierCode ?? 'bronze').trim().toLowerCase();
  try {
    const dbTier = await prisma.userTier.findUnique({
      where: { code: normalized },
      select: {
        listingFeeDiscountPct: true,
        saleCommissionDiscountPct: true,
      },
    });
    if (dbTier) {
      return {
        listingFeeDiscountPct: clampPct(dbTier.listingFeeDiscountPct),
        saleCommissionDiscountPct: clampPct(dbTier.saleCommissionDiscountPct),
      };
    }
  } catch {
    // Ignore DB lookup failures and fallback to defaults.
  }
  return DEFAULT_TIER_DISCOUNTS[normalized] ?? DEFAULT_TIER_DISCOUNTS.bronze;
}

export function applyDiscount(baseCredits: number, discountPct: number): number {
  const base = Math.max(0, Math.floor(baseCredits));
  const pct = clampPct(discountPct);
  const discounted = Math.ceil(base * (100 - pct) / 100);
  return Math.max(0, discounted);
}

