-- CreateTable
CREATE TABLE "CreatedPost" (
    "id" SERIAL NOT NULL,
    "suggestedById" INTEGER NOT NULL,
    "moderatorId" INTEGER,
    "postId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatedPost_postId_key" ON "CreatedPost"("postId");

-- AddForeignKey
ALTER TABLE "CreatedPost" ADD CONSTRAINT "CreatedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatedPost" ADD CONSTRAINT "CreatedPost_suggestedById_fkey" FOREIGN KEY ("suggestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatedPost" ADD CONSTRAINT "CreatedPost_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
