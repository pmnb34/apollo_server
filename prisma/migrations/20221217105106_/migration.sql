/*
  Warnings:

  - You are about to drop the `_PointToPointHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pointId` to the `PointHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PointToPointHistory" DROP CONSTRAINT "_PointToPointHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PointToPointHistory" DROP CONSTRAINT "_PointToPointHistory_B_fkey";

-- AlterTable
ALTER TABLE "PointHistory" ADD COLUMN     "pointId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PointToPointHistory";

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
