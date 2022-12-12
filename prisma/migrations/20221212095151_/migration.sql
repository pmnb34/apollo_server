-- DropIndex
DROP INDEX "Like_feedId_userId_key";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");
