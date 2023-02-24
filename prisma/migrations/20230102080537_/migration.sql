/*
  Warnings:

  - You are about to drop the column `images` on the `Feed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "feedId" INTEGER NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_feedId_key" ON "Images"("feedId");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
