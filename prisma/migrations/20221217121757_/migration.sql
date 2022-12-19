/*
  Warnings:

  - A unique constraint covering the columns `[pointId]` on the table `PointHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[feedId]` on the table `PointHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PointHistory_pointId_key" ON "PointHistory"("pointId");

-- CreateIndex
CREATE UNIQUE INDEX "PointHistory_feedId_key" ON "PointHistory"("feedId");
