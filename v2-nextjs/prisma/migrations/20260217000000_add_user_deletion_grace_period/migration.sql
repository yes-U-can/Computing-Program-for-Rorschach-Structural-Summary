ALTER TABLE "User"
  ADD COLUMN "deletionRequestedAt" TIMESTAMP(3),
  ADD COLUMN "deletionScheduledAt" TIMESTAMP(3);

CREATE INDEX "User_deletionScheduledAt_idx" ON "User"("deletionScheduledAt");
