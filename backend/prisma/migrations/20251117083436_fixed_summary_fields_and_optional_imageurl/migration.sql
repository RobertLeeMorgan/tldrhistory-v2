/*
  Warnings:

  - You are about to drop the column `periodStart` on the `summary` table. All the data in the column will be lost.
  - You are about to drop the column `periodType` on the `summary` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `summary` table. All the data in the column will be lost.
  - Added the required column `endYear` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headline` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `summary` DROP COLUMN `periodStart`,
    DROP COLUMN `periodType`,
    DROP COLUMN `summary`,
    ADD COLUMN `endYear` INTEGER NOT NULL,
    ADD COLUMN `headline` VARCHAR(191) NOT NULL,
    ADD COLUMN `startYear` INTEGER NOT NULL;
