/*
  Warnings:

  - A unique constraint covering the columns `[startYear,endYear]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Summary_startYear_endYear_key` ON `Summary`(`startYear`, `endYear`);
