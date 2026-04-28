-- CreateTable
CREATE TABLE "SavedFilter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "queryParams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedFilter_userId_idx" ON "SavedFilter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedFilter_userId_name_key" ON "SavedFilter"("userId", "name");

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
