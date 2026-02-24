-- Safely ensure UserRole enum and role column are correct.
-- Handles the case where the enum type may already exist,
-- and the column may already be enum type or still TEXT.

-- Step 1: Create enum type if it doesn't already exist
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Convert column only if it is still TEXT type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'User'
      AND column_name = 'role'
      AND data_type = 'text'
  ) THEN
    UPDATE "User" SET "role" = 'user' WHERE "role" IS NULL OR "role" NOT IN ('user', 'admin');
    ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";
  END IF;
END $$;

-- Step 3: Ensure NOT NULL and default are set correctly
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user'::"UserRole";
