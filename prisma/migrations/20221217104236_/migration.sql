/*
  Warnings:

  - You are about to drop the column `pointId` on the `PointHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PointHistory" DROP CONSTRAINT "PointHistory_pointId_fkey";

-- AlterTable
ALTER TABLE "PointHistory" DROP COLUMN "pointId";

-- CreateTable
CREATE TABLE "_PointToPointHistory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PointToPointHistory_AB_unique" ON "_PointToPointHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_PointToPointHistory_B_index" ON "_PointToPointHistory"("B");

-- AddForeignKey
ALTER TABLE "_PointToPointHistory" ADD CONSTRAINT "_PointToPointHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "Point"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PointToPointHistory" ADD CONSTRAINT "_PointToPointHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "PointHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
