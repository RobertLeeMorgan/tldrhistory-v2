/*
  Warnings:

  - You are about to drop the column `queryString` on the `SavedFilter` table. All the data in the column will be lost.
  - Added the required column `state` to the `SavedFilter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedFilter" DROP COLUMN "queryString",
ADD COLUMN     "state" JSONB NOT NULL;
