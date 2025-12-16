-- AlterTable
ALTER TABLE `population` MODIFY `population` BIGINT NOT NULL;

-- RenameIndex
ALTER TABLE `_postsubjects` RENAME INDEX `_PostSubjects_AB_unique` TO `_postsubjects_AB_unique`;

-- RenameIndex
ALTER TABLE `_postsubjects` RENAME INDEX `_PostSubjects_B_index` TO `_postsubjects_B_index`;
