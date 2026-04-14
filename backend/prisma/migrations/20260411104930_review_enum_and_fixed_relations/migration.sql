/*
  Warnings:

  - The `status` column on the `CreatedPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `EditSuggestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "CreatedPost" DROP COLUMN "status",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "EditSuggestion" DROP COLUMN "status",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "CreatedPost_suggestedById_idx" ON "CreatedPost"("suggestedById");

-- CreateIndex
CREATE INDEX "EditSuggestion_suggestedById_idx" ON "EditSuggestion"("suggestedById");

-- CreateIndex
CREATE INDEX "Post_countryId_idx" ON "Post"("countryId");

-- CreateIndex
CREATE INDEX "Post_groupId_idx" ON "Post"("groupId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");
