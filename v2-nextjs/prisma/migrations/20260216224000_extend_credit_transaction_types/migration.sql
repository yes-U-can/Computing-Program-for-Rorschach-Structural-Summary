ALTER TYPE "CreditTransactionType" ADD VALUE IF NOT EXISTS 'listing_fee_burn';
ALTER TYPE "CreditTransactionType" ADD VALUE IF NOT EXISTS 'sale_commission_burn';
ALTER TYPE "CreditTransactionType" ADD VALUE IF NOT EXISTS 'platform_ai_usage_burn';
ALTER TYPE "CreditTransactionType" ADD VALUE IF NOT EXISTS 'sale_settlement_credit';