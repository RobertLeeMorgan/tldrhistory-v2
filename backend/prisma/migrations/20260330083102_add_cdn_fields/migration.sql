-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('pending', 'approved', 'fallback', 'rejected');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "cdnId" TEXT,
ADD COLUMN     "cdnUrl" TEXT,
ADD COLUMN     "imageStatus" "ImageStatus" NOT NULL DEFAULT 'pending';
