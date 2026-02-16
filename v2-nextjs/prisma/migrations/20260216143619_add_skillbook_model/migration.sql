-- AlterTable
ALTER TABLE "User" ADD COLUMN "activeSkillBookId" TEXT;

-- CreateTable
CREATE TABLE "SkillBook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "instructions" TEXT NOT NULL,
    "documents" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'user',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillBook_authorId_idx" ON "SkillBook"("authorId");

-- AddForeignKey
ALTER TABLE "SkillBook" ADD CONSTRAINT "SkillBook_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
