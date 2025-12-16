/*
  Warnings:

  - You are about to drop the column `effectiveDate` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `effectiveDate`;

-- RenameIndex
ALTER TABLE `_postsubjects` RENAME INDEX `_postsubjects_AB_unique` TO `_PostSubjects_AB_unique`;

-- RenameIndex
ALTER TABLE `_postsubjects` RENAME INDEX `_postsubjects_B_index` TO `_PostSubjects_B_index`;
