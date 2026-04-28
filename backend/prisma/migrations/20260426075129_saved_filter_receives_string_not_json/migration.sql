/*
  Warnings:

  - You are about to drop the column `queryParams` on the `SavedFilter` table. All the data in the column will be lost.
  - Added the required column `queryString` to the `SavedFilter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedFilter" DROP COLUMN "queryParams",
ADD COLUMN     "queryString" TEXT NOT NULL;
