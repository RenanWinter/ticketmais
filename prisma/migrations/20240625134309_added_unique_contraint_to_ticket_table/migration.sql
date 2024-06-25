/*
  Warnings:

  - A unique constraint covering the columns `[spotId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Ticket_spotId_key` ON `Ticket`(`spotId`);
